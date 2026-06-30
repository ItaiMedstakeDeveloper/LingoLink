import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ComponentProps, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type IconName = ComponentProps<typeof IconSymbol>["name"];

export type SpeedDialAction = {
  icon: IconName;
  label: string;
  /** Background colour of the small action button. */
  color: string;
  onPress: () => void;
};

/**
 * A Material-style "speed dial": a single floating action button that expands
 * to reveal a column of labelled action buttons stacked above it. Tapping the
 * main button (or the dimmed backdrop) toggles it open/closed.
 *
 * Pass `mainLabel` to render the trigger as an extended pill (icon + text) so
 * it reads clearly as a menu of options; omit it for a plain round `+` FAB.
 */
export function SpeedDialFab({
  actions,
  mainLabel,
  mainIcon = "plus",
}: {
  actions: SpeedDialAction[];
  mainLabel?: string;
  mainIcon?: IconName;
}) {
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme ?? "light"];

  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const next = !open;
    setOpen(next);
    Animated.timing(anim, {
      toValue: next ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const close = () => {
    setOpen(false);
    Animated.timing(anim, {
      toValue: 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const runAction = (action: SpeedDialAction) => {
    close();
    action.onPress();
  };

  // Main "+" icon rotates to an "x" while open.
  const rotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const backdropOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.35],
  });

  return (
    <>
      {/* Dimmed backdrop catches taps outside to close the dial. */}
      {open ? (
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
          pointerEvents="auto"
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        </Animated.View>
      ) : null}

      <View style={styles.container} pointerEvents="box-none">
        {/* Action buttons, stacked from the main FAB upwards. */}
        {actions.map((action) => {
          const translateY = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 0],
          });
          return (
            <Animated.View
              key={action.label}
              style={{
                opacity: anim,
                transform: [{ translateY }],
              }}
              pointerEvents={open ? "auto" : "none"}
            >
              {/* The whole row (label chip + icon) is one tappable target. */}
              <TouchableOpacity
                style={styles.actionRow}
                onPress={() => runAction(action)}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.labelChip,
                    { backgroundColor: activeColors.cardBackground },
                  ]}
                >
                  <ThemedText style={styles.labelText}>{action.label}</ThemedText>
                </View>
                <View
                  style={[styles.actionButton, { backgroundColor: action.color }]}
                >
                  <IconSymbol size={22} name={action.icon} color="#fff" />
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* Main toggle button. Extended pill when a label is provided. */}
        <TouchableOpacity
          style={[
            mainLabel ? styles.mainPill : styles.mainFab,
            { backgroundColor: activeColors.tint },
          ]}
          onPress={toggle}
          activeOpacity={0.85}
        >
          <Animated.View
            style={{ transform: [{ rotate: mainLabel ? "0deg" : rotate }] }}
          >
            <IconSymbol
              size={mainLabel ? 22 : 28}
              name={open ? "xmark" : mainIcon}
              color="#fff"
            />
          </Animated.View>
          {mainLabel ? (
            <ThemedText style={styles.mainPillText}>{mainLabel}</ThemedText>
          ) : null}
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  container: {
    position: "absolute",
    right: 24,
    bottom: 24,
    alignItems: "flex-end",
    gap: 14,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  labelChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  labelText: {
    fontSize: 14,
    fontWeight: "600",
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  mainFab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  mainPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    height: 56,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  mainPillText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
