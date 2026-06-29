/**
 * Curated directory of French / Chinese restaurants and schools.
 *
 * For each entry:
 *   - set the real `name`, `address`, `website`, `hours`
 *   - set accurate `coords` (lat/lng) so "Get directions" opens the right spot
 *     (grab them from Google Maps → right-click a pin → copy coordinates).
 *   - `phone`  → used by the "Call" button (any format, e.g. "+263 77 123 4567").
 *   - `whatsapp` → used by the "WhatsApp" button. International format, e.g.
 *     "+263771234567" (Zimbabwe = 263, drop the leading 0). Often same as phone.
 *
 * The Call / WhatsApp buttons only appear when the matching field is set.
 * ⚠️ The phone/whatsapp numbers below are PLACEHOLDERS — replace with real ones.
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
  /** Phone number for the "Call" button (any readable format). */
  phone?: string;
  /** WhatsApp number for the "WhatsApp" button (international, e.g. "+263771234567"). */
  whatsapp?: string;
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
    address: "328 Herbert Chitepo Avenue, Harare.Corner Chitepo & 9th Street.",
    city: "Harare",
    phone: "+263782946551",
    whatsapp: "+263782946551",
    website: "https://alliancefrancaisezimbabwe.org",
    hours: "Mon–Fri 8:00–17:00",
    coords: { lat: -17.822, lng: 31.049 },
  },
  {
    id: "fr-bistro",
    category: "restaurant",
    language: "fr",
    name: "Cafe De Paris",
    blurb:
      "Providing Harare with a taste of Paris with authentic French pastrie and pâtisserie",
    tags: ["bistro", "breakfast", "wine"],
    address: "47 Churchill Avenue, Harare, Zimbabwe, Harare",
    city: "Harare",
    phone: "+26377807880",
    whatsapp: "+26377807880",
    priceLevel: 2,
    coords: { lat: 17.7915, lng: 31.062 },
  },
  {
    id: "fr-patisserie",
    category: "restaurant",
    language: "fr",
    name: "La Fontaine Grillroom:",
    nativeName: "Pâtisserie",
    blurb:
      "La Fontaine Grillroom is a distinguished choice for upscale dining in Harare—ideal for a refined steak dinner, romantic date, or special celebration.",
    tags: ["bakery", "pastries", "takeaway"],
    address: "Corner of Jason Moyo Avenue & Third Street, Harare CBD",
    city: "Harare",
    phone: "+263772328688",
    whatsapp: "+263772328688",
    priceLevel: 1,
    coords: { lat: -17.824858, lng: 31.053028 },
  },

  // ---- Chinese ----
  {
    id: "zh-confucius",
    category: "school",
    language: "zh",
    name: "Mandarin Minds Academy",
    blurb:
      "Mandarin classes and Chinese cultural programmes, often hosted at a university.",
    tags: ["Mandarin", "HSK", "culture"],
    address:
      " 3 Anchor House, Cnr Jason Moyo and First Street, 54 Jason Moyo Ave, Harare",
    city: "Harare",
    phone: "+263778764015",
    whatsapp: "+263778764015",
    hours: "Mon–Fri 8:30–16:30",
    coords: { lat: 17.83058, lng: 31.05 },
  },
  {
    id: "zh-golden-dragon",
    category: "restaurant",
    language: "zh",
    name: "Hungry Panda",
    blurb: "The Best Chinese and grill cuisine Restaurant In Harare ",
    tags: ["Cantonese", "dim sum", "dinner"],
    address: "4BDG House,Avondale Shopping Centre Zimbabwe",
    city: "Harare",
    phone: "+263776333969",
    whatsapp: "+263776333969",
    priceLevel: 2,
    coords: { lat: -17.80007, lng: 31.03523 },
  },
];

/** Convenience lookup by id. */
export function getPlace(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id);
}
