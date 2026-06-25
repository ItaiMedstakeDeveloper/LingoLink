import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  type ImageSourcePropType,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Lesson cards shown in the catalog grid. Each picture represents a lesson
// from "A Day in Harare". order_index maps a card to its story in the DB.
type Lesson = {
  order: number;
  title: string;
  level: string;
  image: ImageSourcePropType;
};

const LESSONS: Lesson[] = [
  {
    order: 1,
    title: "Morning in Harare",
    level: "Beginner",
    image: require("@/assets/images/lessons/lesson_01_morning_in_harare (1).png"),
  },
  {
    order: 2,
    title: "The Newspaper Man",
    level: "Beginner",
    image: require("@/assets/images/lessons/lesson_02_newspaper_man (1).png"),
  },
  {
    order: 3,
    title: "Mbare Market Arrives",
    level: "Beginner–Elementary",
    image: require("@/assets/images/lessons/lesson_03_mbare_market.png"),
  },
  {
    order: 4,
    title: "Ambuya Chipo's Tomatoes",
    level: "Elementary",
    image: require("@/assets/images/lessons/lesson_04_ambuya_chipo.png"),
  },
  {
    order: 5,
    title: "Zhou Wei & the Charger",
    level: "Elementary–Intermediate",
    image: require("@/assets/images/lessons/lesson_05_zhou_wei.png"),
  },
  {
    order: 6,
    title: "Marguerite and the Shoes",
    level: "Intermediate",
    image: require("@/assets/images/lessons/lesson_06_marguerite.png"),
  },
  {
    order: 8,
    title: "The Professor's Question",
    level: "Upper-Intermediate",
    image: require("@/assets/images/lessons/lesson_08_professor_question.png"),
  },
  {
    order: 9,
    title: "The Ride Home",
    level: "Advanced",
    image: require("@/assets/images/lessons/lesson_09_ride_home.png"),
  },
  {
    order: 10,
    title: "Five Conversations",
    level: "Advanced",
    image: require("@/assets/images/lessons/lesson_10_five_conversations.png"),
  },
];

