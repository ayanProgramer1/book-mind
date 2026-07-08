import "server-only";
import Anthropic from "@anthropic-ai/sdk";

import {
  summaryContentSchema,
  flashcardsSchema,
  explanationsSchema,
} from "@/lib/validations/ai";
import type {
  AnswerExplanation,
  BookSearchResult,
  GeneratedFlashcard,
  SummaryContent,
  SummaryOptions,
} from "@/types";
import {
  mockExplanations,
  mockFlashcards,
  mockSummary,
} from "./mock";
import { callGemini, isGeminiConfigured } from "./gemini";
import { LOCALE_LANGUAGE_NAME, type Locale } from "@/i18n/config";

// Per the Anthropic Claude API reference: latest Opus model + adaptive thinking.
const MODEL = "claude-opus-4-8";
const MAX_TOKENS = 16000;

// Localized true/false option labels for TRUE_FALSE flashcards.
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

/** System-prompt suffix that pins the output language for the current request. */
function languageDirective(locale: Locale): string {
  const language = LOCALE_LANGUAGE_NAME[locale];
  return `\n\n=== LIMBA DE IEȘIRE (OBLIGATORIU) ===
Scrie ABSOLUT TOT conținutul (titlu, intro, secțiuni, puncte-cheie, întrebări, opțiuni, explicații, concluzii) EXCLUSIV în limba: ${language}.
Aceasta este regula cea mai importantă și are prioritate absolută. Respect-o chiar dacă titlul cărții, autorul sau descrierea sunt într-o altă limbă — tot conținutul generat de tine trebuie să fie în ${language}.`;
}

let client: Anthropic | null = null;

/**
 * True if any real AI provider is configured. Gemini (free) takes priority;
 * Anthropic Claude is used if only that key is present. Otherwise the app falls
 * back to clearly-labelled demo content.
 */
export function isAiConfigured(): boolean {
  return isGeminiConfigured() || Boolean(process.env.ANTHROPIC_API_KEY);
}

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

/**
 * Logs why we're falling back to demo content, with a friendly hint for the
 * common causes so the developer knows exactly what to fix.
 */
function logAiFallback(fn: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  let hint = "";
  if (!isAiConfigured()) {
    hint =
      " → Nicio cheie AI configurată. Adaugă o cheie GRATUITĂ Gemini (GEMINI_API_KEY) de la https://aistudio.google.com/apikey pentru rezumate reale.";
  } else if (/credit balance is too low|billing/i.test(message)) {
    hint =
      " → Contul Anthropic nu are credit. Folosește o cheie GRATUITĂ Gemini (GEMINI_API_KEY) sau adaugă credit la https://console.anthropic.com/settings/billing";
  } else if (/authentication|invalid.*api.*key|API key not valid|401|403/i.test(message)) {
    hint =
      " → Cheie API invalidă. Verifică GEMINI_API_KEY (sau ANTHROPIC_API_KEY) în .env";
  } else if (/rate limit|429|quota|overloaded|529|RESOURCE_EXHAUSTED/i.test(message)) {
    hint = " → Rate limit / cotă atinsă. Reîncearcă în câteva secunde.";
  }
  console.warn(
    `[BookMind AI] ${fn}: apelul AI a eșuat, folosesc conținut demonstrativ.${hint}\n  Detaliu: ${message}`,
  );
}

/**
 * Gemini structured-output schemas (OpenAPI subset). These mirror the Zod
 * schemas in @/lib/validations/ai and make Gemini return JSON that is guaranteed
 * to be syntactically valid and correctly shaped — eliminating the rare
 * malformed-JSON responses that used to trigger the demo fallback. Optional
 * fields (characters, options, reference) are intentionally omitted from
 * `required`. Claude ignores these (it's steered by the system prompt instead).
 */
const GEMINI_SUMMARY_SCHEMA = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    intro: { type: "STRING" },
    sections: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          heading: { type: "STRING" },
          body: { type: "STRING" },
          keyPoints: { type: "ARRAY", items: { type: "STRING" } },
        },
        required: ["heading", "body", "keyPoints"],
        propertyOrdering: ["heading", "body", "keyPoints"],
      },
    },
    characters: { type: "ARRAY", items: { type: "STRING" } },
    conclusion: { type: "STRING" },
    keyPoints: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["title", "intro", "sections", "conclusion", "keyPoints"],
  propertyOrdering: ["title", "intro", "sections", "characters", "conclusion", "keyPoints"],
} as const;

const GEMINI_FLASHCARDS_SCHEMA = {
  type: "OBJECT",
  properties: {
    flashcards: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          type: {
            type: "STRING",
            enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"],
          },
          question: { type: "STRING" },
          options: { type: "ARRAY", items: { type: "STRING" } },
          correctAnswer: { type: "STRING" },
          reference: { type: "STRING" },
        },
        required: ["type", "question", "correctAnswer"],
        propertyOrdering: ["type", "question", "options", "correctAnswer", "reference"],
      },
    },
  },
  required: ["flashcards"],
} as const;

