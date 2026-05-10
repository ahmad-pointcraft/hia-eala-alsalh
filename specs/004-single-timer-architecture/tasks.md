# Tasks: Single Timer Architecture

**Input**: Design documents from `/specs/004-single-timer-architecture/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: No test tasks — verification is grep-based (SC-002, SC-005) and build-based (SC-004).

**Organization**: This is an internal refactor with 4 user stories that are all served by the same architectural change (consolidate timers into useClock). Tasks are grouped by execution phase, not by user story, because all stories share the same code path.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/app/` at repository root
- Components: `src/app/components/`
- Utilities: `src/app/utils/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the single shared timer hook that all user stories depend on.

- [ ] T001 Create `useClock` hook in `src/app/utils/useClock.ts` — `useState(new Date())` + `useEffect` with `setInterval(1000)`, `clearInterval` cleanup on unmount (NFR-001), returns `{ currentTime: Date }`, fully typed with no `any` types (SC-005)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Wire useClock into App.tsx and thread currentTime prop to all consumers.

**CRITICAL**: No consumer updates can begin until this phase is complete.

- [ ] T002 Update `src/app/App.tsx`: remove `useState(new Date())` + `useEffect` with `setInterval(1000)` (lines 25, 28–31), add `import { useClock } from './utils/useClock'`, call `const { currentTime } = useClock()`, pass `currentTime={currentTime}` prop to `<Header>`, `<MasjidInfo>`, `<CountdownBar>`. Remove unused `nextPrayerLabel={t.nextPrayer}` prop from `<CountdownBar>` call site (FR-011, line 166)

---

## Phase 3: Consumer Updates (User Stories 1–4, parallel)

**Purpose**: Remove internal timers from each consumer and switch to currentTime prop.

### US1 — Kiosk Clock Display Updates Reliably

**Goal**: Header clock updates every second from shared timer without interruption.

**Independent Test**: Observe header clock for 60+ seconds — no gaps, freezes, or duplicate timestamps.

- [ ] T003 [P] [US1] Update `src/app/components/Header.tsx`: remove `useState(new Date())` (line 22), remove `useEffect` with `setInterval` (lines 24–29), remove `import { useEffect, useState } from 'react'` if no longer needed, add `currentTime: Date` to `HeaderProps` interface (after line 19), add `currentTime` to destructured props, use `currentTime` prop in `formatTime()` call (line 97)

### US3 — Gregorian Date Display Updates at Midnight

**Goal**: Gregorian date reflects current date from shared timer, updates at midnight.

**Independent Test**: Check displayed date matches today; monitor around midnight for automatic rollover.

- [ ] T004 [P] [US3] Update `src/app/components/MasjidInfo.tsx`: remove `useState(new Date())` (line 14), remove `useEffect` with `setInterval` (lines 16–21), remove `import { useEffect, useState } from 'react'` if no longer needed, add `currentTime: Date` to `MasjidInfoProps` interface (after line 11), add `currentTime` to destructured props, use `currentTime` prop in `getGregorianDate()` function (line 27)

### US2 — Countdown Timer Ticks Accurately

**Goal**: Countdown decrements every second from shared timer, correct on first render, no placeholder.

**Independent Test**: Note countdown value + reference clock — verify it decrements by exactly 1s/s and reaches 00:00:00 at correct prayer time.

- [ ] T005 [US2] Update `src/app/components/CountdownBar.tsx`: remove `useState('03:45:23')` (line 14 — eliminates placeholder bug per SC-006), remove `useEffect` with `setInterval` (lines 16–36), remove `import { useEffect, useState } from 'react'` if no longer needed, add `currentTime: Date` to `CountdownBarProps` interface (after line 11), remove `nextPrayerLabel` from `CountdownBarProps` interface (FR-011), remove `nextPrayerLabel` from destructured props, add `currentTime` to destructured props, derive countdown in render body:
  1. Parse `nextPrayerTime` ("HH:MM") via `split(":").map(Number)` → hours, minutes
  2. Create `target = new Date(currentTime)`, set `target.setHours(hours, minutes, 0, 0)`
  3. If `target < currentTime` → `target.setDate(target.getDate() + 1)` (midnight rollover)
  4. Compute `diff = target.getTime() - currentTime.getTime()` in ms
  5. Convert to `HH:MM:SS` with zero-padding
  6. Apply `toArabicNumerals(countdown)` if Arabic language (unchanged)
  - Rest of component (RTL, rendering) stays identical

### US4 — Prayer Highlighting Reflects Current Time

**Goal**: activePrayer/nextPrayer computed from shared timer currentTime.

**Independent Test**: Observe which prayer card is highlighted — compare against current time and prayer schedule.

> **No separate task needed** — US4 is already covered by T002. `activePrayer` and `nextPrayer` are computed inline in App.tsx render body from `currentTime` (via `getCurrentPrayer`/`getNextPrayer`). T002 switches App.tsx to use `useClock` return value, which automatically updates these computations. No additional code changes required.

**Checkpoint**: All user stories functional. Clock, date, countdown, prayer highlighting all driven by single shared timer.

---

## Phase 4: Verification (Cross-Cutting)

**Purpose**: Confirm all success criteria are met.

- [ ] T006 Run `yarn build` — must exit with code 0, zero errors (SC-004)
- [ ] T007 Run `grep "setInterval" src/app/App.tsx src/app/components/Header.tsx src/app/components/MasjidInfo.tsx src/app/components/CountdownBar.tsx` — must return 0 matches / exit code 1 (SC-002)
- [ ] T008 Run `grep "setInterval" src/app/utils/useClock.ts src/app/components/ImageCarousel.tsx src/app/components/FundraisingOverlay.tsx` — must return exactly 3 matches (SC-002)
- [ ] T009 Run `grep -r "any" src/app/utils/useClock.ts src/app/components/Header.tsx src/app/components/MasjidInfo.tsx src/app/components/CountdownBar.tsx` — must return 0 matches (SC-005)
- [ ] T010 Verify first-render countdown accuracy via `yarn dev`: load the app and confirm CountdownBar shows correct countdown immediately — no `'03:45:23'` placeholder (SC-006)
- [ ] T011 Final `yarn build` — must exit with code 0

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on T001 (useClock must exist)
- **Consumer Updates (Phase 3)**: Depends on T002 (App.tsx must pass currentTime prop)
- **Verification (Phase 4)**: Depends on T003, T004, T005 (all consumers updated)

### Dependency Graph

```
T001 ──────┐
T002 ◄─────┘
T003 [P] ◄─┐
T004 [P] ◄─┤── T002
T005 ◄─────┘
T006 ──────┐
T007 [P] ──┤── T003, T004, T005
T008 [P] ──┤
T009 [P] ──┤
T010 [P] ──┘
T011 ──────── T006
```

### Parallel Opportunities

- **T003 + T004** (Header + MasjidInfo): Different files, no shared state, identical pattern
- **T007 + T008 + T009 + T010**: All read-only verification, different checks

---

## Implementation Strategy

### Full Delivery (all stories)

1. Complete Phase 1: Create useClock hook (T001)
2. Complete Phase 2: Wire into App.tsx (T002)
3. Complete Phase 3: Update all 3 consumers (T003–T005, T003+T004 in parallel)
4. Complete Phase 4: Run all verification (T006–T011)
5. Deploy

### Execution Time Estimate

- T001: ~5 min (new file, simple hook)
- T002: ~10 min (modify App.tsx, thread props)
- T003: ~5 min (remove timer, add prop)
- T004: ~5 min (remove timer, add prop)
- T005: ~10 min (remove timer + placeholder, derive countdown inline)
- T006–T011: ~5 min (run commands)
- **Total: ~40 minutes**

---

## Notes

- US4 (prayer highlighting) requires no separate task — covered by T002
- `nextPrayerLabel` removal in T002 (App.tsx call site) and T005 (CountdownBar props) — FR-011
- No new dependencies, no context providers, no `any` types
- Commit after each phase or logical group
- ImageCarousel and FundraisingOverlay remain UNCHANGED throughout
