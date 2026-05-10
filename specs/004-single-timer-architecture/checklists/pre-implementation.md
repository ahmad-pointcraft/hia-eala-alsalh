# Pre-Implementation Checklist: Single Timer Architecture

**Purpose**: Validate the quality, completeness, and clarity of Spec 004 requirements before planning begins
**Created**: 2026-05-10
**Feature**: [spec.md](../spec.md)
**Depth**: Standard (pre-plan gate)
**Actor/Timing**: Author + Reviewer, before `/speckit.plan`

## Requirement Completeness

- [ ] CHK001 - Is the exact interface signature of `useClock` return type specified with all fields and types? [Completeness, Spec §FR-002]
- [ ] CHK002 - Are prop interface changes for all three consuming components (Header, MasjidInfo, CountdownBar) explicitly documented? [Completeness, Spec §FR-001]
- [ ] CHK003 - Is the countdown derivation algorithm (parse `nextPrayerTime` "HH:MM" → target Date → diff) specified with sufficient precision? [Completeness, Spec §FR-005]
- [ ] CHK004 - Is the midnight rollover behavior for the countdown (add 1 day to target) specified as a requirement, not just an edge case? [Completeness, Spec §FR-005 vs Edge Cases]
- [ ] CHK005 - Are the exact files from which `setInterval` must be removed enumerated in the spec? [Completeness, Spec §SC-002]
- [ ] CHK006 - Is the requirement that `useClock` must not introduce a first-render blank state (no flicker) explicitly stated? [Completeness, Spec §FR-009]

## Requirement Clarity

- [ ] CHK007 - Is "identical to the pre-refactor state" in FR-009 quantified with measurable criteria, or is it purely subjective? [Clarity, Spec §FR-009]
- [ ] CHK008 - Is "active prayer highlight MUST be computed from `currentTime` prop" clear about whether `activePrayer` derivation logic moves or stays in App.tsx? [Clarity, Spec §FR-007]
- [ ] CHK009 - Is the boundary between "display timers" (consolidated) and "independent timers" (excluded) defined clearly enough to prevent ambiguity? [Clarity, Spec §FR-008]
- [ ] CHK010 - Is the `nextPrayerTime` prop format ("HH:MM") explicitly specified as a requirement, or only mentioned in clarifications? [Clarity, Spec §FR-005]

## Requirement Consistency

- [ ] CHK011 - Is the assumption "component tree is shallow (1–2 levels)" consistent with the actual component tree depth (App → Header/MasjidInfo/CountdownBar)? [Consistency, Spec §Assumptions]
- [ ] CHK012 - Are the grep-based verification paths in SC-002 consistent with the actual project file structure? [Consistency, Spec §SC-002]
- [ ] CHK013 - Is the "no separate `useCountdown` hook" constraint in FR-006 consistent with the "inline derivation" requirement in FR-005? [Consistency, Spec §FR-005, §FR-006]

## Acceptance Criteria Quality

- [ ] CHK014 - Can SC-001 (reduced from 4 to 1 timer) be objectively measured without runtime inspection tools? [Measurability, Spec §SC-001]
- [ ] CHK015 - Can SC-003 (same rate and accuracy) be measured with specific numeric thresholds, or is it purely observational? [Measurability, Spec §SC-003]
- [ ] CHK016 - Is there a measurable acceptance criterion for "no timing-related regressions" (SC-005) beyond subjective observation? [Measurability, Spec §SC-005]
- [ ] CHK017 - Is SC-004 (zero build errors) the only binary/measurable success criterion? If so, are others insufficiently specified? [Acceptance Criteria, Spec §SC-004]

## Scenario Coverage

- [ ] CHK018 - Are requirements defined for the scenario where the component unmounts and remounts (e.g., React strict mode double-effect)? [Coverage, Gap]
- [ ] CHK019 - Are requirements defined for what happens if `nextPrayerTime` is `undefined` or an invalid format? [Coverage, Gap]
- [ ] CHK020 - Is the transition moment (countdown hits 00:00:00 → switches to next prayer) specified as a distinct requirement with expected latency? [Coverage, Spec §US-2]
- [ ] CHK021 - Are requirements for the countdown display during the exact second of prayer time arrival (0 seconds vs wrapping) clearly specified? [Coverage, Spec §Edge Cases]

## Edge Case Coverage

- [ ] CHK022 - Is the "display runs continuously across midnight" edge case covered by a specific requirement, not just an edge case description? [Edge Case, Spec §Edge Cases]
- [ ] CHK023 - Is the "language toggled mid-countdown" edge case backed by a specific requirement about display format independence from countdown logic? [Edge Case, Spec §Edge Cases]
- [ ] CHK024 - Is the behavior when all prayer times for today have passed (e.g., after Isha) specified with countdown target? [Edge Case, Gap]
- [ ] CHK025 - Are requirements specified for clock drift or interval accumulation over extended 24/7 operation? [Edge Case, Gap]

## Dependencies & Assumptions

- [ ] CHK026 - Is the assumption "fundraising scheduler uses recursive `setTimeout`, not `setInterval`" validated against the current codebase? [Assumption, Spec §Assumptions]
- [ ] CHK027 - Is the assumption "no external systems reading from timers" explicitly scoped to the current architecture? [Assumption, Spec §Assumptions]
- [ ] CHK028 - Is the dependency on React 18's `useEffect` cleanup behavior for timer cleanup documented? [Dependency, Gap]
- [ ] CHK029 - Is the assumption that ImageCarousel and FundraisingOverlay timers remain unchanged validated as safe (no shared state side effects)? [Assumption, Spec §FR-008]

## Ambiguities & Conflicts

- [ ] CHK030 - Does the spec clearly distinguish between "display update timers" (to be consolidated) and "business logic timers" (to remain independent)? [Ambiguity, Spec §FR-001 vs §FR-008]
- [ ] CHK031 - Is it clear whether `activePrayer` and `nextPrayer` computation in App.tsx is considered part of the "single timer" scope or separate logic? [Ambiguity, Spec §FR-007]

## Notes

- Check items off as completed: `[x]`
- Add comments or findings inline
- Items are numbered sequentially for easy reference
- This checklist tests REQUIREMENTS QUALITY, not implementation correctness
