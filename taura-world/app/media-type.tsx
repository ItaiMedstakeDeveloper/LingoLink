import { ChinaFlag, FranceFlag } from "@/components/flags";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Shadows } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LANGUAGE_LABELS, type Language } from "@/lib/media";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MediaTypeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? "light"];

  const { lang } = useLocalSearchParams<{ lang: Language }>();
  const language: Language = lang === "fr" ? "fr" : "zh";
  const isFrench = language === "fr";
  const accent = isFrench ? c.primaryBlue : c.primaryRed;
  const accentLight = isFrench ? c.lightBlue : c.lightRed;

  // Reflect the chosen language in the native header.
  useEffect(() => {
    navigation.setOptions({ title: LANGUAGE_LABELS[language] });
  }, [navigation, language]);

  const openType = (type: "newspapers" | "videos") =>
    router.push({ pathname: "/media-items", params: { lang: language, type } });

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: c.background }]}
      edges={["bottom"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <View style={[styles.flagWrap, { backgroundColor: accentLight }]}>
            {isFrench ? <FranceFlag size={48} /> : <ChinaFlag size={48} />}
          </View>
          <ThemedText type="title" style={styles.title}>
            {LANGUAGE_LABELS[language]}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            What would you like to practise with?
          </ThemedText>
        </View>

        {/* Newspapers */}
        <TouchableOpacity
          style={[styles.typeCard, { borderColor: c.cardBorder }]}
          activeOpacity={0.9}
          onPress={() => openType("newspapers")}
        >
          <View style={[styles.typeIcon, { backgroundColor: accentLight }]}>
            <IconSymbol size={24} name="newspaper.fill" color={accent} />
          </View>
          <View style={styles.typeText}>
            <ThemedText style={styles.typeTitle}>Newspapers</ThemedText>
            <ThemedText style={styles.typeSub}>
              Read the top publications
            </ThemedText>
          </View>
          <IconSymbol size={20} name="chevron.right" color="#9BA1A6" />
        </TouchableOpacity>

        {/* Videos */}
        <TouchableOpacity
          style={[styles.typeCard, { borderColor: c.cardBorder }]}
          activeOpacity={0.9}
          onPress={() => openType("videos")}
        >
          <View style={[styles.typeIcon, { backgroundColor: accentLight }]}>
            <IconSymbol size={24} name="play.circle.fill" color={accent} />
          </View>
          <View style={styles.typeText}>
            <ThemedText style={styles.typeTitle}>Videos</ThemedText>
            <ThemedText style={styles.typeSub}>
              Watch popular video channels
            </ThemedText>
          </View>
          <IconSymbol size={20} name="chevron.right" color="#9BA1A6" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20, gap: 16 },
  heading: { alignItems: "center", gap: 8, marginBottom: 4 },
  flagWrap: {
    width: 72,
    height: 72,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  title: { fontWeight: "bold", color: "#11181C" },
  subtitle: { fontSize: 14, color: "#11181C", textAlign: "center" },
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    ...Shadows.card,
  },
  typeIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  typeText: { flex: 1, gap: 3 },
  typeTitle: { fontSize: 18, fontWeight: "bold", color: "#11181C" },
  typeSub: { fontSize: 13, color: "#11181C" },
});
