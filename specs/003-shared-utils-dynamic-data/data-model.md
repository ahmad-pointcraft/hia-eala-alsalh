# Data Model: Shared Utilities & Dynamic Prayer Data

**Feature**: 003-shared-utils-dynamic-data
**Date**: 2026-05-09

## Overview

This feature introduces 2 new utility modules and 1 type export. No new entities or state management — the data model documents the new types, interfaces, and function signatures.

---

## New Types

### PrayerKey

```typescript
type PrayerKey = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
```

Union literal of all prayer keys. Used to type `prayerIcons` and `PrayerTime.key`.

### PrayerTime

```typescript
interface PrayerTime {
  key: PrayerKey;
  name: string;       // Display name from translations (e.g., "Fajr", "الفجر")
  time: string;       // HH:MM format (e.g., "05:30")
  iqamaTime: string;  // HH:MM format or '—' for Sunrise
}
```

### NextPrayer

```typescript
interface NextPrayer extends PrayerTime {
  isTomorrow: boolean;  // true when wrapping after Isha to next day's Fajr
}
```

### Translations

```typescript
type Translations = typeof translations['en'];
```

Derived from the existing `translations` object in `translations.ts`. Covers:
- Top-level strings: masjidName, donate, comingEvent, exitEvent, nextPrayer, hadithOfTheDay, etc.
- Nested objects: prayers (6 keys), event (16 keys), fundraising (10 keys), weather (4 keys), days (7 keys), months (12 keys)
- Arrays: announcementsList (string[])

---

## New Module: helpers.ts

| Function | Signature | Returns |
|---|---|---|
| `toArabicNumerals` | `(text: string) => string` | Input with 0-9 replaced by ٠-٩ |
| `getFontFamily` | `(language: Language) => string` | '"Noto Naskh Arabic", serif' or '"Open Sans", sans-serif' |
| `isRTL` | `(language: Language) => boolean` | `true` when language is 'ar' |
| `getDirection` | `(language: Language) => 'rtl' \| 'ltr'` | Direction string for `dir` prop |

---

## New Module: prayerTimes.ts

| Function | Signature | Returns |
|---|---|---|
| `parseTimeToMinutes` | `(time: string) => number` | Minutes from midnight (internal) |
| `getCurrentPrayer` | `(prayers: PrayerTime[], now: Date) => PrayerTime \| null` | Most recent prayer, or null before Fajr |
| `getNextPrayer` | `(prayers: PrayerTime[], now: Date) => NextPrayer` | Next upcoming prayer with isTomorrow flag |
| `getTimeToNextPrayer` | `(prayers: PrayerTime[], now: Date) => number` | Seconds until next prayer |

---

## Modified Component Props

### Components receiving `translations: Record<string, string>` → `translations: Translations`

| Component | File | Interface |
|---|---|---|
| Header | Header.tsx | HeaderProps |
| MasjidInfo | MasjidInfo.tsx | MasjidInfoProps |
| HadithPanel | HadithPanel.tsx | HadithPanelProps |
| WeatherWidget | WeatherWidget.tsx | WeatherWidgetProps |
| FundraisingOverlay | FundraisingOverlay.tsx | FundraisingOverlayProps |
| EventModeDisplay | EventModeDisplay.tsx | EventModeDisplayProps |

### Components with `prayerIcons` typing change

| Component | File | Before | After |
|---|---|---|---|
| PrayerCard | PrayerCard.tsx | `Record<string, React.ComponentType<...>>` | `Record<PrayerKey, React.ComponentType<...>>` |

---

## App.tsx State Changes

| Variable | Before | After |
|---|---|---|
| `currentPrayer` | `const currentPrayer = "Dhuhr"` (hardcoded string) | `getCurrentPrayer(prayers, currentTime)` (computed, updates every second) |
| `nextPrayerTime` prop | `"16:15"` (hardcoded string) | `getNextPrayer(prayers, currentTime).time` (computed) |
| `fundraisingTimerRef` | `useRef<ReturnType<typeof setTimeout> \| null>` | Same type, but clearTimeout before each reschedule |
| `currentTime` (new) | N/A | `useState(new Date())` with 1-second interval |

---

## Validation Rules

- FR-008: `Translations` type must cover all keys accessed by components (build fails on missing key)
- FR-010: `PrayerKey` union must match all keys in `prayerIcons` record
- FR-001: `getCurrentPrayer` returns `null` before Fajr, last prayer after Isha
- FR-002: `getNextPrayer` always returns a value (wraps to tomorrow's Fajr)
- FR-013: `isTomorrow` flag is `true` only when wrapping after Isha
