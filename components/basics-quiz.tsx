import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Shadows } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
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

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  word: Vocabulary;
};

function generateQuiz(vocabList: Vocabulary[]): QuizQuestion[] {
  const shuffled = [...vocabList].sort(() => 0.5 - Math.random());
  const selectedWords = shuffled.slice(0, 3);
  return selectedWords.map((word, index) => {
    const type = index % 3;
    let question = "";
    let correctAnswer = "";
    let distractors: string[] = [];
    if (type === 0) {
      question = `What is the French translation of "${word.chinese}" (${word.chinese_pinyin})?`;
      correctAnswer = word.french;
      distractors = vocabList
        .filter((w) => w.id !== word.id)
        .map((w) => w.french);
    } else if (type === 1) {
      question = `Translate "${word.french}" to English:`;
      correctAnswer = word.english;
      distractors = vocabList
        .filter((w) => w.id !== word.id)
        .map((w) => w.english);
    } else {
      question = `Which Chinese word means "${word.english}"?`;
      correctAnswer = word.chinese;
      distractors = vocabList
        .filter((w) => w.id !== word.id)
        .map((w) => w.chinese);
    }
    const shuffledDistractors = distractors
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const options = [correctAnswer, ...shuffledDistractors].sort(
      () => 0.5 - Math.random(),
    );
    return { question, options, correctAnswer, word };
  });
}

