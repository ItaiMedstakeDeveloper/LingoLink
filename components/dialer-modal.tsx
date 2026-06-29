/**
 * DialerModal — full in-app calling experience.
 *
 * Three phases, all inside the app:
 *   1. "dialer"   — keypad + phone number display, tap Call to proceed
 *   2. "calling"  — full-screen overlay with pulsing rings, "Calling…"
 *   3. "connected"— live call timer, mute / speaker / keypad / hang-up controls
 *
 * No Linking, no system phone app, no navigation away.
 */

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/* ─── constants ─────────────────────────────────────────────────────────── */

const { width: W, height: H } = Dimensions.get("window");

const KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "#"],
];

const KEY_LABELS: Record<string, string> = {
  "2": "ABC",  "3": "DEF",
  "4": "GHI",  "5": "JKL",  "6": "MNO",
  "7": "PQRS", "8": "TUV",  "9": "WXYZ",
};

type CallPhase = "dialer" | "calling" | "connected";

/* ─── props ──────────────────────────────────────────────────────────────── */

interface DialerModalProps {
  visible: boolean;
  phone: string;
  name?: string;
  accent?: string;
  onClose: () => void;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main component
═══════════════════════════════════════════════════════════════════════════ */

export function DialerModal({
  visible,
  phone,
  name,
  accent,
  onClose,
}: DialerModalProps) {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? "light"];
  const dialAccent = accent ?? c.primaryRed;
  const isDark = colorScheme === "dark";

  /* colours */
  const bg        = isDark ? "#0A0A0F" : "#F8F9FC";
  const cardBg    = isDark ? "#1A1C22" : "#FFFFFF";
  const keyBg     = isDark ? "#252830" : "#F0F2F6";
  const keyText   = isDark ? "#ECEDEE" : "#11181C";
  const labelText = isDark ? "#9BA1A6" : "#687076";
  const mainText  = isDark ? "#FFFFFF" : "#11181C";