const GEMINI_EXPLANATIONS_SCHEMA = {
  type: "OBJECT",
  properties: {
    explanations: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          flashcardId: { type: "STRING" },
          explanation: { type: "STRING" },
          reference: { type: "STRING" },
        },
        required: ["flashcardId", "explanation"],
        propertyOrdering: ["flashcardId", "explanation", "reference"],
      },
    },
  },
  required: ["explanations"],
} as const;

/**
 * Calls the active provider and returns the raw text of the response. Gemini
 * (free) is preferred; falls back to Claude if only the Anthropic key is set.
 * `schema` (Gemini structured output) is used only by Gemini; Claude relies on
 * the system prompt. We still extract + validate with Zod afterwards.
 */
async function callModel(
  system: string,
  user: string,
  schema?: unknown,
): Promise<string> {
  if (isGeminiConfigured()) {
    return callGemini(system, user, schema);
  }
  return callClaude(system, user);
}

/** Anthropic Claude call. Used when only ANTHROPIC_API_KEY is configured. */
async function callClaude(system: string, user: string): Promise<string> {
  const message = await getClient().messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system,
    messages: [{ role: "user", content: user }],
    // Adaptive thinking is the recommended mode for Opus 4.8. The installed SDK
    // typings may predate it, so we forward the value as-is (the API accepts it).
    thinking: {
      type: "adaptive",
    } as unknown as Anthropic.MessageCreateParams["thinking"],
  });

  const text = message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  return text;
}

/**
 * Light repair for the JSON quirks LLMs occasionally emit despite being asked
 * for strict JSON: trailing commas before a closing bracket and JS-style
 * comments. Only applied AFTER a normal parse fails, so valid output is never
 * altered.
 */
function repairJson(text: string): string {
  return text
    .replace(/\/\/[^\n\r]*/g, "") // // line comments
    .replace(/\/\*[\s\S]*?\*\//g, "") // /* block comments */
    .replace(/,(\s*[}\]])/g, "$1"); // trailing commas
}

/** Robustly extract a JSON object/array from a model response. */
function extractJson(raw: string): unknown {
  const cleaned = raw
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  // 1) Straight parse (the common, happy path).
  try {
    return JSON.parse(cleaned);
  } catch {
    // fall through to recovery below
  }

  // 2) Narrow to the outermost {...} in case of stray prose around it.
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  const sliced =
    start !== -1 && end !== -1 && end > start
      ? cleaned.slice(start, end + 1)
      : cleaned;
  try {
    return JSON.parse(sliced);
  } catch {
    // fall through to repair below
  }

  // 3) Last resort: repair common LLM JSON quirks, then parse.
  return JSON.parse(repairJson(sliced));
}

const SUMMARY_SYSTEM = `Ești BookMind, un asistent expert în sintetizarea cărților pentru studiu.
Generezi rezumate clare, bine structurate, ușor de citit, împărțite pe secțiuni, cu puncte-cheie evidențiate.
Incluzi ideile principale, conceptele importante, personajele (unde este cazul), concluziile și elementele esențiale.
Scrii corect, clar și concis. Limba de scriere îți este indicată la finalul acestor instrucțiuni.
Răspunzi EXCLUSIV cu un singur obiect JSON valid, fără text suplimentar, fără markdown, cu forma:
{
  "title": string,
  "intro": string,
  "sections": [{ "heading": string, "body": string, "keyPoints": string[] }],
  "characters": string[] (opțional, doar pentru ficțiune),
  "conclusion": string,
  "keyPoints": string[]
}`;

export async function generateSummary(
  book: Pick<BookSearchResult, "title" | "authors" | "description"> & {
    publishedYear?: string | null;
  },
  options: SummaryOptions,
  locale: Locale = "ro",
): Promise<SummaryContent> {
  if (!isAiConfigured()) {
    return mockSummary(book, options, locale);
  }

  const scope =
    options.type === "CHAPTER" && options.chapterLabel
      ? `Rezumă DOAR ${options.chapterLabel} din carte.`
      : "Rezumă întreaga carte.";

  const user = `Carte: "${book.title}"${
    book.authors.length ? ` de ${book.authors.join(", ")}` : ""
  }${book.publishedYear ? ` (${book.publishedYear})` : ""}.
${book.description ? `Descriere: ${book.description}\n` : ""}
${scope}
Creează 4-6 secțiuni tematice, fiecare cu 2-4 puncte-cheie. Include o listă generală de 4-6 puncte-cheie esențiale.`;

  try {
    const raw = await callModel(
      SUMMARY_SYSTEM + languageDirective(locale),
      user,
      GEMINI_SUMMARY_SCHEMA,
    );
    return summaryContentSchema.parse(extractJson(raw));
  } catch (error) {
    logAiFallback("generateSummary", error);
    return mockSummary(book, options, locale);
  }
}

