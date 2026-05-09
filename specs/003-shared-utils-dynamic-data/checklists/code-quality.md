# Code Quality Checklist: Shared Utilities & Dynamic Prayer Data

**Purpose**: Validate requirements completeness for utility consolidation, type safety, prayer time dynamics, and timer fix
**Created**: 2026-05-09
**Depth**: Standard (PR review gate)
**Actor**: Tech lead + senior engineer
**Feature**: [spec.md](../spec.md)

## Duplicated Utility Consolidation

- [ ] CHK001 - Does FR-004 enumerate ALL 5 files containing duplicated `toArabicNumerals` by name, confirming none are missed? [Completeness, Spec §FR-004]
- [ ] CHK002 - Does FR-005 enumerate ALL 7 components containing duplicated `getFontFamily`/`isRTL` logic by name? [Completeness, Spec §FR-005]
- [ ] CHK003 - Is the shared utility module filename and location specified (e.g., `src/app/utils/helpers.ts`)? [Clarity, Gap]
- [ ] CHK004 - Are requirements specified for the exact function signatures of shared utilities (`toArabicNumerals(text: string): string`, `getFontFamily(language: Language): string`)? [Clarity, Gap]
- [ ] CHK005 - Does the spec require that ALL consumer components update their imports to the shared module (not just some)? [Completeness, Spec §FR-004, §FR-005]
- [ ] CHK006 - Is `getDirection` (FR-006) defined with a clear return type and parameter, or is it left ambiguous? [Clarity, Spec §FR-006]

## Prayer Time Dynamics

- [ ] CHK007 - Is the "current prayer" definition precise enough — does "most recently passed" handle the case where current time is BEFORE the first prayer (Fajr) of the day? [Edge Case, Spec §FR-001]
- [ ] CHK008 - Does FR-001 specify behavior at an exact prayer time boundary (e.g., exactly 12:45:00 — is Dhuhr "current" or is the previous prayer still "current")? [Edge Case, Spec §FR-001]
- [ ] CHK009 - Does FR-002 specify the countdown computation for the "after Isha wraps to tomorrow" case — is it next-day Fajr time minus current time? [Clarity, Spec §FR-002, §FR-013]
- [ ] CHK010 - Does FR-003 define the countdown format precisely (HH:MM:SS, always 2 digits per segment)? [Clarity, Spec §FR-003]
- [ ] CHK011 - Does FR-014 specify which clock interval drives the prayer computation — the existing Header clock, a new interval, or the existing countdown timer? [Clarity, Dependency, Spec §FR-014]
- [ ] CHK012 - Are requirements specified for how `PrayerTime.time` (HH:MM string) is compared to wall-clock time for getCurrentPrayer/getNextPrayer? [Clarity, Gap]
- [ ] CHK013 - Does the spec address the Sunrise entry — is it treated as a prayer for getCurrentPrayer purposes, or skipped? [Ambiguity, Spec §Assumptions]
- [ ] CHK014 - Is the "before Fajr" edge case covered — when no prayer has passed today, what is the "current prayer"? [Edge Case, Spec §US1 Scenario 1]
- [ ] CHK015 - Does FR-015 specify WHERE the single source of truth lives — App.tsx, or a shared prayerTimes module? [Clarity, Spec §FR-015]

## Type Safety

- [ ] CHK016 - Does FR-008 specify that `typeof translations['en']` covers ALL nested objects (prayers, event, fundraising, weather, days, months, announcementsList)? [Completeness, Spec §FR-008]
- [ ] CHK017 - Does FR-009 list ALL component files that must update their `translations` prop type? [Completeness, Spec §FR-009]
- [ ] CHK018 - Does FR-010 specify the exact type for `prayerIcons` — is it keyed by the PrayerTime key union type or `string`? [Clarity, Spec §FR-010]
- [ ] CHK019 - Are requirements specified for how the `Translations` type handles the `announcementsList: string[]` array (not just string values)? [Completeness, Gap]
- [ ] CHK020 - Does the spec address whether component prop interfaces in data-model.md need updating to reference `Translations` instead of `Record<string, string>`? [Coverage, Gap]
- [ ] CHK021 - Is FR-009 consistent with FR-008 — does deriving via `typeof` actually produce the correct shape for all 8 consumer components? [Consistency, Spec §FR-008, §FR-009]

## Timer Memory Leak Fix

- [ ] CHK022 - Does FR-011 specify the exact cleanup mechanism (useRef + clearTimeout on unmount + clearTimeout before reschedule)? [Clarity, Spec §FR-011]
- [ ] CHK023 - Does the spec address whether the recursive setTimeout pattern should be replaced with setInterval or kept as setTimeout with tracked refs? [Clarity, Gap]
- [ ] CHK024 - Are requirements specified for what happens if the component re-renders while a timeout is pending — does the ref prevent stacking? [Edge Case, Spec §FR-011]

## Scope Boundaries

- [ ] CHK025 - Does FR-016 clearly enumerate which hardcoded values are out of scope (temperature, humidity, donation amounts, donor count, event details)? [Completeness, Spec §FR-016]
- [ ] CHK026 - Is the boundary between Spec 003 (code deduplication + prayer dynamics) and Spec 004 (API integration + performance) clearly documented? [Clarity, Spec §FR-016, §Assumptions]
- [ ] CHK027 - Does the spec explicitly exclude adding new API endpoints, external data fetching, or new npm dependencies? [Scope Boundary, Gap]

## Constitution Compliance

- [ ] CHK028 - Does the spec satisfy Article I (MUI-only) — are all new utility functions compatible with MUI's styling approach? [Constitution, Article I]
- [ ] CHK029 - Does the spec satisfy Article II (no `any`) — does FR-009 + FR-010 eliminate ALL remaining `any` types from component interfaces? [Constitution, Article II, Spec §FR-009, §FR-010]
- [ ] CHK030 - Does the spec satisfy Article V (shared utilities / DRY) — is the consolidation scope comprehensive or are there other duplicated patterns not addressed? [Constitution, Article V]
- [ ] CHK031 - Does the spec satisfy Article VI (dynamic data) — does replacing hardcoded currentPrayer/nextPrayerTime fulfill the "no hardcoded values" requirement for prayer data specifically? [Constitution, Article VI, Spec §FR-001, §FR-002]
- [ ] CHK032 - Does the spec satisfy Article IX (single timer) — does FR-011 move toward single-timer architecture or just fix the cleanup? [Constitution, Article IX, Spec §FR-011]

## PrayerTime Interface

- [ ] CHK033 - Does FR-007 specify the exact field types for `PrayerTime` — is `time` a string (HH:MM), a Date, or minutes-from-midnight? [Clarity, Spec §FR-007]
- [ ] CHK034 - Does the `PrayerTime` interface match what PrayerCard, CountdownBar, and App.tsx currently expect (key, name, time, iqamaTime)? [Consistency, Spec §FR-007]
- [ ] CHK035 - Is `PrayerTime.key` typed as a union literal (`'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'`) or as `string`? [Clarity, Gap]

## Unused Imports

- [ ] CHK036 - Does FR-012 define what constitutes an "unused import" — is there a verification method specified (e.g., TS compiler noUnusedLocals)? [Measurability, Spec §FR-012]

## Notes

- Items marked [Gap] indicate potential missing requirements that should be addressed before `/speckit.plan`
- Constitution articles I, II, V, VI, IX are the primary governance constraints for this spec
- Items marked [Edge Case] relate to boundary conditions in prayer time computation
