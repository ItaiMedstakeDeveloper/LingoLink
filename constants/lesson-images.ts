import type { ImageSourcePropType } from "react-native";

/**
 * Catalog of the story-lesson illustrations.
 *
 * The image files live in `assets/images/lessons/`. Because React Native's
 * Metro bundler resolves `require(...)` at build time, a `require` that points
 * at a missing file is a hard bundling error — so the `require` lines below stay
 * commented until the matching PNG has actually been dropped into the folder.
 *
 * TO ACTIVATE AN IMAGE:
 *   1. Save the PNG into `assets/images/lessons/` using the exact `file` name.
 *   2. Uncomment that entry's `require(...)` and delete its `: null`.
 *
 * See `assets/images/lessons/README.md` for the full filename list.
 */
export type LessonImage = {
  lesson: number;
  title: string;
  file: string;
  source: ImageSourcePropType | null;
};

export const LESSON_IMAGES: LessonImage[] = [
  {
    lesson: 3,
    title: "Mbare Market Arrives",
    file: "lesson-03-mbare-market.png",
    source: null,
    // source: require("@/assets/images/lessons/lesson-03-mbare-market.png"),
  },
  {
    lesson: 4,
    title: "Ambuya Chipo's Tomatoes",
    file: "lesson-04-ambuya-chipo-tomatoes.png",
    source: null,
    // source: require("@/assets/images/lessons/lesson-04-ambuya-chipo-tomatoes.png"),
  },
  {
    lesson: 5,
    title: "Zhou Wei & the Charger",
    file: "lesson-05-zhou-wei-charger.png",
    source: null,
    // source: require("@/assets/images/lessons/lesson-05-zhou-wei-charger.png"),
  },
  {
    lesson: 6,
    title: "Marguerite and the Shoes",
    file: "lesson-06-marguerite-shoes.png",
    source: null,
    // source: require("@/assets/images/lessons/lesson-06-marguerite-shoes.png"),
  },
  {
    lesson: 8,
    title: "The Professor's Question",
    file: "lesson-08-professors-question.png",
    source: null,
    // source: require("@/assets/images/lessons/lesson-08-professors-question.png"),
  },
  {
    lesson: 9,
    title: "The Ride Home",
    file: "lesson-09-ride-home.png",
    source: null,
    // source: require("@/assets/images/lessons/lesson-09-ride-home.png"),
  },
  {
    lesson: 10,
    title: "Five Conversations",
    file: "lesson-10-five-conversations.png",
    source: null,
    // source: require("@/assets/images/lessons/lesson-10-five-conversations.png"),
  },
];

/** Returns the illustration source for a lesson, or null if not yet added. */
export function getLessonImage(lesson: number): ImageSourcePropType | null {
  return LESSON_IMAGES.find((l) => l.lesson === lesson)?.source ?? null;
}
