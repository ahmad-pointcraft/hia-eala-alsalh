# Hayya 'Ala Al-Salah — Masjid Prayer Time Display

A 24/7 kiosk display application for mosques, showing prayer times with Iqama, live countdown, Hijri & Gregorian dates, sunrise/sunset, hadith of the day, event slideshow, announcements ticker, and fundraising overlay. Designed to run on a Chromium-based browser in fullscreen kiosk mode.

> **Stack:** React 18 · TypeScript (strict) · MUI v7 · Zustand 5 · Vite · Yarn
> **Design:** [Figma](https://www.figma.com/design/VFg4zYgOYshrC1eyoxlNwQ/Masjid-Prayer-Time-Display)

---

## Features

- **Prayer Time Cards** — All five daily prayers with Adhan & Iqama times, active prayer highlighting, and per-prayer icons (Sunrise, Sun, Moon, etc.)
- **Live Countdown** — Real-time countdown (HH:MM:SS) to the next prayer with accessibility announcements
- **Hijri & Gregorian Dates** — Dual calendar display with Arabic numeral conversion in the header
- **Sunrise & Sunset Widget** — Dedicated widget showing sunrise and sunset times with icons
- **Hadith of the Day** — Rotating hadith/verse display with source attribution
- **Event Slideshow** — Auto-rotating event cards with mosque background images, speaker info, date/time, location badge, and CTA buttons
- **Announcements Ticker** — RTL-aware scrolling ticker with masjid and PointCraft logos
- **Fundraising Overlay** — Donation progress overlay with collected/goal/donors stats, progress bar, QR code placeholder, auto-close countdown, and focus trap
- **Prayer-in-Progress Overlay** — Dimmed overlay with animated Islamic geometric pattern during prayer time (5 min after Iqama)
- **Dark & Light Themes** — Full dual-theme system with toggle (persisted to localStorage), custom tokens for gold, surface, border, glow, and text levels
- **RTL Bilingual** — Full Arabic (RTL) and English (LTR) support with Zustand-persisted language store
- **Network Status** — Offline/online detection with visual indicator in the header
- **Error Boundary** — Auto-recovery with up to 3 retries (5 s delay), bilingual error UI, manual reload fallback
- **Service Worker** — Offline caching for static assets (JS, CSS, images, fonts)
- **Responsive Design** — Breakpoints: xs (0), sm (640), md (1024), lg (1920), xl (2560)
- **Reduced Motion** — Respects `prefers-reduced-motion` for all animations and transitions

---

## Quick Start

### Prerequisites

- **Node.js** 18+ (with Corepack enabled)
- **Yarn** 4+ (via Corepack)

### Setup

```bash
corepack enable
corepack prepare yarn@stable --activate
yarn install
yarn dev
```

### Scripts

| Command          | Description                          |
| ---------------- | ------------------------------------ |
| `yarn dev`       | Start Vite dev server                |
| `yarn build`     | Production build to `dist/`          |
| `yarn preview`   | Preview production build locally     |
| `yarn typecheck` | Run TypeScript compiler checks       |
| `yarn deploy`    | Build and deploy to GitHub Pages     |

---

## Tech Stack

| Category        | Technology                                    | Version         |
| --------------- | --------------------------------------------- | --------------- |
| UI Framework    | [MUI v7](https://mui.com/) (`@mui/material`)  | 7.3.5           |
| State           | [Zustand](https://zustand-demo.pmnd.rs/)      | 5.x             |
| Icons           | `@mui/icons-material`, `lucide-react`         | 7.3.5, 0.487.0  |
| Styling         | MUI `sx` prop + Emotion                       | 11.14.x         |
| Animations      | [Motion](https://motion.dev/) (Framer Motion) | 12.23.24        |
| Build           | [Vite](https://vite.dev/)                     | 6.3.5           |
| Language        | TypeScript (strict mode)                      | 5.8.3           |
| Package Manager | Yarn Berry (node-modules linker)              | 4.9.2           |
| Deploy          | `gh-pages`                                    | 6.x             |

### Dependencies

10 production · 6 dev · Zero CSS frameworks · Zero routing libraries · Zero date libraries

---

## Project Structure

```structure
src/
├── main.tsx                              # App entry, ThemeProvider + ErrorBoundary wrapper
├── assets/                               # Static assets (mosque images, logos)
└── app/
    ├── App.tsx                           # Root component, layout orchestration
    ├── theme/
    │   ├── muiTheme.ts                   # MUI theme factory (dark/light)
    │   ├── tokens.ts                     # Design tokens per mode (colors, surfaces, borders)
    │   ├── ThemeContext.tsx               # Theme mode context + useThemeMode hook
    │   ├── ThemeProviderWrapper.tsx       # ThemeProvider + CssBaseline + localStorage persist
    │   └── sharedStyles.ts               # Shared sx styles (floatingCardSx)
    ├── store/
    │   ├── index.ts                      # Store barrel export + useLanguage hook
    │   └── languageStore.ts              # Zustand persisted language store (ar/en)
    ├── hooks/
    │   ├── index.ts                      # Hooks barrel export
    │   ├── useClock.ts                   # Single setInterval clock (1 s tick)
    │   ├── usePrayerState.ts             # Computes active/next prayer, isPraying flag
    │   └── useFundraisingScheduler.ts    # Schedules fundraising overlay between prayers
    ├── components/
    │   ├── header/
    │   │   ├── Header.tsx                # Top bar: clock, Hijri/Gregorian dates, language toggle, theme toggle, donate button, offline indicator
    │   │   └── index.ts
    │   ├── prayer/
    │   │   ├── PrayerCard.tsx            # Individual prayer card with icon, time, iqama
    │   │   ├── CountdownBar.tsx          # Next prayer countdown timer
    │   │   └── index.ts
    │   ├── widgets/
    │   │   ├── SunTimesWidget.tsx        # Sunrise & sunset display
    │   │   ├── HadithPanel.tsx           # Daily hadith/verse panel
    │   │   ├── AnnouncementsTicker.tsx   # Scrolling announcements footer
    │   │   └── index.ts
    │   ├── overlays/
    │   │   ├── FundraisingOverlay.tsx    # Donation progress overlay (auto-close, focus trap)
    │   │   ├── IslamicGeometricOverlay.tsx # Animated Islamic geometric background pattern
    │   │   └── index.ts
    │   ├── events/
    │   │   ├── EventSlideshow.tsx        # Auto-rotating event cards with background images
    │   │   ├── ImageCarousel.tsx         # Standalone image carousel (fallback when no events)
    │   │   └── index.ts
    │   └── shared/
    │       ├── ErrorBoundary.tsx         # Auto-recovery error boundary (3 retries)
    │       └── index.ts
    ├── utils/
    │   ├── translations.ts              # Full English/Arabic translation map
    │   ├── prayerTimes.ts               # Prayer time calculation utilities
    │   └── helpers.ts                    # Arabic numerals, font family, RTL direction
    ├── data/
    │   └── prayers.ts                    # Default prayer schedule (Fajr–Isha)
    ├── constants/
    │   └── timings.ts                    # Fundraising timing constants
    └── types/
        ├── prayer.ts                     # PrayerKey, PrayerSchedule, PrayerTime, NextPrayer
        ├── i18n.ts                       # Language, Translations
        └── events.ts                     # EventSlide
```

---

## Configuration

### Fonts

Google Fonts loaded via CDN in `index.html`:

- **Open Sans** — weights 300–700 (English text)
- **Noto Naskh Arabic** — weights 400–700 (Arabic text)
- **Roboto Mono** — system font (clock and countdown numerals)

Preconnect hints are included for optimal loading performance.

### Theme

The app supports **dark** and **light** themes, toggled via the header button and persisted to `localStorage` under `masjid-theme`.

Theme tokens are defined in `src/app/theme/tokens.ts` with shared + mode-specific values:

| Token Category | Dark Mode Default                | Light Mode Default                 |
| -------------- | -------------------------------- | ---------------------------------- |
| Background     | `#0a1f0a` (dark emerald)         | `#f5f0e8` (warm cream)             |
| Gold (accent)  | `#D4AF37` / `#FFD700` / `#B8960C` | `#D4AF37` / `#FFD700` / `#B8960C` |
| Gold onLight   | `#D4AF37`                        | `#9A7D00`                          |
| Text Primary   | `#ffffff`                        | `#1a1a1a`                          |
| Surface levels | `rgba(0,0,0,0.3)` → `rgba(0,0,0,0.95)` | `rgba(0,0,0,0.06)` → `rgba(0,0,0,0.87)` |
| Border levels  | `rgba(212,175,55,0.02)` → `0.8`  | `rgba(0,0,0,0.03)` → `0.8`        |

Extended palette via MUI module augmentation: `gold`, `surface`, `border`, `glow`, `text.muted`, `text.soft`.

### Custom Breakpoints

| Breakpoint | Width  | Target            |
| ---------- | ------ | ----------------- |
| xs         | 0      | Mobile phones     |
| sm         | 640px  | Tablets (portrait) |
| md         | 1024px | Tablets (landscape) / small laptops |
| lg         | 1920px | Desktops / TVs    |
| xl         | 2560px | Large displays    |

### Language Store

Language preference is persisted via Zustand + `localStorage` under key `hia-language`. Default: `ar` (Arabic).

---

## Kiosk Deployment

This app is designed for 24/7 unattended operation:

1. Build for production: `yarn build`
2. Serve the `dist/` directory with any static file server
3. Launch Chromium in kiosk mode:

```bash
chromium --kiosk --incognito --disable-translate http://localhost:3000
```

### Kiosk Resilience

- **Error Boundary** — Auto-recovers from render errors (3 retries, 5 s delay), then shows manual reload
- **Service Worker** — Caches static assets (JS, CSS, images, fonts) for offline operation (`public/sw.js`)
- **Network Detection** — Live online/offline indicator in the header
- **No User Interaction Required** — Single-page display with automatic cycling
- **60fps Animations** — Single timer principle (one `setInterval` via `useClock`), respects `prefers-reduced-motion`

---

## Development Methodology

This project uses [Spec Kit](https://github.com/github/spec-kit) — a Spec-Driven Development (SDD) workflow with 8 steps per spec:

1. **Constitution** — Governance rules (9 articles)
2. **Specify** — Write the feature specification
3. **Clarify** — Resolve ambiguities
4. **Checklist** — Validate spec quality
5. **Plan** — Technical architecture
6. **Tasks** — Break down into executable tasks
7. **Analyze** — Cross-artifact consistency check
8. **Implement** — Execute tasks

### Constitution

The project constitution (`.specify/memory/constitution.md`) defines 9 governing articles:

| Article | Principle              | Key Rule                                           |
| ------- | ---------------------- | -------------------------------------------------- |
| I       | MUI-Only               | No Tailwind, no shadcn, no CSS utilities           |
| II      | TypeScript Strict      | No `any` types, full type coverage                 |
| III     | Yarn                   | Sole package manager, no npm/pnpm                  |
| IV      | Zero Dead Code         | Every dependency justified, no unused imports      |
| V       | Shared Utilities (DRY) | Common logic in `src/app/utils/`                   |
| VI      | Dynamic Data           | No hardcoded values, compute dynamically           |
| VII     | Kiosk-First            | Auto-recover, offline-capable, resilient           |
| VIII    | RTL Bilingual          | Arabic/English first-class, logical CSS properties |
| IX      | Single Timer           | One `setInterval` for all time-dependent UI        |

---

## License

Private — All rights reserved.
