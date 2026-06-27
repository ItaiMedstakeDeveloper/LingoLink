/**
 * Curated directory of French / Chinese restaurants and schools.
 *
 * ⚠️ THE ENTRIES BELOW ARE SAMPLES — replace them with real places. For each:
 *   - set the real `name`, `address`, `phone`, `website`, `hours`
 *   - set accurate `coords` (lat/lng) so "Get directions" opens the right spot
 *     (grab them from Google Maps → right-click a pin → copy coordinates).
 *
 * Everything is static + offline; add/edit objects here and reload.
 */

import type { Language } from "@/lib/media";

export type PlaceCategory = "restaurant" | "school";

export type Place = {
  id: string;
  category: PlaceCategory;
  /** Which language this place relates to. */
  language: Language;
  name: string;
  /** Native-script / secondary name, e.g. "北京小馆". */
  nativeName?: string;
  /** One or two line description. */
  blurb: string;
  /** Small chips, e.g. ["dim sum", "halal"] or ["GCSE", "beginners"]. */
  tags?: string[];
  address: string;
  city: string;
  phone?: string;
  website?: string;
  hours?: string;
  /** 1–3, restaurants only ($, $$, $$$). */
  priceLevel?: 1 | 2 | 3;
  coords: { lat: number; lng: number };
};

export const PLACES: Place[] = [
  // ---- French ----
  {
    id: "fr-alliance",
    category: "school",
    language: "fr",
    name: "Alliance Française",
    blurb:
      "French language and culture centre — classes for all levels plus film and music events.",
    tags: ["all levels", "exams", "culture"],
    address: "Replace with real address",
    city: "Harare",
    website: "https://alliancefrancaisezimbabwe.org",
    hours: "Mon–Fri 8:00–17:00",
    coords: { lat: -17.8246, lng: 31.053 },
  },
  {
    id: "fr-bistro",
    category: "restaurant",
    language: "fr",
    name: "Le Petit Bistro (sample)",
    blurb: "Classic French bistro — steak frites, croissants and good coffee.",
    tags: ["bistro", "breakfast", "wine"],
    address: "Replace with real address",
    city: "Harare",
    priceLevel: 2,
    coords: { lat: -17.812, lng: 31.089 },
  },
  {
    id: "fr-patisserie",
    category: "restaurant",
    language: "fr",
    name: "Maison Douce (sample)",
    nativeName: "Pâtisserie",
    blurb: "French bakery and patisserie — baguettes, éclairs and macarons.",
    tags: ["bakery", "pastries", "takeaway"],
    address: "Replace with real address",
    city: "Harare",
    priceLevel: 1,
    coords: { lat: -17.806, lng: 31.045 },
  },

  // ---- Chinese ----
  {
    id: "zh-confucius",
    category: "school",
    language: "zh",
    name: "Confucius Institute (sample)",
    nativeName: "孔子学院",
    blurb:
      "Mandarin classes and Chinese cultural programmes, often hosted at a university.",
    tags: ["Mandarin", "HSK", "culture"],
    address: "Replace with real address",
    city: "Harare",
    website: "https://www.ci.cn",
    hours: "Mon–Fri 8:30–16:30",
    coords: { lat: -17.7836, lng: 31.052 },
  },
  {
    id: "zh-golden-dragon",
    category: "restaurant",
    language: "zh",
    name: "Golden Dragon (sample)",
    nativeName: "金龙",
    blurb: "Cantonese restaurant — dim sum, roast duck and seafood.",
    tags: ["Cantonese", "dim sum", "dinner"],
    address: "Replace with real address",
    city: "Harare",
    priceLevel: 2,
    coords: { lat: -17.831, lng: 31.05 },
  },
  {
    id: "zh-sichuan-house",
    category: "restaurant",
    language: "zh",
    name: "Sichuan House (sample)",
    nativeName: "川味馆",
    blurb: "Spicy Sichuan cooking — hotpot, mapo tofu and kung pao chicken.",
    tags: ["Sichuan", "spicy", "hotpot"],
    address: "Replace with real address",
    city: "Harare",
    priceLevel: 2,
    coords: { lat: -17.819, lng: 31.075 },
  },
];

/** Convenience lookup by id. */
export function getPlace(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id);
}
