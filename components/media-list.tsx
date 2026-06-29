import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Shadows } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { MediaItem } from "@/lib/media";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  title: string;
  subtitle?: string;
  /** Accent color for names + index badges. */
  accent: string;
  /** Light accent used as the badge background. */
  accentLight: string;
  /** Flag element rendered in the header. */
  flag: React.ReactNode;
  items: MediaItem[];
};

/**
 * A simple list of recommended media (newspapers or video channels). Each row
 * is tappable; if a `url` is provided it opens inside the app in a WebView,
 * otherwise it's a no-op placeholder (links are added via `lib/media.ts`).
 */
export function MediaList({
  title,
  subtitle,
  accent,
  accentLight,
  flag,
  items,
}: Props) {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const handlePress = (item: MediaItem) => {
    if (item.url) {
      router.push({
        pathname: "/web-view",
        params: { url: item.url, title: item.name },
      });
    }
  };

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: c.background }]}
      edges={["bottom"]}
    >
      <View style={styles.header}>
        <View style={[styles.flagWrap, { backgroundColor: accentLight }]}>
          {flag}
        </View>
        <View style={styles.headerText}>
          <ThemedText type="title" style={styles.title}>
            {title}
          </ThemedText>
          {subtitle ? (
            <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
          ) : null}
        </View>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.name}
            style={[styles.row, { borderColor: c.cardBorder }]}
            activeOpacity={0.85}
            onPress={() => handlePress(item)}
          >
            <View style={[styles.indexBadge, { backgroundColor: accentLight }]}>
              <ThemedText style={[styles.indexText, { color: accent }]}>
                {index + 1}
              </ThemedText>
            </View>
            <View style={styles.rowText}>
              <View style={styles.rowTitleLine}>
                <ThemedText style={styles.rowName}>{item.name}</ThemedText>
                {item.native ? (
                  <ThemedText style={[styles.rowNative, { color: accent }]}>
                    {item.native}
                  </ThemedText>
                ) : null}
              </View>
              {item.note ? (
                <ThemedText style={styles.rowNote}>{item.note}</ThemedText>
              ) : null}
            </View>
            <IconSymbol size={18} name="chevron.right" color="#9BA1A6" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 20,
    paddingBottom: 12,
  },
  flagWrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: { flex: 1, gap: 2 },
  title: { fontWeight: "bold", color: "#11181C" },
  subtitle: { fontSize: 14, color: "#11181C" },
  list: { paddingHorizontal: 20, gap: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    ...Shadows.card,
  },
  indexBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  indexText: { fontSize: 14, fontWeight: "800" },
  rowText: { flex: 1, gap: 2 },
  rowTitleLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  rowName: { fontSize: 15, fontWeight: "700", color: "#11181C" },
  rowNative: { fontSize: 14 },
  rowNote: { fontSize: 12, color: "#11181C", lineHeight: 16 },
});
