import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Shadows } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LESSONS } from "@/lib/lessons";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** A story row as stored in SQLite. */
export type LessonStory = {
  id: number;
  title: string;
  location: string;
  description: string;
  order_index: number;
  level: string;
  focus: string;
  scene_count: number;
};

type Props = {
  /** Called with the lesson order when a card / resume hero is tapped. */
  onSelectLesson: (order: number) => void;
  /** Called when the "Before your first story" basics card is tapped. */
  onPressBasics: () => void;
};

/**
 * The "story tree": a vertical, progress-aware path through the 10 lessons.
 * Shared by the Learn tab (navigates to the Story tab) and the Story tab
 * (opens the reader in place). Reloads progress every time it gains focus.
 */
export function StoryPath({ onSelectLesson, onPressBasics }: Props) {
  const db = useSQLiteContext();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? "light"];

  const [stories, setStories] = useState<LessonStory[]>([]);
  const [progress, setProgress] = useState<
    Record<number, { last_scene: number; completed: number }>
  >({});

  const load = useCallback(async () => {
    try {
      const rows = await db.getAllAsync<LessonStory>(
        `SELECT s.id, s.title, s.location, s.description,
                s.order_index, s.level, s.focus,
                COUNT(sc.id) AS scene_count
         FROM stories s
         LEFT JOIN story_scenes sc ON sc.story_id = s.id
         GROUP BY s.id
         ORDER BY s.order_index`,
      );
      const progressRows = await db.getAllAsync<{
        lesson_order: number;
        last_scene: number;
        completed: number;
      }>(`SELECT lesson_order, last_scene, completed FROM lesson_progress`);
      const map: Record<number, { last_scene: number; completed: number }> = {};
      for (const p of progressRows) {
        map[p.lesson_order] = {
          last_scene: p.last_scene,
          completed: p.completed,
        };
      }
      setStories(rows);
      setProgress(map);
    } catch (err) {
      console.error("Error loading story path:", err);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  // Combine static lesson content + DB stories + saved progress.
  const path = LESSONS.map((lesson) => {
    const story = stories.find((s) => s.order_index === lesson.order);
    const prog = progress[lesson.order];
    const sceneCount = story?.scene_count ?? lesson.sections.length;
    const completed = prog?.completed === 1;
    const lastScene = prog?.last_scene ?? 0;
    const started = !!prog && prog.last_scene > 0;
    const inProgress = started && !completed;
    const pct = completed ? 1 : inProgress ? (lastScene + 1) / sceneCount : 0;
    return { lesson, story, sceneCount, completed, lastScene, inProgress, pct };
  });

  const current =
    path.find((p) => p.inProgress) ?? path.find((p) => !p.completed) ?? null;
  const allDone = path.every((p) => p.completed);
  const doneCount = path.filter((p) => p.completed).length;

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: c.background }]}
      edges={["top"]}
    >
      <FlatList
        data={path}
        keyExtractor={(item) => String(item.lesson.order)}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <ThemedText type="title" style={styles.title}>
                A Day in Harare
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                {doneCount} of {path.length} lessons complete
              </ThemedText>
              <View style={styles.overallBarBg}>
                <View
                  style={[
                    styles.overallBarFill,
                    {
                      width: `${(doneCount / path.length) * 100}%`,
                      backgroundColor: c.primaryGreen,
                    },
                  ]}
                />
              </View>

              {/* Two equal shortcuts: Question Papers + Restaurants & Schools */}
              <View style={styles.featureRow}>
                <TouchableOpacity
                  style={[styles.featureCard, styles.papersCard]}
                  activeOpacity={0.9}
                  onPress={() => router.push("/question-papers")}
                >
                  <View style={styles.featureTopRow}>
                    <View style={styles.papersIcon}>
                      <IconSymbol size={16} name="book.fill" color="#7A5B00" />
                    </View>
                    <View style={styles.premiumBadge}>
                      <Text style={styles.premiumBadgeText}>PREMIUM</Text>
                    </View>
                  </View>
                  <Text style={styles.papersTitle}>Question Papers</Text>
                  <Text style={styles.papersHint}>Common exam questions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.featureCard, styles.placesCard]}
                  activeOpacity={0.9}
                  onPress={() => router.push("/places")}
                >
                  <View style={styles.featureTopRow}>
                    <View style={styles.placesShortcutIcon}>
                      <IconSymbol size={16} name="fork.knife" color="#7A1212" />
                    </View>
                  </View>
                  <Text style={styles.placesShortcutTitle}>
                    Restaurants & Schools
                  </Text>
                  <Text style={styles.placesShortcutHint}>
                    French & Chinese places near you
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* "Before your first story" — opens the basics */}
            <TouchableOpacity
              style={[styles.basicsCard, { borderColor: c.cardBorder }]}
              activeOpacity={0.85}
              onPress={onPressBasics}
            >
              <View
                style={[styles.basicsIcon, { backgroundColor: c.lightBlue }]}
              >
                <IconSymbol size={22} name="book.fill" color={c.primaryBlue} />
              </View>
              <View style={styles.basicsText}>
                <Text style={[styles.basicsTitle, { color: c.primaryBlue }]}>
                  Before your first story
                </Text>
                <ThemedText style={styles.basicsSub}>
                  Learn the basic words first · quick warm-up
                </ThemedText>
              </View>
              <IconSymbol size={18} name="chevron.right" color="#9BA1A6" />
            </TouchableOpacity>

            {/* Resume / Start hero */}
            {current && (
              <TouchableOpacity
                style={[styles.resumeCard, { backgroundColor: c.primaryRed }]}
                activeOpacity={0.9}
                onPress={() => onSelectLesson(current.lesson.order)}
              >
                <ThemedText style={styles.resumeLabel}>
                  {current.inProgress
                    ? "CONTINUE WHERE YOU LEFT OFF"
                    : doneCount > 0
                      ? "UP NEXT"
                      : "START YOUR JOURNEY"}
                </ThemedText>
                <ThemedText style={styles.resumeTitle}>
                  Lesson {current.lesson.order}: {current.lesson.title.en}
                </ThemedText>
                <View style={styles.resumeBarBg}>
                  <View
                    style={[
                      styles.resumeBarFill,
                      { width: `${current.pct * 100}%` },
                    ]}
                  />
                </View>
                <View style={styles.resumeFooter}>
                  <ThemedText style={styles.resumeFooterText}>
                    {current.inProgress
                      ? `Scene ${current.lastScene + 1} of ${current.sceneCount} · ${Math.round(current.pct * 100)}%`
                      : `${current.sceneCount} scenes · ${current.lesson.level}`}
                  </ThemedText>
                  <View style={styles.resumePlay}>
                    <IconSymbol
                      size={16}
                      name={current.inProgress ? "arrow.right" : "book.fill"}
                      color={c.primaryRed}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}

            {allDone && (
              <View style={styles.resumeCardDone}>
                <ThemedText style={styles.resumeDoneTitle}>
                  🎉 You finished A Day in Harare
                </ThemedText>
                <ThemedText style={styles.resumeDoneSub}>
                  Revisit any lesson below to keep it fresh.
                </ThemedText>
              </View>
            )}

            <ThemedText style={styles.pathHeading}>YOUR STORY PATH</ThemedText>
          </View>
        }
        renderItem={({ item, index }) => {
          const isCurrent = current?.lesson.order === item.lesson.order;
          const isLast = index === path.length - 1;
          const accent = item.completed
            ? c.primaryGreen
            : isCurrent
              ? c.primaryRed
              : "#D2D6DB";
          return (
            <View style={styles.pathRow}>
              {/* Left rail */}
              <View style={styles.rail}>
                <View
                  style={[
                    styles.railLine,
                    {
                      backgroundColor: item.completed
                        ? c.primaryGreen
                        : "#E3E5E8",
                    },
                    index === 0 && styles.railLineHiddenTop,
                    isLast && styles.railLineHiddenBottom,
                  ]}
                />
                <View style={[styles.node, { backgroundColor: accent }]}>
                  {item.completed ? (
                    <IconSymbol size={16} name="checkmark" color="#fff" />
                  ) : (
                    <Text style={styles.nodeText}>{item.lesson.order}</Text>
                  )}
                </View>
              </View>

              {/* Lesson card */}
              <TouchableOpacity
                style={[
                  styles.pathCard,
                  { borderColor: c.cardBorder },
                  isCurrent && { borderColor: c.primaryRed, borderWidth: 2 },
                ]}
                activeOpacity={0.85}
                onPress={() => onSelectLesson(item.lesson.order)}
              >
                {item.lesson.image ? (
                  <Image
                    source={item.lesson.image}
                    style={styles.pathThumb}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.pathThumb, styles.pathThumbFallback]}>
                    <Text style={styles.pathThumbFallbackText}>
                      {item.lesson.title.zh}
                    </Text>
                  </View>
                )}
                <View style={styles.pathCardInfo}>
                  <Text
                    style={[styles.pathCardTitle, { color: c.primaryBlue }]}
                    numberOfLines={2}
                  >
                    {item.lesson.title.en}
                  </Text>
                  <Text
                    style={[styles.pathCardLevel, { color: c.primaryRed }]}
                    numberOfLines={1}
                  >
                    {item.lesson.level}
                  </Text>
                  {/* Per-story progress bar */}
                  <View style={styles.cardBarBg}>
                    <View
                      style={[
                        styles.cardBarFill,
                        {
                          width: `${item.pct * 100}%`,
                          backgroundColor: item.completed
                            ? c.primaryGreen
                            : c.primaryRed,
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.pathCardStatus,
                      { color: item.completed ? c.primaryGreen : "#687076" },
                    ]}
                  >
                    {item.completed
                      ? "✓ Completed"
                      : item.inProgress
                        ? `${Math.round(item.pct * 100)}% · scene ${item.lastScene + 1}/${item.sceneCount}`
                        : `${item.sceneCount} scenes`}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
      {/* 
       <TouchableOpacity
        style={[styles.fab, { backgroundColor: c.primaryBlue }]}
        activeOpacity={0.9}
        onPress={() => router.push("/view-media")}
      >
        <View style={styles.fabIcon}>
          <IconSymbol size={20} name="newspaper.fill" color={c.primaryBlue} />
        </View>
        <View style={styles.fabText}>
          <Text style={styles.fabTitle}>View Media</Text>
          <Text style={styles.fabHint}>News Papers and Videos</Text>
        </View>
      </TouchableOpacity>
      Floating action button: jump to newspapers & videos */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 16 },
  title: { fontSize: 26, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: "#11181C", marginTop: 4 },
  overallBarBg: {
    height: 8,
    backgroundColor: "#E3E5E8",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 12,
  },
  overallBarFill: { height: "100%", borderRadius: 4 },
  featureRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  featureCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 4,
    ...Shadows.card,
  },
  featureTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 30,
  },
  papersCard: {
    backgroundColor: "#FFF8E6",
    borderColor: "#F0D98C",
  },
  papersIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#FBEFC4",
    justifyContent: "center",
    alignItems: "center",
  },
  papersTitle: { fontSize: 13, fontWeight: "bold", color: "#7A5B00" },
  premiumBadge: {
    backgroundColor: "#7A5B00",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  premiumBadgeText: {
    color: "#FFF8E6",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  papersHint: {
    fontSize: 11,
    lineHeight: 14,
    color: "#8A6D1F",
  },
  placesCard: {
    backgroundColor: "#FCE8E6",
    borderColor: "#F2C4BF",
  },
  placesShortcutIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#F8D3CE",
    justifyContent: "center",
    alignItems: "center",
  },
  placesShortcutTitle: { fontSize: 13, fontWeight: "bold", color: "#7A1212" },
  placesShortcutHint: {
    fontSize: 11,
    lineHeight: 14,
    color: "#9B4A45",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  fabIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  fabText: { paddingRight: 4 },
  fabTitle: { color: "#fff", fontSize: 15, fontWeight: "800" },
  fabHint: { color: "rgba(255,255,255,0.9)", fontSize: 11, fontWeight: "500" },
  basicsCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
    ...Shadows.card,
  },
  basicsIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  basicsText: { flex: 1, gap: 2 },
  basicsTitle: { fontSize: 15, fontWeight: "bold" },
  basicsSub: {
    fontSize: 12,
    lineHeight: 16,
    color: "#11181C",
  },
  resumeCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  resumeLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  resumeTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 6,
  },
  resumeBarBg: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 14,
  },
  resumeBarFill: { height: "100%", backgroundColor: "#fff", borderRadius: 3 },
  resumeFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  resumeFooterText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  resumePlay: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  resumeCardDone: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    ...Shadows.card,
  },
  resumeDoneTitle: { fontSize: 16, fontWeight: "bold" },
  resumeDoneSub: { fontSize: 13, color: "#11181C", marginTop: 4 },
  pathHeading: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: "#11181C",
    marginBottom: 8,
  },
  pathRow: { flexDirection: "row" },
  rail: { width: 40, alignItems: "center" },
  railLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 3,
    borderRadius: 1.5,
  },
  railLineHiddenTop: { top: "50%" },
  railLineHiddenBottom: { bottom: "50%" },
  node: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginTop: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  nodeText: { color: "#fff", fontSize: 13, fontWeight: "800" },
  pathCard: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
    marginLeft: 6,
    alignItems: "center",
    ...Shadows.card,
  },
  pathThumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#F0F0F0",
  },
  pathThumbFallback: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1F2A37",
    padding: 4,
  },
  pathThumbFallbackText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  pathCardInfo: { flex: 1, gap: 4 },
  pathCardTitle: { fontSize: 15, fontWeight: "bold" },
  pathCardLevel: { fontSize: 11, fontWeight: "600" },
  cardBarBg: {
    height: 5,
    backgroundColor: "#EDEFF1",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 2,
  },
  cardBarFill: { height: "100%", borderRadius: 3 },
  pathCardStatus: { fontSize: 12, fontWeight: "600" },
});
