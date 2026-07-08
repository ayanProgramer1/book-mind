"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

import { markSummaryReadAction } from "@/server/actions/summary";
import { createQuizAction } from "@/server/actions/quiz";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/context";

export function ReadConfirm({
  summaryId,
  initialRead,
  quizCompleted,
}: {
  summaryId: string;
  initialRead: boolean;
  quizCompleted: boolean;
}) {
  const t = useT();
  const router = useRouter();
  const [read, setRead] = useState(initialRead);
  const [justConfirmed, setJustConfirmed] = useState(false);
  const [isMarking, startMark] = useTransition();
  const [isContinuing, startContinue] = useTransition();

  function onToggle(checked: boolean) {
    if (!checked || read) return;
    startMark(async () => {
      const res = await markSummaryReadAction(summaryId);
      if (res.ok) {
        setRead(true);
        setJustConfirmed(true);
        setTimeout(() => setJustConfirmed(false), 1800);
      } else {
        toast.error(res.error);
      }
    });
  }

  function goToQuiz() {
    startContinue(async () => {
      const res = await createQuizAction(summaryId);
      if (res.ok) {
        router.push(`/books/quiz/${res.quizId}`);
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <div className="sticky bottom-4 mt-10">
      <div className="glass rounded-2xl p-5 shadow-glass">
        <label className="flex cursor-pointer items-start gap-3">
          <Checkbox
            checked={read}
            disabled={read || isMarking}
            onCheckedChange={(c) => onToggle(Boolean(c))}
            className="mt-0.5"
          />
          <span className="text-sm">
            <span className="font-medium">{t.readConfirm.iRead}</span>
            <span className="block text-muted-foreground">
              {t.readConfirm.iReadDesc}
            </span>
          </span>
          {isMarking && (
            <Loader2 className="ml-auto h-4 w-4 animate-spin text-primary" />
          )}
        </label>

        <AnimatePresence>
          {justConfirmed && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-600"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
              >
                <CheckCircle2 className="h-5 w-5" />
              </motion.span>
              {t.readConfirm.unlocked}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4">
          <Button
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={!read || isContinuing}
            onClick={goToQuiz}
          >
            {isContinuing ? (
              <Loader2 className="animate-spin" />
            ) : read ? (
              <ArrowRight className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            {quizCompleted
              ? t.readConfirm.reviewTest
              : read
                ? t.readConfirm.continueToCards
                : t.readConfirm.cardsLocked}
          </Button>
        </div>
      </div>
    </div>
  );
}
