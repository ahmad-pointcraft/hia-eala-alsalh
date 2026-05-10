# Research: Single Timer Architecture

**Branch**: `004-single-timer-architecture` | **Date**: 2026-05-10 | **Spec**: [spec.md](./spec.md)

## Research Tasks

All unknowns were resolved during the pre-implementation checklist phase via codebase audit. No unresolved NEEDS CLARIFICATION items remain.

---

## R1: Timer Consolidation Pattern

**Decision**: Single `useClock` hook returning `{ currentTime: Date }`, called once in App.tsx, value passed as props.

**Rationale**: Component tree is 1 level deep (App → Header/MasjidInfo/CountdownBar). Context provider would add complexity for 3 consumers at the same tree depth. Constitution Article IV (Zero Dead Code) favors the simpler approach. Article IX (Single Timer Principle) mandates one `setInterval` for all display updates.

**Alternatives considered**:
- Context provider — rejected: unnecessary for 3 sibling consumers, adds provider wrapper + consumer hook boilerplate
- Event emitter pattern — rejected: over-engineered for synchronous React state updates
- Zustand store — rejected: external dependency for a problem that props solve

## R2: Countdown Derivation Strategy

**Decision**: Inline computation in CountdownBar render body from `currentTime` prop + `nextPrayerTime` prop.

**Rationale**: Only one component needs countdown computation. A separate `useCountdown` hook would be premature abstraction (Article IV). Deriving in render body eliminates the current `useState('03:45:23')` placeholder bug — countdown is correct on first render (SC-006).

**Alternatives considered**:
- Pre-computed countdown string passed as prop — rejected: moves display logic out of the component that renders it
- Separate `useCountdown` hook — rejected: single consumer, premature abstraction

## R3: Hook Return Type

**Decision**: Return `{ currentTime: Date }` (object, not raw `Date`).

**Rationale**: Extensible without breaking API. Future additions (formatted time string, day-of-week, isRTL-aware format) can be added as properties. Returning a raw `Date` would require breaking changes later.

**Alternatives considered**:
- Raw `Date` return — rejected: not extensible
- Larger object with pre-formatted values — rejected: premature, only `currentTime` needed now

## R4: Independent Timer Classification

**Decision**: ImageCarousel (5s `setInterval`) and FundraisingOverlay (1s `setInterval`) remain independent. Fundraising scheduler (recursive `setTimeout` in App.tsx) remains unchanged.

**Rationale**: Glossary distinction — these are business logic timers, not display timers. They control behavior (carousel advance, overlay dismiss, fundraising scheduling), not time display. Consolidating them would couple unrelated lifecycle concerns.

**Codebase-validated facts**:
- ImageCarousel: local `currentIndex` state only, no shared state
- FundraisingOverlay: local `countdown` state (10s → 0), auto-calls `onClose()`, no shared state
- Fundraising scheduler: recursive `setTimeout` via `fundraisingTimerRef`, 1-min initial then 10-min recurring

## R5: React StrictMode Compatibility

**Decision**: Cleanup functions required even though StrictMode is not enabled.

**Rationale**: main.tsx confirms no `<React.StrictMode>` wrapper. However, `useEffect` cleanup calling `clearInterval` is required for correctness (NFR-001) — if the component ever unmounts, the timer must be cleared. This also future-proofs against StrictMode being enabled later.

## R6: Clock Drift Over Extended Operation

**Decision**: Acceptable as-is. No synchronization mechanism needed.

**Rationale**: `setInterval(1000)` may accumulate drift (<1ms/hour in modern browsers). The kiosk runs 24/7, but the display shows time derived from `new Date()` on each tick — each tick creates a fresh `Date` from system clock, so accumulated drift is in the callback scheduling, not the displayed time. The displayed time is always correct because `new Date()` reads the system clock.

**Alternatives considered**:
- `requestAnimationFrame` with time check — rejected: over-engineered, 1-second granularity is sufficient
- Web Worker timer — rejected: unnecessary complexity for a display timer
- Adjusting interval based on drift — rejected: `new Date()` per tick makes drift invisible to users

## R7: Dead Code Removal — nextPrayerLabel

**Decision**: Remove `nextPrayerLabel` from CountdownBar props interface and App.tsx call site.

**Rationale**: Codebase audit confirmed `nextPrayerLabel` is passed from App.tsx (line 166) but never used inside CountdownBar.tsx. The component hardcodes its own label text. Article IV (Zero Dead Code) mandates removal.

**Alternatives considered**:
- Wire it up to replace hardcoded label — rejected: out of scope for this refactor, would change behavior
