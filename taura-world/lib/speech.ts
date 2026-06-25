import * as Speech from "expo-speech";

/**
 * Speak `text` in the given BCP 47 language (e.g. "zh-CN", "fr-FR", "en-US").
 * Works on iOS, Android and web. Any in-progress utterance is cancelled first
 * so rapid taps don't queue up. Rate is slightly slowed for learners.
 */
export function speak(text: string, language: string) {
  Speech.stop();
  Speech.speak(text, { language, rate: 0.9 });
}

/** Cancel any in-progress speech. */
export function stopSpeaking() {
  Speech.stop();
}
