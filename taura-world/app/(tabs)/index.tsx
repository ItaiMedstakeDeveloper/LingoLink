import { useRouter } from "expo-router";

import { StoryPath } from "@/components/story-path";

export default function LearnScreen() {
  const router = useRouter();

  // Tapping a lesson navigates to the Story tab and opens its reader there.
  const handleSelectLesson = (order: number) => {
    router.navigate({
      pathname: "/(tabs)/story",
      params: { lesson: String(order) },
    });
  };

  return (
    <StoryPath
      onSelectLesson={handleSelectLesson}
      onPressBasics={() => router.push("/basics")}
    />
  );
}
