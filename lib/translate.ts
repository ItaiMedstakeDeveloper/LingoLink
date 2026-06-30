/**
 * Free text translation via the MyMemory API (no API key required).
 *
 * Example endpoint:
 *   https://api.mymemory.translated.net/get?q=Hello%20World!&langpair=en|it
 *
 * The free anonymous quota is ~5,000 words/day per IP. Setting MYMEMORY_EMAIL
 * to a valid address raises it to ~50,000 words/day (still free, no signup).
 */

// Optional: add an email to raise the free daily limit. Leave "" to stay anonymous.
const MYMEMORY_EMAIL = "";

export type SourceLang = "en" | "auto";
export type TargetLang = "fr" | "zh";

/** BCP 47 codes used for text-to-speech of each target language. */
export const SPEECH_LOCALE: Record<TargetLang, string> = {
  fr: "fr-FR",
  zh: "zh-CN",
};

export const TARGET_LABEL: Record<TargetLang, string> = {
  fr: "Français",
  zh: "中文",
};

type MyMemoryResponse = {
  responseData: { translatedText: string };
  responseStatus: number;
  responseDetails: string;
};

/**
 * Translate `text` from `source` into `target`. Throws on network/API errors
 * so callers can surface a friendly message.
 */
export async function translateText(
  text: string,
  source: SourceLang,
  target: TargetLang,
): Promise<string> {
  const langpair = `${source}|${target}`;
  const email = MYMEMORY_EMAIL
    ? `&de=${encodeURIComponent(MYMEMORY_EMAIL)}`
    : "";
  const url =
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}` +
    `&langpair=${encodeURIComponent(langpair)}${email}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Translation request failed (${res.status}).`);
  }

  const data = (await res.json()) as MyMemoryResponse;
  if (data.responseStatus !== 200 || !data.responseData?.translatedText) {
    throw new Error(data.responseDetails || "Could not translate that text.");
  }

  return data.responseData.translatedText;
}

/** Translate the same text into both French and Chinese at once. */
export async function translateToBoth(
  text: string,
  source: SourceLang = "en",
): Promise<Record<TargetLang, string>> {
  const [fr, zh] = await Promise.all([
    translateText(text, source, "fr"),
    translateText(text, source, "zh"),
  ]);
  return { fr, zh };
}
