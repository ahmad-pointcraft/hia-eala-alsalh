# Masjid Prayer Time Display

A 24/7 kiosk display application for mosques, showing prayer times, countdown to next prayer, Hijri date, weather, announcements, and fundraising progress. Designed to run on a Chromium-based browser in fullscreen kiosk mode.

> **Stack:** React 18 · TypeScript (strict) · MUI v7 · Vite · Yarn
> **Design:** [Figma](https://www.figma.com/design/VFg4zYgOYshrC1eyoxlNwQ/Masjid-Prayer-Time-Display)

---

## Features

- **Prayer Time Display** — Shows all five daily prayer times with active/next prayer highlighting
- **Live Countdown** — Real-time countdown to the next prayer
- **Hijri & Gregorian Dates** — Dual calendar display with Arabic numeral conversion
- **Weather Widget** — Current conditions with temperature and icon
- **Announcements Ticker** — Scrolling mosque announcements
- **Fundraising Progress** — Donation tracker with goal visualization
- **Event Mode** — Toggle for special event display
- **RTL Bilingual** — Full Arabic (RTL) and English (LTR) support
- **Dark Theme** — Dark emerald and gold palette designed for mosque ambiance

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

| Command          | Description                      |
| ---------------- | -------------------------------- |
| `yarn dev`       | Start Vite dev server            |
| `yarn build`     | Production build to `dist/`      |
| `yarn preview`   | Preview production build locally |
| `yarn typecheck` | Run TypeScript compiler checks   |

---

## Tech Stack

| Category        | Technology                                    | Version        |
| --------------- | --------------------------------------------- | -------------- |
| UI Framework    | [MUI v7](https://mui.com/) (`@mui/material`)  | 7.3.5          |
| Icons           | `@mui/icons-material`, `lucide-react`         | 7.3.5, 0.487.0 |
| Styling         | MUI `sx` prop + Emotion                       | 11.14.x        |
| Animations      | [Motion](https://motion.dev/) (Framer Motion) | 12.23.24       |
| Date Utils      | [date-fns](https://date-fns.org/)             | 3.6.0          |
| Build           | [Vite](https://vite.dev/)                     | 6.3.5          |
| Language        | TypeScript (strict mode)                      | 5.8.3          |
| Package Manager | Yarn Berry (node-modules linker)              | 4.9.2          |

### Dependencies

9 production · 5 dev · Zero CSS frameworks · Zero routing libraries

---

## Project Structure

```structure
src/
├── main.tsx                        # App entry point, ThemeProvider wrapper
├── imports/                        # Static assets (logo, splash)
└── app/
    ├── App.tsx                     # Root application component
    ├── theme/
    │   ├── muiTheme.ts             # MUI theme (dark emerald/gold palette)
    │   └── ThemeProviderWrapper.tsx # ThemeProvider + CssBaseline
    ├── components/
    │   ├── Header.tsx              # Top bar: clock, language toggle, actions
    │   ├── PrayerCard.tsx          # Individual prayer time card
    │   ├── CountdownBar.tsx        # Next prayer countdown
    │   ├── MasjidInfo.tsx          # Mosque name, location, date
    │   ├── WeatherWidget.tsx       # Current weather display
    │   ├── AnnouncementsTicker.tsx # Scrolling announcements
    │   ├── HadithPanel.tsx         # Daily hadith/verse display
    │   ├── FundraisingOverlay.tsx  # Donation progress overlay
    │   ├── EventModeDisplay.tsx    # Special event mode
    │   ├── ImageCarousel.tsx       # Rotating image carousel
    │   ├── IslamicGeometricOverlay.tsx # Decorative background pattern
    │   └── figma/
    │       └── ImageWithFallback.tsx # Image component with fallback
    └── utils/
        └── translations.ts         # English/Arabic translation strings
```

---

## Configuration

### Fonts

Google Fonts loaded via CDN in `index.html`:

- **Open Sans** — weights 300–700 (English text)
- **Noto Naskh Arabic** — weights 400–700 (Arabic text)

Preconnect hints are included for optimal loading performance.

### Theme

The MUI theme is centralized in `src/app/theme/muiTheme.ts`:

| Token                        | Value                    | Usage                                    |
| ---------------------------- | ------------------------ | ---------------------------------------- |
| `palette.primary`            | `#D4AF37` (gold)         | Accent color, active states              |
| `palette.background.default` | `#0a1f0a` (dark emerald) | App background                           |
| `palette.background.paper`   | `rgba(0,0,0,0.3)`        | Card/surface backgrounds                 |
| `palette.text.primary`       | `#ffffff`                | Main text                                |
| `palette.text.secondary`     | `#9ca3af`                | Secondary text                           |
| `palette.gold` (custom)      | `#D4AF37` / `#FFD700`    | Extended palette via module augmentation |

---

## Kiosk Deployment

This app is designed for 24/7 unattended operation:

1. Build for production: `yarn build`
2. Serve the `dist/` directory with any static file server
3. Launch Chromium in kiosk mode:

```bash
chromium --kiosk --incognito --disable-translate http://localhost:3000
```

### Kiosk Requirements

- Auto-recovery from network failures (error boundaries)
- Offline-capable (local assets, service worker — planned)
- No user interaction required (single-page display)
- 60fps animations, minimal re-renders (single timer principle)

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

### Migration Roadmap

| Spec | Priority | Description                                                         | Status  |
| ---- | -------- | ------------------------------------------------------------------- | ------- |
| 001  | **P0**   | Bootstrap & Cleanup — Remove Tailwind/shadcn, set up MUI            | ✅ Done |
| 002  | **P0**   | MUI Component Migration — Rewrite all components with `sx` prop     | ✅ Done |
| 003  | **P0**   | Dynamic Data & Shared Utils — Dynamic prayer detection, deduplicate | ✅ Done |
| 004  | **P1**   | Performance & Type Safety — Shared hooks, context providers         | ✅ Done |
| 005  | **P2**   | Production Hardening — Error boundaries, offline, accessibility     | ✅ Done |
| 006  | **P3**   | Polish & Theme System — Theme tokens, responsive audit              | ✅ Done |
| 007  | **P0**   | Mockup 7 Redesign — Floating widgets layout, two-column glassmorphic | ⬜ Pending |

```doc
Spec 001 (Bootstrap) → Spec 002 (MUI Migration) → Spec 003 (Dynamic Data)
                                                          ↓
                                                   Spec 004 (Performance)
                                                          ↓
                                                   Spec 005 (Hardening)
                                                          ↓
                                                   Spec 006 (Polish)
                                                          ↓
                                                   Spec 007 (Mockup 7 Redesign)
```

---

## License

Private — All rights reserved.
