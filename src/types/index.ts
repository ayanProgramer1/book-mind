// SQLite has no native enums — these mirror the string literals stored in the DB.
export type SummaryType = "FULL" | "CHAPTER";
export type FlashcardType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";

/** A book candidate returned by the search providers. */
export type BookSearchResult = {
  externalId: string;
  source: "google_books" | "open_library";
  title: string;
  authors: string[];
  publishedYear: string | null;
  description: string | null;
  coverUrl: string | null;
};

/** Structured shape of an AI-generated summary, stored as JSON. */
export type SummarySection = {
  heading: string;
  body: string;
  keyPoints: string[];
};

export type SummaryContent = {
  title: string;
  intro: string;
  sections: SummarySection[];
  characters?: string[];
  conclusion: string;
  keyPoints: string[];
};

/** A flashcard as produced by the AI (before persistence). */
export type GeneratedFlashcard = {
  type: FlashcardType;
  question: string;
  options?: string[];
  correctAnswer: string;
  reference?: string;
};

export type SummaryOptions = {
  type: SummaryType;
  chapterLabel?: string;
};

/** AI explanation for a single wrong answer. */
export type AnswerExplanation = {
  flashcardId: string;
  explanation: string;
  reference?: string;
};
