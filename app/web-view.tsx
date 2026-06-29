import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "@/lib/auth";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

/** Turn an email into a friendly login name: "itai.neil@x.com" → "Itai Neil". */
function displayNameFromEmail(email?: string): string {
  const local = (email ?? "").split("@")[0] ?? "";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

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
  const { user } = useAuth();
  const { url, title } = useLocalSearchParams<{
    url: string;
    title?: string;
  }>();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const name = useMemo(() => displayNameFromEmail(user?.email), [user?.email]);

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
        <View
          style={[styles.loading, { backgroundColor: c.background }]}
          pointerEvents="none"
        >
          <ActivityIndicator size="large" color={c.primaryBlue} />
          <ThemedText style={styles.loadingTitle}>
            {name ? `Please wait, ${name}` : "Please wait"}
          </ThemedText>
          <ThemedText style={styles.loadingSub}>
            whilst we load {title ?? "the page"}…
          </ThemedText>
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
    padding: 24,
    gap: 6,
  },
  loadingTitle: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  loadingSub: { fontSize: 14, textAlign: "center", opacity: 0.7 },
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
