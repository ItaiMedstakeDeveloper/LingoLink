import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Shadows } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { speak } from "@/lib/speech";
import {
  LANG_LABEL,
  LANGS,
  SPEECH_LOCALE,
  translateText,
  type Lang,
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

export default function TranslateScreen() {
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme ?? "light"];

  const [from, setFrom] = useState<Lang>("en");
  const [to, setTo] = useState<Lang>("fr");
  const [text, setText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Colour each language gets in the UI.
  const accentFor = (lang: Lang) =>
    lang === "fr"
      ? activeColors.primaryBlue
      : lang === "zh"
        ? activeColors.primaryRed
        : activeColors.primaryGreen;
  const accentLightFor = (lang: Lang) =>
    lang === "fr"
      ? activeColors.lightBlue
      : lang === "zh"
        ? activeColors.lightRed
        : activeColors.lightGreen;

  // Pick a "from" language; if it collides with "to", swap them.
  const chooseFrom = (lang: Lang) => {
    if (lang === to) setTo(from);
    setFrom(lang);
    setResult(null);
  };
  const chooseTo = (lang: Lang) => {
    if (lang === from) setFrom(to);
    setTo(lang);
    setResult(null);
  };

  // Swap the two languages (and swap the text/result if we have a result).
  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    if (result !== null) {
      setText(result);
      setResult(null);
    }
  };

  async function handleTranslate() {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const translated = await translateText(trimmed, from, to);
      setResult(translated);
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

  const renderLangPills = (
    selected: Lang,
    onChoose: (lang: Lang) => void,
  ) => (
    <View style={styles.pillRow}>
      {LANGS.map((lang) => {
        const active = lang === selected;
        const accent = accentFor(lang);
        return (
          <TouchableOpacity
            key={lang}
            style={[
              styles.pill,
              {
                borderColor: active ? accent : activeColors.cardBorder,
                backgroundColor: active ? accentLightFor(lang) : "transparent",
              },
            ]}
            onPress={() => onChoose(lang)}
            activeOpacity={0.8}
          >
            <ThemedText
              style={[
                styles.pillText,
                active && { color: accent, fontWeight: "700" },
              ]}
            >
              {LANG_LABEL[lang]}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );

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
          Pick the languages, type your text, and translate either way.
        </ThemedText>

        {/* From / To selectors with a swap button */}
        <ThemedText style={styles.label}>From</ThemedText>
        {renderLangPills(from, chooseFrom)}

        <TouchableOpacity
          style={[styles.swapButton, { borderColor: activeColors.cardBorder }]}
          onPress={handleSwap}
          activeOpacity={0.8}
        >
          <IconSymbol
            size={20}
            name="arrow.clockwise"
            color={activeColors.tint}
          />
          <ThemedText style={[styles.swapText, { color: activeColors.tint }]}>
            Swap
          </ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.label}>To</ThemedText>
        {renderLangPills(to, chooseTo)}

        <ThemedText style={styles.label}>
          Text ({LANG_LABEL[from]})
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            { color: activeColors.text, borderColor: activeColors.cardBorder },
          ]}
          placeholder="Type something to translate…"
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

        {result !== null ? (
          <View
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
                  { backgroundColor: accentLightFor(to) },
                ]}
              >
                <ThemedText
                  style={[styles.langPillText, { color: accentFor(to) }]}
                >
                  {LANG_LABEL[to]}
                </ThemedText>
              </View>
              <TouchableOpacity
                style={[
                  styles.speakButton,
                  { backgroundColor: accentLightFor(to) },
                ]}
                onPress={() => speak(result, SPEECH_LOCALE[to])}
                hitSlop={8}
              >
                <IconSymbol
                  size={18}
                  name="volume.3.fill"
                  color={accentFor(to)}
                />
              </TouchableOpacity>
            </View>
            <ThemedText style={[styles.resultText, { color: accentFor(to) }]}>
              {result}
            </ThemedText>
          </View>
        ) : null}
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
  pillRow: {
    flexDirection: "row",
    gap: 8,
  },
  pill: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pillText: { fontSize: 15 },
  swapButton: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 12,
  },
  swapText: { fontSize: 14, fontWeight: "700" },
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
