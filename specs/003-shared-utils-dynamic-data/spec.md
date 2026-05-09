# Feature Specification: Shared Utilities & Dynamic Prayer Data

**Feature Branch**: `003-shared-utils-dynamic-data`  
**Created**: 2026-05-09  
**Status**: Draft  
**Input**: User description: "Extract shared utilities and replace hardcoded data with dynamic computation"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dynamic Current Prayer Highlighting (Priority: P1)

As a mosque visitor, I want the prayer card for the current active prayer to be highlighted based on the actual time of day, so I can immediately see which prayer window we are in.

**Why this priority**: This is the most visible bug — Dhuhr is always highlighted regardless of actual time, making the display incorrect for most of the day.

**Independent Test**: Open the app at any time of day and verify the correct prayer card is highlighted (active state with gold glow). Change the system clock to different times and confirm the highlight moves to the correct prayer.

**Acceptance Scenarios**:

1. **Given** it is 6:00 AM (before Fajr at 5:30 + iqama buffer), **When** the display loads, **Then** no prayer card is highlighted (or Isha from previous day)
2. **Given** it is 5:45 AM (within Fajr window), **When** the display loads, **Then** the Fajr prayer card is highlighted with gold glow
3. **Given** it is 13:00 (within Dhuhr window), **When** the display loads, **Then** the Dhuhr prayer card is highlighted
4. **Given** it is 21:30 (after Isha window), **When** the display loads, **Then** the Isha prayer card remains highlighted as last prayer of the day
5. **Given** it is 5:31 AM (just after Fajr starts), **When** the display loads, **Then** Fajr is highlighted and the countdown shows time until Sunrise

---

### User Story 2 - Dynamic Countdown to Next Prayer (Priority: P1)

As a mosque visitor, I want the countdown timer to show the actual time remaining until the next prayer, not a hardcoded value, so I know exactly how long until prayer time.

**Why this priority**: The countdown is the most prominent time indicator — currently stuck showing a countdown to 16:15 (Asr) forever.

**Independent Test**: Open the app and verify the countdown shows hours:minutes:seconds until the next actual prayer. After a prayer passes, verify the countdown switches to the following prayer.

**Acceptance Scenarios**:

1. **Given** it is 12:00 (30 minutes before Dhuhr at 12:45), **When** the display loads, **Then** the countdown shows 00:45:00 (or close) counting down to Dhuhr
2. **Given** it is 12:46 (just after Dhuhr time), **When** the display loads, **Then** the countdown switches to show time until Asr (16:15)
3. **Given** it is 20:46 (just after Isha), **When** the display loads, **Then** the countdown shows time until tomorrow's Fajr
4. **Given** the countdown reaches zero, **When** a prayer time arrives, **Then** the current prayer highlight updates and countdown switches to the next prayer

---

### User Story 3 - Shared Utility Consolidation (Priority: P1)

As a developer, I want all duplicated utility functions extracted into a single shared module, so that bug fixes apply everywhere and the codebase follows DRY principles.

**Why this priority**: Code duplication is a maintenance hazard — the same `toArabicNumerals` function exists in 5 separate files, and font/RTL logic is duplicated in 7 components.

**Independent Test**: Grep the codebase for `toArabicNumerals` function definitions — only one should exist in the shared utility file. All other files import it.

**Acceptance Scenarios**:

1. **Given** the shared utility module exists, **When** searching all source files, **Then** `toArabicNumerals` is defined exactly once
2. **Given** the shared utility module exists, **When** searching all source files, **Then** `getFontFamily` and `isRTL` are defined exactly once
3. **Given** a component needs Arabic numerals, **When** it imports the shared utility, **Then** it works identically to the previous inline version
4. **Given** the font family logic changes (e.g., new Arabic font), **When** the change is made in one place, **Then** all 7 components use the updated logic

---

### User Story 4 - Strong TypeScript Types (Priority: P2)

As a developer, I want proper TypeScript types for all translations and component props, so that typos and missing translation keys are caught at compile time, not at runtime.

**Why this priority**: Type safety prevents bugs but is not user-visible. Important for maintainability but secondary to the broken prayer highlighting.

**Independent Test**: Intentionally misspell a translation key in a component — the build must fail with a TypeScript error.

**Acceptance Scenarios**:

1. **Given** the Translations type is defined, **When** a component references `translations.invalidKey`, **Then** the TypeScript build fails
2. **Given** the Translations type is defined, **When** a component accesses a valid nested key like `translations.fundraising.title`, **Then** TypeScript confirms the value is a string
3. **Given** all component props use the Translations type, **When** searching for `any` in component interfaces, **Then** zero matches are found

---

### User Story 5 - Timer Memory Leak Fix (Priority: P2)

As a developer, I want the fundraising timer to properly clean up all scheduled timeouts, so the 24/7 kiosk display doesn't accumulate leaked timers over days of operation.

**Why this priority**: Memory leaks are serious for a 24/7 kiosk but don't cause immediate visible bugs — they degrade performance over hours/days.

**Independent Test**: Open browser devtools memory profiler, let the app run for 30 minutes, verify memory usage remains stable (no continuous growth from orphaned timers).

**Acceptance Scenarios**:

