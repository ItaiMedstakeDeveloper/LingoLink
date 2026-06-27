import { ThemedText } from "@/components/themed-text";
import type { ExploreMap, Marker } from "@/lib/explore";
import { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

type Props = {
  map: ExploreMap;
  /** Accent colour for the outline + selected pin. */
  accent: string;
  /** Light accent used to fill the shape. */
  accentLight: string;
  /** Currently selected marker name (highlighted), if any. */
  selectedName?: string;
  onSelectMarker: (marker: Marker) => void;
};

/**
 * A stylised, tappable map. The outline is drawn in an SVG (0–100 viewBox);
 * markers are absolutely-positioned `View`s on top so they get native touch +
 * labels, scaled to the measured map size.
 */
export function CountryMap({
  map,
  accent,
  accentLight,
  selectedName,
  onSelectMarker,
}: Props) {
  const [size, setSize] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    setSize(e.nativeEvent.layout.width);
  };

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        style={StyleSheet.absoluteFill}
      >
        <Path
          d={map.outline}
          fill={accentLight}
          stroke={accent}
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
        {map.markers.map((m) => (
          <Circle
            key={m.name}
            cx={m.x}
            cy={m.y}
            r={selectedName === m.name ? 2.6 : 1.8}
            fill={accent}
          />
        ))}
      </Svg>

      {/* Tappable markers + labels, positioned over the SVG. */}
      {size > 0 &&
        map.markers.map((m) => {
          const isSelected = selectedName === m.name;
          return (
            <View
              key={m.name}
              style={[
                styles.pin,
                { left: (m.x / 100) * size, top: (m.y / 100) * size },
              ]}
            >
              <View
                style={[
                  styles.label,
                  { borderColor: accent },
                  isSelected && { backgroundColor: accent },
                ]}
                onTouchEnd={() => onSelectMarker(m)}
              >
                <ThemedText
                  style={[
                    styles.labelText,
                    { color: isSelected ? "#fff" : accent },
                  ]}
                >
                  {m.native ? `${m.name} · ${m.native}` : m.name}
                </ThemedText>
              </View>
            </View>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    aspectRatio: 1,
    position: "relative",
  },
  pin: {
    position: "absolute",
    transform: [{ translateX: -1 }, { translateY: -1 }],
  },
  label: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    // Centre the label pill on the marker coordinate.
    transform: [{ translateX: -32 }, { translateY: -10 }],
  },
  labelText: {
    fontSize: 10,
    fontWeight: "700",
  },
});
