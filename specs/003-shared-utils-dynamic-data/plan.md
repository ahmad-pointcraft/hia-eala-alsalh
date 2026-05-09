# Implementation Plan: Shared Utilities & Dynamic Prayer Data

**Branch**: `003-shared-utils-dynamic-data` | **Date**: 2026-05-09 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-shared-utils-dynamic-data/spec.md`

## Summary

Extract 5 duplicated `toArabicNumerals()` copies and 9 duplicated `fontFamily`/`isRTL` patterns into `src/app/utils/helpers.ts`. Create `src/app/utils/prayerTimes.ts` with dynamic `getCurrentPrayer()`, `getNextPrayer()`, and `getTimeToNextPrayer()` functions that replace hardcoded values in App.tsx. Derive a `Translations` type from the existing translations object via `typeof` to replace all 6 `Record<string, string>` usages. Fix the fundraising timer memory leak with proper useRef cleanup. No new dependencies, no new components, no UI changes.

## Technical Context

**Language/Version**: TypeScript 5.8 (strict mode) + React 18.3
**Primary Dependencies**: MUI v7 (`@mui/material` 7.3.5, `@mui/icons-material` 7.3.5), Emotion 11.14, Framer Motion (`motion` 12.23.24), `lucide-react` 0.487, `date-fns` 3.6
**Storage**: N/A (no backend)
**Testing**: Manual visual QA + `yarn build` type checking (no test framework)
**Target Platform**: Browser — 1920x1080 kiosk display (Chromium)
**Project Type**: Single-page React web application (kiosk display)
**Performance Goals**: < 500KB gzipped bundle, single re-render per second
**Constraints**: No new npm dependencies, no MUI theme changes, no Tailwind, no shadcn
**Scale/Scope**: 2 new files (helpers.ts, prayerTimes.ts), 1 modified file (translations.ts), 12 component files updated

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Article | Requirement | Status | Notes |
|---|---|---|---|
| I. MUI-Only | All UI via MUI + sx prop | ✅ PASS | No UI changes — only utility extraction |
| II. TypeScript Strict | No `any` types | ✅ PASS | FR-008/FR-009 eliminate all loose typing. `Translations` type via `typeof` |
| III. Yarn | Package manager | ✅ PASS | No package changes |
| IV. Zero Dead Code | Remove duplicates | ✅ PASS | FR-004/FR-005 remove 5+9 duplicated functions |
| V. Shared Utilities (DRY) | Single-source utils | ✅ PASS | This is the PRIMARY purpose of this spec |
| VI. Dynamic Data | No hardcoded values | ✅ PASS | FR-001/FR-002 replace hardcoded currentPrayer and nextPrayerTime |
| VII. Kiosk-First | Error resilience | ✅ PASS | No behavioral changes to error handling |
| VIII. RTL-First | Logical CSS + dir prop | ✅ PASS | `getDirection()` consolidates RTL logic |
| IX. Single Timer | One setInterval | ⚠️ ACKNOWLEDGED | FR-011 fixes timer cleanup. Full single-timer consolidation is Spec 004 scope |

**Gate Result**: ✅ PASS — All violations are explicitly acknowledged. Article IX timer consolidation deferred to Spec 004.

### Post-Design Re-Check

| Concern | Resolution |
|---|---|
| FR-011 timer cleanup | useRef pattern prevents stacking; single-timer architecture is Spec 004 |
| `Translations` type | Derived via `typeof translations['en']` — automatic, no manual maintenance |
| Sunrise in prayer schedule | Confirmed: treated as valid entry for current/next prayer computation |

## Project Structure

### Documentation (this feature)

```text
specs/003-shared-utils-dynamic-data/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (speckit.tasks — NOT created by plan)
```

### Source Code (repository root)

```text
src/
├── main.tsx                              # Entry point (no changes)
├── app/
│   ├── App.tsx                           # [MODIFY] Dynamic prayer computation, timer fix, remove hardcoded values
│   ├── theme/
│   │   ├── muiTheme.ts                   # (no changes)
│   │   └── ThemeProviderWrapper.tsx       # (no changes)
│   ├── utils/
│   │   ├── translations.ts              # [MODIFY] Export Translations type
│   │   ├── helpers.ts                    # [NEW] Shared: toArabicNumerals, getFontFamily, isRTL, getDirection
│   │   └── prayerTimes.ts               # [NEW] PrayerTime interface, getCurrentPrayer, getNextPrayer, getTimeToNextPrayer
│   └── components/
│       ├── Header.tsx                    # [MODIFY] Import shared helpers, translations type
│       ├── PrayerCard.tsx                # [MODIFY] Remove toArabicNumerals, import shared, prayerIcons typed
│       ├── CountdownBar.tsx              # [MODIFY] Remove toArabicNumerals, import shared helpers
│       ├── MasjidInfo.tsx                # [MODIFY] Remove toArabicNumerals, import shared helpers + type
│       ├── HadithPanel.tsx               # [MODIFY] Import shared helpers, translations type
│       ├── WeatherWidget.tsx             # [MODIFY] Remove toArabicNumerals, import shared helpers + type
│       ├── AnnouncementsTicker.tsx        # [MODIFY] Import shared helpers
│       ├── FundraisingOverlay.tsx         # [MODIFY] Remove toArabicNumerals, import shared helpers + type
│       ├── EventModeDisplay.tsx           # [MODIFY] Import shared helpers, translations type
│       ├── IslamicGeometricOverlay.tsx     # (no changes — no text, no translations, no font)
│       ├── ImageCarousel.tsx              # (no changes — no language/translations props)
│       └── figma/
│           └── ImageWithFallback.tsx      # (no changes — no language/translations props)
```

**Structure Decision**: Single-project SPA. 2 new utility files, 1 modified type export, 10 component files updated. No new components, no new dependencies.

## Detailed Implementation Plan

---

### New File: src/app/utils/helpers.ts

**Exports**: `toArabicNumerals`, `getFontFamily`, `isRTL`, `getDirection`

**Functions**:

```typescript
import { Language } from './translations';

