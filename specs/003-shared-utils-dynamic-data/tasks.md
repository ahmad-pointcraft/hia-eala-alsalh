# Tasks: Dynamic Data & Shared Utilities

**Input**: Design documents from `/specs/003-shared-utils-dynamic-data/`
**Prerequisites**: plan.md, spec.md, data-model.md, research.md, quickstart.md

**Tests**: No automated tests — verification via `yarn build` and grep checks.

**Organization**: Tasks grouped by user story priority. Phase 1–2 are foundations (all parallelizable). Phase 3 updates App.tsx (depends on Phase 1–2). Phase 4 updates components (depends on Phase 1–2). Phase 5 fixes timer (depends on Phase 1). Phase 6 is verification.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Shared Utility Modules (US3 — P1)

**Goal**: Create the two shared utility modules that all other tasks depend on

**Independent Test**: Import helpers.ts and prayerTimes.ts in a test file — verify toArabicNumerals('123') returns '١٢٣', getFontFamily('ar') returns Noto Naskh, getCurrentPrayer returns correct prayer for a given time

- [X] T001 [P] [US3] Create `src/app/utils/helpers.ts` — export `toArabicNumerals(text: string): string` using unicode escapes \u0660–\u0669; export `getFontFamily(language: Language): string` returning `'"Noto Naskh Arabic", serif'` for ar and `'"Open Sans", sans-serif'` for en (note: this standardizes the font string — current components inconsistently use quotes around font names; the shared version uses the correct CSS form with inner double quotes); export `isRTL(language: Language): boolean`; export `getDirection(language: Language): 'rtl' | 'ltr'`; import Language from './translations'
- [X] T002 [P] [US3] Create `src/app/utils/prayerTimes.ts` — export type `PrayerKey = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'`; export interface `PrayerTime { key: PrayerKey; name: string; time: string; iqamaTime: string }`; export interface `NextPrayer extends PrayerTime { isTomorrow: boolean }`; export `parseTimeToMinutes(time: string): number` (internal helper, HH:MM → minutes from midnight); export `getCurrentPrayer(prayers: PrayerTime[], now: Date): PrayerTime | null` (returns last prayer whose time ≤ current minutes, or null if before Fajr); export `getNextPrayer(prayers: PrayerTime[], now: Date): NextPrayer` (returns next prayer after current time, wraps to prayers[0] with isTomorrow=true after Isha); export `getTimeToNextPrayer(prayers: PrayerTime[], now: Date): number` (returns seconds until next prayer, adds 24*60*60 if isTomorrow)

**Checkpoint**: Both files exist, no build errors. Functions have correct signatures per data-model.md.

---

## Phase 2: Type Infrastructure (US4 — P2)

**Goal**: Create the Translations type that all components will use

**Independent Test**: Import Translations in a component file — verify autocomplete works for translations.fundraising.title, translations.event.badge, etc.

- [X] T003 [P] [US4] Update `src/app/utils/translations.ts` — add `export type Translations = typeof translations['en']` after the translations object; verify the type covers all nested keys (prayers.fajr, event.title, fundraising.collected, weather.partlyCloudy, days.sunday, months.january, announcementsList)

**Checkpoint**: Translations type exported, no build errors, type covers all nested objects.

---

## Phase 3: Dynamic Prayer Computation in App.tsx (US1+US2 — P1)

**Goal**: Replace hardcoded currentPrayer="Dhuhr" and nextPrayerTime="16:15" with dynamic computation. Add currentTime state to drive prayer calculations every second.

**Independent Test**: Open app at different times — verify correct prayer card highlighted, countdown shows correct target. Change system clock to test different scenarios.

- [X] T004 [US1+US2] Update `src/app/App.tsx` — add `import { getCurrentPrayer, getNextPrayer } from './utils/prayerTimes'`; add `import type { PrayerTime, PrayerKey } from './utils/prayerTimes'`; add `const [currentTime, setCurrentTime] = useState(new Date())` with useEffect 1-second interval; replace `const currentPrayer = "Dhuhr"` with `const activePrayer = getCurrentPrayer(prayers, currentTime)`; compute `const nextPrayer = getNextPrayer(prayers, currentTime)`; pass `isActive={prayer.key === activePrayer?.key}` to PrayerCard (handle null); pass `nextPrayer={nextPrayer.name}` and `nextPrayerTime={nextPrayer.time}` to CountdownBar; add `PrayerKey` type to prayers array key field; type the prayers array as `PrayerTime[]`

