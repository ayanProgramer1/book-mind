import { z } from "zod";

export const summarySectionSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  keyPoints: z.array(z.string()).default([]),
});

export const summaryContentSchema = z.object({
  title: z.string().min(1),
  intro: z.string().min(1),
  sections: z.array(summarySectionSchema).min(1),
  characters: z.array(z.string()).optional(),
  conclusion: z.string().min(1),
  keyPoints: z.array(z.string()).default([]),
});

export const flashcardSchema = z.object({
  type: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"]),
  question: z.string().min(1),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1),
  reference: z.string().optional(),
});

export const flashcardsSchema = z.object({
  flashcards: z.array(flashcardSchema),
});

export const explanationSchema = z.object({
  flashcardId: z.string(),
  explanation: z.string().min(1),
  reference: z.string().optional(),
});

export const explanationsSchema = z.object({
  explanations: z.array(explanationSchema),
});
