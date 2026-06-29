/**
 * The app is designed light-first, so we always use the light theme regardless
 * of the device's dark-mode setting. (Return the device value here if you ever
 * want to re-enable automatic dark mode.)
 */
export function useColorScheme(): "light" {
  return "light";
}