**Checkpoint**: Prayer highlight changes based on actual time. Countdown targets the correct next prayer. After Isha, countdown shows time until tomorrow's Fajr.

---

## Phase 4: Component Updates — Remove Duplicated Utils (US3 — P1)

**Goal**: Remove all 5 toArabicNumerals copies and all 9 fontFamily/isRTL duplicates. Update 6 translations prop types. All components import from shared modules.

**Independent Test**: `grep -rn "const toArabicNumerals" src/` returns zero matches. `grep -rn "const fontFamily = language" src/` returns zero matches. `grep -rn "translations: Record" src/` returns zero matches. Build passes.

- [ ] T005 [P] [US3] Update `src/app/components/PrayerCard.tsx` — remove local `toArabicNumerals` function (lines 34–47); remove local `fontFamily` const (line 63); add `import { toArabicNumerals, getFontFamily, getDirection } from '../utils/helpers'`; add `import type { PrayerKey } from '../utils/prayerTimes'`; change `prayerIcons` type from `Record<string, React.ComponentType<{ className?: string }>>` to `Record<PrayerKey, React.ComponentType<{ className?: string }>>`; replace `sx={{ fontFamily }}` with `sx={{ fontFamily: getFontFamily(language) }}`; replace `dir={language === 'ar' ? 'rtl' : 'ltr'}` with `dir={getDirection(language)}`
- [ ] T006 [P] [US3] Update `src/app/components/CountdownBar.tsx` — remove local `toArabicNumerals` function; remove local `fontFamily` const; remove local `isRTL` const; add `import { toArabicNumerals, getFontFamily, getDirection } from '../utils/helpers'`; replace `sx={{ fontFamily }}` with `sx={{ fontFamily: getFontFamily(language) }}`; replace `dir={isRTL ? 'rtl' : 'ltr'}` with `dir={getDirection(language)}`
- [ ] T007 [P] [US3+US4] Update `src/app/components/WeatherWidget.tsx` — remove local `toArabicNumerals` function; remove local `fontFamily` const; remove local `isRTL` const; add `import { toArabicNumerals, getFontFamily, getDirection } from '../utils/helpers'`; add `import type { Translations } from '../utils/translations'`; replace `translations: Record<string, string>` with `translations: Translations` in interface; replace `sx={{ fontFamily }}` with `sx={{ fontFamily: getFontFamily(language) }}`; replace `dir={isRTL ? 'rtl' : 'ltr'}` with `dir={getDirection(language)}`
- [ ] T008 [P] [US3+US4] Update `src/app/components/MasjidInfo.tsx` — remove local `toArabicNumerals` function; remove local `fontFamily` const; remove local `isRTL` const; add `import { toArabicNumerals, getFontFamily, getDirection } from '../utils/helpers'`; add `import type { Translations } from '../utils/translations'`; replace `translations: Record<string, string>` with `translations: Translations` in interface; replace `sx={{ fontFamily }}` with `sx={{ fontFamily: getFontFamily(language) }}`; replace `dir={isRTL ? 'rtl' : 'ltr'}` with `dir={getDirection(language)}`
- [ ] T009 [P] [US3+US4] Update `src/app/components/FundraisingOverlay.tsx` — remove local `toArabicNumerals` function; remove local `fontFamily` const; remove local `isRTL` const; add `import { toArabicNumerals, getFontFamily, getDirection } from '../utils/helpers'`; add `import type { Translations } from '../utils/translations'`; replace `translations: Record<string, string>` with `translations: Translations` in interface; replace `sx={{ fontFamily }}` with `sx={{ fontFamily: getFontFamily(language) }}`; replace `dir={isRTL ? 'rtl' : 'ltr'}` with `dir={getDirection(language)}`
- [ ] T010 [P] [US3+US4] Update `src/app/components/Header.tsx` — remove local `fontFamily` const; add `import { getFontFamily, getDirection } from '../utils/helpers'`; add `import type { Translations } from '../utils/translations'`; replace `translations: Record<string, string>` with `translations: Translations` in interface; replace `sx={{ fontFamily }}` with `sx={{ fontFamily: getFontFamily(language) }}`; replace `dir={language === 'ar' ? 'rtl' : 'ltr'}` with `dir={getDirection(language)}`
- [ ] T011 [P] [US3+US4] Update `src/app/components/HadithPanel.tsx` — remove local `fontFamily` const; remove local `isRTL` const; add `import { getFontFamily, getDirection } from '../utils/helpers'`; add `import type { Translations } from '../utils/translations'`; replace `translations: Record<string, string>` with `translations: Translations` in interface; replace `sx={{ fontFamily }}` with `sx={{ fontFamily: getFontFamily(language) }}`; replace `dir={isRTL ? 'rtl' : 'ltr'}` with `dir={getDirection(language)}`
- [ ] T012 [P] [US3+US4] Update `src/app/components/EventModeDisplay.tsx` — remove local `fontFamily` const; remove local `isRTL` const; add `import { getFontFamily, getDirection } from '../utils/helpers'`; add `import type { Translations } from '../utils/translations'`; replace `translations: Record<string, string>` with `translations: Translations` in interface; replace `sx={{ fontFamily }}` with `sx={{ fontFamily: getFontFamily(language) }}`; replace `dir={isRTL ? 'rtl' : 'ltr'}` with `dir={getDirection(language)}`
- [ ] T013 [P] [US3] Update `src/app/components/AnnouncementsTicker.tsx` — remove local `fontFamily` const; remove local `isRTL` const; add `import { getFontFamily, isRTL, getDirection } from '../utils/helpers'`; replace `sx={{ fontFamily }}` with `sx={{ fontFamily: getFontFamily(language) }}`; replace `dir={isRTL ? 'rtl' : 'ltr'}` with `dir={getDirection(language)}`; keep `isRTL(language)` calls for scroll direction logic (speed = isRTL(language) ? 0.4 : -0.4)

