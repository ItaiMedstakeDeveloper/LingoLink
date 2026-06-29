import { ChinaFlag } from "@/components/flags";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChinesePapersScreen() {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? "light"];

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: c.background }]}
      edges={["bottom"]}
    >
      <View style={styles.content}>
        <View style={[styles.flagWrap, { backgroundColor: c.lightRed }]}>
          <ChinaFlag size={96} />
        </View>
        <ThemedText type="title" style={[styles.title, { color: c.primaryRed }]}>
          Chinese Question Papers
        </ThemedText>
        <ThemedText style={styles.subtitle}>中文试卷</ThemedText>
        <ThemedText style={styles.body}>
          Common Chinese examination questions will appear here. We&apos;re
          putting the papers together — check back soon!
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  flagWrap: {
    width: 128,
    height: 128,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  title: { fontWeight: "bold", textAlign: "center" },
  subtitle: { fontSize: 18, opacity: 0.6 },
  body: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    opacity: 0.7,
    marginTop: 8,
  },
});
