/**
 * Single source of truth for the "View Media" feature: recommended newspapers
 * and video channels to practise reading/listening, per language.
 *
 * TO ADD REAL LINKS LATER: fill in the `url` on each item below. When a `url`
 * is present, tapping the row opens it in the browser. Everything else (the
 * screens, navigation, styling) already works off this data.
 */

export type Language = "zh" | "fr";
export type MediaType = "newspapers" | "videos";

export type MediaItem = {
  /** Display name, e.g. "Le Monde" or "InnerFrench". */
  name: string;
  /** Native-script / secondary label, e.g. "人民日报". */
  native?: string;
  /** Short descriptor shown under the name. */
  note?: string;
  /** Link to the publication / channel — add later. */
  url?: string;
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  zh: "Chinese",
  fr: "French",
};

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  newspapers: "Newspapers",
  videos: "Videos",
};

export const MEDIA: Record<Language, Record<MediaType, MediaItem[]>> = {
  zh: {
    newspapers: [
      { name: "People's Daily", native: "人民日报", note: "Largest national daily" },
      { name: "Xinhua", native: "新华网", note: "State news agency · breaking news" },
      { name: "China Daily", native: "中国日报", note: "Bilingual · easier for learners" },
      { name: "Global Times", native: "环球时报", note: "World & current affairs" },
      { name: "Guangming Daily", native: "光明日报", note: "Culture, science & education" },
    ],
    videos: [
      { name: "Mandarin Corner", note: "Real-life Mandarin with subtitles" },
      { name: "Comprehensible Chinese", note: "Beginner listening practice" },
      { name: "CCTV", native: "中国中央电视台", note: "National broadcaster · news" },
      { name: "李子柒 Liziqi", note: "Slow, calm rural life vlogs" },
      { name: "Mandarin With Miss Lin", note: "Structured lessons & culture" },
    ],
  },
  fr: {
    newspapers: [
      { name: "Le Monde", note: "France's paper of record · national & world news" },
      { name: "Le Figaro", note: "Long-running daily · politics & culture" },
      { name: "Libération", note: "Left-leaning daily · society & ideas" },
      { name: "Le Parisien", note: "Accessible daily · everyday French" },
      { name: "L'Équipe", note: "Sports daily · great for casual reading" },
    ],
    videos: [
      { name: "InnerFrench", note: "Intermediate French, spoken slowly" },
      { name: "Français Authentique", note: "Natural everyday French" },
      { name: "Easy French", note: "Street interviews with subtitles" },
      { name: "TV5Monde", note: "News & culture from the Francophone world" },
      { name: "Piece of French", note: "Real conversations for learners" },
    ],
  },
};
