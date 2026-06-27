import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Shadows } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

type Language = "fr" | "zh";

// Enable smooth expand/collapse animations on Android.
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type HelpStep = { emoji: string; text: string };

// Friendly, Android-flavoured walkthrough for adding & switching to each
// keyboard. Keyed by language so the card adapts to what the learner picked.
const KEYBOARD_STEPS: Record<Language, HelpStep[]> = {
  zh: [
    {
      emoji: "🌐",
      text: "On your keyboard, tap & hold the 🌐 globe (or the spacebar) to switch languages.",
    },
    {
      emoji: "⚙️",
      text: "No Chinese yet? Open Settings → System → Languages & input → On-screen keyboard → Gboard → Languages.",
    },
    { emoji: "➕", text: "Tap “Add keyboard” and choose Chinese (Pinyin)." },
    {
      emoji: "✍️",
      text: "Come back here, tap 🌐 to switch, then type “nihao” and pick 你好 from the suggestions!",
    },
  ],
  fr: [
    {
      emoji: "🌐",
      text: "On your keyboard, tap & hold the 🌐 globe (or the spacebar) to switch languages.",
    },
    {
      emoji: "⚙️",
      text: "No French yet? Open Settings → System → Languages & input → On-screen keyboard → Gboard → Languages.",
    },
    { emoji: "➕", text: "Tap “Add keyboard” and choose Français (France)." },
    {
      emoji: "✍️",
      text: "Come back here, tap 🌐 to switch, then hold a letter to get accents like é, à, ç.",
    },
  ],
};

/**
 * A playful, collapsible "how do I type in this language?" helper. Each step
 * can be tapped to tick it off, the globe gently bounces to draw the eye, and
 * finishing every step triggers a little celebration.
 */
function KeyboardHelpCard({
  language,
  colors,
}: {
  language: Language;
  colors: (typeof Colors)["light"];
}) {
  const isFrench = language === "fr";
  const accent = isFrench ? colors.primaryBlue : colors.primaryRed;
  const accentLight = isFrench ? colors.lightBlue : colors.lightRed;
  const langLabel = isFrench ? "Français" : "中文";
  const steps = KEYBOARD_STEPS[language];

  const [expanded, setExpanded] = useState(false);
  const [done, setDone] = useState<Set<number>>(new Set());

  // Reset progress whenever the learner switches language.
  useEffect(() => {
    setDone(new Set());
  }, [language]);

  // Gentle looping bounce on the globe emoji.
  const bounce = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 600,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [bounce]);

  const globeTranslate = bounce.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpanded((prev) => !prev);
  };

  const toggleStep = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const allDone = done.size === steps.length;

  return (
    <View style={[helpStyles.card, { backgroundColor: accentLight }]}>
      <TouchableOpacity
        style={helpStyles.header}
        onPress={toggleExpanded}
        activeOpacity={0.8}
      >
        <Animated.Text
          style={[
            helpStyles.globe,
            { transform: [{ translateY: globeTranslate }] },
          ]}
        >
          🌐
        </Animated.Text>
        <ThemedText style={[helpStyles.headerText, { color: accent }]}>
          How do I type in {langLabel}?
        </ThemedText>
        <IconSymbol
          name={expanded ? "chevron.left" : "chevron.right"}
          size={20}
          color={accent}
        />
      </TouchableOpacity>
      {expanded ? (
        <View style={helpStyles.body}>
          {steps.map((step, index) => {
            const isDone = done.has(index);
            return (
              <TouchableOpacity
                key={index}
                style={helpStyles.step}
                onPress={() => toggleStep(index)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    helpStyles.checkCircle,
                    {
                      borderColor: accent,
                      backgroundColor: isDone ? accent : "transparent",
                    },
                  ]}
                >
                  {isDone ? (
                    <IconSymbol name="checkmark" size={14} color="#fff" />
                  ) : (
                    <ThemedText
                      style={[helpStyles.stepEmoji, { color: accent }]}
                    >
                      {step.emoji}
                    </ThemedText>
                  )}
                </View>
                <ThemedText
                  style={[
                    helpStyles.stepText,
                    isDone && helpStyles.stepTextDone,
                  ]}
                >
                  {step.text}
                </ThemedText>
              </TouchableOpacity>
            );
          })}

          {allDone ? (
            <View style={[helpStyles.celebrate, { backgroundColor: accent }]}>
              <ThemedText style={helpStyles.celebrateText}>
                🎉 You&apos;re all set — type away!
              </ThemedText>
            </View>
          ) : null}
        </View>
      ) : (
        <ThemedText style={[helpStyles.peek, { color: accent }]}>
          Tap for a quick Android walkthrough →
        </ThemedText>
      )}
    </View>
  );
}

