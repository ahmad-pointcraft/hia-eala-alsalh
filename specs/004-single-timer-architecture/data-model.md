# Data Model: Single Timer Architecture

**Branch**: `004-single-timer-architecture` | **Date**: 2026-05-10 | **Spec**: [spec.md](./spec.md)

## Entities

### ClockState (useClock return type)

| Field | Type | Description |
|-------|------|-------------|
| `currentTime` | `Date` | Current timestamp, updated every 1 second via `setInterval` |

**Lifecycle**: Created on mount via `useState(new Date())`. Updated every 1000ms. Never null.

### HeaderProps (updated)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `eventMode` | `boolean` | Yes | Event mode toggle state |
| `onToggleEventMode` | `() => void` | Yes | Toggle callback |
| `language` | `Language` | Yes | Current language |
| `onToggleLanguage` | `() => void` | Yes | Language toggle callback |
| `onShowFundraising` | `() => void` | Yes | Show fundraising callback |
| `translations` | `Translations` | Yes | Translation strings |
| `currentTime` | `Date` | **NEW** | Shared clock value |

**Removed**: None. Pure addition.

### MasjidInfoProps (updated)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `language` | `Language` | Yes | Current language |
| `translations` | `Translations` | Yes | Translation strings |
| `currentTime` | `Date` | **NEW** | Shared clock value |

**Removed**: None. Pure addition.

### CountdownBarProps (updated)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `nextPrayer` | `string` | Yes | Next prayer name |
| `nextPrayerTime` | `string` | Yes | Next prayer time in `"HH:MM"` format |
| `language` | `Language` | Yes | Current language |
| `currentTime` | `Date` | **NEW** | Shared clock value |

**Removed**: `nextPrayerLabel` (unused dead code, FR-011).

## Derived Computations

### Countdown Value (inside CountdownBar render body)

```
Input: currentTime (Date), nextPrayerTime (string "HH:MM")
Output: countdown string "HH:MM:SS"

Algorithm:
1. Parse nextPrayerTime → hours, minutes
2. Create target Date from currentTime, set hours/minutes/0/0
3. If target < currentTime → target.setDate(+1) (midnight rollover)
4. diff = target - currentTime (milliseconds)
5. Convert diff → hours, minutes, seconds
6. Format as "HH:MM:SS" with zero-padding
7. If Arabic language → toArabicNumerals(countdown)
```

**State transitions**:
- `diff > 0`: Normal countdown, decrements every second
- `diff <= 0`: Target passed → re-derives next prayer on next render (getNextPrayer returns next entry or tomorrow's Fajr)
- `diff` crosses midnight: `setDate(+1)` handles wrap

### activePrayer / nextPrayer (in App.tsx render body)

```
Input: currentTime (Date), prayers (PrayerTime[])
Output: activePrayer (PrayerTime | null), nextPrayer (PrayerTime & { isTomorrow?: boolean })

Algorithm (existing, unchanged):
- getCurrentPrayer(prayers, currentTime) → last prayer whose time <= now
- getNextPrayer(prayers, currentTime) → first prayer whose time > now, wraps to [0] if none
```

**No logic changes** — these functions simply receive the `useClock` return value instead of the local `currentTime` state.

## Entity Relationships

```
useClock()
  └── returns { currentTime: Date }
       │
       ├── App.tsx
       │   ├── getCurrentPrayer(prayers, currentTime) → activePrayer
       │   ├── getNextPrayer(prayers, currentTime) → nextPrayer
       │   ├── <Header currentTime={currentTime} ... />
       │   ├── <MasjidInfo currentTime={currentTime} ... />
       │   └── <CountdownBar currentTime={currentTime} nextPrayerTime={nextPrayer.time} ... />
       │
       └── (all time-dependent displays derive from this single Date)
```

## Validation Rules

| Rule | Enforcement |
|------|------------|
| `currentTime` is always a `Date` instance | TypeScript strict mode |
| No `any` types in any changed file | SC-005 (grep verification) |
| `nextPrayerTime` format is `"HH:MM"` | Hardcoded source (prayers array) — no runtime validation needed this round |
| Countdown computed on first render | SC-006 — no `useState` with placeholder |
