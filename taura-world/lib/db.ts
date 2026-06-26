import { type SQLiteDatabase } from "expo-sqlite";

import { LESSONS } from "./lessons";

export const DATABASE_NAME = "taura.db";

/**
 * Runs once on app startup (via SQLiteProvider `onInit`).
 * Creates the auth + content schema and seeds the first story.
 * Guarded by PRAGMA user_version so it only runs when needed.
 */
export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 5;

  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  let currentVersion = result?.user_version ?? 0;

  // Self-heal: always guarantee these tables exist, regardless of how far past
  // migrations got (a prior run may have aborted mid-migration and left
  // user_version inconsistent). Idempotent + safe to run every launch.
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS lesson_progress (
      lesson_order INTEGER PRIMARY KEY,
      last_scene INTEGER NOT NULL DEFAULT 0,
      completed INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS saved_words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT NOT NULL,
      language TEXT NOT NULL,
      translation TEXT NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL
    );
  `);

  if (currentVersion >= DATABASE_VERSION) {
    // Up to date by version, but make sure the lessons actually got seeded.
    await ensureStoriesSeeded(db);
    return;
  }

  if (currentVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      -- Single-row table that remembers the locally signed-in user.
      CREATE TABLE IF NOT EXISTS session (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      INSERT OR IGNORE INTO session (id, user_id) VALUES (1, NULL);
      CREATE TABLE IF NOT EXISTS stories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        location TEXT,
        description TEXT,
        order_index INTEGER
      );

      CREATE TABLE IF NOT EXISTS story_scenes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        story_id INTEGER,
        scene_number INTEGER,
        english TEXT,
        french TEXT,
        chinese TEXT,
        context TEXT,
        FOREIGN KEY (story_id) REFERENCES stories(id)
      );
    `);

    await seedMorningInMbare(db);

    currentVersion = 1;
  }

  if (currentVersion === 1) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS vocabulary (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chinese TEXT NOT NULL,
        chinese_pinyin TEXT NOT NULL,
        french TEXT NOT NULL,
        french_details TEXT,
        english TEXT NOT NULL,
        english_details TEXT,
        context_tip TEXT,
        mastered INTEGER DEFAULT 0
      );
    `);

    await seedVocabulary(db);
    currentVersion = 2;
  }

  if (currentVersion === 2) {
    // Add per-lesson metadata columns (ignore errors if a column already exists)
    // and replace the placeholder story with the full "A Day in Harare" reader.
    for (const column of ["level TEXT", "focus TEXT"]) {
      try {
        await db.execAsync(`ALTER TABLE stories ADD COLUMN ${column}`);
      } catch {
        // Column already present — safe to skip.
      }
    }

    await seedLessons(db);
    currentVersion = 3;
  }

  if (currentVersion === 3) {
    // Tracks how far the learner has read each lesson. Keyed by the stable
    // lesson order (not story id) so it survives future content reseeds.
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS lesson_progress (
        lesson_order INTEGER PRIMARY KEY,
        last_scene INTEGER NOT NULL DEFAULT 0,
        completed INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL
      );
    `);
    currentVersion = 4;
  }

  if (currentVersion === 4) {
    // Personal vocabulary the learner saves themselves ("My Words"). Kept
    // separate from the seeded `vocabulary` deck so reseeds never touch it.
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS saved_words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word TEXT NOT NULL,
        language TEXT NOT NULL,
        translation TEXT NOT NULL,
        note TEXT,
        created_at TEXT NOT NULL
      );
    `);
    currentVersion = 5;
  }

  await ensureStoriesSeeded(db);
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

/**
 * Guarantees the 10 lessons are present. If the stories table exists but is
 * empty (e.g. an earlier migration aborted before seeding), it reseeds them.
 * No-ops on a healthy database.
 */
async function ensureStoriesSeeded(db: SQLiteDatabase) {
  let count = 0;
  try {
    const row = await db.getFirstAsync<{ n: number }>(
      `SELECT COUNT(*) AS n FROM stories`,
    );
    count = row?.n ?? 0;
  } catch {
    // Stories table doesn't exist yet; the versioned migration will create it.
    return;
  }
  if (count > 0) return;

  // Empty — make sure the metadata columns exist, then seed.
  for (const column of ["level TEXT", "focus TEXT"]) {
    try {
      await db.execAsync(`ALTER TABLE stories ADD COLUMN ${column}`);
    } catch {
      // Column already present — safe to skip.
    }
  }
  await seedLessons(db);
}

/**
 * Replaces all story content with the 10 lessons from `lib/lessons.ts`.
 * Each lesson becomes one story; each section becomes one ordered scene.
 */
async function seedLessons(db: SQLiteDatabase) {
  await db.execAsync(`DELETE FROM story_scenes; DELETE FROM stories;`);

  for (const lesson of LESSONS) {
    const insert = await db.runAsync(
      `INSERT INTO stories (title, location, description, order_index, level, focus)
       VALUES (?, ?, ?, ?, ?, ?)`,
      lesson.title.en,
      lesson.location,
      lesson.focus,
      lesson.order,
      lesson.level,
      lesson.focus,
    );
    const storyId = insert.lastInsertRowId;

    let sceneNumber = 1;
    for (const section of lesson.sections) {
      await db.runAsync(
        `INSERT INTO story_scenes (story_id, scene_number, english, french, chinese, context)
         VALUES (?, ?, ?, ?, ?, ?)`,
        storyId,
        sceneNumber,
        section.english,
        section.french,
        section.chinese,
        section.context,
      );
      sceneNumber += 1;
    }
  }
}

async function seedVocabulary(db: SQLiteDatabase) {
  const words: [string, string, string, string, string, string, string][] = [
    [
      "你好",
      "nǐ hǎo",
      "Bonjour",
      "bon-ZHOOR · greeting",
      "Hello",
      "the most common greeting",
      "Used in Harare every day. You'll hear this at every shop on First Street",
    ],
    [
      "市场",
      "shì chǎng",
      "Marché",
      "le marché · masculine",
      "Market",
      "e.g. Mbare Musika, Harare",
      "Tino uses this word at Mbare Musika",
    ],
    [
      "谢谢",
      "xièxie",
      "Merci",
      "merci · expression",
      "Thank you",
      "showing appreciation",
      "Say this when buying fruit from the street vendors on First Street",
    ],
    [
      "巴士",
      "bāshì",
      "Bus",
      "le bus · masculine",
      "Bus",
      "the local commuter omnibus",
      "You will hear people shouting 'Harare! Harare!' at the kombi rank",
    ],
    [
      "朋友",
      "péngyou",
      "Ami",
      "l'ami · masculine",
      "Friend",
      "a close acquaintance",
      "Greet your neighbours with this word in the morning",
    ],
    [
      "水果",
      "shuǐguǒ",
      "Fruit",
      "le fruit · masculine",
      "Fruit",
      "fresh produce",
      "OK Zimbabwe has plenty of fresh apples and oranges",
    ],
    [
      "钱",
      "qián",
      "Argent",
      "l'argent · masculine",
      "Money",
      "used for trade",
      "A commuter trip costs about one US dollar in Harare",
    ],
    [
      "早安",
      "zǎo ān",
      "Bonjour",
      "bon-ZHOOR · morning greeting",
      "Good morning",
      "greeting in the morning",
      "Always say good morning to your mother before leaving",
    ],
    [
      "家",
      "jiā",
      "Maison",
      "la maison · feminine",
      "House",
      "where you live",
      "Leaving the house early ensures you catch the first kombi",
    ],
    [
      "面包",
      "miànbāo",
      "Pain",
      "le pain · masculine",
      "Bread",
      "popular breakfast food",
      "Eating fresh bread with sweet hot tea starts the day right",
    ],
    [
      "司机",
      "sījī",
      "Chauffeur",
      "le chauffeur · masculine",
      "Driver",
      "the kombi operator",
      "Confirm the route with the driver before getting in",
    ],
    [
      "街道",
      "jiēdào",
      "Rue",
      "la rue · feminine",
      "Street",
      "busy thoroughfares",
      "Walking along First Street is a lively experience during rush hour",
    ],
  ];

  for (const [zh, zh_p, fr, fr_d, en, en_d, tip] of words) {
    await db.runAsync(
      `INSERT INTO vocabulary (chinese, chinese_pinyin, french, french_details, english, english_details, context_tip)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      zh,
      zh_p,
      fr,
      fr_d,
      en,
      en_d,
      tip,
    );
  }
}