1. **Given** the fundraising schedule is active, **When** the component unmounts or re-renders, **Then** all pending timeouts are cleared
2. **Given** the recursive scheduling pattern, **When** a timeout fires and schedules the next, **Then** only one timeout is active at any time
3. **Given** the app runs for 24 hours, **When** memory is profiled, **Then** there is no growing accumulation of timer references

---

### Edge Cases

- What happens when the current time is after Isha (last prayer) — no next prayer exists until tomorrow?
- What happens when the current time is exactly at a prayer time boundary (e.g., exactly 12:45)?
- What happens when the clock is between Fajr and Sunrise — is Fajr or Sunrise the "next" prayer?
- What happens if a prayer time array is empty or has only one entry?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST compute the current active prayer as the prayer whose time has most recently passed (e.g., at 13:00 with Dhuhr at 12:45, Dhuhr is active)
- **FR-002**: System MUST compute the next upcoming prayer based on actual wall-clock time, wrapping to tomorrow's Fajr after Isha
- **FR-003**: System MUST compute the countdown duration (HH:MM:SS) as the time difference between now and the next prayer time
- **FR-004**: System MUST extract `toArabicNumerals()` into a single shared utility module, removing all 5 duplicated copies
- **FR-005**: System MUST extract `getFontFamily()` and `isRTL()` into a single shared utility module, removing all 7 duplicated copies
- **FR-006**: System MUST extract `getDirection()` as a convenience function returning `'rtl'` or `'ltr'`
- **FR-007**: System MUST define a `PrayerTime` interface with `key`, `name`, `time`, and `iqamaTime` fields
- **FR-008**: System MUST derive the `Translations` type from the existing translations object via `typeof translations['en']` for automatic type inference
- **FR-009**: System MUST replace all `translations: Record<string, string>` with `translations: Translations` in component props
- **FR-010**: System MUST type `prayerIcons` as a properly typed constant using the `PrayerTime` key union
- **FR-011**: System MUST fix the fundraising timer to use a tracked ref pattern where all scheduled timeouts are properly cleared on unmount
- **FR-012**: System MUST remove all unused imports from components
- **FR-013**: System MUST handle the "after Isha" edge case by wrapping to tomorrow's Fajr (next-day computation)
- **FR-014**: System MUST update the current prayer computation every second (tied to the existing clock interval)
- **FR-015**: System MUST keep prayer time data in a single source of truth — the prayer schedule array in App.tsx or a shared module
- **FR-016**: WeatherWidget and FundraisingOverlay hardcoded values (temperature, donation amounts) are explicitly out of scope — those are API integration tasks deferred to Spec 004

### Key Entities

- **PrayerTime**: Represents a single prayer with key (e.g., "Fajr"), display name, prayer time (HH:MM), and iqama time (HH:MM)
- **PrayerSchedule**: The ordered list of daily prayer times, used by both current-prayer and next-prayer computations
- **Translations**: The full type structure of the bilingual translation object, including nested keys for prayers, events, fundraising, weather, days, and months

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The correct prayer card is highlighted at any time of day, verifiable by checking the display against the actual clock
- **SC-002**: The countdown shows the correct time remaining until the next prayer, ticking down every second
- **SC-003**: `toArabicNumerals` function is defined in exactly 1 file and imported everywhere else — zero duplicate definitions
- **SC-004**: `getFontFamily` and `isRTL` functions are defined in exactly 1 file and imported everywhere else — zero duplicate definitions
- **SC-005**: Zero `any` type usage in any component interface — all translations props use the `Translations` type
- **SC-006**: The build passes with zero TypeScript errors after type strengthening
- **SC-007**: Production bundle remains under 500KB gzipped

## Clarifications

### Session 2026-05-09

- Q: How should getCurrentPrayer determine the "active" prayer? → A: The prayer whose time has most recently passed. At 13:00 with Dhuhr at 12:45, Dhuhr is active.
- Q: How should getNextPrayer handle after Isha? → A: Wrap to tomorrow's Fajr with next-day date computation.
- Q: Should Translations type be derived via typeof or hand-written? → A: Use `type Translations = typeof translations['en']` for automatic type inference from the source of truth.
- Q: Should WeatherWidget/FundraisingOverlay hardcoded values be addressed here? → A: No — those are API integration tasks deferred to Spec 004. This spec only addresses prayer time dynamics and code deduplication.

## Assumptions

- Prayer times are currently hardcoded in App.tsx and will remain hardcoded in this spec — dynamic API-fetched prayer times are out of scope
- The prayer schedule includes 6 entries: Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha — this is the standard Hanafi schedule
- "Current prayer" = the prayer whose time has most recently passed (confirmed in Clarifications)
- Sunrise is included for display but is not a mandatory prayer — it may or may not be highlighted the same way
- After Isha (last prayer), Fajr of the next day is the next prayer — the countdown will show hours until tomorrow's Fajr (confirmed in Clarifications)
- The existing translations object structure is the source of truth for the Translations type — derived via `typeof` (confirmed in Clarifications)
- The fundraising timer fix only addresses cleanup — the scheduling interval (1 min initial, 10 min recurring) remains unchanged
- WeatherWidget temperature and FundraisingOverlay donation amounts remain hardcoded — API integration is Spec 004 scope (confirmed in Clarifications)
- Unused imports: `Languages` was already removed from App.tsx in Spec 002, and `logoSvg` was already removed from MasjidInfo — FR-012 covers any remaining unused imports found during this spec's implementation
