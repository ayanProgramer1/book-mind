import "server-only";
import type {
  AnswerExplanation,
  BookSearchResult,
  GeneratedFlashcard,
  SummaryContent,
  SummaryOptions,
} from "@/types";
import type { Locale } from "@/i18n/config";
import { fmt } from "@/i18n/config";
import { getMockStrings } from "@/i18n/mock-dictionary";

/**
 * Deterministic mock AI output. Used when ANTHROPIC_API_KEY is not set (or the
 * API call fails) so the whole flow still works end-to-end. Localized so demo
 * content matches the user's selected language; the UI labels it as demo.
 */

const TRUE_FALSE_LABELS: Record<Locale, [string, string]> = {
  ro: ["Adevărat", "Fals"],
  en: ["True", "False"],
  es: ["Verdadero", "Falso"],
  fr: ["Vrai", "Faux"],
  de: ["Wahr", "Falsch"],
  it: ["Vero", "Falso"],
  zh: ["正确", "错误"],
  ja: ["正しい", "誤り"],
};

export function mockSummary(
  book: Pick<BookSearchResult, "title" | "authors">,
  options: SummaryOptions,
  locale: Locale = "ro",
): SummaryContent {
  const m = getMockStrings(locale);
  const scope =
    options.type === "CHAPTER" && options.chapterLabel
      ? ` — ${options.chapterLabel}`
      : "";
  const author = book.authors.length ? ` ${m.by} ${book.authors.join(", ")}` : "";
  return {
    title: `${book.title}${scope}`,
    intro: `${m.notice} ${m.demoFor} „${book.title}”${author}. ${m.introExtra}`,
    sections: [
      {
        heading: m.sec1Head,
        body: m.sec1Body,
        keyPoints: [m.sec1p1, m.sec1p2, m.sec1p3],
      },
      {
        heading: m.sec2Head,
        body: m.sec2Body,
        keyPoints: [m.sec2p1, m.sec2p2, m.sec2p3],
      },
      {
        heading: m.sec3Head,
        body: m.sec3Body,
        keyPoints: [m.sec3p1, m.sec3p2],
      },
    ],
    conclusion: m.conclusion,
    keyPoints: [m.kp1, m.kp2, m.kp3, m.kp4],
  };
}

export function mockFlashcards(
  summary: SummaryContent,
  locale: Locale = "ro",
): GeneratedFlashcard[] {
  const m = getMockStrings(locale);
  const [trueLabel] = TRUE_FALSE_LABELS[locale];
  const base: GeneratedFlashcard[] = [];
  for (let i = 0; i < 15; i++) {
    const kind = i % 3;
    if (kind === 0) {
      base.push({
        type: "MULTIPLE_CHOICE",
        question: `${fmt(m.mcQuestion, { title: summary.title })} (${i + 1})`,
        options: [m.sec1p1, m.mcWrong1, m.mcWrong2, m.mcWrong3],
        correctAnswer: m.sec1p1,
        reference: m.mcRef,
      });
    } else if (kind === 1) {
      base.push({
        type: "TRUE_FALSE",
        question: `${m.tfQuestion} (${i + 1})`,
        options: TRUE_FALSE_LABELS[locale],
        correctAnswer: trueLabel,
        reference: m.tfRef,
      });
    } else {
      base.push({
        type: "SHORT_ANSWER",
        question: `${m.saQuestion} (${i + 1})`,
        correctAnswer: m.saAnswer,
        reference: m.saRef,
      });
    }
  }
  return base;
}

export function mockExplanations(
  wrong: Array<{ flashcardId: string; correctAnswer: string }>,
  locale: Locale = "ro",
): AnswerExplanation[] {
  const m = getMockStrings(locale);
  return wrong.map((w) => ({
    flashcardId: w.flashcardId,
    explanation: `${m.explLead} „${w.correctAnswer}”. ${m.notice} ${m.explTail}`,
    reference: m.explRef,
  }));
}
