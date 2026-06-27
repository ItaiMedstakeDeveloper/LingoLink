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
      {
        name: "People's Daily",
        native: "人民日报",
        note: "Largest national daily",
        url: "https://www.people.com.cn",
      },
      {
        name: "Xinhua",
        native: "新华网",
        note: "State news agency · breaking news",
        url: "https://www.news.cn",
      },
      {
        name: "China Daily",
        native: "中国日报",
        note: "Bilingual · easier for learners",
        url: "https://www.chinadaily.com.cn",
      },
      {
        name: "Global Times",
        native: "环球时报",
        note: "World & current affairs",
        url: "https://www.globaltimes.cn",
      },
      {
        name: "Guangming Daily",
        native: "光明日报",
        note: "Culture, science & education",
        url: "https://www.gmw.cn",
      },
    ],
    videos: [
      {
        name: "Mandarin Corner",
        note: "Real-life Mandarin with subtitles",
        url: "https://www.youtube.com/@MandarinCorner2",
      },
      {
        name: "Comprehensible Chinese",
        note: "Beginner listening practice",
        url: "https://www.youtube.com/@comprehensiblechinese",
      },
      {
        name: "CCTV",
        native: "中国中央电视台",
        note: "National broadcaster · news",
        url: "https://www.youtube.com/@CCTV",
      },
      {
        name: "李子柒 Liziqi",
        note: "Slow, calm rural life vlogs",
        url: "https://www.youtube.com/@cnliziqi",
      },
      {
        name: "Mandarin With Miss Lin",
        note: "Structured lessons & culture",
        url: "https://www.youtube.com/@MandarinWithMissLin",
      },
    ],
  },
  fr: {
    newspapers: [
      {
        name: "Le Monde",
        note: "France's paper of record · national & world news",
        url: "https://www.lemonde.fr",
      },
      {
        name: "Le Figaro",
        note: "Long-running daily · politics & culture",
        url: "https://www.lefigaro.fr",
      },
      {
        name: "Libération",
        note: "Left-leaning daily · society & ideas",
        url: "https://www.liberation.fr",
      },
      {
        name: "Le Parisien",
        note: "Accessible daily · everyday French",
        url: "https://www.leparisien.fr",
      },
      {
        name: "L'Équipe",
        note: "Sports daily · great for casual reading",
        url: "https://www.lequipe.fr",
      },
    ],
    videos: [
      {
        name: "InnerFrench",
        note: "Intermediate French, spoken slowly",
        url: "https://www.youtube.com/@innerfrench",
      },
      {
        name: "Français Authentique",
        note: "Natural everyday French",
        url: "https://www.youtube.com/@francaisauthentique",
      },
      {
        name: "Easy French",
        note: "Street interviews with subtitles",
        url: "https://www.youtube.com/@easyfrench",
      },
      {
        name: "TV5Monde",
        note: "Learn French with news & culture",
        url: "https://apprendre.tv5monde.com",
      },
      {
        name: "Piece of French",
        note: "Real conversations for learners",
        url: "https://www.youtube.com/@PieceofFrench",
      },
    ],
  },
};
