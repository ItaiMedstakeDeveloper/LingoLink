import { Linking } from "react-native";

/**
 * Open the device's maps app with turn-by-turn directions to a coordinate.
 * Uses the universal Google Maps URL, which opens the Google Maps app when
 * installed and falls back to the browser / Apple Maps otherwise.
 */
export function openDirections(lat: number, lng: number) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  Linking.openURL(url).catch(() => {});
}

/** Start a phone call. */
export function callPhone(phone: string) {
  Linking.openURL(`tel:${phone.replace(/\s+/g, "")}`).catch(() => {});
}

/** Open a website in the browser. */
export function openWebsite(url: string) {
  Linking.openURL(url).catch(() => {});
}
