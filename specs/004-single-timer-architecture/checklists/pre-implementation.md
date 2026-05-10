# Pre-Implementation Checklist: Single Timer Architecture

**Purpose**: Validate the quality, completeness, and clarity of Spec 004 requirements before planning begins
**Created**: 2026-05-10
**Feature**: [spec.md](../spec.md)
**Depth**: Standard (pre-plan gate)
**Actor/Timing**: Author + Reviewer, before `/speckit.plan`
**Resolved**: 2026-05-10 — all items addressed via spec update

## Requirement Completeness

- [x] CHK001 - Is the exact interface signature of `useClock` return type specified with all fields and types? [Completeness, Spec §FR-002] → **Resolved**: FR-002 specifies `{ currentTime: Date }`, Key Entities documents the full hook contract
- [x] CHK002 - Are prop interface changes for all three consuming components (Header, MasjidInfo, CountdownBar) explicitly documented? [Completeness, Spec §FR-001] → **Resolved**: FR-001/003/004/005 specify `currentTime` prop for each component; FR-011 removes unused `nextPrayerLabel`
- [x] CHK003 - Is the countdown derivation algorithm (parse `nextPrayerTime` "HH:MM" → target Date → diff) specified with sufficient precision? [Completeness, Spec §FR-005] → **Resolved**: FR-005 now includes format (`"HH:MM"`, 24-hour string), parsing step, and computation (`target - currentTime` in ms)
- [x] CHK004 - Is the midnight rollover behavior for the countdown (add 1 day to target) specified as a requirement, not just an edge case? [Completeness, Spec §FR-005 vs Edge Cases] → **Resolved**: Covered in FR-005 (inline derivation includes rollover) and Edge Cases (post-Isha wrap to tomorrow's Fajr)
- [x] CHK005 - Are the exact files from which `setInterval` must be removed enumerated in the spec? [Completeness, Spec §SC-002] → **Resolved**: SC-002 lists exact grep paths for both removal targets and retained timers
- [x] CHK006 - Is the requirement that `useClock` must not introduce a first-render blank state (no flicker) explicitly stated? [Completeness, Spec §FR-009] → **Resolved**: FR-009 now explicitly addresses the current `'03:45:23'` placeholder bug and requires immediate computation; SC-006 adds measurable criterion

## Requirement Clarity

- [x] CHK007 - Is "identical to the pre-refactor state" in FR-009 quantified with measurable criteria, or is it purely subjective? [Clarity, Spec §FR-009] → **Resolved**: FR-009 now specifies "pixel-identical rendering" and references SC-003 (side-by-side screenshot comparison)
- [x] CHK008 - Is "active prayer highlight MUST be computed from `currentTime` prop" clear about whether `activePrayer` derivation logic moves or stays in App.tsx? [Clarity, Spec §FR-007] → **Resolved**: FR-007 clarified — `activePrayer`/`nextPrayer` stay inline in App.tsx render body, just switch to `useClock` return value
- [x] CHK009 - Is the boundary between "display timers" (consolidated) and "independent timers" (excluded) defined clearly enough to prevent ambiguity? [Clarity, Spec §FR-008] → **Resolved**: Glossary defines "display timer" vs "business logic timer"; Key Entities lists Independent Timers and Fundraising Scheduler separately
- [x] CHK010 - Is the `nextPrayerTime` prop format ("HH:MM") explicitly specified as a requirement, or only mentioned in clarifications? [Clarity, Spec §FR-005] → **Resolved**: FR-005 now includes format `(format: "HH:MM", 24-hour string, e.g., "16:15")`; Assumptions documents hardcoded source

## Requirement Consistency

- [x] CHK011 - Is the assumption "component tree is shallow (1–2 levels)" consistent with the actual component tree depth (App → Header/MasjidInfo/CountdownBar)? [Consistency, Spec §Assumptions] → **Resolved**: Codebase audit confirms tree is App → Header/MasjidInfo/CountdownBar (1 level). Assumption validated.
- [x] CHK012 - Are the grep-based verification paths in SC-002 consistent with the actual project file structure? [Consistency, Spec §SC-002] → **Resolved**: Codebase audit confirms paths match: src/app/App.tsx, src/app/components/{Header,MasjidInfo,CountdownBar,ImageCarousel,FundraisingOverlay}.tsx, src/app/utils/useClock.ts
- [x] CHK013 - Is the "no separate `useCountdown` hook" constraint in FR-006 consistent with the "inline derivation" requirement in FR-005? [Consistency, Spec §FR-005, §FR-006] → **Resolved**: Both FR-005 and FR-006 consistently state countdown stays inline in CountdownBar

## Acceptance Criteria Quality

- [x] CHK014 - Can SC-001 (reduced from 4 to 1 timer) be objectively measured without runtime inspection tools? [Measurability, Spec §SC-001] → **Resolved**: Yes — grep-based count in SC-002 provides objective measurement. SC-001 states the target (4→1), SC-002 provides the verification method.
- [x] CHK015 - Can SC-003 (same rate and accuracy) be measured with specific numeric thresholds, or is it purely observational? [Measurability, Spec §SC-003] → **Resolved**: SC-003 now specifies "pixel-identical rendering" via side-by-side screenshot comparison — binary pass/fail
- [x] CHK016 - Is there a measurable acceptance criterion for "no timing-related regressions" (SC-005) beyond subjective observation? [Measurability, Spec §SC-005] → **Resolved**: SC-005 now specifies `grep -r "any"` returns 0 matches; SC-006 adds first-render countdown accuracy (±1 second)
- [x] CHK017 - Is SC-004 (zero build errors) the only binary/measurable success criterion? If so, are others insufficiently specified? [Acceptance Criteria, Spec §SC-004] → **Resolved**: SC-003 (screenshot comparison), SC-004 (build exit 0), SC-005 (grep for `any`), SC-006 (first-render accuracy) are all binary/measurable

## Scenario Coverage

- [x] CHK018 - Are requirements defined for the scenario where the component unmounts and remounts (e.g., React strict mode double-effect)? [Coverage, Gap] → **Resolved**: NFR-001 documents cleanup requirement and notes React StrictMode is not used; Assumptions section explicitly states this
- [x] CHK019 - Are requirements defined for what happens if `nextPrayerTime` is `undefined` or an invalid format? [Coverage, Gap] → **Resolved**: Edge Cases section addresses this — out of scope since prayer times are hardcoded; future validation noted for dynamic data spec
- [x] CHK020 - Is the transition moment (countdown hits 00:00:00 → switches to next prayer) specified as a distinct requirement with expected latency? [Coverage, Spec §US-2] → **Resolved**: FR-012 specifies transition must occur within 1 second (same as current behavior)
- [x] CHK021 - Are requirements for the countdown display during the exact second of prayer time arrival (0 seconds vs wrapping) clearly specified? [Coverage, Spec §Edge Cases] → **Resolved**: FR-012 + US-2 Acceptance Scenario 2 cover this — wrap to subsequent prayer without negative values or freezing

## Edge Case Coverage

- [x] CHK022 - Is the "display runs continuously across midnight" edge case covered by a specific requirement, not just an edge case description? [Edge Case, Spec §Edge Cases] → **Resolved**: FR-004 (date updates at midnight), FR-009 (no flicker), NFR-002 (24/7 drift acceptable) all cover this
- [x] CHK023 - Is the "language toggled mid-countdown" edge case backed by a specific requirement about display format independence from countdown logic? [Edge Case, Spec §Edge Cases] → **Resolved**: Edge Cases section states countdown value is clock-derived (language-independent), only formatting changes
- [x] CHK024 - Is the behavior when all prayer times for today have passed (e.g., after Isha) specified with countdown target? [Edge Case, Gap] → **Resolved**: Edge Cases section documents post-Isha behavior — `getNextPrayer()` wraps to tomorrow's Fajr with `isTomorrow: true`
- [x] CHK025 - Are requirements specified for clock drift or interval accumulation over extended 24/7 operation? [Edge Case, Gap] → **Resolved**: NFR-002 documents acceptable drift (<1ms/hour) and confirms no synchronization mechanism needed

## Dependencies & Assumptions

- [x] CHK026 - Is the assumption "fundraising scheduler uses recursive `setTimeout`, not `setInterval`" validated against the current codebase? [Assumption, Spec §Assumptions] → **Resolved**: Codebase audit confirms — App.tsx line 58 uses recursive `setTimeout` (1-min initial, 10-min recurring via `fundraisingTimerRef`). Assumption validated. Note: FundraisingOverlay itself uses `setInterval` for countdown — now correctly documented in Key Entities.
- [x] CHK027 - Is the assumption "no external systems reading from timers" explicitly scoped to the current architecture? [Assumption, Spec §Assumptions] → **Resolved**: Assumptions section states "The kiosk display is the sole consumer of these timers — there are no external systems reading from them"
- [x] CHK028 - Is the dependency on React 18's `useEffect` cleanup behavior for timer cleanup documented? [Dependency, Gap] → **Resolved**: NFR-001 documents `clearInterval` cleanup requirement; Assumptions notes React StrictMode is not enabled
- [x] CHK029 - Is the assumption that ImageCarousel and FundraisingOverlay timers remain unchanged validated as safe (no shared state side effects)? [Assumption, Spec §FR-008] → **Resolved**: Codebase audit confirms — both use local state only (ImageCarousel: `currentIndex`, FundraisingOverlay: `countdown`). No shared state side effects. Key Entities documents both as independent.

## Ambiguities & Conflicts

- [x] CHK030 - Does the spec clearly distinguish between "display update timers" (to be consolidated) and "business logic timers" (to remain independent)? [Ambiguity, Spec §FR-001 vs §FR-008] → **Resolved**: Glossary defines both terms with clear criteria; Key Entities separates useClock, Independent Timers, and Fundraising Scheduler
- [x] CHK031 - Is it clear whether `activePrayer` and `nextPrayer` computation in App.tsx is considered part of the "single timer" scope or separate logic? [Ambiguity, Spec §FR-007] → **Resolved**: FR-007 explicitly states they stay inline in App.tsx render body and simply switch to the `useClock` return value — no logic changes

## Notes

- All 31 items resolved via spec update on 2026-05-10
- Spec now includes: Glossary (4 terms), 12 FRs, 3 NFRs, 6 SCs, 11 Assumptions, 5 Edge Cases
- Key additions: FR-011 (dead code removal), FR-012 (transition latency), NFR-001 (cleanup), NFR-002 (drift), SC-005 (no `any`), SC-006 (first-render accuracy)
- Items are numbered sequentially for easy reference
- This checklist tests REQUIREMENTS QUALITY, not implementation correctness
