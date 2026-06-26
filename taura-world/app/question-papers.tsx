import { ChinaFlag, FranceFlag } from "@/components/flags";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuestionPapersScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? "light"];

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: c.background }]}
      edges={["bottom"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Question Papers
        </ThemedText>

        {/* Helpful hint banner */}
        <View style={styles.hint}>
          <IconSymbol size={20} name="book.fill" color="#7A5B00" />
          <ThemedText style={styles.hintText}>
            Practise with common questions that appear in examinations. Choose a
            language to get started.
          </ThemedText>
        </View>

        {/* Chinese card */}
        <TouchableOpacity
          style={[styles.langCard, { borderColor: c.cardBorder }]}
          activeOpacity={0.9}
          onPress={() => router.push("/question-papers-chinese")}
        >
          <View style={[styles.flagWrap, { backgroundColor: c.lightRed }]}>
            <ChinaFlag size={64} />
          </View>
          <View style={styles.langText}>
            <ThemedText style={[styles.langTitle, { color: c.primaryRed }]}>
              Chinese
            </ThemedText>
            <ThemedText style={styles.langSub}>中文 · 普通话</ThemedText>
          </View>
          <IconSymbol size={20} name="chevron.right" color="#9BA1A6" />
        </TouchableOpacity>

        {/* French card */}
        <TouchableOpacity
          style={[styles.langCard, { borderColor: c.cardBorder }]}
          activeOpacity={0.9}
          onPress={() => router.push("/question-papers-french")}
        >
          <View style={[styles.flagWrap, { backgroundColor: c.lightBlue }]}>
            <FranceFlag size={64} />
          </View>
          <View style={styles.langText}>
            <ThemedText style={[styles.langTitle, { color: c.primaryBlue }]}>
              French
            </ThemedText>
            <ThemedText style={styles.langSub}>Français</ThemedText>
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
    backgroundColor: "#FFF8E6",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F0D98C",
    padding: 14,
  },
  hintText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: "#8A6D1F",
  },
  langCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  flagWrap: {
    width: 84,
    height: 84,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  langText: { flex: 1, gap: 4 },
  langTitle: { fontSize: 20, fontWeight: "bold" },
  langSub: { fontSize: 14, opacity: 0.6 },
});
