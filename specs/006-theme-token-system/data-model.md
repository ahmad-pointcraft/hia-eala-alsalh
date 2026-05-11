# Data Model: Centralized Theme Token System

**Date**: 2026-05-11 | **Branch**: `006-theme-token-system`

## Entity: Color Tokens (`tokens.ts`)

A single exported `colors` object typed `as const` containing all color constants organized by semantic namespace.

### Structure

```
colors (as const)
├── gold
│   ├── main: "#D4AF37"
│   ├── light: "#FFD700"
│   └── dark: "#B8960C"
├── border
│   ├── faint: "rgba(212,175,55,0.02)"
│   ├── subtle: "rgba(212,175,55,0.08)"
│   ├── thin: "rgba(212,175,55,0.12)"
│   ├── light: "rgba(212,175,55,0.15)"
│   ├── default: "rgba(212,175,55,0.2)"
│   ├── medium: "rgba(212,175,55,0.3)"
│   ├── strong: "rgba(212,175,55,0.4)"
│   ├── prominent: "rgba(212,175,55,0.5)"
│   └── intense: "rgba(212,175,55,0.8)"
├── surface
│   ├── overlay: "rgba(0,0,0,0.3)"
│   ├── raised: "rgba(0,0,0,0.4)"
│   ├── medium: "rgba(0,0,0,0.5)"
│   ├── deep: "rgba(0,0,0,0.6)"
│   ├── heavy: "rgba(0,0,0,0.7)"
│   ├── darker: "rgba(0,0,0,0.8)"
│   └── opaque: "rgba(0,0,0,0.95)"
├── glow
│   ├── subtle: "rgba(212,175,55,0.3)"
│   ├── medium: "rgba(212,175,55,0.5)"
│   └── strong: "rgba(212,175,55,0.8)"
├── background
│   ├── default: "#0a1f0a"
│   └── paper: "rgba(0,0,0,0.3)"
├── text
│   ├── primary: "#ffffff"
│   ├── secondary: "#9ca3af"
│   ├── contrast: "#0a1f0a"
│   ├── onGold: "#0a1f0a"
│   ├── onDark: "#ffffff"
│   ├── whiteMuted: "rgba(255,255,255,0.5)"
│   └── whiteSoft: "rgba(255,255,255,0.7)"
├── error
│   ├── main: "#d4183d"
│   ├── light: "#ff4d6a"
│   └── dark: "#a30025"
├── green
│   ├── main: "#2E7D32"
│   ├── light: "#4CAF50"
│   └── dark: "#1B5E20"
└── common
    ├── black: "#000000"
    └── white: "#ffffff"
```

### Validation Rules

- Every value is a string literal (hex or rgba format)
- No two tokens share the same key name within a namespace
- Every hardcoded color found in the codebase audit maps to exactly one token
- The `as const` assertion ensures TypeScript infers literal types

## Entity: Extended Palette (`muiTheme.ts` module augmentation)

MUI Palette interface extended with four new namespaces, each mapping to the corresponding `colors` sub-object.

### Palette Augmentation Structure

```typescript
declare module "@mui/material/styles" {
  interface Palette {
    gold: { main: string; light: string; dark: string };
    surface: { overlay: string; raised: string; medium: string; deep: string; heavy: string; darker: string; opaque: string };
    border: { faint: string; subtle: string; thin: string; light: string; default: string; medium: string; strong: string; prominent: string; intense: string };
    glow: { subtle: string; medium: string; strong: string };
    text: { whiteMuted: string; whiteSoft: string };
  }
  interface PaletteOptions {
    gold?: { main: string; light: string; dark: string };
    surface?: { overlay: string; raised: string; medium: string; deep: string; heavy: string; darker: string; opaque: string };
    border?: { faint: string; subtle: string; thin: string; light: string; default: string; medium: string; strong: string; prominent: string; intense: string };
    glow?: { subtle: string; medium: string; strong: string };
    text?: { whiteMuted: string; whiteSoft: string };
  }
}
```

### Assignment Pattern

```typescript
muiTheme.palette.gold = colors.gold;
muiTheme.palette.surface = colors.surface;
muiTheme.palette.border = colors.border;
muiTheme.palette.glow = colors.glow;
muiTheme.palette.text = { ...muiTheme.palette.text, whiteMuted: colors.text.whiteMuted, whiteSoft: colors.text.whiteSoft };
```

## Entity: Component Migration Mapping

Each component maps to a migration strategy based on its color usage patterns.

| Component | Strategy | Token Contexts | Est. Replacements |
|-----------|----------|---------------|-------------------|
| Header.tsx | sx palette refs | rgba(0,0,0,.*), rgba(212,175,55,.*) | ~10 |
| EventModeDisplay.tsx | Mixed: sx + token imports | rgba, hex, gradient strings, framer-motion | ~20 |
| FundraisingOverlay.tsx | Mixed: sx + token imports | rgba, hex, gradient strings | ~10 |
| IslamicGeometricOverlay.tsx | Token imports only | SVG strokes, inline styles, gradient strings | ~14 |
| PrayerCard.tsx | sx palette refs | rgba(212,175,55,.*), rgba(0,0,0,.*) | ~5 |
| AnnouncementsTicker.tsx | Mixed: sx + token imports | rgba, CSS keyword "black" (icon) | ~4 |
| CountdownBar.tsx | sx palette refs | rgba(212,175,55,0.3) | ~1 |
| HadithPanel.tsx | sx palette refs | rgba(212,175,55,0.3) | ~1 |
| WeatherWidget.tsx | sx palette refs | rgba(212,175,55,0.3) | ~1 |
| ImageCarousel.tsx | sx palette refs | rgba(0,0,0,.*), rgba(255,255,255,.*) | ~6 |
| App.tsx | Remove duplicate | backgroundImage pattern | Remove 4 lines |