export const toArabicNumerals = (text: string): string => {
  const arabicNumerals = ['\u0660', '\u0661', '\u0662', '\u0663', '\u0664', '\u0665', '\u0666', '\u0667', '\u0668', '\u0669'];
  return text.replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)]);
};

export const getFontFamily = (language: Language): string => {
  // Standardized: inner double quotes required for CSS font-family with spaces
  return language === 'ar' ? '"Noto Naskh Arabic", serif' : '"Open Sans", sans-serif';
};

export const isRTL = (language: Language): boolean => {
  return language === 'ar';
};

export const getDirection = (language: Language): 'rtl' | 'ltr' => {
  return language === 'ar' ? 'rtl' : 'ltr';
};
```

**Removes from**:
- `toArabicNumerals`: PrayerCard.tsx:34, CountdownBar.tsx:12, WeatherWidget.tsx:11, FundraisingOverlay.tsx:17, MasjidInfo.tsx:11
- `fontFamily` const: PrayerCard.tsx:63, CountdownBar.tsx:43, WeatherWidget.tsx:18, FundraisingOverlay.tsx:44, MasjidInfo.tsx:41, Header.tsx:38, EventModeDisplay.tsx:21, HadithPanel.tsx:14, AnnouncementsTicker.tsx:17
- `isRTL` const: CountdownBar.tsx:42, WeatherWidget.tsx:17, FundraisingOverlay.tsx:43, MasjidInfo.tsx:40, EventModeDisplay.tsx:20, HadithPanel.tsx:13, AnnouncementsTicker.tsx:16

---

### New File: src/app/utils/prayerTimes.ts

**Exports**: `PrayerKey`, `PrayerTime`, `NextPrayer`, `getCurrentPrayer`, `getNextPrayer`, `getTimeToNextPrayer`

**Types**:

```typescript
export type PrayerKey = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export interface PrayerTime {
  key: PrayerKey;
  name: string;
  time: string;       // HH:MM format
  iqamaTime: string;  // HH:MM format or '—'
}

export interface NextPrayer extends PrayerTime {
  isTomorrow: boolean;
}
```

**Functions**:

```typescript
const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const getCurrentPrayer = (prayers: PrayerTime[], now: Date): PrayerTime | null => {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  let current: PrayerTime | null = null;
  for (const prayer of prayers) {
    if (parseTimeToMinutes(prayer.time) <= currentMinutes) {
      current = prayer;
    } else {
      break;
    }
  }
  return current;
};

export const getNextPrayer = (prayers: PrayerTime[], now: Date): NextPrayer => {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  for (const prayer of prayers) {
    if (parseTimeToMinutes(prayer.time) > currentMinutes) {
      return { ...prayer, isTomorrow: false };
    }
  }
  return { ...prayers[0], isTomorrow: true };
};

