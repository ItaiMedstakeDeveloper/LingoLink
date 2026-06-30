import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { SpeedDialFab, type SpeedDialAction } from "@/components/speed-dial-fab";
import { StoryPath } from "@/components/story-path";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function LearnScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme ?? "light"];

  // Tapping a lesson navigates to the Story tab and opens its reader there.
  const handleSelectLesson = (order: number) => {
    router.navigate({
      pathname: "/(tabs)/story",
      params: { lesson: String(order) },
    });
  };

  const quickActions: SpeedDialAction[] = [
    {
      icon: "play.rectangle.fill",
      label: "View media",
      color: activeColors.primaryRed,
      onPress: () => router.push("/view-media"),
    },
    {
      icon: "globe",
      label: "Translate",
      color: activeColors.primaryBlue,
      onPress: () => router.push("/translate"),
    },
  ];

  return (
    <View style={styles.flex}>
      <StoryPath
        onSelectLesson={handleSelectLesson}
        onPressBasics={() => router.push("/basics")}
      />

      <SpeedDialFab
        actions={quickActions}
        mainLabel="Quick actions"
        mainIcon="square.grid.2x2.fill"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
