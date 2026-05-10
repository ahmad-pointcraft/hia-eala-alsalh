# Feature Specification: Single Timer Architecture

**Feature Branch**: `004-single-timer-architecture`  
**Created**: 2026-05-10  
**Status**: Draft  
**Input**: User description: "Consolidate 4 independent 1-second setInterval timers into a single useClock hook per Constitution Article IX (Single Timer Principle)."

## Clarifications

### Session 2026-05-10

- Q: Should `useClock` be a context provider (so deep children auto-subscribe) or a simple hook called once in App.tsx with the value passed as props? → A: Simple hook called once in App.tsx, value passed as props. The tree is only 1–2 levels deep (App → Header/MasjidInfo/CountdownBar). Context adds unnecessary complexity for 3 consumers at the same level. Constitution Article IV (Zero Dead Code) favors the simpler approach.
- Q: Should CountdownBar receive a pre-computed countdown string or derive it from `currentTime` + `nextPrayerTime` props? → A: Derive it inside CountdownBar from the `currentTime` prop. The component already receives `nextPrayerTime` (e.g., "16:15"). It parses that into a target Date and computes `target - currentTime`. This keeps display logic local to the component that renders it.
- Q: Should `useClock` return a raw `Date` or an object `{ currentTime: Date }`? → A: Return `{ currentTime: Date }` for future extensibility. If we later add derived values (formatted time, day-of-week), we can add them without breaking the API.
- Q: How do we verify the 4 redundant timers are gone without unit tests? → A: Grep-based verification: `grep "setInterval" src/app/App.tsx src/app/components/Header.tsx src/app/components/MasjidInfo.tsx src/app/components/CountdownBar.tsx` must return 0 matches; `grep "setInterval" src/app/utils/useClock.ts src/app/components/ImageCarousel.tsx src/app/components/FundraisingOverlay.tsx` must return exactly 3 matches.
- Q: Should we create a separate `useCountdown` hook or keep countdown computation inline in CountdownBar? → A: Keep it inline in CountdownBar. Only one component needs countdown computation. A separate hook would be premature abstraction. Constitution Article IV (Zero Dead Code) applies.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Kiosk Clock Display Updates Reliably (Priority: P1)

As a masjid attendee viewing the 24/7 kiosk display, the digital clock in the header updates every second without interruption or visual glitches, exactly as it does today.

**Why this priority**: The clock is the most visible and frequently observed element on the display. Any regression here would be immediately noticeable to every attendee.

**Independent Test**: Can be fully tested by observing the header clock for 60+ seconds and confirming it ticks every second with no missed or double updates.

**Acceptance Scenarios**:

1. **Given** the kiosk display is running, **When** a user watches the header clock, **Then** the time updates every second with no gaps, freezes, or duplicate timestamps
2. **Given** the display has been running for 24+ hours, **When** midnight passes, **Then** the clock continues ticking normally with the correct date

---

### User Story 2 - Countdown Timer Ticks Accurately (Priority: P1)

As a masjid attendee, the countdown to next prayer updates every second and reaches zero exactly when the prayer time arrives.

**Why this priority**: The countdown directly informs attendees how much time remains before the next prayer — a core function of the display.

**Independent Test**: Can be fully tested by noting the countdown value and a reference clock, then verifying the countdown decrements by exactly 1 second per second and reaches 00:00:00 at the correct prayer time.

**Acceptance Scenarios**:

1. **Given** the next prayer is at a known time, **When** a user watches the countdown, **Then** it decrements by exactly 1 second per real second
2. **Given** the countdown reaches 00:00:00, **When** the prayer time arrives, **Then** the countdown wraps to the subsequent prayer time without displaying negative values or freezing
3. **Given** the countdown is displayed, **When** Arabic language is active, **Then** numerals are rendered in Arabic-Indic digits (٠-٩)

---

### User Story 3 - Gregorian Date Display Updates at Midnight (Priority: P2)

As a masjid attendee, the Gregorian date shown below the masjid logo is always the current date, updating automatically at midnight.

**Why this priority**: Date display accuracy is important but changes only once daily — less critical than real-time clock and countdown.

**Independent Test**: Can be tested by checking that the displayed Gregorian date matches today's date and monitoring around midnight for automatic rollover.

**Acceptance Scenarios**:

1. **Given** the display is showing today's date, **When** midnight passes, **Then** the Gregorian date updates to the next day automatically
2. **Given** Arabic language is active, **When** the date is displayed, **Then** numerals in the Gregorian date appear in Arabic-Indic digits

---

### User Story 4 - Prayer Highlighting Reflects Current Time (Priority: P1)

