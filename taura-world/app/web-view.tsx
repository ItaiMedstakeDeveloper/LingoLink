import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

/**
 * Full-screen in-app WebView used to view newspapers / video channels without
 * leaving the app. Only a genuine main-frame load failure (no network, blocked
 * cleartext, SSL error) shows the fallback — subresource errors are ignored so
 * pages that load fine aren't replaced by an error screen.
 */
export default function WebViewScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? "light"];

  const { url, title } = useLocalSearchParams<{ url: string; title?: string }>();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  // Reflect the source name in the native header.
  useEffect(() => {
    if (title) {
      navigation.setOptions({ title });
    }
  }, [navigation, title]);

  if (!url) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <ThemedText>No page to display.</ThemedText>
      </View>
    );
  }

  if (failed) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <ThemedText style={styles.failTitle}>
          This page couldn&apos;t be loaded inside the app.
        </ThemedText>
        <ThemedText style={styles.failText}>
          Check your connection, or open it in the in-app browser instead.
        </ThemedText>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: c.primaryBlue }]}
          activeOpacity={0.85}
          onPress={() => openBrowserAsync(url).catch(() => {})}
        >
          <ThemedText style={styles.buttonText}>Open in browser</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.flex, { backgroundColor: c.background }]}>
      <WebView
        source={{ uri: url }}
        originWhitelist={["*"]}
        // Let sites that try window.open (e.g. YouTube) navigate in place.
        setSupportMultipleWindows={false}
        javaScriptEnabled
        domStorageEnabled
        // Allow https pages to pull in any http subresources (Android).
        mixedContentMode="always"
        allowsBackForwardNavigationGestures
        startInLoadingState
        onLoadEnd={() => setLoading(false)}
        // Fires only for main-frame navigation failures (DNS/SSL/cleartext/etc).
        onError={() => {
          setLoading(false);
          setFailed(true);
        }}
        style={styles.flex}
      />
      {loading ? (
        <View style={styles.loading} pointerEvents="none">
          <ActivityIndicator size="large" color={c.primaryBlue} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 10,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  failTitle: { fontSize: 16, fontWeight: "700", textAlign: "center" },
  failText: { fontSize: 14, textAlign: "center", opacity: 0.7 },
  button: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: { color: "#fff", fontWeight: "700" },
});
