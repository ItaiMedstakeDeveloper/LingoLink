/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const primaryRed = "#7A1212";
const lightRed = "#FCE8E6";
const primaryBlue = "#1A73E8";
const lightBlue = "#E8F0FE";
const primaryGreen = "#2E7D32";
const lightGreen = "#E6F4EA";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: primaryRed,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: primaryRed,
    primaryRed,
    lightRed,
    primaryBlue,
    lightBlue,
    primaryGreen,
    lightGreen,
    cardBorder: "#E5E5E5",
    cardBackground: "#fff",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#FF8A80",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#FF8A80",
    primaryRed: "#FF8A80",
    lightRed: "#6f1818",
    primaryBlue: "#8AB4F8",
    lightBlue: "#1B2A4A",
    primaryGreen: "#81C784",
    lightGreen: "#1C3224",
    cardBorder: "#383A3C",
    cardBackground: "#1E2022",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
