"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Sparkles, BookText, ListTree } from "lucide-react";
import { toast } from "sonner";

import { createSummaryAction } from "@/server/actions/summary";
import { Button } from "@/components/ui/button";
import { UpgradeButton } from "@/components/upgrade-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/i18n/context";

export function SummaryGenerator({ bookId }: { bookId: string }) {
  const t = useT();
  const router = useRouter();
  const [type, setType] = useState<"FULL" | "CHAPTER">("FULL");
  const [chapterLabel, setChapterLabel] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [isPending, startTransition] = useTransition();

  function generate() {
    startTransition(async () => {
      const res = await createSummaryAction({
        bookId,
        type,
        chapterLabel: type === "CHAPTER" ? chapterLabel : undefined,
      });
      if (res.ok) {
        toast.success(t.summaryGen.generated);
        router.push(`/books/summary/${res.summaryId}`);
      } else {
        if (res.limitReached) setLimitReached(true);
        toast.error(res.error);
      }
    });
  }

  if (limitReached) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-sky-500/5 p-6 text-center shadow-soft"
      >
        <Sparkles className="mx-auto h-8 w-8 text-primary" />
        <h3 className="mt-3 text-lg font-bold">{t.billing.limitTitle}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {t.billing.limitDesc}
        </p>
        <div className="mt-5 flex justify-center">
          <UpgradeButton />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {t.billing.priceEur} {t.billing.perMonth} · {t.billing.priceNote}
        </p>
      </motion.div>
    );
  }

  if (isPending) {
    return (
      <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-soft">
        <div className="flex items-center gap-2 text-primary">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p className="text-sm font-medium">{t.summaryGen.generating}</p>
        </div>
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-4/5" />
        <div className="pt-2">
          <Skeleton className="h-5 w-1/2" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-10/12" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border bg-card p-6 shadow-soft"
    >
      <Tabs value={type} onValueChange={(v) => setType(v as "FULL" | "CHAPTER")}>
        <TabsList className="w-full">
          <TabsTrigger value="FULL" className="flex-1 gap-2">
            <BookText className="h-4 w-4" />
            {t.summaryGen.fullTab}
          </TabsTrigger>
          <TabsTrigger value="CHAPTER" className="flex-1 gap-2">
            <ListTree className="h-4 w-4" />
            {t.summaryGen.chapterTab}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="FULL">
          <p className="text-sm text-muted-foreground">
            {t.summaryGen.fullDesc}
          </p>
        </TabsContent>

        <TabsContent value="CHAPTER" className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="chapter">{t.summaryGen.chapterLabel}</Label>
            <Input
              id="chapter"
              value={chapterLabel}
              onChange={(e) => setChapterLabel(e.target.value)}
              placeholder={t.summaryGen.chapterPlaceholder}
            />
          </div>
        </TabsContent>
      </Tabs>

      <Button
        variant="gradient"
        size="lg"
        className="mt-6 w-full"
        onClick={generate}
        disabled={type === "CHAPTER" && chapterLabel.trim().length === 0}
      >
        <Sparkles className="h-4 w-4" />
        {t.summaryGen.generateBtn}
      </Button>
    </motion.div>
  );
}
