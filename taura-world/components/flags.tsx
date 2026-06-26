import { StyleSheet, Text, View } from "react-native";

/**
 * Lightweight, dependency-free flag graphics drawn with Views/Text so they
 * render identically on iOS and Android (Android does not display the regional
 * indicator flag emojis). Each flag keeps a 3:2 aspect ratio.
 */

type FlagProps = {
  /** Flag width in px. Height is derived as width * 2 / 3. */
  size?: number;
};

export function FranceFlag({ size = 60 }: FlagProps) {
  const height = (size * 2) / 3;
  return (
    <View style={[styles.flag, { width: size, height }]}>
      <View style={[styles.stripe, { backgroundColor: "#0055A4" }]} />
      <View style={[styles.stripe, { backgroundColor: "#FFFFFF" }]} />
      <View style={[styles.stripe, { backgroundColor: "#EF4135" }]} />
    </View>
  );
}

export function ChinaFlag({ size = 60 }: FlagProps) {
  const height = (size * 2) / 3;
  // Canonical flag is 30 wide x 20 tall; scale every coordinate by `s`.
  const s = size / 30;
  const star = (key: string, left: number, top: number, fontSize: number) => (
    <Text
      key={key}
      style={[styles.star, { left: left * s, top: top * s, fontSize: fontSize * s }]}
    >
      ★
    </Text>
  );
  return (
    <View
      style={[styles.flag, styles.chinaFlag, { width: size, height }]}
    >
      {star("big", 2, 1, 9)}
      {star("s1", 9.5, 1, 3.2)}
      {star("s2", 11.5, 3, 3.2)}
      {star("s3", 11.5, 6, 3.2)}
      {star("s4", 9.5, 8, 3.2)}
    </View>
  );
}

const styles = StyleSheet.create({
  flag: {
    flexDirection: "row",
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.1)",
  },
  stripe: {
    flex: 1,
    height: "100%",
  },
  chinaFlag: {
    backgroundColor: "#DE2910",
  },
  star: {
    position: "absolute",
    color: "#FFDE00",
    lineHeight: undefined,
  },
});
