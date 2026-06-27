import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Shadows } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { Language } from "@/lib/media";
import { PLACES, type Place, type PlaceCategory } from "@/lib/places";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type CatFilter = "all" | PlaceCategory;
type LangFilter = "all" | Language;

export default function PlacesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? "light"];

  const [cat, setCat] = useState<CatFilter>("all");
  const [lang, setLang] = useState<LangFilter>("all");

  const data = useMemo(
    () =>
      PLACES.filter(
        (p) =>
          (cat === "all" || p.category === cat) &&
          (lang === "all" || p.language === lang),
      ),
    [cat, lang],
  );

  const accentFor = (l: Language) => (l === "fr" ? c.primaryBlue : c.primaryRed);
  const lightFor = (l: Language) => (l === "fr" ? c.lightBlue : c.lightRed);

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: c.background }]}
      edges={["bottom"]}
    >
      {/* Filters */}
      <View style={styles.filters}>
        <View style={styles.chipRow}>
          {(
            [
              ["all", "All"],
              ["restaurant", "Restaurants"],
              ["school", "Schools"],
            ] as [CatFilter, string][]
          ).map(([value, label]) => (
            <Chip
              key={value}
              label={label}
              active={cat === value}
              accent={c.primaryRed}
              onPress={() => setCat(value)}
              border={c.cardBorder}
            />
          ))}
        </View>
        <View style={styles.chipRow}>
          {(
            [
              ["all", "All languages"],
              ["zh", "中文 Chinese"],
              ["fr", "Français French"],
            ] as [LangFilter, string][]
          ).map(([value, label]) => (
            <Chip
              key={value}
              label={label}
              active={lang === value}
              accent={value === "fr" ? c.primaryBlue : c.primaryRed}
              onPress={() => setLang(value)}
              border={c.cardBorder}
            />
          ))}
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText style={styles.emptyText}>
              No places match these filters yet.
            </ThemedText>
          </View>
        }
        renderItem={({ item }) => (
          <PlaceCard
            place={item}
            accent={accentFor(item.language)}
            accentLight={lightFor(item.language)}
            border={c.cardBorder}
            onPress={() =>
              router.push({
                pathname: "/place-detail",
                params: { id: item.id },
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

function Chip({
  label,
  active,
  accent,
  border,
  onPress,
}: {
  label: string;
  active: boolean;
  accent: string;
  border: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { borderColor: active ? accent : border },
        active && { backgroundColor: accent },
      ]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <ThemedText
        style={[styles.chipText, { color: active ? "#fff" : "#11181C" }]}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

function PlaceCard({
  place,
  accent,
  accentLight,
  border,
  onPress,
}: {
  place: Place;
  accent: string;
  accentLight: string;
  border: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: border }]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={[styles.cardIcon, { backgroundColor: accentLight }]}>
        <IconSymbol
          size={22}
          name={place.category === "school" ? "graduationcap.fill" : "fork.knife"}
          color={accent}
        />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTitleRow}>
          <ThemedText style={styles.cardName}>{place.name}</ThemedText>
          {place.nativeName ? (
            <ThemedText style={[styles.cardNative, { color: accent }]}>
              {place.nativeName}
            </ThemedText>
          ) : null}
        </View>
        <ThemedText style={styles.cardBlurb} numberOfLines={2}>
          {place.blurb}
        </ThemedText>
        <ThemedText style={styles.cardMeta}>
          {place.category === "restaurant" && place.priceLevel
            ? `${"$".repeat(place.priceLevel)} · `
            : ""}
          {place.city}
        </ThemedText>
      </View>
      <IconSymbol size={18} name="chevron.right" color="#9BA1A6" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  filters: { paddingHorizontal: 16, paddingTop: 12, gap: 8 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  chipText: { fontSize: 13, fontWeight: "700" },
  list: { padding: 16, gap: 12 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    ...Shadows.card,
  },
  cardIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: { flex: 1, gap: 2 },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    flexWrap: "wrap",
  },
  cardName: { fontSize: 15, fontWeight: "700", color: "#11181C" },
  cardNative: { fontSize: 13, fontWeight: "700" },
  cardBlurb: { fontSize: 13, color: "#11181C", lineHeight: 17 },
  cardMeta: { fontSize: 12, color: "#687076", fontWeight: "600", marginTop: 2 },
  empty: { padding: 40, alignItems: "center" },
  emptyText: { fontSize: 14, color: "#687076" },
});
