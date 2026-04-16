import { interpolateColors } from "remotion";

// Light palette (from real app)
const LIGHT = {
  bg: "#eef2f5",
  panelBg: "rgba(255, 255, 255, 0.85)",
  panelBorder: "rgba(255, 255, 255, 0.6)",
  panelShadowInset: "rgba(255, 255, 255, 1)",
  text: "#4b5563",
  textMuted: "#9ca3af",
  textFaint: "#d1d5db",
  timer: "#9ca3af",
  timerActive: "#4b5563",
  accent: "#0891b2",
  accentLight: "rgba(207, 250, 254, 0.5)",
  accentBorder: "#67e8f9",
  controlBorder: "#e5e7eb",
  checkboxBorder: "#d1d5db",
  inputBg: "rgba(243, 244, 246, 0.5)",
  musicBg: "#ffffff",
  musicBorder: "#d1d5db",
};

const DARK = {
  bg: "#000000",
  panelBg: "rgba(10, 10, 10, 0.85)",
  panelBorder: "rgba(255, 255, 255, 0.15)",
  panelShadowInset: "rgba(255, 255, 255, 0.05)",
  text: "#e5e7eb",
  textMuted: "#6b7280",
  textFaint: "#374151",
  timer: "#6b7280",
  timerActive: "#e5e7eb",
  accent: "#22d3ee",
  accentLight: "rgba(6, 182, 212, 0.2)",
  accentBorder: "#0891b2",
  controlBorder: "#374151",
  checkboxBorder: "#4b5563",
  inputBg: "rgba(55, 65, 81, 0.5)",
  musicBg: "#171717",
  musicBorder: "#525252",
};

export type ThemeColors = typeof LIGHT;

export function getColors(progress: number): ThemeColors {
  const i = (lightVal: string, darkVal: string) =>
    interpolateColors(progress, [0, 1], [lightVal, darkVal]);

  return {
    bg: i(LIGHT.bg, DARK.bg),
    panelBg: i(LIGHT.panelBg, DARK.panelBg),
    panelBorder: i(LIGHT.panelBorder, DARK.panelBorder),
    panelShadowInset: i(LIGHT.panelShadowInset, DARK.panelShadowInset),
    text: i(LIGHT.text, DARK.text),
    textMuted: i(LIGHT.textMuted, DARK.textMuted),
    textFaint: i(LIGHT.textFaint, DARK.textFaint),
    timer: i(LIGHT.timer, DARK.timer),
    timerActive: i(LIGHT.timerActive, DARK.timerActive),
    accent: i(LIGHT.accent, DARK.accent),
    accentLight: i(LIGHT.accentLight, DARK.accentLight),
    accentBorder: i(LIGHT.accentBorder, DARK.accentBorder),
    controlBorder: i(LIGHT.controlBorder, DARK.controlBorder),
    checkboxBorder: i(LIGHT.checkboxBorder, DARK.checkboxBorder),
    inputBg: i(LIGHT.inputBg, DARK.inputBg),
    musicBg: i(LIGHT.musicBg, DARK.musicBg),
    musicBorder: i(LIGHT.musicBorder, DARK.musicBorder),
  };
}
