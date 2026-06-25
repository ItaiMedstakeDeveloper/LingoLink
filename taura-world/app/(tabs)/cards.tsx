import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { speak } from "@/lib/speech";

type Vocabulary = {
  id: number;
  chinese: string;
  chinese_pinyin: string;
  french: string;
  french_details: string;
  english: string;
  english_details: string;
  context_tip: string;
  mastered: number;
};

export default function CardsScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme ?? "light"];

  const [words, setWords] = useState<Vocabulary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Load words from SQLite
  useEffect(() => {
    let active = true;
    async function loadWords() {
      try {
        const rows = await db.getAllAsync<Vocabulary>(
          `SELECT * FROM vocabulary ORDER BY id ASC`,
        );
        if (active) {
          setWords(rows);
          // Find first unmastered word or default to 0
          const firstUnmastered = rows.findIndex((w) => w.mastered === 0);
          setCurrentIndex(firstUnmastered !== -1 ? firstUnmastered : 0);
        }
      } catch (err) {
        console.error("Error loading vocabulary for flashcards:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadWords();
    return () => {
      active = false;
    };
  }, [db]);


  const handleAction = async (gotIt: boolean) => {
    if (words.length === 0) return;
    const currentWord = words[currentIndex];

    if (gotIt) {
      try {
        await db.runAsync(
          `UPDATE vocabulary SET mastered = 1 WHERE id = ?`,
          currentWord.id,
        );
        setWords((prev) =>
          prev.map((w, idx) =>
            idx === currentIndex ? { ...w, mastered: 1 } : w,
          ),
        );
      } catch (err) {
        console.error("Error updating mastery in flashcards:", err);
      }
    }

    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setSessionCompleted(true);
    }
  };

  const handleRestart = async () => {
    try {
      await db.runAsync(`UPDATE vocabulary SET mastered = 0`);
      const rows = await db.getAllAsync<Vocabulary>(
        `SELECT * FROM vocabulary ORDER BY id ASC`,
      );
      setWords(rows);
      setCurrentIndex(0);
      setSessionCompleted(false);
    } catch (err) {
      console.error("Error resetting flashcards progress:", err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.flex, styles.center]}>
        <ActivityIndicator size="large" color={activeColors.tint} />
      </SafeAreaView>
    );
  }

  if (words.length === 0) {
    return (
      <SafeAreaView style={[styles.flex, styles.center, { padding: 24 }]}>
        <ThemedText type="subtitle">No flashcards available.</ThemedText>
      </SafeAreaView>
    );
  }

  if (sessionCompleted) {
    return (
      <SafeAreaView
        style={[
          styles.flex,
          styles.center,
          { padding: 24, backgroundColor: activeColors.background },
        ]}
      >
        <View style={styles.completedCard}>
          <IconSymbol
            size={72}
            name="checkmark"
            color={activeColors.primaryGreen}
            style={styles.completedIcon}
          />
          <ThemedText type="title" style={styles.completedTitle}>
            Flashcards Done!
          </ThemedText>
          <ThemedText style={styles.completedSubtitle}>
            Awesome! You have reviewed all flashcards in this deck.
          </ThemedText>
          <TouchableOpacity
            style={[
              styles.buttonPrimary,
              { backgroundColor: activeColors.tint },
            ]}
            onPress={handleRestart}
          >
            <ThemedText style={styles.buttonPrimaryText}>
              Study again
            </ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentWord = words[currentIndex];
  const totalCount = words.length;
  const currentNum = currentIndex + 1;

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: activeColors.background }]}
      edges={["top"]}
    >
      <View style={styles.container}>
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/(tabs)")}
          >
            <IconSymbol
              size={24}
              name="chevron.left"
              color={activeColors.text}
            />
          </TouchableOpacity>
          <ThemedText style={styles.navTitle}>Flashcards</ThemedText>
          <ThemedText style={styles.navCount}>
            {currentNum}/{totalCount}
          </ThemedText>
        </View>

        {/* Segmented Progress Bar */}
        <View style={styles.segmentsContainer}>
          {Array.from({ length: totalCount }).map((_, idx) => {
            const isCompleted = idx < currentNum;
            return (
              <View
                key={idx}
                style={[
                  styles.segment,
                  {
                    backgroundColor: isCompleted
                      ? activeColors.primaryRed
                      : activeColors.lightRed,
                    opacity: isCompleted ? 1 : 0.4,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Central Flashcard */}
        <View
          style={[
            styles.flashcard,
            {
              borderColor: activeColors.cardBorder,
              backgroundColor: "#fff",
            },
          ]}
        >
          {/* Chinese Content */}
          <View style={styles.sectionZh}>
            <ThemedText
              style={[
                styles.textZhCharacters,
                { color: activeColors.primaryRed },
              ]}
            >
              {currentWord.chinese}
            </ThemedText>
            <ThemedText
              style={[styles.textZhPinyin, { color: activeColors.primaryRed }]}
            >
              {currentWord.chinese_pinyin}
            </ThemedText>
          </View>

          <View style={styles.divider} />

          {/* French Content */}
          <View style={styles.sectionFr}>
            <ThemedText
              style={[styles.textFrWord, { color: activeColors.primaryBlue }]}
            >
              {currentWord.french}
            </ThemedText>
            <ThemedText
              style={[
                styles.textFrDetails,
                { color: activeColors.primaryBlue },
              ]}
            >
              {currentWord.french_details}
            </ThemedText>
          </View>

          <View style={styles.divider} />

          {/* English Content */}
          <View style={styles.sectionEn}>
            <ThemedText style={styles.textEnWord}>
              {currentWord.english}
            </ThemedText>
            <ThemedText style={styles.textEnDetails}>
              {currentWord.english_details}
            </ThemedText>
          </View>

          {/* Audio Buttons Row */}
          <View style={styles.audioRow}>
            <TouchableOpacity
              style={[
                styles.cardAudioButton,
                {
                  backgroundColor: activeColors.lightRed,
                  borderColor: activeColors.lightRed,
                },
              ]}
              onPress={() => speak(currentWord.chinese, "zh-CN")}
            >
              <IconSymbol
                size={18}
                name="volume.3.fill"
                color={activeColors.primaryRed}
              />
              <ThemedText
                style={[
                  styles.cardAudioText,
                  { color: activeColors.primaryRed, fontWeight: "bold" },
                ]}
              >
                ZH audio
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.cardAudioButton,
                {
                  backgroundColor: activeColors.lightBlue,
                  borderColor: activeColors.lightBlue,
                },
              ]}
              onPress={() => speak(currentWord.french, "fr-FR")}
            >
              <IconSymbol
                size={18}
                name="volume.3.fill"
                color={activeColors.primaryBlue}
              />
              <ThemedText
                style={[
                  styles.cardAudioText,
                  { color: activeColors.primaryBlue, fontWeight: "bold" },
                ]}
              >
                FR audio
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[
              styles.btnStudyAgain,
              { borderColor: activeColors.cardBorder, backgroundColor: "#fff" },
            ]}
            onPress={() => handleAction(false)}
          >
            <IconSymbol
              size={18}
              name="arrow.clockwise"
              color={activeColors.primaryRed}
            />
            <ThemedText
              style={[
                styles.btnStudyAgainText,
                { color: activeColors.primaryRed },
              ]}
            >
              Study again
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btnGotIt,
              { backgroundColor: activeColors.primaryGreen },
            ]}
            onPress={() => handleAction(true)}
          >
            <IconSymbol size={18} name="checkmark" color="#fff" />
            <ThemedText style={styles.btnGotItText}>Got it</ThemedText>
          </TouchableOpacity>
        </View>

        {/* bottom Tip Card */}
        <View style={[styles.tipCard, { backgroundColor: "#F5F5F7" }]}>
          <View style={styles.tipIconWrapper}>
            <IconSymbol size={20} name="mappin.and.ellipse" color="#687076" />
          </View>
          <View style={styles.tipContent}>
            <ThemedText style={styles.tipDescription}>
              {currentWord.context_tip}
            </ThemedText>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    justifyContent: "space-between",
    paddingBottom: 24,
  },
  navBar: {
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
  navTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  navCount: {
    fontSize: 14,
    opacity: 0.6,
    fontWeight: "600",
  },
  segmentsContainer: {
    flexDirection: "row",
    gap: 4,
    marginVertical: 10,
  },
  segment: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  flashcard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
    marginVertical: 12,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  sectionZh: {
    alignItems: "center",
    marginTop: 10,
  },
  textZhCharacters: {
    fontSize: 48,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  textZhPinyin: {
    fontSize: 18,
    marginTop: 8,
    opacity: 0.8,
  },
  divider: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginVertical: 12,
  },
  sectionFr: {
    alignItems: "center",
  },
  textFrWord: {
    fontSize: 28,
    fontWeight: "bold",
  },
  textFrDetails: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8,
  },
  sectionEn: {
    alignItems: "center",
    marginBottom: 10,
  },
  textEnWord: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },
  textEnDetails: {
    fontSize: 12,
    color: "#687076",
    marginTop: 4,
    textAlign: "center",
  },
  audioRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 12,
  },
  cardAudioButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardAudioText: {
    fontSize: 14,
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 8,
  },
  btnStudyAgain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
  },
  btnStudyAgainText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  btnGotIt: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 14,
  },
  btnGotItText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  tipIconWrapper: {
    justifyContent: "center",
  },
  tipContent: {
    flex: 1,
  },
  tipDescription: {
    fontSize: 12,
    color: "#687076",
    lineHeight: 16,
  },
  completedCard: {
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
