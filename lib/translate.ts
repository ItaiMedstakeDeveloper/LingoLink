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

/** Any language the translator supports, in either direction. */
export type Lang = "en" | "fr" | "zh";

export const LANGS: Lang[] = ["en", "fr", "zh"];

/** Short label shown on the language selectors. */
export const LANG_LABEL: Record<Lang, string> = {
  en: "English",
  fr: "Français",
  zh: "中文",
};

/** BCP 47 codes used for text-to-speech of each language. */
export const SPEECH_LOCALE: Record<Lang, string> = {
  en: "en-US",
  fr: "fr-FR",
  zh: "zh-CN",
};

type MyMemoryResponse = {
  responseData: { translatedText: string };
  responseStatus: number;
  responseDetails: string;
};

/**
 * Translate `text` from `source` into `target` (any direction). Throws on
 * network/API errors so callers can surface a friendly message.
 */
export async function translateText(
  text: string,
  source: Lang,
  target: Lang,
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
