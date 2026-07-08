"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Send,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { toast } from "sonner";

import { submitQuizAction } from "@/server/actions/quiz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/context";
import { fmt } from "@/i18n/config";

export type RunnerCard = {
  id: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";
  question: string;
  options: string[] | null;
};

export function QuizRunner({
  quizId,
  cards,
}: {
  quizId: string;
  cards: RunnerCard[];
}) {
  const t = useT();
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, startSubmit] = useTransition();
  const startedAt = useRef(Date.now());

  const card = cards[current]!;
  const answeredCount = useMemo(
    () => cards.filter((c) => (answers[c.id] ?? "").trim().length > 0).length,
    [answers, cards],
  );
  const progressValue = (answeredCount / cards.length) * 100;
  const isLast = current === cards.length - 1;
  const currentAnswered = (answers[card.id] ?? "").trim().length > 0;

  function setAnswer(value: string) {
    setAnswers((prev) => ({ ...prev, [card.id]: value }));
  }

  function next() {
    if (!isLast) setCurrent((c) => c + 1);
  }
  function prev() {
    if (current > 0) setCurrent((c) => c - 1);
  }

  function submit() {
    if (answeredCount < cards.length) {
      toast.error(t.quiz.answerAll);
      return;
    }
    startSubmit(async () => {
      const res = await submitQuizAction({
        quizId,
        timeSpentMs: Date.now() - startedAt.current,
        answers: cards.map((c) => ({
          flashcardId: c.id,
          answer: answers[c.id] ?? "",
        })),
      });
      if (res.ok) {
        router.push(`/books/quiz/${res.quizId}/results`);
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">
            {fmt(t.quiz.questionOf, { n: current + 1, total: cards.length })}
          </span>
          <span className="text-muted-foreground">
            {fmt(t.quiz.completedCount, { n: answeredCount, total: cards.length })}
          </span>
        </div>
        <Progress value={progressValue} />
      </div>

      {/* Question dots */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {cards.map((c, i) => {
          const done = (answers[c.id] ?? "").trim().length > 0;
          return (
            <button
              key={c.id}
              onClick={() => setCurrent(i)}
              className={cn(
                "grid h-7 w-7 place-items-center rounded-lg text-xs font-medium transition-colors",
                i === current
                  ? "bg-primary text-primary-foreground"
                  : done
                    ? "bg-emerald-500/15 text-emerald-600"
                    : "bg-secondary text-muted-foreground hover:bg-muted",
              )}
              aria-label={fmt(t.quiz.questionN, { n: i + 1 })}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border bg-card p-6 shadow-soft sm:p-8"
        >
          <p className="text-lg font-semibold leading-snug">{card.question}</p>

          <div className="mt-6">
            {card.type === "SHORT_ANSWER" ? (
              <Input
                value={answers[card.id] ?? ""}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={t.quiz.answerPlaceholder}
                className="h-12"
                autoFocus
              />
            ) : (
              <RadioGroup
                value={answers[card.id] ?? ""}
                onValueChange={setAnswer}
              >
                {(card.options ?? []).map((option, i) => {
                  const selected = answers[card.id] === option;
                  return (
                    <Label
                      key={i}
                      htmlFor={`${card.id}-${i}`}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors",
                        selected
                          ? "border-primary/60 bg-primary/5"
                          : "hover:border-primary/40 hover:bg-secondary/50",
                      )}
                    >
                      <RadioGroupItem
                        value={option}
                        id={`${card.id}-${i}`}
                      />
                      <span className="text-sm font-normal">{option}</span>
                    </Label>
                  );
                })}
              </RadioGroup>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={prev}
          disabled={current === 0 || isSubmitting}
        >
          <ArrowLeft className="h-4 w-4" />
          {t.quiz.back}
        </Button>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {currentAnswered ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : (
            <Circle className="h-4 w-4" />
          )}
          {currentAnswered ? t.quiz.answered : t.quiz.notAnswered}
        </div>

        {isLast ? (
          <Button variant="gradient" onClick={submit} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {t.quiz.submit}
          </Button>
        ) : (
          <Button variant="gradient" onClick={next} disabled={isSubmitting}>
            {t.quiz.next}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
