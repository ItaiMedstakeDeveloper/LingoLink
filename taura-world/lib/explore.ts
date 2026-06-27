/**
 * Data for the "Explore" tab. Each language has a LIST of maps the learner can
 * switch between (e.g. France ↔ Francophone Africa, China ↔ dialects). Every
 * map is just a simplified outline (drawn in a 0–100 viewBox) plus a set of
 * markers placed at relative coordinates. Tapping a marker speaks a phrase and
 * shows a short cultural fact.
 *
 * The outlines are deliberately illustrative (not survey-accurate) to match the
 * app's hand-drawn feel and to stay light + offline.
 */

import type { Language } from "@/lib/media";

export type Marker = {
  /** Display name (city or country). */
  name: string;
  /** Native-script / secondary label, e.g. "北京" or "Cantonese". */
  native?: string;
  /** X position in the 0–100 map viewBox. */
  x: number;
  /** Y position in the 0–100 map viewBox. */
  y: number;
  /** Phrase to speak when tapped (in the target language/variety). */
  phrase: string;
  /** Same phrase shown on screen (native script / accented). */
  phraseLabel: string;
  /** English meaning of the phrase. */
  phraseEn: string;
  /** A short, fun cultural fact. */
  fact: string;
  /** Optional BCP-47 override for this marker (e.g. "zh-HK" for Cantonese). */
  bcp47?: string;
};

export type ExploreMap = {
  /** Stable id. */
  id: string;
  /** Short label for the map switcher, e.g. "France" or "Afrique". */
  label: string;
  /** Secondary label shown under the header, e.g. "中国 · 普通话". */
  sub: string;
  /** Default BCP-47 code used for speech, e.g. "zh-CN". */
  bcp47: string;
  /** Simplified outline path in a "0 0 100 100" viewBox. */
  outline: string;
  markers: Marker[];
};

const CHINA_OUTLINE =
  "M50,18 L70,15 L84,16 L82,30 L83,46 L74,62 L70,74 L58,73 L48,72 L33,67 L20,57 L22,40 L17,30 L34,21 Z";

const FRANCE_OUTLINE =
  "M50,12 L66,16 L80,30 L74,52 L72,70 L55,80 L45,82 L33,75 L28,60 L21,48 L8,44 L21,39 L31,27 Z";

// Stylised Africa silhouette (West-Africa bulge, narrowing to the Cape).
const AFRICA_OUTLINE =
  "M28,12 L46,11 L66,16 L80,30 L88,40 L80,49 L72,64 L66,80 L54,92 L46,86 L42,72 L40,60 L33,55 L16,46 L12,38 L20,24 Z";

