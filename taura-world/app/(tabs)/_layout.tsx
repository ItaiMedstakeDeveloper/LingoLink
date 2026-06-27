import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#11181C",
        tabBarInactiveTintColor: "#9BA1A6",
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Learn",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="book.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: "Flash Cards",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="square.stack.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="words"
        options={{
          title: "My Words",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="bookmark.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: "Me",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="story"
        options={{
          // Hidden from the tab bar — opened from the Learn tab's story path.
          href: null,
        }}
      />
    </Tabs>
  );
}
