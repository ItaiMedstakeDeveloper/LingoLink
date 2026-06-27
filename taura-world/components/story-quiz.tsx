import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Shadows } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { type LocalizedText, type QuizQuestion, QUIZZES } from "@/lib/quizzes";

type Props = {
  /** Lesson order whose quiz to run. */
  lessonOrder: number;
  /** Story title, shown in the header. */
  storyTitle: string;
  /** Called when the learner leaves the quiz (finished or skipped). */
  onClose: () => void;
};

/** Fisher–Yates shuffle returning a new array of indices [0..n-1]. */
function shuffleIndices(n: number): number[] {
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

/** A trilingual block: Chinese (large, red), French (blue), English (grey). */
function TriText({
  text,
  variant = "body",
}: {
  text: LocalizedText;
  variant?: "prompt" | "body";
}) {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? "light"];
  return (
    <View style={styles.triBlock}>
      <ThemedText
        style={[
          variant === "prompt" ? styles.triZhPrompt : styles.triZh,
          { color: c.primaryRed },
        ]}
      >
        {text.zh}
      </ThemedText>
      <ThemedText style={[styles.triFr, { color: c.primaryBlue }]}>
        {text.fr}
      </ThemedText>
      <ThemedText style={styles.triEn}>{text.en}</ThemedText>
    </View>
  );
}