export const getTimeToNextPrayer = (prayers: PrayerTime[], now: Date): number => {
  const next = getNextPrayer(prayers, now);
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  let targetMinutes = parseTimeToMinutes(next.time);
  if (next.isTomorrow) {
    targetMinutes += 24 * 60;
  }
  return Math.max(0, (targetMinutes - currentMinutes) * 60);
};
```

**Behavior**:
- `getCurrentPrayer`: Returns last prayer whose time ≤ current time, or `null` if before Fajr
- `getNextPrayer`: Returns next prayer with `isTomorrow` flag for after-Isha wrap
- `getTimeToNextPrayer`: Returns seconds until next prayer (handles day wrap)

---

### Modified File: src/app/utils/translations.ts

**Change**: Add `Translations` type export

```typescript
export type Translations = typeof translations['en'];
```

This single line derives the complete type from the existing `en` object, covering all nested structures (prayers, event, fundraising, weather, days, months, announcementsList).

---

### Modified File: src/app/App.tsx

**Key Changes**:

1. **Remove hardcoded currentPrayer**:
   - Before: `const currentPrayer = "Dhuhr";`
   - After: `const currentPrayer = getCurrentPrayer(prayers, currentTime);` (computed every second)

2. **Remove hardcoded nextPrayerTime**:
   - Before: `<CountdownBar nextPrayerTime="16:15" ... />`
   - After: `<CountdownBar nextPrayerTime={nextPrayer.time} ... />` (dynamic)

3. **Add clock-driven state**:
   - The `currentTime` state already exists in Header.tsx for the clock display
   - App.tsx needs its own `currentTime` state (or receives it) to drive prayer computation
   - Simplest: add `const [currentTime, setCurrentTime] = useState(new Date())` with 1-second interval in App.tsx

4. **Fix timer memory leak**:
   - Before: Recursive `setTimeout` with only last ref tracked
   - After: `useRef<ReturnType<typeof setTimeout> | null>(null)` with `clearTimeout` before each new schedule

5. **Import shared utilities**:
   - Remove `isNearPrayerTime` function from App.tsx → move to prayerTimes.ts
   - Import `getCurrentPrayer`, `getNextPrayer`, `getTimeToNextPrayer` from prayerTimes.ts

---

### Modified Files: All 10 Components

**Pattern for each component**:

1. Remove local `toArabicNumerals` function (if present)
2. Remove local `fontFamily` const
3. Remove local `isRTL` const
4. Add imports: `import { toArabicNumerals, getFontFamily, isRTL, getDirection } from '../utils/helpers';`
5. Replace `translations: Record<string, string>` with `translations: Translations` (if applicable)
6. Add `import { Translations } from '../utils/translations';` (if applicable)
7. Replace `dir={isRTL ? 'rtl' : 'ltr'}` with `dir={getDirection(language)}`
8. Replace `fontFamily` variable references with `getFontFamily(language)`

**Components with translations prop** (6 files — type change):
- Header.tsx, HadithPanel.tsx, WeatherWidget.tsx, MasjidInfo.tsx, FundraisingOverlay.tsx, EventModeDisplay.tsx

**Components with toArabicNumerals** (5 files — function removal):
- PrayerCard.tsx, CountdownBar.tsx, WeatherWidget.tsx, FundraisingOverlay.tsx, MasjidInfo.tsx

**Components with only fontFamily/isRTL** (2 files — helper import only):
- AnnouncementsTicker.tsx (also has isRTL for scroll direction logic)
- Header.tsx (also has translations type change)

**Components NOT modified** (3 files):
- IslamicGeometricOverlay.tsx — no text, no translations, no font
- ImageCarousel.tsx — no language/translations props
- ImageWithFallback.tsx — no language/translations props

### CountdownBar.tsx — Additional Changes

The component currently receives `nextPrayer` (name) and `nextPrayerTime` (HH:MM) as props. After this spec:
- Props remain the same — App.tsx passes dynamic values instead of hardcoded ones
- No prop interface changes needed

### AnnouncementsTicker.tsx — Special Case

Uses `isRTL` for scroll direction logic (speed +1 vs -1, scrollLeft vs scrollRight). The shared `isRTL()` function works identically — just import and use.

### PrayerCard.tsx — prayerIcons Typing

Before:
```typescript
const prayerIcons: Record<string, React.ComponentType<{ className?: string }>> = {
```

After:
```typescript
import { PrayerKey } from '../utils/prayerTimes';

const prayerIcons: Record<PrayerKey, React.ComponentType<{ className?: string }>> = {
```

This makes the key type a union literal instead of generic `string`.

## Complexity Tracking

No constitution violations requiring justification. Article IX acknowledged — full single-timer is Spec 004 scope.
