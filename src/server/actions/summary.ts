"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

import { requireUserId } from "@/lib/session";
import { prisma } from "@/server/db";
import { generateSummary } from "@/server/ai/generate";
import { getLocale } from "@/i18n/server";
import { createSummarySchema } from "@/lib/validations/book";
import {
  isProUser,
  countUserSummaries,
  FREE_SUMMARY_LIMIT,
} from "@/server/subscription";
import { isStripeConfigured } from "@/lib/stripe";
import type { SummaryContent } from "@/types";

export async function createSummaryAction(
  input: unknown,
): Promise<
  | { ok: true; summaryId: string }
  | { ok: false; error: string; limitReached?: boolean }
> {
  const userId = await requireUserId();
  const parsed = createSummarySchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Date invalide.",
    };
  }
  const { bookId, type, chapterLabel } = parsed.data;

  // Paywall is active only when payments are configured (Stripe keys present).
  // During the free launch (no keys) summaries are unlimited for everyone.
  if (isStripeConfigured() && !(await isProUser(userId))) {
    const used = await countUserSummaries(userId);
    if (used >= FREE_SUMMARY_LIMIT) {
      return {
        ok: false,
        limitReached: true,
        error: `Ai folosit cele ${FREE_SUMMARY_LIMIT} rezumate gratuite. Treci pe Pro pentru rezumate nelimitate.`,
      };
    }
  }

  const book = await prisma.book.findFirst({
    where: { id: bookId, userId },
  });
  if (!book) return { ok: false, error: "Cartea nu a fost găsită." };

  try {
    const locale = await getLocale();
    const content = await generateSummary(
      {
        title: book.title,
        authors: book.authors ? book.authors.split(", ") : [],
        description: book.description,
        publishedYear: book.publishedYear,
      },
      { type, chapterLabel },
      locale,
    );

    const summary = await prisma.summary.create({
      data: {
        bookId: book.id,
        type,
        chapterLabel: type === "CHAPTER" ? chapterLabel : null,
        content: content as unknown as Prisma.InputJsonValue,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/history");
    return { ok: true, summaryId: summary.id };
  } catch (error) {
    console.error("createSummaryAction failed", error);
    return {
      ok: false,
      error: "Generarea rezumatului a eșuat. Încearcă din nou.",
    };
  }
}

export async function markSummaryReadAction(
  summaryId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await requireUserId();

  const summary = await prisma.summary.findFirst({
    where: { id: summaryId, book: { userId } },
    select: { id: true },
  });
  if (!summary) return { ok: false, error: "Rezumatul nu a fost găsit." };

  await prisma.summary.update({
    where: { id: summaryId },
    data: { markedRead: true, markedReadAt: new Date() },
  });

  revalidatePath(`/books/${summaryId}`);
  return { ok: true };
}

export type { SummaryContent };