**Checkpoint**: Zero local toArabicNumerals definitions. Zero local fontFamily/isRTL constants. All 6 translations props use Translations type. Build passes.

---

## Phase 5: Timer Memory Leak Fix (US5 — P2)

**Goal**: Fix the recursive setTimeout pattern to properly clean up all pending timeouts

**Independent Test**: App runs for 30 minutes without growing memory in devtools profiler

- [ ] T014 [US5] Update `src/app/App.tsx` fundraising timer — (1) Remove `prayerTimesInMinutes` array (lines 31–37) entirely — duplicated data replaced by `prayers` array already typed as `PrayerTime[]`; (2) Remove `isNearPrayerTime` function (lines 39–51) — replace calls with `getTimeToNextPrayer(prayers, new Date()) > 10 * 60` (more than 10 minutes until next prayer); (3) Ensure `useRef<ReturnType<typeof setTimeout> | null>(null)` is used; (4) Add `clearTimeout(fundraisingTimerRef.current)` before each `setTimeout` call to prevent stacking; (5) In cleanup, clear the ref; import `getTimeToNextPrayer` from `./utils/prayerTimes`

**Checkpoint**: Only one fundraising timeout active at any time. Cleanup clears on unmount. No stacking on re-renders.

---

## Phase 6: Verification

**Purpose**: Validate all success criteria and functional requirements