export function BasicsQuiz() {
  const db = useSQLiteContext();
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme ?? "light"];

  const [words, setWords] = useState<Vocabulary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Countdown timer: 3 minutes (180s) to see how quickly the user finishes
  const [secondsLeft, setSecondsLeft] = useState(180);

  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

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
        console.error("Error loading vocabulary:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadWords();
    return () => {
      active = false;
    };
  }, [db]);

  // Tick the countdown down every second while still learning the words.
  useEffect(() => {
    if (loading || showQuiz || sessionCompleted || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, showQuiz, sessionCompleted, secondsLeft]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleNext = async (markMastered: boolean) => {
    if (words.length === 0) return;
    const currentWord = words[currentIndex];

    if (markMastered) {
      try {
        await db.runAsync(
          `UPDATE vocabulary SET mastered = 1 WHERE id = ?`,
          currentWord.id,
        );
        // Update local state
        setWords((prev) =>
          prev.map((w, idx) =>
            idx === currentIndex ? { ...w, mastered: 1 } : w,
          ),
        );
      } catch (err) {
        console.error("Error updating mastery:", err);
      }
    }

    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Transition to quiz activity
      const questions = generateQuiz(words);
      setQuizQuestions(questions);
      setQuizIndex(0);
      setQuizScore(0);
      setSelectedAnswer(null);
      setAnswered(false);
      setShowQuiz(true);
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
      setShowQuiz(false);
      setQuizScore(0);
    } catch (err) {
      console.error("Error resetting progress:", err);
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
        <ThemedText type="subtitle">No vocabulary words available.</ThemedText>
        <ThemedText style={styles.centerText}>
          Ensure your database seeds properly on migration.
        </ThemedText>
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
            All Done!
          </ThemedText>
          <ThemedText style={styles.completedSubtitle}>
            You have reviewed all the essential Harare street vocabulary.
          </ThemedText>
          <View style={styles.scoreContainer}>
            <ThemedText style={styles.scoreText}>
              Activity Score: {quizScore} / 3
            </ThemedText>
            <ThemedText style={styles.scoreFeedback}>
              {quizScore === 3
                ? "🏆 Perfect Score! You're a natural!"
                : "👍 Good job! Keep practicing!"}
            </ThemedText>
          </View>
          <TouchableOpacity
            style={[
              styles.buttonPrimary,
              { backgroundColor: activeColors.tint },
            ]}
            onPress={handleRestart}
          >
            <ThemedText style={styles.buttonPrimaryText}>
              Study Again
            </ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (showQuiz) {
    const questionObj = quizQuestions[quizIndex];
    const progressRatio = (quizIndex + 1) / quizQuestions.length;

    const handleAnswerSelect = (option: string) => {
      if (answered) return;
      setSelectedAnswer(option);
      setAnswered(true);
      if (option === questionObj.correctAnswer) {
        setQuizScore((prev) => prev + 1);
      }
    };

    const handleNextQuestion = () => {
      if (quizIndex < quizQuestions.length - 1) {
        setQuizIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setAnswered(false);
      } else {
        setShowQuiz(false);
        setSessionCompleted(true);
      }
    };

    return (
      <SafeAreaView
        style={[styles.flex, { backgroundColor: activeColors.background }]}
        edges={["top"]}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.titleText}>
              Lesson Activity
            </ThemedText>
            <ThemedText style={styles.subtitleText}>
              Test your knowledge on the vocabulary you just learned.
            </ThemedText>
          </View>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${progressRatio * 100}%`,
                    backgroundColor: activeColors.primaryBlue,
                  },
                ]}
              />
            </View>
            <ThemedText style={styles.progressLabel}>
              Question {quizIndex + 1} of {quizQuestions.length}
            </ThemedText>
          </View>

          {/* Question card */}
          <View
            style={[styles.quizCard, { borderColor: activeColors.cardBorder }]}
          >
            <ThemedText style={styles.questionText}>
              {questionObj.question}
            </ThemedText>

            <View style={styles.optionsList}>
              {questionObj.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === questionObj.correctAnswer;

                const optionStyle: object[] = [styles.optionButton];
                const optionTextStyle: object[] = [styles.optionText];

                if (answered) {
                  if (isSelected) {
                    if (isCorrect) {
                      optionStyle.push(styles.optionCorrect);
                      optionTextStyle.push(styles.optionTextCorrect);
                    } else {
                      optionStyle.push(styles.optionIncorrect);
                      optionTextStyle.push(styles.optionTextIncorrect);
                    }
                  } else if (isCorrect) {
                    optionStyle.push(styles.optionCorrectSecondary);
                    optionTextStyle.push(styles.optionTextCorrectSecondary);
                  } else {
                    optionStyle.push(styles.optionDisabled);
                  }
                } else {
                  optionStyle.push(styles.optionNormal);
                }

                return (
                  <TouchableOpacity
                    key={idx}
                    style={optionStyle}
                    onPress={() => handleAnswerSelect(option)}
                    disabled={answered}
                  >
                    <ThemedText style={optionTextStyle}>{option}</ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Next Button */}
          <View style={{ height: 60, justifyContent: "center" }}>
            {answered && (
              <TouchableOpacity
                style={[
                  styles.buttonPrimary,
                  { backgroundColor: activeColors.primaryBlue },
                ]}
                onPress={handleNextQuestion}
              >
                <ThemedText style={styles.buttonPrimaryText}>
                  {quizIndex === quizQuestions.length - 1
                    ? "Finish Quiz"
                    : "Next Question"}
                </ThemedText>
                <IconSymbol size={18} name="arrow.right" color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const currentWord = words[currentIndex];
  const progressRatio = (currentIndex + 1) / words.length;

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: activeColors.background }]}
      edges={["top"]}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.titleText}>
            Before your first story chapter, learn the basics.
          </ThemedText>
          <View style={styles.subtitleRow}>
            <ThemedText style={styles.subtitleText}>
              {words.length} essential words · takes 3 min
            </ThemedText>
            <View
              style={[
                styles.timerPill,
                {
                  backgroundColor:
                    secondsLeft === 0
                      ? activeColors.lightRed
                      : activeColors.lightBlue,
                },
              ]}
            >
              <IconSymbol
                size={13}
                name="timer"
                color={
                  secondsLeft === 0
                    ? activeColors.primaryRed
                    : activeColors.primaryBlue
                }
              />
              <ThemedText
                style={[
                  styles.timerText,
                  {
                    color:
                      secondsLeft === 0
                        ? activeColors.primaryRed
                        : activeColors.primaryBlue,
                  },
                ]}
              >
                {secondsLeft === 0 ? "Time's up" : formatTime(secondsLeft)}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Custom Progress Bar */}
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
          <ThemedText style={styles.progressLabel}>
            {currentIndex + 1} of {words.length} words
          </ThemedText>
        </View>

        {/* Word Cards List */}
        <View style={styles.cardsList}>
          {/* Chinese Card */}
          <View
            style={[styles.wordCard, { borderColor: activeColors.cardBorder }]}
          >
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: activeColors.lightRed },
                ]}
              >
                <ThemedText
                  style={[styles.badgeText, { color: activeColors.primaryRed }]}
                >
                  ZH
                </ThemedText>
              </View>
              <View style={styles.wordInfo}>
                <ThemedText
                  style={[
                    styles.wordTextMain,
                    { color: activeColors.primaryRed },
                  ]}
                >
                  {currentWord.chinese}
                </ThemedText>
                <ThemedText style={styles.wordTextSub}>
                  {currentWord.chinese_pinyin}
                </ThemedText>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.audioButton,
                { backgroundColor: activeColors.lightRed },
              ]}
              onPress={() => speak(currentWord.chinese, "zh-CN")}
            >
              <IconSymbol
                size={20}
                name="volume.3.fill"
                color={activeColors.primaryRed}
              />
            </TouchableOpacity>
          </View>

          {/* French Card */}
          <View
            style={[styles.wordCard, { borderColor: activeColors.cardBorder }]}
          >
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: activeColors.lightBlue },
                ]}
              >
                <ThemedText
                  style={[
                    styles.badgeText,
                    { color: activeColors.primaryBlue },
                  ]}
                >
                  FR
                </ThemedText>
              </View>
              <View style={styles.wordInfo}>
                <ThemedText
                  style={[
                    styles.wordTextMain,
                    { color: activeColors.primaryBlue },
                  ]}
                >
                  {currentWord.french}
                </ThemedText>
                <ThemedText style={styles.wordTextSub}>
                  {currentWord.french_details}
                </ThemedText>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.audioButton,
                { backgroundColor: activeColors.lightBlue },
              ]}
              onPress={() => speak(currentWord.french, "fr-FR")}
            >
              <IconSymbol
                size={20}
                name="volume.3.fill"
                color={activeColors.primaryBlue}
              />
            </TouchableOpacity>
          </View>

          {/* English Card */}
          <View
            style={[styles.wordCard, { borderColor: activeColors.cardBorder }]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.badge, { backgroundColor: "#F0F0F0" }]}>
                <ThemedText style={[styles.badgeText, { color: "#687076" }]}>
                  EN
                </ThemedText>
              </View>
              <View style={styles.wordInfo}>
                <ThemedText
                  style={[styles.wordTextMain, { color: activeColors.text }]}
                >
                  {currentWord.english}
                </ThemedText>
                <ThemedText style={styles.wordTextSub}>
                  {currentWord.english_details}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons Row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[
              styles.buttonAgain,
              { backgroundColor: activeColors.lightRed },
            ]}
            onPress={() => handleNext(false)}
          >
            <IconSymbol
              size={18}
              name="arrow.clockwise"
              color={activeColors.primaryRed}
            />
            <ThemedText
              style={[
                styles.buttonAgainText,
                { color: activeColors.primaryRed },
              ]}
            >
              Again
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.buttonPrimary,
              { backgroundColor: activeColors.primaryRed },
            ]}
            onPress={() => handleNext(true)}
          >
            <ThemedText style={styles.buttonPrimaryText}>
              I know this
            </ThemedText>
            <IconSymbol size={18} name="arrow.right" color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Harare Context Pin Card */}
        <View style={[styles.tipCard, { backgroundColor: "#F5F5F7" }]}>
          <View style={styles.tipIconWrapper}>
            <IconSymbol
              size={20}
              name="mappin.and.ellipse"
              color={activeColors.primaryRed}
            />
          </View>
          <View style={styles.tipContent}>
            <ThemedText style={styles.tipTitle}>
              Used in Harare every day
            </ThemedText>
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
  centerText: { textAlign: "center", opacity: 0.7, marginTop: 8 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    justifyContent: "space-between",
    paddingBottom: 24,
  },
  header: { marginBottom: 8 },
  titleText: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "bold",
    letterSpacing: -0.5,
    color: "white",
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 6,
  },
  subtitleText: {
    fontSize: 14,
    opacity: 0.6,
    fontWeight: "500",
    flexShrink: 1,
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  timerText: {
    fontSize: 13,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  progressContainer: { marginVertical: 10, gap: 6 },
  progressBarBg: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 3 },
  progressLabel: { fontSize: 12, opacity: 0.5, fontWeight: "600" },
  cardsList: { gap: 12, marginVertical: 8 },
  wordCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    ...Shadows.card,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { fontSize: 12, fontWeight: "bold" },
  wordInfo: { flex: 1, justifyContent: "center" },
  wordTextMain: { fontSize: 22, fontWeight: "bold", lineHeight: 28 },
  wordTextSub: { fontSize: 13, color: "#687076", marginTop: 1 },
  audioButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 8,
  },
  buttonAgain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 52,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  buttonAgainText: { fontSize: 16, fontWeight: "bold" },
  buttonPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 14,
  },
  buttonPrimaryText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 16,
    padding: 14,
    gap: 12,
    ...Shadows.card,
  },
  tipIconWrapper: { marginTop: 2 },
  tipContent: { flex: 1, gap: 2 },
  tipTitle: { fontSize: 13, fontWeight: "bold", color: "#11181C" },
  tipDescription: { fontSize: 12, color: "#687076", lineHeight: 16 },
  completedCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    ...Shadows.card,
  },
  completedIcon: { marginBottom: 16 },
  completedTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  completedSubtitle: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.6,
    lineHeight: 20,
    marginBottom: 20,
  },
  scoreContainer: {
    marginVertical: 16,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    width: "100%",
  },
  scoreText: { fontSize: 18, fontWeight: "bold", color: "#11181C" },
  scoreFeedback: { fontSize: 14, color: "#687076", marginTop: 4 },
  quizCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    marginVertical: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    gap: 20,
    ...Shadows.card,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 28,
    color: "#11181C",
  },
  optionsList: { gap: 12 },
  optionButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  optionNormal: { backgroundColor: "#fff", borderColor: "#E5E5E5" },
  optionCorrect: { backgroundColor: "#2E7D32", borderColor: "#2E7D32" },
  optionIncorrect: { backgroundColor: "#D32F2F", borderColor: "#D32F2F" },
  optionCorrectSecondary: {
    backgroundColor: "#E6F4EA",
    borderColor: "#2E7D32",
  },
  optionDisabled: {
    backgroundColor: "#F5F5F7",
    borderColor: "#E5E5E5",
    opacity: 0.6,
  },
  optionText: { fontSize: 16, fontWeight: "600", color: "#11181C" },
  optionTextCorrect: { color: "#fff" },
  optionTextIncorrect: { color: "#fff" },
  optionTextCorrectSecondary: { color: "#2E7D32" },
});
