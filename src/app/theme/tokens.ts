export type ThemeMode = "light" | "dark";

const sharedTokens = {
  gold: {
    main: "#D4AF37",
    light: "#FFD700",
    dark: "#B8960C",
  },
  glow: {
    subtle: "rgba(212,175,55,0.3)",
    medium: "rgba(212,175,55,0.5)",
    strong: "rgba(212,175,55,0.8)",
  },
  error: {
    main: "#d4183d",
    light: "#ff4d6a",
    dark: "#a30025",
  },
  green: {
    main: "#2E7D32",
    light: "#4CAF50",
    dark: "#1B5E20",
  },
  common: {
    black: "#000000",
    white: "#ffffff",
  },
} as const;

export const darkTokens = {
  ...sharedTokens,
  gold: {
    ...sharedTokens.gold,
    onLight: "#D4AF37",
  },
  border: {
    faint: "rgba(212,175,55,0.02)",
    subtle: "rgba(212,175,55,0.08)",
    thin: "rgba(212,175,55,0.12)",
    light: "rgba(212,175,55,0.15)",
    default: "rgba(212,175,55,0.2)",
    medium: "rgba(212,175,55,0.3)",
    strong: "rgba(212,175,55,0.4)",
    prominent: "rgba(212,175,55,0.5)",
    intense: "rgba(212,175,55,0.8)",
  },
  surface: {
    overlay: "rgba(0,0,0,0.3)",
    raised: "rgba(0,0,0,0.4)",
    medium: "rgba(0,0,0,0.5)",
    deep: "rgba(0,0,0,0.6)",
    heavy: "rgba(0,0,0,0.7)",
    darker: "rgba(0,0,0,0.8)",
    opaque: "rgba(0,0,0,0.95)",
  },
  background: {
    default: "#0a1f0a",
    paper: "rgba(0,0,0,0.3)",
  },
  text: {
    primary: "#ffffff",
    secondary: "#9ca3af",
    contrast: "#0a1f0a",
    onGold: "#0a1f0a",
    onDark: "#ffffff",
    muted: "rgba(255,255,255,0.5)",
    soft: "rgba(255,255,255,0.7)",
  },
} as const;

export const lightTokens = {
  ...sharedTokens,
  gold: {
    ...sharedTokens.gold,
    onLight: "#9A7D00",
  },
  border: {
    faint: "rgba(0,0,0,0.03)",
    subtle: "rgba(0,0,0,0.06)",
    thin: "rgba(0,0,0,0.1)",
    light: "rgba(0,0,0,0.12)",
    default: "rgba(0,0,0,0.15)",
    medium: "rgba(0,0,0,0.2)",
    strong: "rgba(0,0,0,0.3)",
    prominent: "rgba(0,0,0,0.4)",
    intense: "rgba(0,0,0,0.8)",
  },
  surface: {
    overlay: "rgba(0,0,0,0.06)",
    raised: "rgba(0,0,0,0.08)",
    medium: "rgba(0,0,0,0.1)",
    deep: "rgba(0,0,0,0.12)",
    heavy: "rgba(0,0,0,0.15)",
    darker: "rgba(0,0,0,0.2)",
    opaque: "rgba(0,0,0,0.87)",
  },
  background: {
    default: "#f5f0e8",
    paper: "#ffffff",
  },
  text: {
    primary: "#1a1a1a",
    secondary: "#6b7280",
    contrast: "#0a1f0a",
    onGold: "#0a1f0a",
    onDark: "#ffffff",
    muted: "rgba(0,0,0,0.45)",
    soft: "rgba(0,0,0,0.65)",
  },
} as const;

export function getTokens(mode: ThemeMode) {
  return mode === "light" ? lightTokens : darkTokens;
}
