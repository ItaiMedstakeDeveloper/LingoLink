import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Shadows } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { callPhone, openDirections, openWebsite } from "@/lib/directions";
import { getPlace } from "@/lib/places";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlaceDetailScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? "light"];

  const { id } = useLocalSearchParams<{ id: string }>();
  const place = getPlace(id);

  useEffect(() => {
    if (place) navigation.setOptions({ title: place.name });
  }, [navigation, place]);

  if (!place) {
    return (
      <SafeAreaView style={[styles.flex, styles.center]} edges={["bottom"]}>
        <ThemedText>Place not found.</ThemedText>
      </SafeAreaView>
    );
  }

  const isFrench = place.language === "fr";
  const accent = isFrench ? c.primaryBlue : c.primaryRed;
  const accentLight = isFrench ? c.lightBlue : c.lightRed;

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: c.background }]}
      edges={["bottom"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: accentLight }]}>
          <View style={[styles.heroIcon, { backgroundColor: "#fff" }]}>
            <IconSymbol
              size={34}
              name={
                place.category === "school" ? "graduationcap.fill" : "fork.knife"
              }
              color={accent}
            />
          </View>
          <ThemedText type="title" style={styles.name}>
            {place.name}
          </ThemedText>
          {place.nativeName ? (
            <ThemedText style={[styles.native, { color: accent }]}>
              {place.nativeName}
            </ThemedText>
          ) : null}
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: accent }]}>
              <ThemedText style={styles.badgeText}>
                {place.category === "school" ? "School" : "Restaurant"}
              </ThemedText>
            </View>
            {place.category === "restaurant" && place.priceLevel ? (
              <View style={[styles.badge, { backgroundColor: accent }]}>
                <ThemedText style={styles.badgeText}>
                  {"$".repeat(place.priceLevel)}
                </ThemedText>
              </View>
            ) : null}
          </View>
        </View>

        <ThemedText style={styles.blurb}>{place.blurb}</ThemedText>

        {place.tags && place.tags.length > 0 ? (
          <View style={styles.tagRow}>
            {place.tags.map((t) => (
              <View
                key={t}
                style={[styles.tag, { backgroundColor: accentLight }]}
              >
                <ThemedText style={[styles.tagText, { color: accent }]}>
                  {t}
                </ThemedText>
              </View>
            ))}
          </View>
        ) : null}

        {/* Info rows */}
        <View style={[styles.infoCard, { borderColor: c.cardBorder }]}>
          <InfoRow icon="mappin.and.ellipse" accent={accent}>
            {place.address}
            {place.city ? `, ${place.city}` : ""}
          </InfoRow>
          {place.hours ? (
            <InfoRow icon="timer" accent={accent}>
              {place.hours}
            </InfoRow>
          ) : null}
          {place.phone ? (
            <InfoRow icon="phone.fill" accent={accent}>
              {place.phone}
            </InfoRow>
          ) : null}
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: accent }]}
          activeOpacity={0.9}
          onPress={() => openDirections(place.coords.lat, place.coords.lng)}
        >
          <IconSymbol size={20} name="location.fill" color="#fff" />
          <ThemedText style={styles.primaryBtnText}>Get directions</ThemedText>
        </TouchableOpacity>

        <View style={styles.secondaryRow}>
          {place.phone ? (
            <TouchableOpacity
              style={[styles.secondaryBtn, { borderColor: accent }]}
              activeOpacity={0.85}
              onPress={() => callPhone(place.phone!)}
            >
              <IconSymbol size={18} name="phone.fill" color={accent} />
              <ThemedText style={[styles.secondaryText, { color: accent }]}>
                Call
              </ThemedText>
            </TouchableOpacity>
          ) : null}
          {place.website ? (
            <TouchableOpacity
              style={[styles.secondaryBtn, { borderColor: accent }]}
              activeOpacity={0.85}
              onPress={() => openWebsite(place.website!)}
            >
              <IconSymbol size={18} name="globe" color={accent} />
              <ThemedText style={[styles.secondaryText, { color: accent }]}>
                Website
              </ThemedText>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  accent,
  children,
}: {
  icon: Parameters<typeof IconSymbol>[0]["name"];
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.infoRow}>
      <IconSymbol size={18} name={icon} color={accent} />
      <ThemedText style={styles.infoText}>{children}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  hero: {
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    gap: 6,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  name: { fontWeight: "bold", textAlign: "center", color: "#11181C" },
  native: { fontSize: 16, fontWeight: "700" },
  badgeRow: { flexDirection: "row", gap: 8, marginTop: 6 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "800" },
  blurb: { fontSize: 15, lineHeight: 21, color: "#11181C" },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  tagText: { fontSize: 12, fontWeight: "700" },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    ...Shadows.card,
  },
  infoRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  infoText: { flex: 1, fontSize: 14, color: "#11181C", lineHeight: 19 },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 14,
    ...Shadows.card,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  secondaryRow: { flexDirection: "row", gap: 12 },
  secondaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  secondaryText: { fontSize: 15, fontWeight: "700" },
});
