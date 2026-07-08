import "server-only";

// Google Gemini provider (free tier via Google AI Studio). Called over plain
// REST so we don't need an extra SDK dependency. Public surface mirrors the
// Claude client: isGeminiConfigured() + callGemini(system, user) returning the
// raw text of the model's response (a JSON string, which the caller validates).

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

// Quality-first ladder over the FREE tier. gemini-2.5-pro has a 0-request free
// quota (paid only), so the best free model is gemini-2.5-flash. The free tier
// caps requests PER MODEL PER DAY (e.g. gemini-2.5-flash is ~20/day), so when
// one model's daily quota is spent we fall through to the next model — each has
// its own separate quota. This multiplies the total free daily capacity and
// keeps summaries "real" far longer before the demo fallback ever kicks in.
// Order = best quality first.
const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
] as const;

const MAX_OUTPUT_TOKENS = 16000;
const TIMEOUT_MS = 60000; // generous — some models think for a while.

type GeminiPart = { text?: string };
type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: GeminiPart[] };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
};

// Transient server/overload errors — worth a quick same-model retry before we
// give up on that model and advance down the ladder.
const TRANSIENT_STATUS = new Set([500, 502, 503, 504]);
const RETRIES_PER_MODEL = 2; // same-model retries for transient overloads
const RETRY_DELAY_MS = 800;

/** HTTP 429 — the model's (daily) quota is spent; advance to the next model now. */
class QuotaError extends Error {}
/** Transient 5xx — retry the same model briefly, then advance. */
class TransientError extends Error {}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

async function callModelOnce(
  model: string,
  system: string,
  user: string,
  responseSchema?: unknown,
): Promise<string> {
  const key = process.env.GEMINI_API_KEY!;
  const res = await fetch(
    `${ENDPOINT}/${model}:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          // Force a clean JSON object so parsing is reliable (no markdown fence).
          responseMimeType: "application/json",
          // When a schema is supplied, Gemini's structured output guarantees the
          // response is syntactically valid JSON matching the shape — this fixes
          // the rare malformed-JSON responses that otherwise fall back to demo.
          ...(responseSchema ? { responseSchema } : {}),
        },
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    },
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    if (res.status === 429) {
      throw new QuotaError(`Gemini ${model} quota exhausted (429). ${detail}`);
    }
    if (TRANSIENT_STATUS.has(res.status)) {
      throw new TransientError(`Gemini ${model} HTTP ${res.status}. ${detail}`);
    }
    throw new Error(`Gemini ${model} HTTP ${res.status}. ${detail}`);
  }

  const data = (await res.json()) as GeminiResponse;

  if (data.promptFeedback?.blockReason) {
    throw new Error(`Gemini blocked the prompt: ${data.promptFeedback.blockReason}`);
  }

  const text =
    data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("")
      .trim() ?? "";

  if (!text) throw new Error(`Gemini ${model} returned an empty response.`);
  return text;
}

/**
 * Calls Gemini and returns the raw response text. For each model in the
 * quality-first ladder it retries transient errors (429/5xx) a couple of times
 * with a short backoff, then advances to the next (higher-quota) model. Only a
 * non-transient error (bad key, blocked prompt, …) stops early and propagates to
 * the caller's mock fallback.
 */
export async function callGemini(
  system: string,
  user: string,
  responseSchema?: unknown,
): Promise<string> {
  let lastError: unknown;
  for (const model of MODELS) {
    for (let attempt = 0; attempt <= RETRIES_PER_MODEL; attempt++) {
      try {
        return await callModelOnce(model, system, user, responseSchema);
      } catch (error) {
        lastError = error;
        if (error instanceof QuotaError) break; // daily quota spent — next model
        if (error instanceof TransientError) {
          // Brief backoff, then retry the same model; on the last attempt, fall
          // through to advance to the next model in the ladder.
          if (attempt < RETRIES_PER_MODEL) {
            await sleep(RETRY_DELAY_MS * (attempt + 1));
            continue;
          }
          break;
        }
        throw error; // non-retryable (bad key, blocked prompt, …) — real failure
      }
    }
    // Exhausted this model — advance to the next one in the ladder.
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("Gemini: all models failed.");
}
