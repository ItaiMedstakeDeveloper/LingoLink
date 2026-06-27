import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Shadows } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { speak } from "@/lib/speech";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SavedWord = {
  id: number;
  word: string;
  language: string; // 'fr' | 'zh'
  translation: string;
  note: string | null;
  created_at: string;
};

export default function WordsScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme ?? "light"];

  const [words, setWords] = useState<SavedWord[]>([]);
  const [loading, setLoading] = useState(true);

  // Reload every time the screen comes into focus so a word added in the
  // modal shows up as soon as the modal closes.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function loadWords() {
        try {
          const rows = await db.getAllAsync<SavedWord>(
            `SELECT * FROM saved_words ORDER BY created_at DESC`,
          );
          if (active) setWords(rows);
        } catch (err) {
          console.error("Error loading saved words:", err);
        } finally {
          if (active) setLoading(false);
        }
      }
      loadWords();
      return () => {
        active = false;
      };
    }, [db]),
  );

  const handleDelete = (word: SavedWord) => {
    Alert.alert(
      "Delete word",
      `Remove "${word.word}" from your saved words?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await db.runAsync(
                `DELETE FROM saved_words WHERE id = ?`,
                word.id,
              );
              setWords((prev) => prev.filter((w) => w.id !== word.id));
            } catch (err) {
              console.error("Error deleting saved word:", err);
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: SavedWord }) => {
    const isFrench = item.language === "fr";
    const accent = isFrench ? activeColors.primaryBlue : activeColors.primaryRed;
    const accentLight = isFrench ? activeColors.lightBlue : activeColors.lightRed;
    const bcp47 = isFrench ? "fr-FR" : "zh-CN";

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onLongPress={() => handleDelete(item)}
        style={[
          styles.card,
          { borderColor: activeColors.cardBorder, backgroundColor: activeColors.cardBackground },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.langPill, { backgroundColor: accentLight }]}>
            <ThemedText style={[styles.langPillText, { color: accent }]}>
              {isFrench ? "Français" : "中文"}
            </ThemedText>
          </View>
          <TouchableOpacity
            style={[styles.speakButton, { backgroundColor: accentLight }]}
            onPress={() => speak(item.word, bcp47)}
            hitSlop={8}
          >
            <IconSymbol size={18} name="volume.3.fill" color={accent} />
          </TouchableOpacity>
        </View>

        <ThemedText style={[styles.word, { color: accent }]}>
          {item.word}
        </ThemedText>
        <ThemedText style={styles.translation}>{item.translation}</ThemedText>

        {item.note ? (
          <ThemedText style={styles.note}>{item.note}</ThemedText>
        ) : null}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.flex, styles.center]}>
        <ActivityIndicator size="large" color={activeColors.tint} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: activeColors.background }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <ThemedText type="title">My Words</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Words you have saved while learning
        </ThemedText>
      </View>

      {words.length === 0 ? (
        <View style={[styles.center, { flex: 1, padding: 32 }]}>
          <IconSymbol
            size={56}
            name="bookmark.fill"
            color={activeColors.cardBorder}
          />
          <ThemedText type="subtitle" style={styles.emptyTitle}>
            No saved words yet
          </ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Tap the + button to save a new word and its translation.
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={words}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating add button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: activeColors.tint }]}
        onPress={() => router.push("/word-add")}
        activeOpacity={0.85}
      >
        <IconSymbol size={28} name="plus" color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  listContent: {
    padding: 20,
    paddingBottom: 120,
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    ...Shadows.card,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  langPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  langPillText: {
    fontSize: 12,
    fontWeight: "700",
  },
  speakButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  word: {
    fontSize: 28,
    fontWeight: "bold",
  },
  translation: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
  note: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 8,
    lineHeight: 18,
  },
  emptyTitle: {
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.6,
    marginTop: 8,
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
