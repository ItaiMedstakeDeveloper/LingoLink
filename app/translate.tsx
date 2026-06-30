import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Shadows } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { speak } from "@/lib/speech";
import {
  SPEECH_LOCALE,
  TARGET_LABEL,
  translateToBoth,
  type TargetLang,
} from "@/lib/translate";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Results = Record<TargetLang, string> | null;

export default function TranslateScreen() {
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme ?? "light"];

  const [text, setText] = useState("");
  const [results, setResults] = useState<Results>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleTranslate() {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const both = await translateToBoth(trimmed, "en");
      setResults(both);
    } catch (err) {
      console.error("Translation error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while translating.",
      );
    } finally {
      setLoading(false);
    }
  }

  const accentFor = (lang: TargetLang) =>
    lang === "fr" ? activeColors.primaryBlue : activeColors.primaryRed;
  const accentLightFor = (lang: TargetLang) =>
    lang === "fr" ? activeColors.lightBlue : activeColors.lightRed;

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
          Translate
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Type some English text and get it in French and Chinese.
        </ThemedText>

        <ThemedText style={styles.label}>Text to translate</ThemedText>
        <TextInput
          style={[
            styles.input,
            { color: activeColors.text, borderColor: activeColors.cardBorder },
          ]}
          placeholder="e.g. Hello, how are you?"
          placeholderTextColor={activeColors.icon}
          value={text}
          onChangeText={setText}
          autoFocus
          multiline
        />

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: activeColors.tint },
            (loading || !text.trim()) && styles.buttonDisabled,
          ]}
          onPress={handleTranslate}
          disabled={loading || !text.trim()}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Translate</ThemedText>
          )}
        </TouchableOpacity>

        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

        {results
          ? (Object.keys(results) as TargetLang[]).map((lang) => {
              const accent = accentFor(lang);
              return (
                <View
                  key={lang}
                  style={[
                    styles.resultCard,
                    {
                      borderColor: activeColors.cardBorder,
                      backgroundColor: activeColors.cardBackground,
                    },
                  ]}
                >
                  <View style={styles.resultHeader}>
                    <View
                      style={[
                        styles.langPill,
                        { backgroundColor: accentLightFor(lang) },
                      ]}
                    >
                      <ThemedText style={[styles.langPillText, { color: accent }]}>
                        {TARGET_LABEL[lang]}
                      </ThemedText>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.speakButton,
                        { backgroundColor: accentLightFor(lang) },
                      ]}
                      onPress={() => speak(results[lang], SPEECH_LOCALE[lang])}
                      hitSlop={8}
                    >
                      <IconSymbol size={18} name="volume.3.fill" color={accent} />
                    </TouchableOpacity>
                  </View>
                  <ThemedText style={[styles.resultText, { color: accent }]}>
                    {results[lang]}
                  </ThemedText>
                </View>
              );
            })
          : null}
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
  title: { fontWeight: "bold" },
  subtitle: { opacity: 0.6, marginBottom: 12 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 90,
    textAlignVertical: "top",
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  error: { color: "#c0392b", marginTop: 12 },
  resultCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginTop: 16,
    ...Shadows.card,
  },
  resultHeader: {
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
  langPillText: { fontSize: 12, fontWeight: "700" },
  speakButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  resultText: { fontSize: 22, fontWeight: "600", lineHeight: 30 },
});
