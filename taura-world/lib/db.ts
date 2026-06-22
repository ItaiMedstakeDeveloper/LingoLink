import { type SQLiteDatabase } from 'expo-sqlite';

export const DATABASE_NAME = 'taura.db';

/**
 * Runs once on app startup (via SQLiteProvider `onInit`).
 * Creates the auth + content schema and seeds the first story.
 * Guarded by PRAGMA user_version so it only runs when needed.
 */
export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;

  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let currentVersion = result?.user_version ?? 0;

  if (currentVersion >= DATABASE_VERSION) {
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

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

async function seedMorningInMbare(db: SQLiteDatabase) {
  const insert = await db.runAsync(
    `INSERT INTO stories (title, location, description, order_index) VALUES (?, ?, ?, ?)`,
    'Morning in Mbare',
    'Mbare',
    'A beginner-friendly immersive journey showing a morning in Mbare, including waking up, walking, taking a kombi, and arriving in Harare CBD for daily activities.',
    1
  );
  const storyId = insert.lastInsertRowId;

  const scenes: [number, string, string, string, string][] = [
    [1, 'I wake up early in Mbare.', 'Je me réveille tôt à Mbare.', '我在 Mbare 很早醒来。', 'daily life'],
    [2, 'I say good morning to my mother.', 'Je dis bonjour à ma mère.', '我对我妈妈说早上好。', 'social'],
    [3, 'I eat a little bread and drink tea.', 'Je mange un peu de pain et je bois du thé.', '我吃一点面包，喝茶。', 'food'],
    [4, "I leave the house at six o'clock.", 'Je quitte la maison à six heures.', '我六点离开家。', 'daily life'],
    [5, 'I walk through the streets of Mbare.', 'Je marche dans les rues de Mbare.', '我走过 Mbare 的街道。', 'daily life'],
    [6, 'I greet my neighbour on the road.', 'Je salue mon voisin sur la route.', '我在路上跟邻居打招呼。', 'social'],
    [7, 'I go to the kombi rank.', 'Je vais à la gare des kombis.', '我去 kombi 车站。', 'transport'],
    [8, 'I ask the driver, "Do you go to Harare?"', 'Je demande au chauffeur : « Allez-vous à Harare ? »', '我问司机：“你去 Harare 吗？”', 'transport'],
    [9, 'I pay one dollar for the trip.', 'Je paie un dollar pour le voyage.', '我为这趟车付一美元。', 'transport'],
    [10, 'I sit in the kombi and wait.', "Je m'assois dans le kombi et j'attends.", '我坐在 kombi 里等待。', 'transport'],
    [11, 'The kombi arrives in Harare CBD.', 'Le kombi arrive à Harare CBD.', 'kombi 到达 Harare CBD。', 'transport'],
    [12, 'I walk on First Street in the city.', 'Je marche dans First Street en ville.', '我走在市中心的 First Street 上。', 'daily life'],
    [13, 'I buy fruit at OK Zimbabwe.', "J'achète des fruits à OK Zimbabwe.", '我在 OK Zimbabwe 买水果。', 'shopping'],
    [14, 'I say thank you to the seller.', 'Je dis merci au vendeur.', '我对卖家说谢谢。', 'social'],
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
      context
    );
  }
}
