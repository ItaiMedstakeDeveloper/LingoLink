import { ChinaFlag, FranceFlag } from "@/components/flags";
import { CountryMap } from "@/components/country-map";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Shadows } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { EXPLORE } from "@/lib/explore";
import type { Marker } from "@/lib/explore";
import type { Language } from "@/lib/media";
import { speak } from "@/lib/speech";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? "light"];

  const [language, setLanguage] = useState<Language>("zh");
  const [mapIndex, setMapIndex] = useState(0);
  const [selected, setSelected] = useState<Marker | null>(null);

  const maps = EXPLORE[language];
  const map = maps[mapIndex];
  const isFrench = language === "fr";
  const accent = isFrench ? c.primaryBlue : c.primaryRed;
  const accentLight = isFrench ? c.lightBlue : c.lightRed;

  const switchLanguage = (lang: Language) => {
    setLanguage(lang);
    setMapIndex(0);
    setSelected(null);
  };

  const switchMap = (index: number) => {
    setMapIndex(index);
    setSelected(null);
  };

  const sayMarker = (marker: Marker) => {
    speak(marker.phrase, marker.bcp47 ?? map.bcp47);
  };

  const handleSelectMarker = (marker: Marker) => {
    setSelected(marker);
    sayMarker(marker);
  };

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: c.background }]}
      edges={["top"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Explore
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Tap a place to hear a phrase and learn something about it.
        </ThemedText>

        {/* Language toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[
              styles.toggle,
              {
                borderColor: language === "zh" ? c.primaryRed : c.cardBorder,
                backgroundColor: language === "zh" ? c.lightRed : "#fff",
              },
            ]}
            activeOpacity={0.9}
            onPress={() => switchLanguage("zh")}
          >
            <ChinaFlag size={22} />
            <ThemedText
              style={[
                styles.toggleText,
                language === "zh" && { color: c.primaryRed },
              ]}
            >
              China
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggle,
              {
                borderColor: language === "fr" ? c.primaryBlue : c.cardBorder,
                backgroundColor: language === "fr" ? c.lightBlue : "#fff",
              },
            ]}
            activeOpacity={0.9}
            onPress={() => switchLanguage("fr")}
          >
            <FranceFlag size={22} />
            <ThemedText
              style={[
                styles.toggleText,
                language === "fr" && { color: c.primaryBlue },
              ]}
            >
              France
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Map switcher (e.g. France ↔ Afrique, China ↔ Dialects) */}
        {maps.length > 1 ? (
          <View style={[styles.segment, { borderColor: accent }]}>
            {maps.map((m, i) => {
              const active = i === mapIndex;
              return (
                <TouchableOpacity
                  key={m.id}
                  style={[
                    styles.segmentItem,
                    active && { backgroundColor: accent },
                  ]}
                  activeOpacity={0.9}
                  onPress={() => switchMap(i)}
                >
                  <ThemedText
                    style={[
                      styles.segmentText,
                      { color: active ? "#fff" : accent },
                    ]}
                  >
                    {m.label}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}

        <ThemedText style={[styles.countrySub, { color: accent }]}>
          {map.sub}
        </ThemedText>

        {/* The map */}
        <View style={[styles.mapCard, { borderColor: c.cardBorder }]}>
          <CountryMap
            map={map}
            accent={accent}
            accentLight={accentLight}
            selectedName={selected?.name}
            onSelectMarker={handleSelectMarker}
          />
        </View>

        {/* Selected marker detail */}
        {selected ? (
          <View style={[styles.detailCard, { borderColor: c.cardBorder }]}>
            <View style={styles.detailHeader}>
              <View style={styles.detailHeading}>
                <ThemedText style={styles.detailCity}>
                  {selected.name}
                </ThemedText>
                {selected.native ? (
                  <ThemedText style={[styles.detailNative, { color: accent }]}>
                    {selected.native}
                  </ThemedText>
                ) : null}
              </View>
              <TouchableOpacity
                style={[styles.speakButton, { backgroundColor: accentLight }]}
                onPress={() => sayMarker(selected)}
                hitSlop={8}
              >
                <IconSymbol size={20} name="volume.3.fill" color={accent} />
              </TouchableOpacity>
            </View>

            <ThemedText style={[styles.phrase, { color: accent }]}>
              {selected.phraseLabel}
            </ThemedText>
            <ThemedText style={styles.phraseEn}>{selected.phraseEn}</ThemedText>

            <View style={styles.factRow}>
              <IconSymbol size={16} name="mappin.and.ellipse" color={accent} />
              <ThemedText style={styles.factText}>{selected.fact}</ThemedText>
            </View>
          </View>
        ) : (
          <View style={[styles.hintCard, { backgroundColor: accentLight }]}>
            <ThemedText style={[styles.hintText, { color: accent }]}>
              👆 Tap any marker on the map to begin.
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  title: { fontWeight: "bold" },
  subtitle: { fontSize: 14, color: "#11181C" },
  toggleRow: { flexDirection: "row", gap: 12 },
  toggle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    ...Shadows.card,
  },
  toggleText: { fontSize: 16, fontWeight: "700", color: "#11181C" },
  segment: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  segmentItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
  },
  segmentText: { fontSize: 13, fontWeight: "700" },
  countrySub: { fontSize: 14, fontWeight: "600", textAlign: "center" },
  mapCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    ...Shadows.card,
  },
  detailCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    gap: 6,
    ...Shadows.card,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailHeading: { flexDirection: "row", alignItems: "baseline", gap: 8, flex: 1 },
  detailCity: { fontSize: 20, fontWeight: "bold", color: "#11181C" },
  detailNative: { fontSize: 15, fontWeight: "700" },
  speakButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  phrase: { fontSize: 18, fontWeight: "700", marginTop: 4 },
  phraseEn: { fontSize: 14, color: "#11181C" },
  factRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    alignItems: "flex-start",
  },
  factText: { flex: 1, fontSize: 13, lineHeight: 18, color: "#11181C" },
  hintCard: {
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  hintText: { fontSize: 14, fontWeight: "600" },
});