export const EXPLORE: Record<Language, ExploreMap[]> = {
  zh: [
    {
      id: "china",
      label: "China",
      sub: "中国 · 普通话",
      bcp47: "zh-CN",
      outline: CHINA_OUTLINE,
      markers: [
        {
          name: "Beijing",
          native: "北京",
          x: 70,
          y: 31,
          phrase: "你好，欢迎来到北京",
          phraseLabel: "你好，欢迎来到北京",
          phraseEn: "Hello, welcome to Beijing",
          fact: "Home to the Forbidden City — the world's largest palace complex.",
        },
        {
          name: "Shanghai",
          native: "上海",
          x: 82,
          y: 47,
          phrase: "上海是一个大城市",
          phraseLabel: "上海是一个大城市",
          phraseEn: "Shanghai is a big city",
          fact: "China's biggest city and a global finance hub on the Huangpu River.",
        },
        {
          name: "Xi'an",
          native: "西安",
          x: 57,
          y: 45,
          phrase: "西安有兵马俑",
          phraseLabel: "西安有兵马俑",
          phraseEn: "Xi'an has the Terracotta Army",
          fact: "Guarded by the Terracotta Army — over 8,000 clay soldiers.",
        },
        {
          name: "Chengdu",
          native: "成都",
          x: 45,
          y: 53,
          phrase: "成都有熊猫",
          phraseLabel: "成都有熊猫",
          phraseEn: "Chengdu has pandas",
          fact: "The giant panda capital — and famously spicy Sichuan food.",
        },
        {
          name: "Guangzhou",
          native: "广州",
          x: 66,
          y: 70,
          phrase: "广州的早茶很好吃",
          phraseLabel: "广州的早茶很好吃",
          phraseEn: "Guangzhou's dim sum is delicious",
          fact: "Cantonese heartland — the birthplace of dim sum (早茶).",
        },
        {
          name: "Hong Kong",
          native: "香港",
          x: 70,
          y: 76,
          phrase: "香港很热闹",
          phraseLabel: "香港很热闹",
          phraseEn: "Hong Kong is lively",
          fact: "Where Cantonese, English and skyscrapers meet the sea.",
        },
      ],
    },
    {
      id: "zh-dialects",
      label: "方言 Dialects",
      sub: "汉语方言 · the many Chinese languages",
      bcp47: "zh-CN",
      outline: CHINA_OUTLINE,
      markers: [
        {
          name: "Mandarin",
          native: "普通话",
          x: 70,
          y: 31,
          phrase: "你好",
          phraseLabel: "你好 (nǐ hǎo)",
          phraseEn: "Hello — Mandarin (Beijing/north)",
          fact: "The official standard, based on northern speech. ~70% of China.",
          bcp47: "zh-CN",
        },
        {
          name: "Cantonese",
          native: "粤语",
          x: 66,
          y: 70,
          phrase: "你好",
          phraseLabel: "你好 (néih hóu)",
          phraseEn: "Hello — Cantonese (Guangdong, HK, Macau)",
          fact: "Has 6 tones to Mandarin's 4 — a different spoken language entirely.",
          bcp47: "zh-HK",
        },
        {
          name: "Shanghainese",
          native: "上海话 (吴)",
          x: 82,
          y: 47,
          phrase: "侬好",
          phraseLabel: "侬好 (nong hó)",
          phraseEn: "Hello — Shanghainese / Wu",
          fact: "Part of the Wu family — sounds soft and very unlike Mandarin.",
        },
        {
          name: "Hokkien",
          native: "闽南话",
          x: 77,
          y: 60,
          phrase: "你好",
          phraseLabel: "你好 (lí-hó)",
          phraseEn: "Hello — Hokkien / Min (Fujian, Taiwan, SE Asia)",
          fact: "Spoken across Fujian, Taiwan and the diaspora in Singapore & Malaysia.",
        },
        {
          name: "Sichuanese",
          native: "四川话",
          x: 45,
          y: 53,
          phrase: "你好",
          phraseLabel: "你好 (ní hǎo)",
          phraseEn: "Hello — Sichuanese (southwest Mandarin)",
          fact: "A Mandarin variety with its own melody — from the spicy hotpot heartland.",
        },
      ],
    },
  ],
  fr: [
    {
      id: "france",
      label: "France",
      sub: "Français · l'Hexagone",
      bcp47: "fr-FR",
      outline: FRANCE_OUTLINE,
      markers: [
        {
          name: "Paris",
          x: 52,
          y: 30,
          phrase: "Bonjour de Paris !",
          phraseLabel: "Bonjour de Paris !",
          phraseEn: "Hello from Paris!",
          fact: "The Eiffel Tower was meant to be temporary — built for the 1889 fair.",
        },
        {
          name: "Lille",
          x: 55,
          y: 16,
          phrase: "Il fait froid à Lille",
          phraseLabel: "Il fait froid à Lille",
          phraseEn: "It's cold in Lille",
          fact: "Northern city famous for its huge flea market, La Braderie.",
        },
        {
          name: "Strasbourg",
          x: 76,
          y: 31,
          phrase: "Strasbourg est près de l'Allemagne",
          phraseLabel: "Strasbourg est près de l'Allemagne",
          phraseEn: "Strasbourg is near Germany",
          fact: "Seat of the European Parliament, on the German border.",
        },
        {
          name: "Lyon",
          x: 62,
          y: 55,
          phrase: "Lyon, capitale de la gastronomie",
          phraseLabel: "Lyon, capitale de la gastronomie",
          phraseEn: "Lyon, capital of gastronomy",
          fact: "Considered France's food capital — home of the bouchon bistro.",
        },
        {
          name: "Bordeaux",
          x: 33,
          y: 63,
          phrase: "Bordeaux est connue pour le vin",
          phraseLabel: "Bordeaux est connue pour le vin",
          phraseEn: "Bordeaux is known for wine",
          fact: "Surrounded by some of the world's most famous vineyards.",
        },
        {
          name: "Marseille",
          x: 66,
          y: 74,
          phrase: "Marseille est au bord de la mer",
          phraseLabel: "Marseille est au bord de la mer",
          phraseEn: "Marseille is by the sea",
          fact: "France's oldest city and biggest Mediterranean port.",
        },
      ],
    },
    {
      id: "francophone-africa",
      label: "Afrique",
      sub: "La Francophonie · l'Afrique",
      bcp47: "fr-FR",
      outline: AFRICA_OUTLINE,
      markers: [
        {
          name: "Kinshasa",
          native: "RD Congo",
          x: 47,
          y: 66,
          phrase: "Kinshasa est la plus grande ville francophone du monde",
          phraseLabel: "Kinshasa, la plus grande ville francophone du monde",
          phraseEn: "Kinshasa is the largest French-speaking city in the world",
          fact: "The DR Congo has more French speakers than any other country.",
        },
        {
          name: "Dakar",
          native: "Sénégal",
          x: 13,
          y: 42,
          phrase: "À Dakar, on parle français et wolof",
          phraseLabel: "On parle français et wolof",
          phraseEn: "In Dakar we speak French and Wolof",
          fact: "French is official; Wolof is the everyday lingua franca.",
        },
        {
          name: "Abidjan",
          native: "Côte d'Ivoire",
          x: 27,
          y: 56,
          phrase: "Abidjan est une grande ville francophone",
          phraseLabel: "Abidjan, une grande ville francophone",
          phraseEn: "Abidjan is a big French-speaking city",
          fact: "Home of 'nouchi' — a playful Ivorian French street slang.",
        },
        {
          name: "Bamako",
          native: "Mali",
          x: 24,
          y: 46,
          phrase: "Bienvenue à Bamako",
          phraseLabel: "Bienvenue à Bamako",
          phraseEn: "Welcome to Bamako",
          fact: "French is official across the Sahel; Bambara is widely spoken.",
        },
        {
          name: "Yaoundé",
          native: "Cameroun",
          x: 44,
          y: 58,
          phrase: "Le Cameroun est bilingue",
          phraseLabel: "Le Cameroun est bilingue",
          phraseEn: "Cameroon is bilingual",
          fact: "Officially French AND English — a rare bilingual nation.",
        },
        {
          name: "Antananarivo",
          native: "Madagascar",
          x: 82,
          y: 74,
          phrase: "Madagascar parle français et malgache",
          phraseLabel: "français et malgache",
          phraseEn: "Madagascar speaks French and Malagasy",
          fact: "An Indian-Ocean island where French sits beside Malagasy.",
        },
        {
          name: "Rabat",
          native: "Maroc",
          x: 23,
          y: 17,
          phrase: "Au Maroc, on parle français et arabe",
          phraseLabel: "français et arabe",
          phraseEn: "In Morocco we speak French and Arabic",
          fact: "French is widely used in business and school alongside Arabic & Darija.",
        },
      ],
    },
  ],
};
