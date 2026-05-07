# Masjid Prayer Time Display Constitution

## Core Principles

### I. MUI-Only UI Framework

All UI components MUST use MUI v7 (`@mui/material`, `@mui/icons-material`) with the `sx` prop for styling. No Tailwind CSS, no shadcn/ui, no CSS utility classes. Theme tokens and `sx` are the single source of truth for all visual styling. Emotion is the styling engine (MUI peer dependency).

### II. TypeScript Strict Mode

All code MUST be written in TypeScript with strict type checking. No `any` types are permitted — use proper interfaces and types. Every component prop, utility function, and service must be fully typed. The `Translations` type must replace all `translations: any` usage.

### III. Yarn Package Management

Yarn is the sole package manager. No npm, no pnpm. All scripts in `package.json` must work with `yarn <script>`. The `yarn.lock` file is the source of truth for dependency resolution.

### IV. Zero Dead Code

Every dependency in `package.json` must be justified by actual usage in the source code. Every imported module must be used. Unused components, files, and CSS artifacts must be deleted. Bundle size is a first-class concern — target < 500KB gzipped.

### V. Shared Utilities (DRY)

Common logic (Arabic numeral conversion, font family resolution, RTL helpers, prayer time calculations) MUST live in `src/app/utils/` as single-source utilities. No copy-paste duplication across components. Shared hooks (`useClock`, `useCountdown`, `usePrayerTimes`) centralize repetitive state logic.

### VI. Dynamic Data Over Hardcoded Values

Prayer times, current/next prayer detection, weather data, Hijri dates, and countdown targets MUST be computed dynamically. Hardcoded values (e.g., `currentPrayer = "Dhuhr"`, `temperature = "28"`) are only acceptable as API placeholder fallbacks, never as permanent implementations.

### VII. Kiosk-First Design

This app runs as a 24/7 kiosk display in a mosque. It MUST: auto-recover from errors (error boundaries), work offline (local assets, service worker), never crash to a white screen, and be resilient to network failures. Performance matters — minimize re-renders and animation overhead.

### VIII. RTL-First Bilingual Support

Arabic (RTL) and English (LTR) are first-class citizens. Every component MUST handle `dir="rtl"` properly using MUI's RTL support and logical CSS properties. Use `start`/`end` instead of `left`/`right` for positioning. Arabic numeral conversion must be applied consistently.

### IX. Single Timer Principle

Only ONE `setInterval` timer drives all time-dependent UI updates (clock, countdown, date). Components consume shared hooks (`useClock`, `useCountdown`) rather than running independent timers. This prevents redundant re-renders (was 3 re-renders/sec, target: 1).

## Technology Stack

- **Runtime**: React 18.3 + TypeScript (strict)
- **UI Library**: MUI v7 (`@mui/material`, `@mui/icons-material`)
- **Styling**: MUI `sx` prop + Emotion (no Tailwind, no CSS modules)
- **Animations**: Motion (Framer Motion) for transitions and micro-interactions
- **Icons**: `@mui/icons-material` primary, `lucide-react` only where MUI lacks an icon
- **Build**: Vite 6.x
- **Package Manager**: Yarn
- **Date Utilities**: date-fns

## Constraints

- Maximum 12 production dependencies (excluding React itself)
- No CSS framework/utility library besides MUI's built-in styling
- No routing library (single-page kiosk display)
- All image assets must be bundled locally (no external URLs in production)
- `prefers-reduced-motion` must be respected for accessibility

## Governance

This constitution supersedes all other development practices. Any deviation (e.g., adding a new dependency, using `any`) requires explicit justification in the spec and approval. Amendments follow the project's git workflow — branch, review, merge.

**Version**: 1.0.0 | **Ratified**: 2026-05-07 | **Last Amended**: 2026-05-07