async function seedMorningInMbare(db: SQLiteDatabase) {
  const insert = await db.runAsync(
    `INSERT INTO stories (title, location, description, order_index) VALUES (?, ?, ?, ?)`,
    "Morning in Mbare",
    "Mbare",
    "A beginner-friendly immersive journey showing a morning in Mbare, including waking up, walking, taking a kombi, and arriving in Harare CBD for daily activities.",
    1,
  );
  const storyId = insert.lastInsertRowId;

  const scenes: [number, string, string, string, string][] = [
    [
      1,
      "I wake up early in Mbare.",
      "Je me réveille tôt à Mbare.",
      "我在 Mbare 很早醒来。",
      "daily life",
    ],
    [
      2,
      "I say good morning to my mother.",
      "Je dis bonjour à ma mère.",
      "我对我妈妈说早上好。",
      "social",
    ],
    [
      3,
      "I eat a little bread and drink tea.",
      "Je mange un peu de pain et je bois du thé.",
      "我吃一点面包，喝茶。",
      "food",
    ],
    [
      4,
      "I leave the house at six o'clock.",
      "Je quitte la maison à six heures.",
      "我六点离开家。",
      "daily life",
    ],
    [
      5,
      "I walk through the streets of Mbare.",
      "Je marche dans les rues de Mbare.",
      "我走过 Mbare 的街道。",
      "daily life",
    ],
    [
      6,
      "I greet my neighbour on the road.",
      "Je salue mon voisin sur la route.",
      "我在路上跟邻居打招呼。",
      "social",
    ],
    [
      7,
      "I go to the kombi rank.",
      "Je vais à la gare des kombis.",
      "我去 kombi 车站。",
      "transport",
    ],
    [
      8,
      'I ask the driver, "Do you go to Harare?"',
      "Je demande au chauffeur : « Allez-vous à Harare ? »",
      "我问司机：“你去 Harare 吗？”",
      "transport",
    ],
    [
      9,
      "I pay one dollar for the trip.",
      "Je paie un dollar pour le voyage.",
      "我为这趟车付一美元。",
      "transport",
    ],
    [
      10,
      "I sit in the kombi and wait.",
      "Je m'assois dans le kombi et j'attends.",
      "我坐在 kombi 里等待。",
      "transport",
    ],
    [
      11,
      "The kombi arrives in Harare CBD.",
      "Le kombi arrive à Harare CBD.",
      "kombi 到达 Harare CBD。",
      "transport",
    ],
    [
      12,
      "I walk on First Street in the city.",
      "Je marche dans First Street en ville.",
      "我走在市中心的 First Street 上。",
      "daily life",
    ],
    [
      13,
      "I buy fruit at OK Zimbabwe.",
      "J'achète des fruits à OK Zimbabwe.",
      "我在 OK Zimbabwe 买水果。",
      "shopping",
    ],
    [
      14,
      "I say thank you to the seller.",
      "Je dis merci au vendeur.",
      "我对卖家说谢谢。",
      "social",
    ],
  ];

  for (const [sceneNumber, english, french, chinese, context] of scenes) {
    await db.runAsync(
      `INSERT INTO story_scenes (story_id, scene_number, english, french, chinese, context)
       VALUES (?, ?, ?, ?, ?, ?)`,
      storyId,
      sceneNumber,
      english,
      french,
      chinese,
      context,
    );
  }
}
