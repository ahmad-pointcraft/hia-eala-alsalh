# Code Quality Checklist: Shared Utilities & Dynamic Prayer Data

**Purpose**: Validate requirements completeness for utility consolidation, type safety, prayer time dynamics, and timer fix
**Created**: 2026-05-09
**Depth**: Standard (PR review gate)
**Actor**: Tech lead + senior engineer
**Feature**: [spec.md](../spec.md)

## Duplicated Utility Consolidation

- [X] CHK001 - Does FR-004 enumerate ALL 5 files containing duplicated `toArabicNumerals` by name, confirming none are missed? [Completeness, Spec §FR-004] — Plan lists all 5 with line numbers. Grep confirms: PrayerCard, CountdownBar, WeatherWidget, FundraisingOverlay, MasjidInfo.
- [X] CHK002 - Does FR-005 enumerate ALL 7 components containing duplicated `getFontFamily`/`isRTL` logic by name? [Completeness, Spec §FR-005] — Spec says "7" but actual count is 9 fontFamily + 7 isRTL. Plan and tasks correctly cover all 16 locations.
- [X] CHK003 - Is the shared utility module filename and location specified (e.g., `src/app/utils/helpers.ts`)? [Clarity, Gap] — Plan: `src/app/utils/helpers.ts`. Task T001 creates it.
- [X] CHK004 - Are requirements specified for the exact function signatures of shared utilities (`toArabicNumerals(text: string): string`, `getFontFamily(language: Language): string`)? [Clarity, Gap] — Plan + data-model.md specify all 4 signatures. Task T001 lists them.
- [X] CHK005 - Does the spec require that ALL consumer components update their imports to the shared module (not just some)? [Completeness, Spec §FR-004, §FR-005] — Tasks T005–T013 cover all 9 components. 3 correctly excluded.
- [X] CHK006 - Is `getDirection` (FR-006) defined with a clear return type and parameter, or is it left ambiguous? [Clarity, Spec §FR-006] — Plan: `getDirection(language: Language): 'rtl' | 'ltr'`.

## Prayer Time Dynamics

- [X] CHK007 - Is the "current prayer" definition precise enough — does "most recently passed" handle the case where current time is BEFORE the first prayer (Fajr) of the day? [Edge Case, Spec §FR-001] — Plan: `getCurrentPrayer` returns `PrayerTime | null`. Task T004: `activePrayer?.key` handles null.
- [X] CHK008 - Does FR-001 specify behavior at an exact prayer time boundary (e.g., exactly 12:45:00 — is Dhuhr "current" or is the previous prayer still "current")? [Edge Case, Spec §FR-001] — Plan: `<=` comparison. At exactly 12:45, Dhuhr is current.
- [X] CHK009 - Does FR-002 specify the countdown computation for the "after Isha wraps to tomorrow" case — is it next-day Fajr time minus current time? [Clarity, Spec §FR-002, §FR-013] — Plan: `getTimeToNextPrayer` adds 24*60 when `isTomorrow`. Tasks T002 + T004.
- [X] CHK010 - Does FR-003 define the countdown format precisely (HH:MM:SS, always 2 digits per segment)? [Clarity, Spec §FR-003] — CountdownBar already formats HH:MM:SS. `getTimeToNextPrayer` returns seconds.
- [X] CHK011 - Does FR-014 specify which clock interval drives the prayer computation — the existing Header clock, a new interval, or the existing countdown timer? [Clarity, Dependency, Spec §FR-014] — Plan: new `currentTime` state in App.tsx with 1-second interval. Task T004.
- [X] CHK012 - Are requirements specified for how `PrayerTime.time` (HH:MM string) is compared to wall-clock time for getCurrentPrayer/getNextPrayer? [Clarity, Gap] — Spec FR-001: "parsed to minutes-from-midnight." Plan: `parseTimeToMinutes` helper.
- [X] CHK013 - Does the spec address the Sunrise entry — is it treated as a prayer for getCurrentPrayer purposes, or skipped? [Ambiguity, Spec §Assumptions] — Spec Clarifications: "IS treated as a valid entry." Plan: PrayerKey includes 'Sunrise'.
- [X] CHK014 - Is the "before Fajr" edge case covered — when no prayer has passed today, what is the "current prayer"? [Edge Case, Spec §US1 Scenario 1] — Plan: returns null. Task T004: null-safe.
- [X] CHK015 - Does FR-015 specify WHERE the single source of truth lives — App.tsx, or a shared prayerTimes module? [Clarity, Spec §FR-015] — Plan resolves to: PrayerTime[] in App.tsx. Task T004 types it.

## Type Safety

