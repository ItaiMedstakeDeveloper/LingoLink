import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/lib/auth';

type Story = {
  id: number;
  title: string;
  location: string;
  description: string;
  scene_count: number;
};

export default function DashboardScreen() {
  const db = useSQLiteContext();
  const { user, signOut } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const rows = await db.getAllAsync<Story>(
        `SELECT s.id, s.title, s.location, s.description,
                COUNT(sc.id) AS scene_count
         FROM stories s
         LEFT JOIN story_scenes sc ON sc.story_id = s.id
         GROUP BY s.id
         ORDER BY s.order_index`
      );
      if (active) setStories(rows);
    })();
    return () => {
      active = false;
    };
  }, [db]);

  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <FlatList
        contentContainerStyle={styles.content}
        data={stories}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.flexShrink}>
              <ThemedText type="title">Dashboard</ThemedText>
              <ThemedText style={styles.subtitle}>
                {user ? `Signed in as ${user.email}` : ''}
              </ThemedText>
            </View>
            <TouchableOpacity onPress={signOut} style={styles.signOut}>
              <ThemedText style={styles.signOutText}>Sign out</ThemedText>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={<ThemedText>No stories yet.</ThemedText>}
        renderItem={({ item }) => (
          <ThemedView style={styles.card}>
            <ThemedText type="subtitle">{item.title}</ThemedText>
            <ThemedText style={styles.location}>📍 {item.location}</ThemedText>
            <ThemedText style={styles.description}>{item.description}</ThemedText>
            <ThemedText style={styles.meta}>{item.scene_count} scenes</ThemedText>
          </ThemedView>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  flexShrink: { flexShrink: 1, paddingRight: 12 },
  content: { padding: 20, gap: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subtitle: { opacity: 0.7, marginTop: 2 },
  signOut: {
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  signOutText: { color: '#0a7ea4', fontWeight: '600' },
  card: {
    borderWidth: 1,
    borderColor: '#687076',
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  location: { opacity: 0.8 },
  description: { opacity: 0.9 },
  meta: { opacity: 0.6, marginTop: 4 },
});