  /* phase state */
  const [phase, setPhase] = useState<CallPhase>("dialer");
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);

  /* call timer */
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* animations */
  const fadeIn    = useRef(new Animated.Value(0)).current;
  const pulse1    = useRef(new Animated.Value(1)).current;
  const pulse2    = useRef(new Animated.Value(1)).current;
  const pulse3    = useRef(new Animated.Value(1)).current;
  const avatarScale = useRef(new Animated.Value(0.8)).current;

  /* ── reset on open/close ── */
  useEffect(() => {
    if (visible) {
      setPhase("dialer");
      setMuted(false);
      setSpeaker(false);
      setShowKeypad(false);
      setSeconds(0);
      Animated.timing(fadeIn, {
        toValue: 1, duration: 280, useNativeDriver: true,
      }).start();
    } else {
      fadeIn.setValue(0);
      stopTimer();
      stopPulse();
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── timer ── */
  function startTimer() {
    setSeconds(0);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }
  function stopTimer() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }

  /* ── pulse rings ── */
  function startPulse() {
    const ring = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 2.2, duration: 1400,
            easing: Easing.out(Easing.quad), useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1, duration: 0, useNativeDriver: true,
          }),
        ])
      ).start();
    ring(pulse1, 0);
    ring(pulse2, 460);
    ring(pulse3, 920);

    Animated.spring(avatarScale, {
      toValue: 1, friction: 5, tension: 60, useNativeDriver: true,
    }).start();
  }
  function stopPulse() {
    pulse1.stopAnimation(); pulse1.setValue(1);
    pulse2.stopAnimation(); pulse2.setValue(1);
    pulse3.stopAnimation(); pulse3.setValue(1);
    avatarScale.setValue(0.8);
  }

  /* ── phase transitions ── */
  function handleCallPress() {
    setPhase("calling");
    startPulse();
    // simulate the other side picking up after ~3 s
    setTimeout(() => {
      stopPulse();
      setPhase("connected");
      startTimer();
    }, 3000);
  }

  function handleHangUp() {
    stopTimer();
    stopPulse();
    setPhase("dialer");
    onClose();
  }

  /* ── timer label ── */
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  /* ──────────────────────────────────────────────────────────────────────── */

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleHangUp}
    >
      <Animated.View style={[styles.root, { backgroundColor: bg, opacity: fadeIn }]}>

        {/* ══════ DIALER phase ══════ */}
        {phase === "dialer" && (
          <View style={styles.dialerWrap}>
            {/* Header */}
            <View style={styles.dialerHeader}>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
                <Ionicons name="chevron-down" size={26} color={labelText} />
              </TouchableOpacity>
              <Text style={[styles.dialerTitle, { color: mainText }]}>Call</Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Contact */}
            <View style={styles.dialerContact}>
              <View style={[styles.bigAvatar, { backgroundColor: dialAccent + "22" }]}>
                <Text style={[styles.bigAvatarLetter, { color: dialAccent }]}>
                  {(name ?? phone)[0]?.toUpperCase()}
                </Text>
              </View>
              {name ? (
                <Text style={[styles.dialerName, { color: mainText }]} numberOfLines={1}>
                  {name}
                </Text>
              ) : null}
              <Text style={[styles.dialerNumber, { color: labelText }]}>{phone}</Text>
            </View>

            {/* Keypad */}
            <View style={[styles.keypadCard, { backgroundColor: cardBg }]}>
              {KEYS.map((row, ri) => (
                <View key={ri} style={styles.keyRow}>
                  {row.map((k) => (
                    <TouchableOpacity
                      key={k}
                      style={[styles.key, { backgroundColor: keyBg }]}
                      activeOpacity={0.6}
                    >
                      <Text style={[styles.keyMain, { color: keyText }]}>{k}</Text>
                      {KEY_LABELS[k] ? (
                        <Text style={[styles.keySub, { color: labelText }]}>
                          {KEY_LABELS[k]}
                        </Text>
                      ) : null}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>

            {/* Call button */}
            <View style={styles.dialerActions}>
              <View style={{ width: 56 }} />
              <TouchableOpacity
                style={[styles.greenBtn, { shadowColor: "#22C55E" }]}
                activeOpacity={0.85}
                onPress={handleCallPress}
              >
                <FontAwesome name="phone" size={30} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.ghostBtn, { backgroundColor: keyBg }]}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={labelText} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ══════ CALLING phase ══════ */}
        {phase === "calling" && (
          <View style={[styles.callScreen, { backgroundColor: dialAccent }]}>
            {/* Pulse rings */}
            {[pulse1, pulse2, pulse3].map((anim, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.pulseRing,
                  { transform: [{ scale: anim }], opacity: anim.interpolate({
                      inputRange: [1, 2.2],
                      outputRange: [0.35, 0],
                    }),
                  },
                ]}
              />
            ))}

            {/* Avatar */}
            <Animated.View
              style={[
                styles.callingAvatar,
                { transform: [{ scale: avatarScale }] },
              ]}
            >
              <Text style={styles.callingAvatarLetter}>
                {(name ?? phone)[0]?.toUpperCase()}
              </Text>
            </Animated.View>

            <Text style={styles.callingName} numberOfLines={1}>
              {name ?? phone}
            </Text>
            <Text style={styles.callingStatus}>Calling…</Text>

            {/* Hang up */}
            <TouchableOpacity
              style={styles.redBtn}
              activeOpacity={0.85}
              onPress={handleHangUp}
            >
              <FontAwesome name="phone" size={30} color="#fff" style={{ transform: [{ rotate: "135deg" }] }} />
            </TouchableOpacity>
          </View>
        )}

        {/* ══════ CONNECTED phase ══════ */}
        {phase === "connected" && (
          <View style={[styles.callScreen, { backgroundColor: isDark ? "#0D1117" : "#0F172A" }]}>
            {/* Contact info */}
            <View style={styles.connectedTop}>
              <View style={[styles.connectedAvatar, { backgroundColor: dialAccent }]}>
                <Text style={styles.callingAvatarLetter}>
                  {(name ?? phone)[0]?.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.connectedName} numberOfLines={1}>
                {name ?? phone}
              </Text>
              <Text style={styles.connectedNumber}>{phone}</Text>
              <Text style={styles.connectedTimer}>{mm}:{ss}</Text>
            </View>

            {/* In-call controls grid */}
            <View style={styles.controlsGrid}>
              <CallControl
                icon={muted ? "mic-off" : "mic"}
                iconLib="MaterialIcons"
                label={muted ? "Unmute" : "Mute"}
                active={muted}
                onPress={() => setMuted((v) => !v)}
              />
              <CallControl
                icon={speaker ? "volume-up" : "volume-off"}
                iconLib="MaterialIcons"
                label="Speaker"
                active={speaker}
                onPress={() => setSpeaker((v) => !v)}
              />
              <CallControl
                icon="dialpad"
                iconLib="MaterialIcons"
                label="Keypad"
                active={showKeypad}
                onPress={() => setShowKeypad((v) => !v)}
              />
              <CallControl
                icon="add-call"
                iconLib="MaterialIcons"
                label="Add call"
                active={false}
                onPress={() => {}}
              />
            </View>

            {/* In-call keypad overlay */}
            {showKeypad && (
              <View style={[styles.inCallKeypad, { backgroundColor: "rgba(0,0,0,0.55)" }]}>
                {KEYS.map((row, ri) => (
                  <View key={ri} style={styles.keyRow}>
                    {row.map((k) => (
                      <TouchableOpacity
                        key={k}
                        style={styles.inCallKey}
                        activeOpacity={0.6}
                      >
                        <Text style={styles.inCallKeyMain}>{k}</Text>
                        {KEY_LABELS[k] ? (
                          <Text style={styles.inCallKeySub}>{KEY_LABELS[k]}</Text>
                        ) : null}
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* Hang up */}
            <TouchableOpacity
              style={[styles.redBtn, { marginTop: 24 }]}
              activeOpacity={0.85}
              onPress={handleHangUp}
            >
              <FontAwesome
                name="phone"
                size={30}
                color="#fff"
                style={{ transform: [{ rotate: "135deg" }] }}
              />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </Modal>
  );
}

/* ─── CallControl helper ─────────────────────────────────────────────────── */

function CallControl({
  icon,
  iconLib,
  label,
  active,
  onPress,
}: {
  icon: string;
  iconLib: "MaterialIcons" | "Ionicons";
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const Lib = iconLib === "MaterialIcons" ? MaterialIcons : Ionicons;
  return (
    <TouchableOpacity style={styles.controlBtn} activeOpacity={0.75} onPress={onPress}>
      <View style={[styles.controlIcon, active && styles.controlIconActive]}>
        {/* @ts-ignore – icon name is dynamic */}
        <Lib name={icon} size={26} color={active ? "#fff" : "rgba(255,255,255,0.85)"} />
      </View>
      <Text style={styles.controlLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ─── styles ─────────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  root: { flex: 1 },

  /* ── dialer ── */
  dialerWrap: { flex: 1, paddingTop: 52 },
  dialerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  closeBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  dialerTitle: { fontSize: 17, fontWeight: "700" },
  dialerContact: { alignItems: "center", paddingVertical: 20, gap: 6 },
  bigAvatar: {
    width: 80, height: 80, borderRadius: 40,
    justifyContent: "center", alignItems: "center", marginBottom: 6,
  },
  bigAvatarLetter: { fontSize: 34, fontWeight: "700" },
  dialerName: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  dialerNumber: { fontSize: 15, fontWeight: "400", letterSpacing: 1 },
  keypadCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  keyRow: { flexDirection: "row", gap: 10 },
  key: { flex: 1, height: 60, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  keyMain: { fontSize: 22, fontWeight: "400" },
  keySub: { fontSize: 9, fontWeight: "600", letterSpacing: 1, marginTop: 1 },
  dialerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 48,
    paddingTop: 24,
  },
  greenBtn: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: "#22C55E",
    justifyContent: "center", alignItems: "center",
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.45, shadowRadius: 16, elevation: 10,
  },
  ghostBtn: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: "center", alignItems: "center",
  },

  /* ── call screen (calling + connected) ── */
  callScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
  },
  pulseRing: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  callingAvatar: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center", alignItems: "center",
    marginBottom: 20,
  },
  callingAvatarLetter: { fontSize: 48, fontWeight: "700", color: "#fff" },
  callingName: {
    fontSize: 28, fontWeight: "700", color: "#fff",
    textAlign: "center", marginBottom: 6,
    paddingHorizontal: 24,
  },
  callingStatus: { fontSize: 16, color: "rgba(255,255,255,0.75)", marginBottom: 56 },

  /* ── connected ── */
  connectedTop: { alignItems: "center", marginBottom: 36, gap: 6 },
  connectedAvatar: {
    width: 96, height: 96, borderRadius: 48,
    justifyContent: "center", alignItems: "center", marginBottom: 8,
  },
  connectedName: { fontSize: 26, fontWeight: "700", color: "#fff", textAlign: "center", paddingHorizontal: 24 },
  connectedNumber: { fontSize: 14, color: "rgba(255,255,255,0.6)" },
  connectedTimer: { fontSize: 22, fontWeight: "300", color: "#fff", letterSpacing: 3, marginTop: 4 },
  controlsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 20,
    width: W,
  },
  controlBtn: { width: (W - 100) / 2, alignItems: "center", gap: 8 },
  controlIcon: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center", alignItems: "center",
  },
  controlIconActive: { backgroundColor: "rgba(255,255,255,0.4)" },
  controlLabel: { fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: "600" },

  /* in-call keypad */
  inCallKeypad: {
    position: "absolute",
    bottom: 120,
    left: 20, right: 20,
    borderRadius: 20,
    padding: 16,
    gap: 10,
  },
  inCallKey: { flex: 1, height: 56, borderRadius: 12, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255,255,255,0.12)" },
  inCallKeyMain: { fontSize: 20, fontWeight: "400", color: "#fff" },
  inCallKeySub: { fontSize: 8, fontWeight: "600", color: "rgba(255,255,255,0.6)", letterSpacing: 1 },

  /* hang-up */
  redBtn: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: "#EF4444",
    justifyContent: "center", alignItems: "center",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 10,
    marginTop: 12,
  },
});