export default function AddWordScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme ?? "light"];

  const [language, setLanguage] = useState<Language>("fr");
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (saving) return;
    const trimmedWord = word.trim();
    const trimmedTranslation = translation.trim();

    if (!trimmedWord || !trimmedTranslation) {
      setError("Please enter both the word and its English translation.");
      return;
    }

    setError(null);
    setSaving(true);
    try {
      await db.runAsync(
        `INSERT INTO saved_words (word, language, translation, note, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        trimmedWord,
        language,
        trimmedTranslation,
        note.trim() || null,
        new Date().toISOString(),
      );
      router.back();
    } catch (err) {
      console.error("Error saving word:", err);
      setError("Something went wrong while saving. Please try again.");
      setSaving(false);
    }
  }

  const isFrench = language === "fr";

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: activeColors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText type="title" style={styles.title}>
          Save a new word
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Add a word you came across along with its English meaning.
        </ThemedText>

        {/* Language toggle */}
        <ThemedText style={styles.label}>Language</ThemedText>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[
              styles.toggle,
              {
                borderColor: isFrench
                  ? activeColors.primaryBlue
                  : activeColors.cardBorder,
                backgroundColor: isFrench
                  ? activeColors.lightBlue
                  : "transparent",
              },
            ]}
            onPress={() => setLanguage("fr")}
          >
            <ThemedText
              style={[
                styles.toggleText,
                isFrench && {
                  color: activeColors.primaryBlue,
                  fontWeight: "700",
                },
              ]}
            >
              Français
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggle,
              {
                borderColor: !isFrench
                  ? activeColors.primaryRed
                  : activeColors.cardBorder,
                backgroundColor: !isFrench
                  ? activeColors.lightRed
                  : "transparent",
              },
            ]}
            onPress={() => setLanguage("zh")}
          >
            <ThemedText
              style={[
                styles.toggleText,
                !isFrench && {
                  color: activeColors.primaryRed,
                  fontWeight: "700",
                },
              ]}
            >
              中文
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Fun, interactive guide for switching the Android keyboard. */}
        <KeyboardHelpCard language={language} colors={activeColors} />

        <ThemedText style={styles.label}>
          Word {isFrench ? "(in French)" : "(in Chinese)"}
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            { color: activeColors.text, borderColor: activeColors.cardBorder },
          ]}
          placeholder={isFrench ? "e.g. Bonjour" : "e.g. 你好"}
          placeholderTextColor={activeColors.icon}
          value={word}
          onChangeText={setWord}
          autoFocus
          autoCorrect={false}
          autoCapitalize="none"
          spellCheck={false}
        />

        <ThemedText style={styles.label}>English translation</ThemedText>
        <TextInput
          style={[
            styles.input,
            { color: activeColors.text, borderColor: activeColors.cardBorder },
          ]}
          placeholder="e.g. Hello"
          placeholderTextColor={activeColors.icon}
          value={translation}
          onChangeText={setTranslation}
        />

        <ThemedText style={styles.label}>Note (optional)</ThemedText>
        <TextInput
          style={[
            styles.input,
            styles.noteInput,
            { color: activeColors.text, borderColor: activeColors.cardBorder },
          ]}
          placeholder="Where you heard it, an example sentence, a tip…"
          placeholderTextColor={activeColors.icon}
          value={note}
          onChangeText={setNote}
          multiline
        />

        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: activeColors.tint },
            saving && styles.buttonDisabled,
          ]}
          onPress={handleSave}
          disabled={saving}
        >
          <ThemedText style={styles.buttonText}>
            {saving ? "Saving…" : "Save word"}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.cancelText}>Cancel</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: 24,
    gap: 8,
    paddingBottom: 48,
  },
  title: {
    fontWeight: "bold",
  },
  subtitle: {
    opacity: 0.6,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 12,
  },
  toggle: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  error: {
    color: "#c0392b",
    marginTop: 10,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  cancelText: {
    opacity: 0.6,
    fontSize: 15,
  },
});

const helpStyles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
    ...Shadows.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  globe: {
    fontSize: 22,
  },
  headerText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
  },
  peek: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.8,
    marginTop: 8,
    marginLeft: 32,
  },
  body: {
    marginTop: 12,
    gap: 12,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  stepEmoji: {
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  stepTextDone: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  celebrate: {
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 4,
  },
  celebrateText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