export function StoryQuiz({ lessonOrder, storyTitle, onClose }: Props) {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? "light"];
  const questions: QuizQuestion[] = QUIZZES[lessonOrder] ?? [];

  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [committed, setCommitted] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [finished, setFinished] = useState(false);

  // Per-question answer state (reset on advance).
  const [choice, setChoice] = useState<number | null>(null); // MC / who-said-it / fill-blank
  const [boolChoice, setBoolChoice] = useState<boolean | null>(null); // true-false
  const [order, setOrder] = useState<number[]>([]); // sequence: original indices, tap order

  const q = questions[qIndex];

  // Stable shuffle for the current sequence question.
  const shuffled = useMemo(
    () => (q?.type === "sequence" ? shuffleIndices(q.items.length) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [qIndex],
  );

  if (questions.length === 0) {
    return (
      <SafeAreaView style={[styles.flex, styles.center, { backgroundColor: c.background }]}>
        <ThemedText type="subtitle">No quiz for this story yet.</ThemedText>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: c.primaryRed, marginTop: 16 }]}
          onPress={onClose}
        >
          <ThemedText style={styles.primaryBtnText}>Back to Stories</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const resetPerQuestion = () => {
    setChoice(null);
    setBoolChoice(null);
    setOrder([]);
    setCommitted(false);
    setLastCorrect(false);
  };

  const commit = (correct: boolean) => {
    setCommitted(true);
    setLastCorrect(correct);
    if (correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (qIndex < questions.length - 1) {
      setQIndex((i) => i + 1);
      resetPerQuestion();
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setQIndex(0);
    setScore(0);
    setFinished(false);
    resetPerQuestion();
  };

  // ---- Results screen ----
  if (finished) {
    const perfect = score === questions.length;
    return (
      <SafeAreaView style={[styles.flex, { backgroundColor: c.background }]} edges={["top"]}>
        <View style={[styles.flex, styles.center, { padding: 24 }]}>
          <View style={styles.resultCard}>
            <IconSymbol
              size={72}
              name={perfect ? "checkmark" : "book.fill"}
              color={c.primaryGreen}
              style={{ marginBottom: 16 }}
            />
            <ThemedText type="title" style={styles.resultTitle}>
              Quiz Complete!
            </ThemedText>
            <ThemedText style={styles.resultSub}>{storyTitle}</ThemedText>
            <View style={styles.scoreBox}>
              <ThemedText style={styles.scoreText}>
                {score} / {questions.length}
              </ThemedText>
              <ThemedText style={styles.scoreFeedback}>
                {perfect
                  ? "🏆 Perfect! Tu as tout compris · 全对！"
                  : score >= questions.length / 2
                    ? "👍 Good work · Bon travail · 做得好"
                    : "📚 Keep practising · Continue · 继续加油"}
              </ThemedText>
            </View>
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: c.primaryRed }]}
              onPress={onClose}
            >
              <ThemedText style={styles.primaryBtnText}>Back to Stories</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleRestart}>
              <ThemedText style={[styles.secondaryBtnText, { color: c.primaryBlue }]}>
                Try Again
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const progress = (qIndex + 1) / questions.length;

  // Type label shown as a small chip above the question.
  const typeLabel: Record<QuizQuestion["type"], string> = {
    "multiple-choice": "MULTIPLE CHOICE",
    "true-false": "TRUE OR FALSE",
    sequence: "PUT IN ORDER",
    "who-said-it": "WHO SAID IT?",
    "fill-blank": "FILL THE BLANK",
  };

  // Renders a tappable option used by MC / who-said-it / fill-blank.
  const renderChoiceOptions = (options: LocalizedText[], correctIndex: number) => (
    <View style={styles.optionsList}>
      {options.map((opt, i) => {
        const isPicked = choice === i;
        const isCorrect = i === correctIndex;
        let optStyle = styles.optionNormal;
        if (committed) {
          if (isCorrect) optStyle = styles.optionCorrect;
          else if (isPicked) optStyle = styles.optionIncorrect;
          else optStyle = styles.optionDimmed;
        }
        return (
          <TouchableOpacity
            key={i}
            style={[styles.option, optStyle]}
            disabled={committed}
            onPress={() => {
              setChoice(i);
              commit(i === correctIndex);
            }}
          >
            <TriText text={opt} />
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: c.background }]} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <IconSymbol size={24} name="chevron.left" color={c.text} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle} numberOfLines={1}>
          {storyTitle} · Quiz
        </ThemedText>
        <ThemedText style={styles.headerCount}>
          {qIndex + 1}/{questions.length}
        </ThemedText>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBg}>
        <View
          style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: c.primaryRed }]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.typeChip, { backgroundColor: c.lightBlue }]}>
          <ThemedText style={[styles.typeChipText, { color: c.primaryBlue }]}>
            {typeLabel[q.type]}
          </ThemedText>
        </View>

        {/* Prompt / statement */}
        {q.type === "true-false" ? (
          <View style={styles.promptCard}>
            <TriText text={q.statement} variant="prompt" />
          </View>
        ) : q.type === "fill-blank" ? (
          <View style={styles.promptCard}>
            <TriText text={q.sentence} variant="prompt" />
          </View>
        ) : (
          <View style={styles.promptCard}>
            <TriText text={q.prompt} variant="prompt" />
            {q.type === "who-said-it" && (
              <View style={[styles.quoteBox, { borderLeftColor: c.primaryRed }]}>
                <TriText text={q.quote} />
              </View>
            )}
          </View>
        )}

        {/* Answer area, per type */}
        {q.type === "multiple-choice" && renderChoiceOptions(q.options, q.correctIndex)}
        {q.type === "who-said-it" && renderChoiceOptions(q.options, q.correctIndex)}
        {q.type === "fill-blank" && renderChoiceOptions(q.options, q.correctIndex)}

        {q.type === "true-false" && (
          <View style={styles.tfRow}>
            {[true, false].map((val) => {
              const isPicked = boolChoice === val;
              const isCorrect = val === q.answer;
              let tfStyle = styles.optionNormal;
              if (committed) {
                if (isCorrect) tfStyle = styles.optionCorrect;
                else if (isPicked) tfStyle = styles.optionIncorrect;
                else tfStyle = styles.optionDimmed;
              }
              return (
                <TouchableOpacity
                  key={String(val)}
                  style={[styles.tfButton, tfStyle]}
                  disabled={committed}
                  onPress={() => {
                    setBoolChoice(val);
                    commit(val === q.answer);
                  }}
                >
                  <ThemedText style={styles.tfText}>
                    {val ? "True" : "False"}
                  </ThemedText>
                  <ThemedText style={styles.tfSub}>
                    {val ? "Vrai · 对" : "Faux · 错"}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {q.type === "sequence" && (
          <View style={styles.optionsList}>
            {shuffled.map((origIndex) => {
              const pickPos = order.indexOf(origIndex); // -1 if not yet picked
              const picked = pickPos !== -1;
              let seqStyle = styles.optionNormal;
              if (committed) {
                // Correct slot? The item that SHOULD be at this pick position.
                const correctHere = picked && pickPos === origIndex;
                seqStyle = correctHere ? styles.optionCorrect : styles.optionIncorrect;
              } else if (picked) {
                seqStyle = styles.optionPicked;
              }
              return (
                <TouchableOpacity
                  key={origIndex}
                  style={[styles.option, styles.seqOption, seqStyle]}
                  disabled={committed || picked}
                  onPress={() => setOrder((o) => [...o, origIndex])}
                >
                  <View style={[styles.seqBadge, { backgroundColor: picked ? c.primaryRed : "#E3E5E8" }]}>
                    <ThemedText style={[styles.seqBadgeText, { color: picked ? "#fff" : "#687076" }]}>
                      {picked ? pickPos + 1 : "·"}
                    </ThemedText>
                  </View>
                  <View style={styles.seqTextWrap}>
                    <TriText text={(q.items as LocalizedText[])[origIndex]} />
                  </View>
                </TouchableOpacity>
              );
            })}

            {!committed && order.length > 0 && (
              <TouchableOpacity style={styles.resetBtn} onPress={() => setOrder([])}>
                <IconSymbol size={15} name="arrow.clockwise" color="#687076" />
                <ThemedText style={styles.resetText}>Reset order</ThemedText>
              </TouchableOpacity>
            )}

            {!committed && order.length === q.items.length && (
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: c.primaryBlue }]}
                onPress={() => {
                  const correct = order.every((orig, pos) => orig === pos);
                  commit(correct);
                }}
              >
                <ThemedText style={styles.primaryBtnText}>Check Order</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Feedback + Next */}
        {committed && (
          <View style={styles.feedbackWrap}>
            <View
              style={[
                styles.feedbackPill,
                { backgroundColor: lastCorrect ? "#E6F4EA" : "#FDECEC" },
              ]}
            >
              <IconSymbol
                size={18}
                name={lastCorrect ? "checkmark" : "xmark"}
                color={lastCorrect ? "#2E7D32" : "#D32F2F"}
              />
              <ThemedText
                style={[styles.feedbackText, { color: lastCorrect ? "#2E7D32" : "#D32F2F" }]}
              >
                {lastCorrect ? "Correct! · Bravo · 正确" : "Not quite · Presque · 不对"}
              </ThemedText>
            </View>
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: c.primaryRed }]}
              onPress={handleNext}
            >
              <ThemedText style={styles.primaryBtnText}>
                {qIndex === questions.length - 1 ? "See Results" : "Next Question"}
              </ThemedText>
              <IconSymbol size={18} name="arrow.right" color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 48,
  },
  closeBtn: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { flex: 1, fontSize: 15, fontWeight: "bold", marginHorizontal: 4 },
  headerCount: { fontSize: 14, fontWeight: "bold", opacity: 0.6 },
  progressBg: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    marginHorizontal: 20,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 3 },
  scroll: { padding: 20, paddingBottom: 40, gap: 16 },
  typeChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  typeChipText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.6 },
  promptCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 18,
    ...Shadows.card,
  },
  quoteBox: {
    marginTop: 12,
    paddingLeft: 12,
    borderLeftWidth: 3,
  },
  triBlock: { gap: 3 },
  triZhPrompt: { fontSize: 20, fontWeight: "bold", lineHeight: 28 },
  triZh: { fontSize: 17, fontWeight: "bold", lineHeight: 24 },
  triFr: { fontSize: 15, fontWeight: "600" },
  triEn: { fontSize: 13, color: "#687076" },
  optionsList: { gap: 10 },
  option: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  optionNormal: { borderColor: "#E5E5E5" },
  optionPicked: { borderColor: "#1E88E5", backgroundColor: "#F0F7FF" },
  optionCorrect: { borderColor: "#2E7D32", backgroundColor: "#E6F4EA" },
  optionIncorrect: { borderColor: "#D32F2F", backgroundColor: "#FDECEC" },
  optionDimmed: { borderColor: "#E5E5E5", opacity: 0.5 },
  seqOption: { flexDirection: "row", alignItems: "center", gap: 12 },
  seqBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  seqBadgeText: { fontSize: 14, fontWeight: "800" },
  seqTextWrap: { flex: 1 },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
  resetText: { fontSize: 13, color: "#687076", fontWeight: "600" },
  tfRow: { flexDirection: "row", gap: 12 },
  tfButton: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 22,
    alignItems: "center",
    gap: 2,
  },
  tfText: { fontSize: 20, fontWeight: "bold" },
  tfSub: { fontSize: 13, color: "#687076" },
  feedbackWrap: { gap: 12, marginTop: 4 },
  feedbackPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
  },
  feedbackText: { fontSize: 15, fontWeight: "bold" },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 14,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  secondaryBtn: { height: 48, alignItems: "center", justifyContent: "center" },
  secondaryBtnText: { fontSize: 15, fontWeight: "bold" },
  resultCard: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    ...Shadows.card,
  },
  resultTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  resultSub: { fontSize: 14, opacity: 0.6, marginBottom: 16, textAlign: "center" },
  scoreBox: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  scoreText: { fontSize: 32, fontWeight: "bold" },
  scoreFeedback: { fontSize: 14, color: "#687076", marginTop: 6, textAlign: "center" },
});
