export const colors = {
  gold: {
    main: "#D4AF37",
    light: "#FFD700",
    dark: "#B8960C",
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
  glow: {
    subtle: "rgba(212,175,55,0.3)",
    medium: "rgba(212,175,55,0.5)",
    strong: "rgba(212,175,55,0.8)",
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
    whiteMuted: "rgba(255,255,255,0.5)",
    whiteSoft: "rgba(255,255,255,0.7)",
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
