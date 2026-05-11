# Implementation Plan: Production Hardening

**Branch**: `005-production-hardening` | **Date**: 2026-05-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-production-hardening/spec.md`

## Summary

Harden the Masjid Prayer Time Display kiosk app for unattended 24/7 production operation: add an ErrorBoundary with auto-recovery, migrate carousel images from remote Unsplash URLs to local Vite module imports, add accessibility compliance (aria-live regions, aria-labels, focus trap, reduced-motion support), and optionally add a handwritten service worker for offline capability.

## Technical Context

**Language/Version**: TypeScript 5.8.3 (strict mode + noUncheckedIndexedAccess)
**Primary Dependencies**: React 18.3.1, @mui/material 7.3.5, motion 12.23.24, date-fns 3.6.0, lucide-react 0.487.0
**Storage**: N/A (static assets bundled via Vite)
**Testing**: Manual verification (yarn build + visual + grep checks)
**Target Platform**: Chromium-based browser in kiosk mode (24/7 wall-mounted display)
**Project Type**: Single-page kiosk web application
**Performance Goals**: <1 frame error recovery, zero remote image dependency, 60fps animations
**Constraints**: No new dependencies, no `any` types, MUI-only styling, <200KB per image asset
**Scale/Scope**: 12 components, 9 production deps, 3 static images to migrate

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Article | Requirement | Status | Notes |
|---------|------------|--------|-------|
| I. MUI-Only UI Framework | All UI via MUI sx prop | ✅ Pass | ErrorBoundary fallback uses Box, Typography, CircularProgress |
| II. TypeScript Strict Mode | No `any` types, fully typed | ✅ Pass | ErrorBoundary class component fully typed |
| III. Yarn Package Management | Yarn only | ✅ Pass | No new packages |
| IV. Zero Dead Code | Every dep justified, no unused imports | ✅ Pass | No new deps; replaces remote URLs with local imports |
| V. Shared Utilities (DRY) | Common logic in utils/ | ✅ Pass | Reduced-motion hook can be extracted to utils if reused |
| VI. Dynamic Data Over Hardcoded | Computed dynamically | ✅ Pass | Countdown already dynamic via useClock |
| VII. Kiosk-First Design | Auto-recover, never white screen | ✅ Pass | ErrorBoundary + local assets directly support this |
| VIII. RTL-First Bilingual | Handle dir="rtl" | ✅ Pass | aria-live uses "polite" (universal), labels support en/ar |
| IX. Single Timer Principle | One setInterval for all time UI | ✅ Pass | No new timers; aria throttling uses useRef comparison, not setInterval |

**No violations. No justifications needed.**

## Project Structure

### Documentation (this feature)

```text
specs/005-production-hardening/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── checklists/
│   └── requirements.md  # Step 4 output
├── spec.md              # Feature specification
└── tasks.md             # Step 6 output (NOT created by this command)
```

### Source Code (repository root)

```text
src/
├── main.tsx                           # MODIFY: wrap App in ErrorBoundary, optional SW registration
├── imports/
│   ├── logo.png                       # EXISTING
│   ├── logo-masjid-design-1.png       # EXISTING
│   ├── splash.svg                     # EXISTING
│   ├── mosque-1.jpg                   # NEW: local carousel image
│   ├── mosque-2.jpg                   # NEW: local carousel image
│   └── mosque-3.jpg                   # NEW: local carousel image
├── app/
│   ├── App.tsx                        # MODIFY: replace Unsplash URLs, add reduced-motion
│   ├── theme/
│   │   └── ThemeProviderWrapper.tsx   # UNCHANGED
│   ├── components/
│   │   ├── ErrorBoundary.tsx          # NEW: class component with auto-recovery
│   │   ├── CountdownBar.tsx           # MODIFY: add aria-live throttled to 1/min
│   │   ├── AnnouncementsTicker.tsx    # MODIFY: add role="status", aria-live="polite"
│   │   ├── Header.tsx                 # MODIFY: add aria-labels to icon-only buttons
│   │   ├── FundraisingOverlay.tsx     # MODIFY: focus trap, role="dialog", aria-modal
│   │   ├── ImageCarousel.tsx          # UNCHANGED
│   │   ├── MasjidInfo.tsx             # UNCHANGED
│   │   ├── PrayerCard.tsx             # UNCHANGED
│   │   ├── HadithPanel.tsx            # UNCHANGED
│   │   ├── WeatherWidget.tsx          # UNCHANGED
│   │   ├── EventModeDisplay.tsx       # UNCHANGED
│   │   ├── IslamicGeometricOverlay.tsx # UNCHANGED
│   │   └── figma/
│   │       └── ImageWithFallback.tsx  # UNCHANGED
│   └── utils/
│       ├── translations.ts            # UNCHANGED
│       ├── prayerTimes.ts             # UNCHANGED
│       ├── helpers.ts                 # UNCHANGED
│       └── useClock.ts               # UNCHANGED
public/
├── sw.js                              # NEW (optional): handwritten service worker
└── index.html                         # UNCHANGED
```

**Structure Decision**: Single frontend project. All changes are local to existing component files plus one new ErrorBoundary component and three new image assets.

## Complexity Tracking

> No constitution violations. Table left empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
