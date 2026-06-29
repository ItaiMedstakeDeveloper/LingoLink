import { ChinaFlag, FranceFlag } from "@/components/flags";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Shadows } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ViewMediaScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? "light"];

  const openLanguage = (lang: "zh" | "fr") =>
    router.push({ pathname: "/media-type", params: { lang } });

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: c.background }]}
      edges={["bottom"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.title}>
          View Media
        </ThemedText>

        {/* Helpful hint banner */}
        <View style={styles.hint}>
          <IconSymbol size={20} name="newspaper.fill" color="#1A4D7A" />
          <ThemedText style={styles.hintText}>
            Practise chinese or french with common newspapers and videos
          </ThemedText>
        </View>

        {/* Chinese card */}
        <TouchableOpacity
          style={[styles.langCard, { borderColor: c.cardBorder }]}
          activeOpacity={0.9}
          onPress={() => openLanguage("zh")}
        >
          <View style={[styles.flagWrap, { backgroundColor: c.lightRed }]}>
            <ChinaFlag size={64} />
          </View>
          <View style={styles.langText}>
            <ThemedText style={styles.langTitle}>Chinese</ThemedText>
            <ThemedText style={styles.langSub}>中文 · 报纸 & 视频</ThemedText>
          </View>
          <IconSymbol size={20} name="chevron.right" color="#9BA1A6" />
        </TouchableOpacity>

        {/* French card */}
        <TouchableOpacity
          style={[styles.langCard, { borderColor: c.cardBorder }]}
          activeOpacity={0.9}
          onPress={() => openLanguage("fr")}
        >
          <View style={[styles.flagWrap, { backgroundColor: c.lightBlue }]}>
            <FranceFlag size={64} />
          </View>
          <View style={styles.langText}>
            <ThemedText style={styles.langTitle}>French</ThemedText>
            <ThemedText style={styles.langSub}>
              Français · journaux & vidéos
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
  title: { fontWeight: "bold" },
  hint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#EAF2FB",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BBD4F0",
    padding: 14,
  },
  hintText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: "#3A6491",
  },
  langCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    ...Shadows.card,
  },
  flagWrap: {
    width: 84,
    height: 84,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  langText: { flex: 1, gap: 4 },
  langTitle: { fontSize: 20, fontWeight: "bold", color: "#11181C" },
  langSub: { fontSize: 14, color: "#11181C" },
});
