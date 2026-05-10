# Implementation Plan: Single Timer Architecture

**Branch**: `004-single-timer-architecture` | **Date**: 2026-05-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/004-single-timer-architecture/spec.md`

## Summary

Consolidate 4 independent 1-second `setInterval` timers into a single `useClock` hook per Constitution Article IX (Single Timer Principle). The hook is called once in App.tsx and `currentTime` is passed as a prop to Header, MasjidInfo, and CountdownBar. CountdownBar derives its countdown inline from `currentTime` + `nextPrayerTime` props, eliminating the current hardcoded `'03:45:23'` placeholder. Unused `nextPrayerLabel` prop is removed (FR-011).

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) + React 18.3
**Primary Dependencies**: MUI v7, Vite 6.x, Emotion
**Storage**: N/A (no persistence changes)
**Testing**: Grep-based verification (SC-002, SC-005) + `yarn build` (SC-004) + manual visual check (SC-003, SC-006)
**Target Platform**: 24/7 kiosk browser display
**Project Type**: Single-page web application (kiosk)
**Performance Goals**: Reduce re-render cycles from 4/sec to 1/sec; zero visual regressions
**Constraints**: No new dependencies (FR-010), no `any` types (SC-005), bundle <500KB gzipped (NFR-003)
**Scale/Scope**: 5 files changed (1 new, 4 modified), single feature branch

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Article | Requirement | Status | Notes |
|---------|------------|--------|-------|
| I. MUI-Only UI | No new UI libraries | PASS | No UI changes, only timer logic |
| II. TypeScript Strict | No `any` types | PASS | SC-005 verifies via grep |
| III. Yarn | Yarn commands only | PASS | No package manager changes |
| IV. Zero Dead Code | Remove unused code | PASS | FR-011 removes `nextPrayerLabel`; no premature abstraction |
| V. Shared Utilities | Common logic in utils/ | PASS | `useClock` in `src/app/utils/` |
| VI. Dynamic Data | Compute dynamically | PASS | Countdown derived from props, no hardcoded placeholder |
| VII. Kiosk-First | Auto-recover, resilient | PASS | `clearInterval` cleanup (NFR-001); no crash risk |
| VIII. RTL Bilingual | Arabic/English support | PASS | No changes to RTL/numeral logic |
| IX. Single Timer | One setInterval for display | PASS | This spec directly implements Article IX |

**Gate result**: PASS — all 9 articles satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/004-single-timer-architecture/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── checklists/
│   └── pre-implementation.md  # 31 requirements quality items (all resolved)
└── tasks.md             # Phase 2 output (/speckit.tasks - NOT YET CREATED)
```

### Source Code (repository root)

```text
src/app/
├── App.tsx                          # MODIFY: useClock + pass currentTime, remove nextPrayerLabel prop
├── utils/
│   ├── useClock.ts                  # NEW: single timer hook
│   ├── helpers.ts                   # UNCHANGED
│   ├── prayerTimes.ts              # UNCHANGED
│   └── translations.ts            # UNCHANGED
├── components/
│   ├── Header.tsx                   # MODIFY: currentTime prop, remove internal timer
│   ├── MasjidInfo.tsx              # MODIFY: currentTime prop, remove internal timer
│   ├── CountdownBar.tsx            # MODIFY: currentTime prop, derive countdown, remove nextPrayerLabel
│   ├── ImageCarousel.tsx           # UNCHANGED
│   ├── FundraisingOverlay.tsx      # UNCHANGED
│   ├── PrayerCard.tsx              # UNCHANGED
│   └── ...                         # UNCHANGED
```

**Structure Decision**: Single `src/app/` frontend application. No project structure changes — only one new file and four modifications.

## Architecture

### Before (4 independent display timers)

```
App.tsx ─── setInterval(1000) ─── currentTime state ──→ prayer computation
Header.tsx ─── setInterval(1000) ─── currentTime state ──→ formatTime()
MasjidInfo.tsx ─── setInterval(1000) ─── currentTime state ──→ getGregorianDate()
CountdownBar.tsx ─── setInterval(1000) ─── new Date() in callback ──→ countdown
```

### After (1 shared display timer, prop drilling)

```
useClock hook ─── setInterval(1000) ─── { currentTime: Date }
│
App.tsx calls useClock(), passes currentTime as prop
├── Header receives currentTime prop ──→ formatTime(currentTime)
├── MasjidInfo receives currentTime prop ──→ getGregorianDate(currentTime)
└── CountdownBar receives currentTime prop ──→ derive countdown(currentTime, nextPrayerTime)
```

### Execution Order

1. **Create hook** — `useClock` standalone utility, zero component dependencies
2. **Wire into App.tsx** — Replace timer, pass `currentTime` prop, remove `nextPrayerLabel`
3. **Update consumers in parallel** — Header, MasjidInfo, CountdownBar are independent
4. **Verify** — Build + grep checks + manual visual check

### File Changes

| File | Action | Changes |
|------|--------|---------|
| `src/app/utils/useClock.ts` | CREATE | `useState(new Date())` + `useEffect` with `setInterval(1000)`, `clearInterval` cleanup, returns `{ currentTime: Date }` |
| `src/app/App.tsx` | MODIFY | Remove timer state/effect, add `useClock` import, pass `currentTime` prop to 3 children, remove `nextPrayerLabel` from CountdownBar call (FR-011) |
| `src/app/components/Header.tsx` | MODIFY | Remove timer state/effect, add `currentTime: Date` to `HeaderProps`, use prop |
| `src/app/components/MasjidInfo.tsx` | MODIFY | Remove timer state/effect, add `currentTime: Date` to `MasjidInfoProps`, use prop |
| `src/app/components/CountdownBar.tsx` | MODIFY | Remove timer state/effect + placeholder, add `currentTime: Date` to props, remove `nextPrayerLabel` (FR-011), derive countdown in render body (SC-006) |

### Dependencies to Keep Unchanged

| Component | Timer | Classification | Why Unchanged |
|-----------|-------|----------------|---------------|
| `ImageCarousel.tsx` | `setInterval(5000)` | Business logic timer | Auto-advance carousel, different purpose |
| `FundraisingOverlay.tsx` | `setInterval(1000)` | Business logic timer | Self-dismiss countdown (10s), different lifecycle |
| `App.tsx` fundraising scheduler | `setTimeout` (recursive) | Business logic timer | Scheduling via `fundraisingTimerRef`, not a display timer |

### Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| CountdownBar stale placeholder on first render | Medium (current bug) | Medium | Derive from `currentTime` prop immediately — no `useState('03:45:23')` (SC-006) |
| CountdownBar stale countdown | Low | Medium | Derive from prop every render — same math, same frequency |
| Midnight date rollover breaks | Low | Medium | Same Date object, same rollover logic |
| Initial render flicker | Low | Low | `useClock` initializes with `new Date()` — no delay |
| Language toggle resets countdown | Low | Low | Countdown derived from props, not state |
| Countdown transition latency at 00:00:00 | Low | Medium | Next tick re-derives from updated `nextPrayer` — ≤1s (FR-012) |

### Non-Functional Considerations

- **NFR-001**: `useEffect` cleanup MUST call `clearInterval`. React StrictMode not enabled (confirmed) but cleanup required for correctness.
- **NFR-002**: `setInterval(1000)` drift (<1ms/hour) is acceptable. Each tick creates `new Date()` from system clock — displayed time is always correct.
- **NFR-003**: Bundle size remains <500KB gzipped (no new deps).

## Complexity Tracking

No constitution violations. No justifications needed.
