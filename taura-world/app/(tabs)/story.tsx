import { StoryPath, type LessonStory } from "@/components/story-path";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LESSONS } from "@/lib/lessons";
import { speak } from "@/lib/speech";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
type Story = LessonStory;

type Scene = {
  id: number;
  story_id: number;
  scene_number: number;
  english: string;
  french: string;
  chinese: string;
  context: string;
};

export default function StoryScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const params = useLocalSearchParams<{ lesson?: string }>();
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme ?? "light"];

  // Reader state
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [scenesLoading, setScenesLoading] = useState(false);
  const [readingCompleted, setReadingCompleted] = useState(false);

  // Page-flip animation: 0 → flat, 1 → edge-on (content swaps here), back to flat.
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [flipDir, setFlipDir] = useState(1);

  // Upsert reading progress for a lesson.
  const saveProgress = useCallback(
    async (order: number, lastScene: number, completed: boolean) => {
      try {
        await db.runAsync(
          `INSERT INTO lesson_progress (lesson_order, last_scene, completed, updated_at)
           VALUES (?, ?, ?, ?)
           ON CONFLICT(lesson_order) DO UPDATE SET
             last_scene = excluded.last_scene,
             completed = MAX(lesson_progress.completed, excluded.completed),
             updated_at = excluded.updated_at`,
          order,
          lastScene,
          completed ? 1 : 0,
          new Date().toISOString(),
        );
      } catch (err) {
        console.error("Error saving progress:", err);
      }
    },
    [db],
  );

  // Fetch scenes when a lesson is selected, resuming where the learner left off.
  const handleSelectStory = useCallback(
    async (story: Story) => {
      setScenesLoading(true);
      setReadingCompleted(false);
      try {
        const rows = await db.getAllAsync<Scene>(
          `SELECT * FROM story_scenes WHERE story_id = ? ORDER BY scene_number ASC`,
          story.id,
        );
        const saved = await db.getFirstAsync<{
          last_scene: number;
          completed: number;
        }>(
          `SELECT last_scene, completed FROM lesson_progress WHERE lesson_order = ?`,
          story.order_index,
        );
        // Resume mid-lesson; restart completed lessons from the beginning.
        const startIndex =
          saved && saved.completed !== 1
            ? Math.min(saved.last_scene, Math.max(rows.length - 1, 0))
            : 0;
        setScenes(rows);
        setCurrentSceneIndex(startIndex);
        setSelectedStory(story);
      } catch (err) {
        console.error("Error fetching scenes:", err);
      } finally {
        setScenesLoading(false);
      }
    },
    [db],
  );

  // Resolve a lesson order to its DB story row, then open the reader.
  const openLessonByOrder = useCallback(
    async (order: number) => {
      try {
        const story = await db.getFirstAsync<Story>(
          `SELECT s.id, s.title, s.location, s.description,
                  s.order_index, s.level, s.focus,
                  COUNT(sc.id) AS scene_count
           FROM stories s
           LEFT JOIN story_scenes sc ON sc.story_id = s.id
           WHERE s.order_index = ?
           GROUP BY s.id`,
          order,
        );
        if (story) {
          handleSelectStory(story);
        } else {
          console.warn(`No story found for lesson order ${order}`);
        }
      } catch (err) {
        console.error("Error opening lesson:", err);
      }
    },
    [db, handleSelectStory],
  );

  // Deep-link from the Learn tab: open the lesson passed as a route param.
  useEffect(() => {
    const order = params.lesson ? Number(params.lesson) : null;
    if (!order) return;
    // Clear the param so the same lesson can be tapped again later.
    router.setParams({ lesson: undefined });
    openLessonByOrder(order);
  }, [params.lesson, openLessonByOrder, router]);

  // Run a book-flip, swapping scene at the hidden mid-point.
  const flip = (apply: () => void, dir: number) => {
    setFlipDir(dir);
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 160,
      useNativeDriver: true,
    }).start(() => {
      apply();
      Animated.timing(flipAnim, {
        toValue: 2,
        duration: 160,
        useNativeDriver: true,
      }).start(() => flipAnim.setValue(0));
    });
  };

  const handleNextScene = () => {
    if (!selectedStory) return;
    const order = selectedStory.order_index;
    if (currentSceneIndex < scenes.length - 1) {
      flip(() => {
        const next = currentSceneIndex + 1;
        setCurrentSceneIndex(next);
        saveProgress(order, next, false);
      }, 1);
    } else {
      saveProgress(order, currentSceneIndex, true);
      setReadingCompleted(true);
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIndex > 0 && selectedStory) {
      flip(() => {
        const prev = currentSceneIndex - 1;
        setCurrentSceneIndex(prev);
        saveProgress(selectedStory.order_index, prev, false);
      }, -1);
    }
  };

  if (scenesLoading) {
    return (
      <SafeAreaView style={[styles.flex, styles.center]}>
        <ActivityIndicator size="large" color={activeColors.tint} />
      </SafeAreaView>
    );
  }

  // 1. Reader Mode Screen
  if (selectedStory && scenes.length > 0) {
    // The lesson backing this story (for the key-vocabulary recap).
    const lesson = LESSONS.find((l) => l.order === selectedStory.order_index);

    if (readingCompleted) {
      return (
        <SafeAreaView
          style={[styles.flex, { backgroundColor: activeColors.background }]}
          edges={["top"]}
        >
          <ScrollView
            contentContainerStyle={styles.completedScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.completedCard}>
              <IconSymbol
                size={72}
                name="checkmark"
                color={activeColors.primaryGreen}
                style={styles.completedIcon}
              />
              <ThemedText type="title" style={styles.completedTitle}>
                Story Completed!
              </ThemedText>
              <ThemedText style={styles.completedSubtitle}>
                Well done! You have finished reading &quot;{selectedStory.title}
                &quot;.
              </ThemedText>
              <TouchableOpacity
                style={[
                  styles.buttonPrimary,
                  { backgroundColor: activeColors.primaryRed, width: "100%" },
                ]}
                onPress={() => setSelectedStory(null)}
              >
                <ThemedText style={styles.buttonPrimaryText}>
                  Back to Story List
                </ThemedText>
              </TouchableOpacity>
            </View>

            {lesson && lesson.vocabulary.length > 0 && (
              <View style={styles.vocabCard}>
                <ThemedText style={styles.vocabHeading}>
                  Key Vocabulary
                </ThemedText>
                {lesson.vocabulary.map((word) => (
                  <View key={word.english} style={styles.vocabRow}>
                    <Text style={styles.vocabHeadword}>
                      <Text style={{ color: activeColors.primaryRed }}>
                        {word.chinese}
                      </Text>
                      {"  ·  "}
                      <Text style={{ color: activeColors.primaryBlue }}>
                        {word.french}
                      </Text>
                      {"  ·  "}
                      {word.english}
                    </Text>
                    <Text style={styles.vocabNote}>{word.note}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      );
    }

    const currentScene = scenes[currentSceneIndex];
    const progressRatio = (currentSceneIndex + 1) / scenes.length;
    const rotateY = flipAnim.interpolate({
      inputRange: [0, 1, 2],
      outputRange:
        flipDir > 0 ? ["0deg", "-90deg", "0deg"] : ["0deg", "90deg", "0deg"],
    });

    return (
      <SafeAreaView
        style={[styles.flex, { backgroundColor: activeColors.background }]}
        edges={["top"]}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.readerHeader}>
            <TouchableOpacity
              onPress={() => setSelectedStory(null)}
              style={styles.backButton}
            >
              <IconSymbol
                size={24}
                name="chevron.left"
                color={activeColors.text}
              />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <ThemedText style={styles.readerTitle} numberOfLines={1}>
                {selectedStory.title}
              </ThemedText>
              <ThemedText style={styles.readerLocation}>
                📍 {selectedStory.location}
              </ThemedText>
            </View>
            <ThemedText style={styles.sceneCounter}>
              {currentSceneIndex + 1}/{scenes.length}
            </ThemedText>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${progressRatio * 100}%`,
                    backgroundColor: activeColors.primaryRed,
                  },
                ]}
              />
            </View>
          </View>

          {/* Immersive Scene Card (book-flip on Next/Prev) */}
          <Animated.View
            style={[
              styles.sceneCard,
              {
                borderColor: activeColors.cardBorder,
                backgroundColor: "#fff",
                transform: [{ perspective: 1000 }, { rotateY }],
              },
            ]}
          >
            {/* Context/Category badge */}
            <View style={styles.contextBadgeRow}>
              <View style={styles.contextBadge}>
                <ThemedText style={styles.contextBadgeText}>
                  {currentScene.context.toUpperCase()}
                </ThemedText>
              </View>
            </View>

            {/* ZH Translation */}
            <View style={styles.translationBlock}>
              <View style={styles.translationHeader}>
                <View
                  style={[
                    styles.langTag,
                    { backgroundColor: activeColors.lightRed },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.langTagText,
                      { color: activeColors.primaryRed },
                    ]}
                  >
                    ZH
                  </ThemedText>
                </View>
                <TouchableOpacity
                  style={[
                    styles.audioButton,
                    { backgroundColor: activeColors.lightRed },
                  ]}
                  onPress={() => speak(currentScene.chinese, "zh-CN")}
                >
                  <IconSymbol
                    size={16}
                    name="volume.3.fill"
                    color={activeColors.primaryRed}
                  />
                </TouchableOpacity>
              </View>
              <ThemedText
                style={[styles.textChinese, { color: activeColors.primaryRed }]}
              >
                {currentScene.chinese}
              </ThemedText>
            </View>

            <View style={styles.divider} />

            {/* FR Translation */}
            <View style={styles.translationBlock}>
              <View style={styles.translationHeader}>
                <View
                  style={[
                    styles.langTag,
                    { backgroundColor: activeColors.lightBlue },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.langTagText,
                      { color: activeColors.primaryBlue },
                    ]}
                  >
                    FR
                  </ThemedText>
                </View>
                <TouchableOpacity
                  style={[
                    styles.audioButton,
                    { backgroundColor: activeColors.lightBlue },
                  ]}
                  onPress={() => speak(currentScene.french, "fr-FR")}
                >
                  <IconSymbol
                    size={16}
                    name="volume.3.fill"
                    color={activeColors.primaryBlue}
                  />
                </TouchableOpacity>
              </View>
              <ThemedText
                style={[styles.textFrench, { color: activeColors.primaryBlue }]}
              >
                {currentScene.french}
              </ThemedText>
            </View>

            <View style={styles.divider} />

            {/* EN (Base) text */}
            <View style={styles.translationBlock}>
              <View style={styles.translationHeader}>
                <View style={[styles.langTag, { backgroundColor: "#F0F0F0" }]}>
                  <ThemedText
                    style={[styles.langTagText, { color: "#687076" }]}
                  >
                    EN
                  </ThemedText>
                </View>
                <TouchableOpacity
                  style={[styles.audioButton, { backgroundColor: "#F0F0F0" }]}
                  onPress={() => speak(currentScene.english, "en-US")}
                >
                  <IconSymbol size={16} name="volume.3.fill" color="#687076" />
                </TouchableOpacity>
              </View>
              <ThemedText style={styles.textEnglish}>
                {currentScene.english}
              </ThemedText>
            </View>
          </Animated.View>

          {/* Action Navigation Buttons */}
          <View style={styles.navButtonsRow}>
            <TouchableOpacity
              style={[
                styles.navButtonSecondary,
                currentSceneIndex === 0 && styles.disabledButton,
                { borderColor: activeColors.cardBorder },
              ]}
              onPress={handlePrevScene}
              disabled={currentSceneIndex === 0}
            >
              <IconSymbol
                size={18}
                name="chevron.left"
                color={activeColors.text}
              />
              <ThemedText style={styles.navButtonSecondaryText}>
                Prev
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.buttonPrimary,
                { backgroundColor: activeColors.primaryRed },
              ]}
              onPress={handleNextScene}
            >
              <ThemedText style={styles.buttonPrimaryText}>
                {currentSceneIndex === scenes.length - 1
                  ? "Finish"
                  : "Next Scene"}
              </ThemedText>
              <IconSymbol size={18} name="arrow.right" color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // 2. Story tree (shared with the Learn tab). Tapping a card opens the
  // reader here on the Story tab.
  return (
    <StoryPath
      onSelectLesson={openLessonByOrder}
      onPressBasics={() => router.push("/basics")}
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    justifyContent: "space-between",
    paddingBottom: 24,
  },
  readerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 8,
  },
  readerTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  readerLocation: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 1,
  },
  sceneCounter: {
    fontSize: 14,
    fontWeight: "bold",
    opacity: 0.6,
  },
  progressContainer: {
    marginVertical: 12,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  sceneCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    marginVertical: 8,
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  contextBadgeRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  contextBadge: {
    backgroundColor: "#F5F5F7",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  contextBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#687076",
    letterSpacing: 0.5,
  },
  translationBlock: {
    gap: 8,
  },
  translationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  langTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  langTagText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  audioButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  textChinese: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 30,
  },
  textFrench: {
    fontSize: 20,
    fontWeight: "bold",
  },
  textEnglish: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
  },
  navButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 8,
  },
  navButtonSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  navButtonSecondaryText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.4,
  },
  buttonPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 14,
  },
  buttonPrimaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  completedCard: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  completedIcon: {
    marginBottom: 16,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  completedSubtitle: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.6,
    lineHeight: 20,
    marginBottom: 20,
  },
  completedScroll: {
    padding: 20,
    gap: 16,
  },
  vocabCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    gap: 14,
  },
  vocabHeading: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  vocabRow: {
    gap: 2,
  },
  vocabHeadword: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  vocabNote: {
    fontSize: 13,
    color: "#687076",
  },
});
