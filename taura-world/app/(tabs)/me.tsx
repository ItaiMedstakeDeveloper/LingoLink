import { useIsFocused } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Shadows } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "@/lib/auth";

export default function MeScreen() {
  const db = useSQLiteContext();
  const isFocused = useIsFocused();
  const { user, signOut } = useAuth();
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme ?? "light"];

  const [stats, setStats] = useState({
    masteredCount: 0,
    totalCount: 0,
    storiesCount: 1, // Static or dynamic based on seed
  });

  // Fetch stats when tab is focused
  useEffect(() => {
    if (!isFocused) return;

    let active = true;
    async function fetchStats() {
      try {
        const masteredResult = await db.getFirstAsync<{ count: number }>(
          `SELECT COUNT(*) as count FROM vocabulary WHERE mastered = 1`,
        );
        const totalResult = await db.getFirstAsync<{ count: number }>(
          `SELECT COUNT(*) as count FROM vocabulary`,
        );

        if (active) {
          setStats({
            masteredCount: masteredResult?.count ?? 0,
            totalCount: totalResult?.count ?? 0,
            storiesCount: 1, // We have 1 seeded story
          });
        }
      } catch (err) {
        console.error("Error fetching profile stats:", err);
      }
    }

    fetchStats();
    return () => {
      active = false;
    };
  }, [db, isFocused]);

  const progressPercentage =
    stats.totalCount > 0
      ? Math.round((stats.masteredCount / stats.totalCount) * 100)
      : 0;

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: activeColors.background }]}
      edges={["top"]}
    >
      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View
            style={[styles.avatar, { backgroundColor: activeColors.lightRed }]}
          >
            <IconSymbol
              size={40}
              name="person.fill"
              color={activeColors.primaryRed}
            />
          </View>
          <ThemedText type="title" style={styles.title}>
            My Progress
          </ThemedText>
          <ThemedText style={styles.email}>{user?.email}</ThemedText>
        </View>

        {/* Dynamic Stats Grid */}
        <View style={styles.statsContainer}>
          <ThemedText style={styles.sectionTitle}>STATISTICS</ThemedText>
          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statCard,
                {
                  borderColor: activeColors.cardBorder,
                  backgroundColor: "#fff",
                },
              ]}
            >
              <ThemedText
                style={[styles.statValue, { color: activeColors.primaryRed }]}
              >
                {stats.masteredCount}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Words Mastered</ThemedText>
            </View>

            <View
              style={[
                styles.statCard,
                {
                  borderColor: activeColors.cardBorder,
                  backgroundColor: "#fff",
                },
              ]}
            >
              <ThemedText
                style={[styles.statValue, { color: activeColors.primaryBlue }]}
              >
                {progressPercentage}%
              </ThemedText>
              <ThemedText style={styles.statLabel}>
                Vocabulary Complete
              </ThemedText>
            </View>

            <View
              style={[
                styles.statCard,
                {
                  borderColor: activeColors.cardBorder,
                  backgroundColor: "#fff",
                },
              ]}
            >
              <ThemedText
                style={[styles.statValue, { color: activeColors.primaryGreen }]}
              >
                {stats.storiesCount}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Stories Read</ThemedText>
            </View>
          </View>
        </View>

        {/* Current Learning Tracks */}
        <View style={styles.tracksContainer}>
          <ThemedText style={styles.sectionTitle}>LEARNING TRACKS</ThemedText>

          <View
            style={[
              styles.trackItem,
              { borderColor: activeColors.cardBorder, backgroundColor: "#fff" },
            ]}
          >
            <View
              style={[
                styles.trackBadge,
                { backgroundColor: activeColors.lightRed },
              ]}
            >
              <ThemedText
                style={[
                  styles.trackBadgeText,
                  { color: activeColors.primaryRed },
                ]}
              >
                ZH
              </ThemedText>
            </View>
            <View style={styles.trackInfo}>
              <ThemedText style={styles.trackTitle}>
                Chinese (Mandarin)
              </ThemedText>
              <ThemedText style={styles.trackSub}>
                Focus: Harare Street Talk
              </ThemedText>
            </View>
            <IconSymbol
              size={18}
              name="checkmark"
              color={activeColors.primaryGreen}
            />
          </View>

          <View
            style={[
              styles.trackItem,
              { borderColor: activeColors.cardBorder, backgroundColor: "#fff" },
            ]}
          >
            <View
              style={[
                styles.trackBadge,
                { backgroundColor: activeColors.lightBlue },
              ]}
            >
              <ThemedText
                style={[
                  styles.trackBadgeText,
                  { color: activeColors.primaryBlue },
                ]}
              >
                FR
              </ThemedText>
            </View>
            <View style={styles.trackInfo}>
              <ThemedText style={styles.trackTitle}>French</ThemedText>
              <ThemedText style={styles.trackSub}>
                Focus: Daily Conversations
              </ThemedText>
            </View>
            <IconSymbol
              size={18}
              name="checkmark"
              color={activeColors.primaryGreen}
            />
          </View>
        </View>

        {/* Settings & Sign out */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.buttonSignOut,
              { backgroundColor: activeColors.primaryRed },
            ]}
            onPress={signOut}
          >
            <ThemedText style={styles.buttonSignOutText}>Sign Out</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    justifyContent: "space-between",
    paddingBottom: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  statsContainer: {
    marginVertical: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    opacity: 0.5,
    letterSpacing: 1,
    marginBottom: 4,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    gap: 4,
    ...Shadows.card,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 10,
    textAlign: "center",
    opacity: 0.6,
    fontWeight: "600",
    color: "black",
  },
  tracksContainer: {
    marginVertical: 12,
    gap: 8,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 12,
    ...Shadows.card,
  },
  trackBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  trackBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
  },
  trackSub: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 1,
    color: "black",
  },
  actionsContainer: {
    marginTop: 20,
  },
  buttonSignOut: {
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSignOutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