- [X] CHK016 - Does FR-008 specify that `typeof translations['en']` covers ALL nested objects (prayers, event, fundraising, weather, days, months, announcementsList)? [Completeness, Spec §FR-008] — Verified against translations.ts: all nested objects present. Task T003 lists them.
- [X] CHK017 - Does FR-009 list ALL component files that must update their `translations` prop type? [Completeness, Spec §FR-009] — Grep confirms 6 components. Plan + data-model.md list all 6. Tasks T007–T012 cover each.
- [X] CHK018 - Does FR-010 specify the exact type for `prayerIcons` — is it keyed by the PrayerTime key union type or `string`? [Clarity, Spec §FR-010] — Plan: `Record<PrayerKey, React.ComponentType<...>>`. Task T005 implements.
- [X] CHK019 - Are requirements specified for how the `Translations` type handles the `announcementsList: string[]` array (not just string values)? [Completeness, Gap] — `typeof` automatically infers `string[]`. Verified in source.
- [X] CHK020 - Does the spec address whether component prop interfaces in data-model.md need updating to reference `Translations` instead of `Record<string, string>`? [Coverage, Gap] — Data-model.md has full table of 6 components with interface names. Tasks T007–T012 implement.
- [X] CHK021 - Is FR-009 consistent with FR-008 — does deriving via `typeof` actually produce the correct shape for all 8 consumer components? [Consistency, Spec §FR-008, §FR-009] — `typeof translations['en']` correctly infers all nested keys. Build would fail on mismatch.

## Timer Memory Leak Fix

- [X] CHK022 - Does FR-011 specify the exact cleanup mechanism (useRef + clearTimeout on unmount + clearTimeout before reschedule)? [Clarity, Spec §FR-011] — Plan: `useRef<ReturnType<typeof setTimeout> | null>(null)`, clearTimeout before reschedule + on unmount. Task T014: 5 explicit steps.
- [X] CHK023 - Does the spec address whether the recursive setTimeout pattern should be replaced with setInterval or kept as setTimeout with tracked refs? [Clarity, Gap] — Spec Assumptions: "scheduling interval remains unchanged." Plan: keeps setTimeout with tracked refs.
- [X] CHK024 - Are requirements specified for what happens if the component re-renders while a timeout is pending — does the ref prevent stacking? [Edge Case, Spec §FR-011] — Plan + Task T014: clearTimeout before each setTimeout. Only one active at any time.

## Scope Boundaries

- [X] CHK025 - Does FR-016 clearly enumerate which hardcoded values are out of scope (temperature, humidity, donation amounts, donor count, event details)? [Completeness, Spec §FR-016] — FR-016: "temperature, donation amounts." Tasks T007/T009 only change imports/types.
- [X] CHK026 - Is the boundary between Spec 003 (code deduplication + prayer dynamics) and Spec 004 (API integration + performance) clearly documented? [Clarity, Spec §FR-016, §Assumptions] — FR-016 + Assumptions + Plan Constitution Check clearly separate.
- [X] CHK027 - Does the spec explicitly exclude adding new API endpoints, external data fetching, or new npm dependencies? [Scope Boundary, Gap] — Plan: "No new npm dependencies." Spec scope limited to prayer dynamics + deduplication.

## Constitution Compliance

- [X] CHK028 - Does the spec satisfy Article I (MUI-only) — are all new utility functions compatible with MUI's styling approach? [Constitution, Article I] — Plan Constitution Check: "No UI changes — only utility extraction."
- [X] CHK029 - Does the spec satisfy Article II (no `any`) — does FR-009 + FR-010 eliminate ALL remaining `any` types from component interfaces? [Constitution, Article II, Spec §FR-009, §FR-010] — Translations type replaces all Record<string, string>. prayerIcons typed with PrayerKey.
- [X] CHK030 - Does the spec satisfy Article V (shared utilities / DRY) — is the consolidation scope comprehensive or are there other duplicated patterns not addressed? [Constitution, Article V] — Plan: "This is the PRIMARY purpose of this spec." Removing 5+9+7 duplicated functions.
- [X] CHK031 - Does the spec satisfy Article VI (dynamic data) — does replacing hardcoded currentPrayer/nextPrayerTime fulfill the "no hardcoded values" requirement for prayer data specifically? [Constitution, Article VI, Spec §FR-001, §FR-002] — Plan: "FR-001/FR-002 replace hardcoded currentPrayer and nextPrayerTime." Task T004 removes all hardcoded values.
- [X] CHK032 - Does the spec satisfy Article IX (single timer) — does FR-011 move toward single-timer architecture or just fix the cleanup? [Constitution, Article IX, Spec §FR-011] — Plan: "⚠️ ACKNOWLEDGED — cleanup only. Full consolidation is Spec 004."

## PrayerTime Interface

- [X] CHK033 - Does FR-007 specify the exact field types for `PrayerTime` — is `time` a string (HH:MM), a Date, or minutes-from-midnight? [Clarity, Spec §FR-007] — Data-model.md: `key: PrayerKey; name: string; time: string (HH:MM); iqamaTime: string (HH:MM or '—')`.
- [X] CHK034 - Does the `PrayerTime` interface match what PrayerCard, CountdownBar, and App.tsx currently expect (key, name, time, iqamaTime)? [Consistency, Spec §FR-007] — All components use these exact fields. Data-model.md confirms.
- [X] CHK035 - Is `PrayerTime.key` typed as a union literal (`'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'`) or as `string`? [Clarity, Gap] — Data-model.md: PrayerKey union literal. Plan + Task T002 match.

## Unused Imports

- [X] CHK036 - Does FR-012 define what constitutes an "unused import" — is there a verification method specified (e.g., TS compiler noUnusedLocals)? [Measurability, Spec §FR-012] — Task T024: grep spot-check + yarn build catches unused type imports in strict mode.

## Notes

- Items marked [Gap] indicate potential missing requirements that should be addressed before `/speckit.plan`
- Constitution articles I, II, V, VI, IX are the primary governance constraints for this spec
- Items marked [Edge Case] relate to boundary conditions in prayer time computation