As a masjid attendee, the prayer card for the currently active prayer is highlighted, and the highlight switches to the next prayer at the correct time.

**Why this priority**: Active prayer highlighting is the primary way attendees identify which prayer window they are in — equal priority to clock and countdown.

**Independent Test**: Can be tested by observing which prayer card is highlighted and comparing against the current time and prayer schedule.

**Acceptance Scenarios**:

1. **Given** the current time is between Fajr and Sunrise, **When** a user views the prayer cards, **Then** the Fajr card is highlighted as active
2. **Given** a prayer time passes, **When** the next prayer window begins, **Then** the highlight switches to the correct next prayer card immediately

---

### Edge Cases

- What happens when the display runs continuously across midnight? The shared clock's Date object naturally rolls over — clock, date, countdown, and prayer highlighting must all update correctly.
- What happens if the next prayer time has already passed today? The countdown wraps to tomorrow's first prayer (Fajr) by adding 1 day to the target date.
- What happens when language is toggled mid-countdown? The countdown value is derived from the shared clock (not affected by language), only the display formatting (Arabic vs Western numerals, label text) changes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a single shared time source (`useClock` hook) that updates once per second, called once in App.tsx with the value passed as props to consuming components
- **FR-002**: The `useClock` hook MUST return `{ currentTime: Date }` for future extensibility without breaking the API
- **FR-003**: The header clock display MUST reflect the current time from `currentTime` prop, updating every second
- **FR-004**: The Gregorian date display MUST reflect the current date from `currentTime` prop, updating at midnight automatically
- **FR-005**: The countdown to next prayer MUST be derived inline inside CountdownBar from `currentTime` prop and `nextPrayerTime` prop — the component parses `nextPrayerTime` into a target Date and computes the difference
- **FR-006**: No separate `useCountdown` hook MUST be created — countdown computation stays inline in CountdownBar (single consumer, no premature abstraction per Article IV)
- **FR-007**: The active prayer highlight MUST be computed from the `currentTime` prop and update when the prayer window changes
- **FR-008**: The carousel auto-advance timer (5-second interval) and fundraising self-dismiss timer MUST continue operating independently without any changes to their behavior
- **FR-009**: All visual behavior MUST remain identical to the pre-refactor state — no flicker, no blank states, no missing updates
- **FR-010**: The system MUST NOT introduce any new external dependencies

### Key Entities

- **useClock Hook**: A simple hook (not a context provider) called once in App.tsx. Returns `{ currentTime: Date }`. Uses a single `setInterval` internally with proper cleanup on unmount. The value is passed as props to Header, MasjidInfo, and CountdownBar.
- **Time Consumer**: Any display component (clock, date, countdown, prayer state) that receives `currentTime` as a prop and derives its display value from it. CountdownBar additionally receives `nextPrayerTime` and computes the countdown inline.
- **Independent Timers**: ImageCarousel (5-second auto-advance) and FundraisingOverlay (1-second self-dismiss) retain their own `setInterval` calls — these are not consolidated into `useClock`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The number of active 1-second interval timers driving display updates is reduced from 4 to exactly 1
- **SC-002**: Grep-based verification confirms timer consolidation: `grep "setInterval" src/app/App.tsx src/app/components/Header.tsx src/app/components/MasjidInfo.tsx src/app/components/CountdownBar.tsx` returns 0 matches; `grep "setInterval" src/app/utils/useClock.ts src/app/components/ImageCarousel.tsx src/app/components/FundraisingOverlay.tsx` returns exactly 3 matches
- **SC-003**: All display elements (clock, date, countdown, prayer highlighting) update at the same rate and accuracy as before the change — verified by side-by-side comparison
- **SC-004**: The application build completes with zero errors
- **SC-005**: No timing-related regressions are introduced — clock ticks every second, countdown decrements every second, date rolls over at midnight, prayer highlighting switches at the correct time

## Assumptions

- The kiosk display is the sole consumer of these timers — there are no external systems reading from them
- The component tree is shallow (1–2 levels: App → Header/MasjidInfo/CountdownBar), making prop passing sufficient — a context provider is unnecessary (Constitution Article IV)
- `useClock` is called once in App.tsx and `currentTime` is passed down as a prop to all time-dependent components
- Carousel auto-advance (5-second interval) and fundraising self-dismiss (1-second interval for 10 seconds) are fundamentally different use cases and should remain independent
- The fundraising scheduler in App.tsx uses recursive `setTimeout`, not `setInterval`, and is not affected by this change
- Countdown derivation is inline in CountdownBar — no separate `useCountdown` hook needed (single consumer, Article IV)
- No new data sources or APIs are being introduced — this is purely an internal refactoring of existing time management