type Story = {
  id: number;
  title: string;
  location: string;
  description: string;
  order_index: number;
  scene_count: number;
};

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
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme ?? "light"];

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  // Reader state
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [scenesLoading, setScenesLoading] = useState(false);
  const [readingCompleted, setReadingCompleted] = useState(false);

  // Fetch stories
  useEffect(() => {
    let active = true;
    async function loadStories() {
      try {
        const rows = await db.getAllAsync<Story>(
          `SELECT s.id, s.title, s.location, s.description,
                  COUNT(sc.id) AS scene_count
           FROM stories s
           LEFT JOIN story_scenes sc ON sc.story_id = s.id
           GROUP BY s.id
           ORDER BY s.order_index`,
        );
        if (active) setStories(rows);
      } catch (err) {
        console.error("Error fetching stories:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadStories();
    return () => {
      active = false;
    };
  }, [db]);

  // Fetch scenes when story is selected
  const handleSelectStory = async (story: Story) => {
    setScenesLoading(true);
    setReadingCompleted(false);
    setCurrentSceneIndex(0);
    try {
      const rows = await db.getAllAsync<Scene>(
        `SELECT * FROM story_scenes WHERE story_id = ? ORDER BY scene_number ASC`,
        story.id,
      );
      setScenes(rows);
      setSelectedStory(story);
    } catch (err) {
      console.error("Error fetching scenes:", err);
    } finally {
      setScenesLoading(false);
    }
  };

  const speak = (text: string, lang: "zh-CN" | "fr-FR") => {
    if (Platform.OS === "web" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    } else {
      console.log(`[TTS Native simulation] Speaking: "${text}" in ${lang}`);
    }
  };

  const handleNextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex((prev) => prev + 1);
    } else {
      setReadingCompleted(true);
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex((prev) => prev - 1);
    }
  };

  if (loading || scenesLoading) {
    return (
      <SafeAreaView style={[styles.flex, styles.center]}>
        <ActivityIndicator size="large" color={activeColors.tint} />
      </SafeAreaView>
    );
  }

  // 1. Reader Mode Screen
  if (selectedStory && scenes.length > 0) {
    if (readingCompleted) {
      return (
        <SafeAreaView
          style={[styles.flex, { backgroundColor: activeColors.background }]}
          edges={["top"]}
        >
          <View style={[styles.container, styles.center]}>
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
          </View>
        </SafeAreaView>
      );
    }

    const currentScene = scenes[currentSceneIndex];
    const progressRatio = (currentSceneIndex + 1) / scenes.length;

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

          {/* Immersive Scene Card */}
          <View
            style={[
              styles.sceneCard,
              {
                borderColor: activeColors.cardBorder,
                backgroundColor: "#fff",
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
              </View>
              <ThemedText style={styles.textEnglish}>
                {currentScene.english}
              </ThemedText>
            </View>
          </View>

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

  // 2. Story Catalog / Dashboard Screen
  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: activeColors.background }]}
      edges={["top"]}
    >
      <FlatList
        data={LESSONS}
        keyExtractor={(item) => String(item.order)}
        numColumns={2}
        columnWrapperStyle={styles.lessonRow}
        contentContainerStyle={styles.catalogContent}
        ListHeaderComponent={
          <View style={styles.catalogHeader}>
            <ThemedText type="title" style={styles.catalogTitle}>
              A Day in Harare
            </ThemedText>
            <ThemedText style={styles.catalogSubtitle}>
              Ten lessons, beginner to advanced. Tap a lesson to start reading.
            </ThemedText>
          </View>
        }
        renderItem={({ item }) => {
          // Open the matching DB story, falling back to the first available one
          // so every lesson card opens the reader.
          const story =
            stories.find((s) => s.order_index === item.order) ?? stories[0];
          return (
            <TouchableOpacity
              style={[
                styles.lessonCard,
                {
                  borderColor: activeColors.cardBorder,
                  backgroundColor: "#fff",
                },
              ]}
              onPress={() => story && handleSelectStory(story)}
              activeOpacity={0.85}
            >
              <View style={styles.lessonImageWrap}>
                <Image
                  source={item.image}
                  style={styles.lessonImage}
                  resizeMode="cover"
                />
                <View
                  style={[
                    styles.lessonNumber,
                    { backgroundColor: activeColors.primaryRed },
                  ]}
                >
                  <ThemedText style={styles.lessonNumberText}>
                    {item.order}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.lessonInfo}>
                <Text
                  style={[
                    styles.lessonTitle,
                    { color: activeColors.primaryBlue },
                  ]}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.lessonLevel,
                    { color: activeColors.primaryRed },
                  ]}
                  numberOfLines={1}
                >
                  {item.level}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
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
  catalogContent: {
    padding: 20,
    gap: 16,
  },
  catalogHeader: {
    marginBottom: 12,
  },
  catalogTitle: {
    fontSize: 26,
    fontWeight: "bold",
  },
  catalogSubtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
    lineHeight: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    opacity: 0.6,
  },
  lessonRow: {
    gap: 12,
  },
  lessonCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  lessonImageWrap: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#F0F0F0",
  },
  lessonImage: {
    width: "100%",
    height: "100%",
  },
  lessonNumber: {
    position: "absolute",
    top: 6,
    left: 6,
    minWidth: 24,
    height: 24,
    paddingHorizontal: 6,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  lessonNumberText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 16,
  },
  lessonInfo: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 2,
  },
  lessonTitle: {
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 16,
  },
  lessonLevel: {
    fontSize: 10,
    fontWeight: "600",
  },
  storyCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  storyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  storyCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flexShrink: 1,
  },
  locationBadge: {
    backgroundColor: "#F5F5F7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  locationBadgeText: {
    fontSize: 12,
    color: "#687076",
    fontWeight: "600",
  },
  storyCardDesc: {
    fontSize: 13,
    color: "#687076",
    lineHeight: 18,
  },
  storyCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  scenesTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  scenesTagText: {
    fontSize: 12,
    color: "#687076",
  },
  startReadButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  startReadText: {
    fontSize: 12,
    fontWeight: "bold",
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
});