- [ ] T015 Run `yarn build` — verify zero TypeScript errors (SC-006). All components compile with Translations type, PrayerKey union, shared imports
- [ ] T016 Grep for duplicate `toArabicNumerals` — `grep -rn "const toArabicNumerals" src/` must return exactly 1 match (in helpers.ts only) (SC-003)
- [ ] T017 Grep for duplicate `fontFamily` logic — `grep -rn "const fontFamily = language" src/` must return zero matches (SC-004)
- [ ] T018 Grep for duplicate `isRTL` const — `grep -rn "const isRTL = language" src/` must return zero matches (SC-004)
- [ ] T019 Grep for old type — `grep -rn "translations: Record<string, string>" src/` must return zero matches (SC-005)
- [ ] T020 Grep for old prayerIcons type — `grep -rn "Record<string, React.ComponentType" src/` must return zero matches (replaced with Record<PrayerKey, ...>)
- [ ] T021 Verify dynamic prayer highlighting — open app, confirm active prayer matches actual time of day (SC-001)
- [ ] T022 Verify dynamic countdown — countdown shows time until actual next prayer, not hardcoded 16:15 (SC-002)
- [ ] T023 Verify bundle size — `yarn build` output remains under 500KB gzipped (SC-007)
- [ ] T024 Verify no unused imports — `grep -rn "import.*from" src/` spot-check that removed utility functions don't leave orphaned imports behind (FR-012); `yarn build` should also catch unused type imports in strict mode

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** (helpers.ts, prayerTimes.ts): No dependencies — create first
- **Phase 2** (Translations type): No dependencies — create in parallel with Phase 1
- **Phase 3** (App.tsx): Depends on Phase 1 (imports prayerTimes) + Phase 2 (may use Translations)
- **Phase 4** (Components): Depends on Phase 1 (imports helpers) + Phase 2 (imports Translations type)
- **Phase 5** (Timer fix): Depends on Phase 1 (may use prayerTimes for isNearPrayerTime)
- **Phase 6** (Verification): Depends on all above

### User Story Dependencies

- **US1 (Dynamic highlight)**: Depends on Phase 1 + Phase 3
- **US2 (Dynamic countdown)**: Depends on Phase 1 + Phase 3
- **US3 (Shared utilities)**: Depends on Phase 1 + Phase 4
- **US4 (Type safety)**: Depends on Phase 2 + Phase 4
- **US5 (Timer fix)**: Depends on Phase 5

### Parallel Opportunities

Phase 1 and Phase 2 are fully independent and parallel:

```
Task A: T001 (helpers.ts) + T002 (prayerTimes.ts)    # Phase 1
Task B: T003 (Translations type)                       # Phase 2
```

Phase 4 tasks T005–T013 are all parallelizable (different files):

```
Dev A: T005 (PrayerCard) + T006 (CountdownBar)
Dev B: T007 (WeatherWidget) + T008 (MasjidInfo)
Dev C: T009 (FundraisingOverlay) + T010 (Header)
Dev D: T011 (HadithPanel) + T012 (EventModeDisplay)
Dev E: T013 (AnnouncementsTicker)
```

---

## Implementation Strategy

### MVP First (US1+US2 only)

1. Complete Phase 1: Create helpers.ts + prayerTimes.ts
2. Complete Phase 2: Create Translations type
3. Complete Phase 3: Update App.tsx with dynamic prayer computation
4. **STOP and VALIDATE**: Prayer highlight changes with time, countdown is dynamic
5. Proceed to remaining phases if MVP looks good

### Incremental Delivery

1. Phases 1–2: Shared utilities + types → foundation
2. Phase 3: App.tsx → dynamic behavior
3. Phase 4: All components → deduplication
4. Phase 5: Timer fix → memory leak resolved
5. Phase 6: Verification → all 7 success criteria validated
6. Commit after each phase

### Commit Strategy

- Commit after Phase 1: "feat: create shared utility modules (helpers.ts, prayerTimes.ts)"
- Commit after Phase 2: "feat: export Translations type from translations.ts"
- Commit after Phase 3: "feat: replace hardcoded prayer data with dynamic computation"
- Commit after Phase 4: "refactor: remove duplicated utils, use shared imports in all components"
- Commit after Phase 5: "fix: prevent fundraising timer memory leak with useRef cleanup"

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- IslamicGeometricOverlay.tsx, ImageCarousel.tsx, ImageWithFallback.tsx are NOT modified (no text/translations/font)
- AnnouncementsTicker uses `isRTL(language)` for scroll direction — imported from helpers.ts, not removed
- prayerIcons in PrayerCard typed with PrayerKey union, not generic string
- WeatherWidget temperature and FundraisingOverlay amounts remain hardcoded (Spec 004 scope per FR-016)
- App.tsx gets its own `currentTime` state with 1-second interval for prayer computation (Header has its own clock)
