import { z } from "zod";

export const bookSearchResultSchema = z.object({
  externalId: z.string(),
  source: z.enum(["google_books", "open_library"]),
  title: z.string().min(1),
  authors: z.array(z.string()),
  publishedYear: z.string().nullable(),
  description: z.string().nullable(),
  coverUrl: z.string().url().nullable(),
});

export const createSummarySchema = z
  .object({
    bookId: z.string().min(1),
    type: z.enum(["FULL", "CHAPTER"]),
    chapterLabel: z.string().trim().max(120).optional(),
  })
  .refine(
    (data) =>
      data.type === "FULL" ||
      (data.chapterLabel !== undefined && data.chapterLabel.length > 0),
    {
      message: "Introdu numărul sau titlul capitolului.",
      path: ["chapterLabel"],
    },
  );

export const submitAnswerSchema = z.object({
  flashcardId: z.string().min(1),
  answer: z.string(),
});

export const submitQuizSchema = z.object({
  quizId: z.string().min(1),
  timeSpentMs: z.number().int().nonnegative().optional(),
  answers: z.array(submitAnswerSchema),
});

export type BookSearchResultInput = z.infer<typeof bookSearchResultSchema>;
export type CreateSummaryInput = z.infer<typeof createSummarySchema>;
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