const FLASHCARDS_SYSTEM = `Ești BookMind, un generator de teste de cunoștințe.
Pe baza unui rezumat, generezi EXACT 15 întrebări care acoperă toate ideile importante.
Folosești un mix de tipuri: alegere multiplă (MULTIPLE_CHOICE, cu 4 opțiuni), adevărat/fals (TRUE_FALSE) și răspuns scurt (SHORT_ANSWER).
Pentru MULTIPLE_CHOICE, "correctAnswer" trebuie să fie exact una dintre opțiuni.
Pentru TRUE_FALSE, "options" este ["Adevărat", "Fals"] și "correctAnswer" este "Adevărat" sau "Fals".
Pentru SHORT_ANSWER, "correctAnswer" este un răspuns scurt și clar; nu incluzi "options".
Fiecare întrebare are un "reference" scurt către secțiunea relevantă din rezumat.
Limba de scriere îți este indicată la finalul acestor instrucțiuni.
Răspunzi EXCLUSIV cu un singur obiect JSON valid: { "flashcards": [ { "type", "question", "options"?, "correctAnswer", "reference"? } ] }`;

export async function generateFlashcards(
  summary: SummaryContent,
  locale: Locale = "ro",
): Promise<GeneratedFlashcard[]> {
  if (!isAiConfigured()) {
    return mockFlashcards(summary, locale);
  }

  const [trueLabel, falseLabel] = TRUE_FALSE_LABELS[locale];
  const tfDirective = `\nPentru TRUE_FALSE folosește exact opțiunile ["${trueLabel}", "${falseLabel}"] și correctAnswer "${trueLabel}" sau "${falseLabel}".`;
  const user = `Rezumat:\n${JSON.stringify(summary)}\n\nGenerează exact 15 flashcard-uri.`;

  try {
    const raw = await callModel(
      FLASHCARDS_SYSTEM + tfDirective + languageDirective(locale),
      user,
      GEMINI_FLASHCARDS_SCHEMA,
    );
    const parsed = flashcardsSchema.parse(extractJson(raw));

    let cards = parsed.flashcards.map((c) => normalizeCard(c, locale));
    // Enforce exactly 15: trim extras or pad with mock cards if the model
    // returned fewer.
    if (cards.length > 15) cards = cards.slice(0, 15);
    if (cards.length < 15) {
      const filler = mockFlashcards(summary, locale).slice(0, 15 - cards.length);
      cards = [...cards, ...filler];
    }
    return cards;
  } catch (error) {
    logAiFallback("generateFlashcards", error);
    return mockFlashcards(summary, locale);
  }
}

function normalizeCard(
  card: GeneratedFlashcard,
  locale: Locale,
): GeneratedFlashcard {
  if (card.type === "TRUE_FALSE") {
    return {
      ...card,
      options: TRUE_FALSE_LABELS[locale],
    };
  }
  return card;
}

const EXPLAIN_SYSTEM = `Ești BookMind, un tutore care explică greșelile pentru a ajuta la învățare.
Pentru fiecare răspuns greșit primești întrebarea, răspunsul utilizatorului și răspunsul corect.
Oferi o explicație clară și scurtă (2-3 propoziții) de ce răspunsul corect este cel bun și o referință la partea relevantă din rezumat.
Limba de scriere îți este indicată la finalul acestor instrucțiuni.
Răspunzi EXCLUSIV cu un singur obiect JSON valid: { "explanations": [ { "flashcardId", "explanation", "reference"? } ] }`;

export async function explainWrongAnswers(
  summary: SummaryContent,
  wrong: Array<{
    flashcardId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    reference?: string | null;
  }>,
  locale: Locale = "ro",
): Promise<AnswerExplanation[]> {
  if (wrong.length === 0) return [];
  if (!isAiConfigured()) {
    return mockExplanations(wrong, locale);
  }

  const user = `Rezumat (context):\n${JSON.stringify(summary)}\n\nRăspunsuri greșite:\n${JSON.stringify(
    wrong,
  )}\n\nExplică fiecare greșeală.`;

  try {
    const raw = await callModel(
      EXPLAIN_SYSTEM + languageDirective(locale),
      user,
      GEMINI_EXPLANATIONS_SCHEMA,
    );
    const parsed = explanationsSchema.parse(extractJson(raw));
    return parsed.explanations;
  } catch (error) {
    logAiFallback("explainWrongAnswers", error);
    return mockExplanations(wrong, locale);
  }
}
