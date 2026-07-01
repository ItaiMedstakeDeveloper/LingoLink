import { AuthProvider, useAuth } from "@/lib/auth";
import { DATABASE_NAME, migrateDbIfNeeded } from "@/lib/db";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import "react-native-reanimated";
export const unstable_settings = {
  anchor: "(tabs)",
};
// Keep the native splash screen visible until the app has finished loading.
SplashScreen.preventAutoHideAsync();
// Minimum time (ms) to keep the splash screen visible before the login screen.
const SPLASH_MIN_DURATION = 5000;
function RootNavigator() {
  const { user, isLoading } = useAuth();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    // Hide the native (Android 12 centred-icon) splash right away so our own
    // full-screen splash image below can fill the whole screen instead.
    SplashScreen.hideAsync();
    const timer = setTimeout(
      () => setMinTimeElapsed(true),
      SPLASH_MIN_DURATION,
    );
    return () => clearTimeout(timer);
  }, []);

  const ready = !isLoading && minTimeElapsed;

  if (!ready) {
    // Our own full-screen splash: fills the entire screen (the native splash
    // can only show a small centred icon on Android 12+).
    return (
      <View style={styles.splash}>
        <Image
          source={require("../assets/images/lessons/splash_screen_clean.png")}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      </View>
    );
  }
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="basics"
            options={{ presentation: "modal", title: "Learn the Basics" }}
          />
          <Stack.Screen
            name="word-add"
            options={{ presentation: "modal", title: "Save a Word" }}
          />
          <Stack.Screen
            name="translate"
            options={{ presentation: "modal", title: "Translate" }}
          />
          <Stack.Screen
            name="question-papers"
            options={{ headerShown: true, title: "Question Papers" }}
          />
          <Stack.Screen
            name="question-papers-chinese"
            options={{ headerShown: true, title: "Chinese Papers" }}
          />
          <Stack.Screen
            name="question-papers-french"
            options={{ headerShown: true, title: "French Papers" }}
          />
          <Stack.Screen
            name="view-media"
            options={{ headerShown: true, title: "View Media" }}
          />
          <Stack.Screen
            name="media-type"
            options={{ headerShown: true, title: "View Media" }}
          />
          <Stack.Screen
            name="media-items"
            options={{ headerShown: true, title: "View Media" }}
          />
          <Stack.Screen
            name="web-view"
            options={{ headerShown: true, title: "View Media" }}
          />
          <Stack.Screen
            name="places"
            options={{ headerShown: true, title: "Restaurants & Schools" }}
          />
          <Stack.Screen
            name="place-detail"
            options={{ headerShown: true, title: "Place" }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack.Protected>
        <Stack.Protected guard={!user}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDbIfNeeded}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: "#EAE0CC" },
});
