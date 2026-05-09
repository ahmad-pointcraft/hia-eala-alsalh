# Implementation Plan: MUI Component Migration

**Branch**: `002-mui-component-migration` | **Date**: 2026-05-09 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/002-mui-component-migration/spec.md`

## Summary

Migrate all 13 React component files (12 application components + 1 utility) from Tailwind CSS utility classes to MUI v7 component system with `sx` prop styling. The migration replaces every `className` string with MUI components (`Box`, `Typography`, `Paper`, `Card`, `AppBar`, `Grid`, `Backdrop`, `LinearProgress`, `Chip`, `Button`, `IconButton`) and `sx` prop values. No new files created — all changes are in-place rewrites of existing components. Framer Motion animations are preserved. RTL support maintained via `dir` prop + logical CSS properties.

## Technical Context

**Language/Version**: TypeScript 5.8 (strict mode) + React 18.3  
**Primary Dependencies**: MUI v7 (`@mui/material` 7.3.5, `@mui/icons-material` 7.3.5), Emotion 11.14, Framer Motion (`motion` 12.23.24), `lucide-react` 0.487, `date-fns` 3.6  
**Storage**: N/A (no backend)  
**Testing**: Manual visual QA + `yarn build` type checking (no test framework)  
**Target Platform**: Browser — 1920×1080 kiosk display (Chromium)  
**Project Type**: Single-page React web application (kiosk display)  
**Performance Goals**: < 500KB gzipped bundle, smooth 60fps animations, single re-render per second  
**Constraints**: Offline-capable, 24/7 operation, kiosk resilience (Article VII), < 12 production dependencies  
**Scale/Scope**: 13 files to modify, ~1,400 LOC affected, zero new files

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Article                   | Requirement               | Status          | Notes                                                                                                   |
| ------------------------- | ------------------------- | --------------- | ------------------------------------------------------------------------------------------------------- |
| I. MUI-Only               | All UI via MUI + sx prop  | ✅ PASS         | This is the entire purpose of this spec                                                                 |
| II. TypeScript Strict     | No `any` types            | ✅ PASS         | `prayerIcons` → typed (FR-019). `translations: any` → `Record<string, string>` per FR-019               |
| III. Yarn                 | Package manager           | ✅ PASS         | No package changes needed                                                                               |
| IV. Zero Dead Code        | Remove Tailwind artifacts | ✅ PASS         | FR-023 removes all className dead code                                                                  |
| V. Shared Utilities (DRY) | No copy-paste             | ⚠️ ACKNOWLEDGED | `toArabicNumerals` is duplicated in 4 components — consolidation is Spec 003 scope per spec assumptions |
| VI. Dynamic Data          | No hardcoded values       | ⚠️ ACKNOWLEDGED | Hardcoded prayer times, weather — Spec 003 scope                                                        |
| VII. Kiosk-First          | Error resilience          | ✅ PASS         | No behavioral changes — only UI layer migration                                                         |
| VIII. RTL-First           | Logical CSS + dir prop    | ✅ PASS         | FR-006: dir on every root, logical properties                                                           |
| IX. Single Timer          | One setInterval           | ⚠️ ACKNOWLEDGED | Multiple timers exist — Spec 004 scope. Timer type fix (NodeJS.Timeout) addressed here                  |

**Gate Result**: ✅ PASS — All violations are explicitly acknowledged in the spec assumptions and deferred to future specs.

### Post-Design Re-Check

| Concern                    | Resolution                                                                                                                       |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| FR-019 `translations: any` | Replaced with `Record<string, string>` per FR-019. Full `Translations` interface is Spec 004 scope. `prayerIcons` typed properly |
| FR-014 useMemo particles   | Implemented in design — positions memoized, count reduced 12→6                                                                   |
| MUI v7 Grid API            | Research confirmed: use `Grid` (not `Grid2`) with `size` prop in v7                                                              |
| motion(Box) vs motion.div  | Decision: keep `motion.div` wrappers — simpler, no ref forwarding issues                                                         |

## Project Structure

### Documentation (this feature)

```text
specs/002-mui-component-migration/
├── plan.md              # This file
├── research.md          # Phase 0 output — 12 research items resolved
├── data-model.md        # Phase 1 output — component props interfaces
├── quickstart.md        # Phase 1 output — migration developer guide
├── contracts/
│   └── ui-component-contracts.md  # Phase 1 output — MUI component trees
└── tasks.md             # Phase 2 output (speckit.tasks — NOT created by plan)
```

### Source Code (repository root)

```text
src/
├── main.tsx                              # Entry point (no changes)
├── app/
│   ├── App.tsx                           # [MODIFY] Root layout → Box, Stack, Grid
│   ├── theme/
│   │   ├── muiTheme.ts                   # (no changes — already configured)
│   │   └── ThemeProviderWrapper.tsx       # (no changes)
│   ├── utils/
│   │   └── translations.ts              # (no changes)
│   └── components/
│       ├── Header.tsx                    # [MODIFY] → AppBar, Toolbar, Button
│       ├── PrayerCard.tsx                # [MODIFY] → Card, CardContent, Typography
│       ├── CountdownBar.tsx              # [MODIFY] → Paper, Box, Typography
│       ├── MasjidInfo.tsx                # [MODIFY] → Box, Typography
│       ├── HadithPanel.tsx               # [MODIFY] → Paper, Typography
│       ├── WeatherWidget.tsx             # [MODIFY] → Paper, Typography, Cloud (MUI)
│       ├── AnnouncementsTicker.tsx        # [MODIFY] → Paper, Box, Typography
│       ├── FundraisingOverlay.tsx         # [MODIFY] → Backdrop, Paper, LinearProgress
│       ├── EventModeDisplay.tsx           # [MODIFY] → Paper, Chip, Grid, Button
│       ├── IslamicGeometricOverlay.tsx     # [MODIFY] → Box, useMemo particles
│       ├── ImageCarousel.tsx              # [MODIFY] → Box, IconButton
│       └── figma/
│           └── ImageWithFallback.tsx      # [MODIFY] → Box sx prop
```

**Structure Decision**: Single-project SPA. No backend, no test directory (manual QA only). All source under `src/app/`.

## Detailed Component Migration Plan

### Font Family Convention (FR-018)

All 51 `style={{ fontFamily }}` instances are replaced with `sx={{ fontFamily }}`. The `fontFamily` variable is computed at runtime based on language (`language === 'ar' ? '"Noto Naskh Arabic", serif' : '"Open Sans", sans-serif'`). This cannot use a pure theme typography reference because the font stack switches dynamically between Arabic and English — the MUI theme defines a combined font stack but components need language-first ordering. The `sx` prop pattern is the correct solution.

### Arabic Numerals Convention (FR-024)

The `toArabicNumerals()` utility MUST be applied in these 5 components when `language === 'ar'`:

- **PrayerCard** — prayer times, iqama times
- **CountdownBar** — countdown timer (HH:MM:SS)
- **MasjidInfo** — Hijri date (already in Arabic in translations, but Gregorian date digits)
- **WeatherWidget** — temperature, humidity percentage
- **FundraisingOverlay** — collected amount, goal amount, donor count, progress percentage, countdown seconds

### Theme Token Convention (FR-022)

Use theme tokens in `sx` instead of raw hex where a token exists:

- `color: 'primary.main'` (not `color: '#D4AF37'`) — gold
- `color: 'primary.light'` (not `color: '#FFD700'`) — gold-light
- `bgcolor: 'background.default'` (not `bgcolor: '#0a1f0a'`) — dark emerald
- `bgcolor: 'background.paper'` (not `bgcolor: 'rgba(0,0,0,0.3)'`) — card bg (already set in theme)
- `color: 'text.primary'` (not `color: '#ffffff'`) — white
- `color: 'text.secondary'` (not `color: '#9ca3af'`) — gray-400
- Direct `rgba()` values are OK for one-off non-theme colors (e.g., `rgba(212,175,55,0.5)` for glow effects)

### Grid Convention

All Grid layouts use the standard **12-column** system with `size` prop:

- Prayer cards: `<Grid size={{ xs: 6, sm: 4, lg: 2 }}>` (2→3→6 columns)
- Countdown+Weather: `<Grid size={{ xs: 12, lg: 6 }}>` (stack→side-by-side)
- Event details: `<Grid size={4}>` (3 equal columns)

---

### Phase 1: Independent Components (Parallelizable)

All 13 component files can be migrated independently — no cross-component API changes.

---

#### Header.tsx

**MUI Components**: `AppBar`, `Toolbar`, `Button`, `Typography`, `Box`  
**Icons**: Keep `Languages`, `CalendarClock`, `Heart` from lucide-react  
**Key Changes**:

- Outer `<div>` → `<AppBar position="static">` with `<Toolbar>`
- Language/Donate/Event buttons → `<Button>` with `variant="outlined"` / `variant="contained"`
- Clock text → `<Typography>` with `sx={{ fontFamily: 'monospace', color: 'text.primary' }}`
- Button text colors → `sx={{ color: 'primary.main' }}` for gold buttons
- Event button → `sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}`
- `hidden sm:inline` spans → `<Typography component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>`
- All `style={{ fontFamily }}` → `sx={{ fontFamily }}` (computed variable, see Font Family Convention)
- All `className` strings removed
- `dir` prop on `<AppBar>` root

---

#### PrayerCard.tsx

**MUI Components**: `Card`, `CardContent`, `Typography`, `Box`  
**Icons**: Keep all lucide prayer icons (Sunrise, Sun, Sunset, CloudSun, Moon, Star)  
**Key Changes**:

- Outer `<div>` → `<Card>` with conditional `sx` for active/inactive states
- Active card: `border: '1px solid'`, `borderColor: 'primary.main'`, `boxShadow: '0 0 30px rgba(212,175,55,0.5)'`, `transform: { xs: 'scale(1.05)', lg: 'scale(1.10)' }`
- Inactive card: `bgcolor: 'background.paper'`, `border: '1px solid rgba(212,175,55,0.3)'`
- Prayer name → `<Typography>` with `sx={{ color: 'text.secondary' }}`
- Prayer time → `<Typography>` with `sx={{ color: 'text.primary', fontWeight: 'bold' }}`
- Iqama label → `<Typography>` with `sx={{ color: 'primary.main' }}`
- Icon color: active → `sx={{ color: 'primary.main' }}`, inactive → `sx={{ color: 'text.secondary' }}`
- All `style={{ fontFamily }}` → `sx={{ fontFamily }}` (computed variable, see Font Family Convention)
- Arabic numerals via `toArabicNumerals()` for prayer time + iqama time (FR-024)
- `prayerIcons` type: `Record<string, any>` → `Record<string, React.ComponentType<{ className?: string }>>`
- `dir` prop on `<Card>` root

---

#### CountdownBar.tsx

**MUI Components**: `Paper`, `Box`, `Typography`  
**Icons**: None  
**Key Changes**:

- Outer `<div>` → `<Paper>` with `sx` for glass effect (`bgcolor: 'background.paper'`, `backdropFilter: 'blur(4px)'`)
- Inner flex container → `<Box>` with `sx={{ display: 'flex' }}`
- Prayer text → `<Typography>` with `sx={{ color: 'text.primary', fontWeight: 'bold' }}`
- Countdown text → `<Typography>` with `sx={{ color: 'primary.main', fontFamily: 'monospace' }}`
- All `style={{ fontFamily }}` → `sx={{ fontFamily }}` (computed variable)
- Arabic numerals via `toArabicNumerals()` for countdown timer display (FR-024)
- `dir` prop on `<Paper>` root

---

#### MasjidInfo.tsx

**MUI Components**: `Box`, `Typography`  
**Icons**: None  
**Key Changes**:

- Outer `<div>` → `<Box>` (structural layout, no elevation needed)
- Hijri date → `<Typography component="span">` with `sx={{ color: 'text.primary' }}`
- Gregorian date → `<Typography component="span">` with `sx={{ color: 'text.secondary' }}`
- Date divider → `<Typography component="span">` with `sx={{ color: 'text.secondary' }}`
- Logo img stays as `<img>` with `sx` for sizing
- All `style={{ fontFamily }}` → `sx={{ fontFamily }}` (computed variable)
- Arabic numerals via `toArabicNumerals()` for Gregorian date digits when `language === 'ar'` (FR-024)
- Remove unused `logoSvg` import
- `dir` prop on root `<Box>`

---

#### HadithPanel.tsx

**MUI Components**: `Paper`, `Typography`, `Box`  
**Icons**: None  
**Key Changes**:

- Outer `<div>` → `<Paper>` with glass effect
- Title → `<Typography>` with `sx={{ color: 'primary.main', textAlign: 'start', textTransform: 'uppercase' }}`
- Hadith text → `<Typography>` with `sx={{ color: 'text.primary', fontStyle: 'italic', textAlign: 'center' }}`
- Source → `<Typography>` with `sx={{ color: 'text.secondary', textAlign: 'end' }}` (logical, auto-flips for RTL)
- All `style={{ fontFamily }}` → `sx={{ fontFamily }}` (computed variable)
- `dir` prop on `<Paper>` root

---

#### WeatherWidget.tsx

**MUI Components**: `Paper`, `Typography`, `Box`  
**Icons**: Replace `Cloud` from lucide → `Cloud` from `@mui/icons-material`; keep `Droplets` from lucide  
**Key Changes**:

- Outer `<div>` → `<Paper>` with `sx={{ bgcolor: 'background.paper' }}`
- `Cloud` icon import changed from `lucide-react` to `@mui/icons-material`; `sx={{ color: 'text.secondary' }}`
- Temperature → `<Typography>` with `sx={{ color: 'text.primary', fontWeight: 'bold' }}`
- City name → `<Typography>` with `sx={{ color: 'text.secondary' }}`
- Condition text → `<Typography>` with `sx={{ color: 'grey.300' }}`
- Conditional `text-left`/`text-right` → `textAlign: 'end'` (logical)
- Conditional `flex-row-reverse` → removed, replaced with logical direction from `dir` prop
- All `style={{ fontFamily }}` → `sx={{ fontFamily }}` (computed variable)
- Arabic numerals via `toArabicNumerals()` for temperature + humidity values (FR-024)
- `dir` prop on `<Paper>` root

---

#### AnnouncementsTicker.tsx

**MUI Components**: `Paper`, `Box`, `Typography`  
**Icons**: Keep `Megaphone` from lucide-react  
**Key Changes**:

- Outer `<div>` → `<Paper>` (elevated surface, bottom ticker)
- Inner flex sections → `<Box>` elements with `sx`
- Text → `<Typography component="span">`
- Scroll animation via `ref` preserved as-is (requestAnimationFrame)
- `dir` prop on `<Paper>` root

---

#### FundraisingOverlay.tsx

**MUI Components**: `Backdrop`, `Paper`, `Typography`, `IconButton`, `Box`, `LinearProgress`  
**Icons**: Replace `X` from lucide → `Close` from `@mui/icons-material`  
**Key Changes**:

- Outer overlay `<div>` → `<Backdrop open sx={{ bgcolor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>`
- Content card `<div>` → `<Paper>` with `sx={{ bgcolor: 'rgba(0,0,0,0.6)', border: '1px solid', borderColor: 'primary.main' }}`
- Close button `<button>` → `<IconButton>` with `Close` icon; `sx={{ position: 'absolute', top: 16, insetInlineEnd: 16 }}`
- Title → `<Typography>` with `sx={{ color: 'primary.main' }}`
- Collected amount → `<Typography>` with `sx={{ color: 'primary.main', fontWeight: 'bold' }}`
- Goal/Donors → `<Typography>` with `sx={{ color: 'text.primary', fontWeight: 'bold' }}`
- Labels → `<Typography>` with `sx={{ color: 'text.secondary', textTransform: 'uppercase' }}`
- Progress bar `<div>` → `<LinearProgress variant="determinate">` with gold gradient bar
- Stats dividers `<div>` → `<Box>` with `sx={{ display: { xs: 'none', sm: 'block' } }}`
- All `style={{ fontFamily }}` → `sx={{ fontFamily }}` (computed variable)
- Arabic numerals via `toArabicNumerals()` for all amounts: collected, goal, donors, progress %, countdown (FR-024)
- `dir` prop on `<Backdrop>` root

---

#### EventModeDisplay.tsx

**MUI Components**: `Paper`, `Chip`, `Grid`, `Typography`, `Button`, `Box`  
**Icons**: Replace `Calendar`→`CalendarMonth`, `Clock`→`AccessTime`, `MapPin`→`LocationOn`, `Users`→`Groups` from `@mui/icons-material`  
**Key Changes**:

- Event card `<div>` → `<Paper>` with `sx={{ bgcolor: 'rgba(0,0,0,0.6)' }}`
- Badge `<span>` → `<Chip>` with `sx={{ bgcolor: 'rgba(212,175,55,0.2)', color: 'primary.main', borderColor: 'rgba(212,175,55,0.5)' }}`
- Title → `<Typography>` with `sx={{ color: 'primary.main' }}`
- Speaker name → `<Typography>` with `sx={{ color: 'text.primary', fontWeight: 'bold' }}`
- Detail labels → `<Typography>` with `sx={{ color: 'text.secondary', textTransform: 'uppercase' }}`
- Detail icons → `sx={{ color: 'primary.main' }}` (CalendarMonth, AccessTime, LocationOn)
- Details grid `grid grid-cols-3` → `<Grid container>` + `<Grid size={4}>` (12-column, 3 equal)
- CTA `motion.div` → `motion.div` wrapping `<Button>` with `sx={{ background: 'linear-gradient(to right, #D4AF37, #FFD700)' }}`
- Corner ornaments → `<Box>` with `sx={{ display: { xs: 'none', sm: 'block' } }}`
- All `style={{ fontFamily }}` → `sx={{ fontFamily }}` (computed variable)
- `dir` prop on root `motion.div`

---

#### IslamicGeometricOverlay.tsx

**MUI Components**: `Box`  
**Icons**: None  
**Key Changes**:

- All wrapper `<div>` → `<Box>` with `sx`
- Floating particles: `Math.random()` in render → `useMemo` hook
- Particle count: 12 → 6
- SVG patterns remain as-is (no MUI equivalent)
- `motion.div` wrappers remain as-is
- No `dir` prop needed (decorative overlay, no text)

---

#### ImageCarousel.tsx

**MUI Components**: `Box`, `IconButton`  
**Icons**: Replace `ChevronLeft`, `ChevronRight` from lucide → `@mui/icons-material`  
**Key Changes**:

- Outer container `<div>` → `<Box>`
- Nav buttons `<button>` → `<IconButton>` with `sx`
- Dot indicators `<button>` → `<Box component="button">` with `sx` for active/inactive
- Image stays as `<img>` (no MUI equivalent)
- `motion.div` and `AnimatePresence` remain as-is

---

#### figma/ImageWithFallback.tsx

**MUI Components**: `Box`  
**Icons**: None  
**Key Changes**:

- Error state `<div>` → `<Box>` with `sx={{ display: 'inline-block', bgcolor: 'grey.100' }}`
- Inner flex `<div>` → `<Box>` with `sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}`
- Normal state `<img>` stays as `<img>` — replace `className`/`style` with `sx` via `Box component="img"`

---

### Phase 2: Root Layout

#### App.tsx

**MUI Components**: `Box`, `Stack`, `Grid`  
**Icons**: Keep `Languages` from lucide-react (already imported, used for type)  
**Key Changes**:

- Root `<div>` → `<Box>` with `sx={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}`
- Background pattern `<div>` → `<Box>` with `sx={{ bgcolor: 'background.default' }}` + gradient pattern
- Main content column → `<Stack>` with `sx={{ height: '100%' }}` for vertical flow (FR-016)
- Normal mode inner layout → `<Stack>` for vertical section stacking (FR-016)
- Prayer cards grid `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6` → `<Grid container>` with `<Grid size={{ xs: 6, sm: 4, lg: 2 }}>` (12-column)
- Countdown+Weather grid → `<Grid container>` with `<Grid size={{ xs: 12, lg: 6 }}>` (12-column)
- `NodeJS.Timeout` → `ReturnType<typeof setTimeout>`
- Timer pattern: use `useRef` for fundraising timer to prevent leaks
- Remove all `className` strings

---

### Phase 3: Verification

1. `yarn build` — zero TypeScript errors (SC-003)
2. Visual QA at 1920×1080 — dark emerald/gold theme preserved (SC-002)
3. RTL mode — all components flip correctly (SC-004)
4. Responsive at 375px, 640px, 960px, 1440px, 1920px (SC-005)
5. Event mode toggle works (animations preserved) (SC-006)
6. Fundraising overlay opens, countdown works, auto-closes (SC-006)
7. `grep` for remaining Tailwind classes — zero matches (SC-001)
8. `grep` for `style={{ fontFamily` — zero matches (FR-018)
9. `grep` for empty `className=""` — zero matches (FR-023)
10. Arabic numerals on all numeric displays (FR-024)

## Complexity Tracking

No constitution violations requiring justification. All acknowledged items (V, VI, IX) have explicit spec deferrals.
