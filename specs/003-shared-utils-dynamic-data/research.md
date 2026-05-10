# Research: Shared Utilities & Dynamic Prayer Data

**Feature**: 003-shared-utils-dynamic-data
**Date**: 2026-05-09

## Research Items

### R01: `typeof` type derivation for translations object

**Decision**: Use `type Translations = typeof translations['en']`

**Rationale**: The translations object is a static constant with full type information. `typeof` derivation means the Translations type automatically updates when translations are modified. No manual interface maintenance required. TypeScript's type system handles all nested objects (prayers, event, fundraising, weather, days, months, announcementsList).

**Alternatives considered**:
- Hand-written interface: High maintenance cost, drift risk when translations change
- `Record<string, string>`: Loses all nested structure (prayers.fajr, event.title, etc.)
- Generic `any`: Violates Article II (TypeScript Strict)

### R02: Prayer time comparison strategy

**Decision**: Store prayer times as HH:MM strings, parse to minutes-from-midnight for comparison

**Rationale**: The prayer schedule is currently defined with string times ("05:30", "12:45", etc.). Parsing to minutes-from-midnight (integer) enables simple arithmetic comparison. No need to construct Date objects for each prayer.

**Alternatives considered**:
- Date objects per prayer: Over-engineered for a simple time-of-day comparison
- Store as minutes directly: Less readable in source code ("330" vs "05:30")
- Store as seconds: Unnecessary precision for minute-resolution prayer times

### R03: After-Isha wrap-around handling

**Decision**: Return Fajr with `isTomorrow: true` flag

**Rationale**: After Isha (last prayer, ~20:45), the next prayer is tomorrow's Fajr (~05:30). The countdown needs to show the correct duration (can be 8+ hours). Adding `isTomorrow` flag to the return type allows consumers to compute the correct time delta by adding 24*60 minutes.

**Alternatives considered**:
- Return null after Isha: Forces consumers to handle null case separately
- Return Fajr without flag: Consumer can't distinguish today vs tomorrow
- Compute tomorrow's Date: Over-engineered — minutes arithmetic is sufficient

### R04: Timer cleanup pattern for recursive setTimeout

**Decision**: `useRef<ReturnType<typeof setTimeout> | null>` with `clearTimeout` before each reschedule

**Rationale**: The current pattern in App.tsx only tracks the last timeout reference. When the recursive `scheduleFundraising()` calls itself, the previous ref is overwritten without being cleared. By clearing the ref before each new `setTimeout`, we guarantee only one timeout is active at any time. The cleanup function clears on unmount.

**Alternatives considered**:
- `setInterval` instead of recursive `setTimeout`: Doesn't allow dynamic rescheduling based on prayer proximity
- AbortController: Over-engineered for a simple timeout
- Tracking all refs in an array: Unnecessary complexity for single-active-timer pattern

### R05: Sunrise treatment in prayer schedule

**Decision**: Sunrise IS a valid entry for getCurrentPrayer and getNextPrayer

**Rationale**: Sunrise is included in the 6-entry prayer schedule displayed to users. When the time is between Fajr and Sunrise, Sunrise should be "next" and the countdown should target it. When between Sunrise and Dhuhr, Sunrise is "current". This matches user expectations — the display shows 6 cards and the highlight/countdown should track all 6.

**Alternatives considered**:
- Skip Sunrise for current/next: Inconsistent with the 6-card display
- Special Sunrise handling: Adds unnecessary branching complexity

### R06: getCurrentPrayer returns null before Fajr

**Decision**: Return `null` when current time is before the first prayer (Fajr)

**Rationale**: Between midnight and Fajr (00:00–05:30), no prayer has "most recently passed". The UI should show no prayer highlighted (or optionally show Isha from the previous day). The null return gives the consumer flexibility.

**Alternatives considered**:
- Return Isha from previous day: Requires storing "yesterday's schedule" state
- Return Fajr as "upcoming": Confusing — Fajr hasn't happened yet
- Throw error: Hostile for a kiosk display (Article VII)
