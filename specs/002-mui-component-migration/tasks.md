# Tasks: MUI Component Migration

**Input**: Design documents from `/specs/002-mui-component-migration/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/, research.md, quickstart.md

**Tests**: No automated tests — verification via `yarn build` and manual visual QA.

**Organization**: Tasks are grouped by user story priority (P1 → P2 → P3). All component rewrites within a phase are parallelizable. App.tsx is last (depends on all child components).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: User Story 1 — Header & Navigation Bar (Priority: P1)

**Goal**: Migrate the top navigation bar (clock, language toggle, event/donate buttons) from Tailwind to MUI AppBar/Toolbar/Button

**Independent Test**: Load the app and verify the header renders with MUI AppBar/Toolbar, clock ticks, buttons are interactive, EN/AR toggle works

- [X] T001 [P] [US1] Rewrite Header.tsx in `src/app/components/Header.tsx` — replace all Tailwind className with MUI sx prop; outer div → AppBar position="static" with Toolbar; buttons → MUI Button variant="outlined"/"contained"; clock → Typography with sx fontFamily monospace; hidden sm:inline → sx display { xs: none, sm: inline }; replace style={{ fontFamily }} with sx={{ fontFamily }}; translations: any → Record<string, string>; dir={language === 'ar' ? 'rtl' : 'ltr'} on AppBar root; remove all className strings
- [X] T002 [US1] Verify Header renders at xs/sm/lg breakpoints — clock displays, language toggle switches EN↔AR, donate button shows Heart icon, event mode button toggles; confirm in browser at 375px, 640px, 1920px

**Checkpoint**: Header uses MUI AppBar/Toolbar/Button, zero Tailwind classes, RTL works

---

## Phase 2: User Story 2 — Prayer Time Cards (Priority: P1)

**Goal**: Migrate 6 prayer time cards with responsive grid (2→3→6 columns), active card glow, Arabic numerals

**Independent Test**: Render prayer cards grid — 6 cards display, active card has gold glow + scale, responsive at xs/sm/lg, Arabic numerals in AR mode

- [X] T003 [P] [US2] Rewrite PrayerCard.tsx in `src/app/components/PrayerCard.tsx` — outer div → Card with conditional sx for active/inactive; active: border 1px solid primary.main, boxShadow 0 0 30px rgba(212,175,55,0.5), transform { xs: scale(1.05), lg: scale(1.10) }; inactive: bgcolor background.paper, border rgba(212,175,55,0.3); text divs → Typography; keep lucide icons (Sunrise, Sun, Sunset, CloudSun, Moon, Star); prayerIcons type: Record<string, any> → Record<string, React.ComponentType<{ className?: string }>>; replace style={{ fontFamily }} with sx={{ fontFamily }}; Arabic numerals via toArabicNumerals() for prayer time + iqama time; dir prop on Card root; remove all className strings
- [X] T004 [US2] Verify PrayerCard active/inactive states — active card has gold border, glow shadow, scale 1.05/1.10; inactive cards are subtle; 2 columns at xs, 3 at sm, 6 at lg; Arabic numerals render when language=ar

**Checkpoint**: PrayerCard uses MUI Card/CardContent, active glow works, responsive grid works, no any types

---

## Phase 3: User Stories 3–5 — Countdown, Weather, Masjid Info, Ticker (Priority: P2)

**Goal**: Migrate secondary info panels (CountdownBar, WeatherWidget, MasjidInfo, AnnouncementsTicker)

**Independent Test**: Countdown ticks every second, weather shows temp/conditions, masjid info shows dual dates, ticker scrolls; all adapt to RTL

- [ ] T005 [P] [US3] Rewrite CountdownBar.tsx in `src/app/components/CountdownBar.tsx` — outer div → Paper with sx glass effect (bgcolor: background.paper, backdropFilter: blur(4px)); inner flex → Box sx display flex; prayer text → Typography sx color text.primary; countdown → Typography sx color primary.main fontFamily monospace fontWeight bold; replace style={{ fontFamily }} with sx={{ fontFamily }}; Arabic numerals via toArabicNumerals() for countdown timer display; dir prop on Paper root; remove all className strings
- [ ] T006 [P] [US4] Rewrite MasjidInfo.tsx in `src/app/components/MasjidInfo.tsx` — outer div → Box (structural layout); date spans → Typography component="span" with responsive sx; logo img stays as img with sx sizing; Hijri date → sx color text.primary; Gregorian date → sx color text.secondary; translations: any → Record<string, string>; replace style={{ fontFamily }} with sx={{ fontFamily }}; Arabic numerals via toArabicNumerals() for Gregorian date digits when language=ar; remove unused logoSvg import; dir prop on root Box; remove all className strings
- [ ] T007 [P] [US6] Rewrite HadithPanel.tsx in `src/app/components/HadithPanel.tsx` — outer div → Paper with glass effect; title → Typography sx color primary.main textAlign start textTransform uppercase; hadith text → Typography sx color text.primary fontStyle italic textAlign center; source → Typography sx color text.secondary textAlign end (logical, auto-flips RTL); translations: any → Record<string, string>; replace style={{ fontFamily }} with sx={{ fontFamily }}; dir prop on Paper root; remove all className strings
- [ ] T008 [P] [US3] Rewrite WeatherWidget.tsx in `src/app/components/WeatherWidget.tsx` — outer div → Paper sx bgcolor background.paper; replace Cloud import from lucide-react → Cloud from @mui/icons-material (named import); Cloud icon sx color text.secondary; temperature → Typography sx color text.primary fontWeight bold; city → Typography sx color text.secondary; keep Droplets from lucide; conditional text-left/text-right → textAlign end (logical); conditional flex-row-reverse → removed (dir prop handles RTL); translations: any → Record<string, string>; replace style={{ fontFamily }} with sx={{ fontFamily }}; Arabic numerals via toArabicNumerals() for temperature + humidity; dir prop on Paper root; remove all className strings
- [ ] T009 [P] [US5] Rewrite AnnouncementsTicker.tsx in `src/app/components/AnnouncementsTicker.tsx` — outer div → Paper (elevated surface, fixed bottom); inner flex sections → Box with sx; text → Typography component="span"; keep Megaphone from lucide; scroll animation ref preserved as-is (requestAnimationFrame); replace style={{ fontFamily }} with sx={{ fontFamily }}; replace style={{ willChange }} with sx={{ willChange }}; dir prop on Paper root; remove all className strings

**Checkpoint**: CountdownBar, WeatherWidget, MasjidInfo, HadithPanel, AnnouncementsTicker all use MUI components, zero Tailwind, Arabic numerals work, RTL works

---

## Phase 4: User Stories 7–10 — Fundraising, Event Mode, Overlay, Carousel (Priority: P3)

**Goal**: Migrate fundraising overlay, event mode display, geometric overlay, image carousel

**Independent Test**: Fundraising overlay opens/auto-closes, event mode renders with MUI icons, geometric overlay animates, carousel auto-advances

- [ ] T010 [P] [US7] Rewrite FundraisingOverlay.tsx in `src/app/components/FundraisingOverlay.tsx` — outer overlay div → Backdrop open sx bgcolor rgba(0,0,0,0.4) backdropFilter blur(8px); content card div → Paper sx bgcolor rgba(0,0,0,0.6) border 1px solid borderColor primary.main; close button → IconButton with Close icon from @mui/icons-material (named import), sx position absolute top 16 insetInlineEnd 16 (logical for RTL); title → Typography sx color primary.main; collected → Typography sx color primary.main fontWeight bold; goal/donors → Typography sx color text.primary fontWeight bold; labels → Typography sx color text.secondary textTransform uppercase; progress bar div → LinearProgress variant determinate with gold gradient; stats dividers → Box sx display { xs: none, sm: block }; translations: any → Record<string, string>; replace all style={{ fontFamily }} with sx={{ fontFamily }}; Arabic numerals via toArabicNumerals() for collected, goal, donors, progress %, countdown seconds; dir prop on Backdrop root; remove all className strings
- [ ] T011 [P] [US8] Rewrite EventModeDisplay.tsx in `src/app/components/EventModeDisplay.tsx` — event card div → Paper sx bgcolor rgba(0,0,0,0.6); badge span → Chip sx bgcolor rgba(212,175,55,0.2) color primary.main borderColor rgba(212,175,55,0.5); replace Calendar→CalendarMonth, Clock→AccessTime, MapPin→LocationOn, Users→Groups all from @mui/icons-material (named imports); detail icons sx color primary.main; details grid grid-cols-3 → Grid container + Grid size={4} (12-column); title → Typography sx color primary.main; speaker → Typography sx color text.primary fontWeight bold; detail labels → Typography sx color text.secondary textTransform uppercase; CTA button → Button sx background linear-gradient(to right, #D4AF37, #FFD700) boxShadow; corner ornaments → Box sx display { xs: none, sm: block }; translations: any → Record<string, string>; replace all style={{ fontFamily }} with sx={{ fontFamily }}; dir prop on root motion.div; remove all className strings
- [ ] T012 [P] [US9] Rewrite IslamicGeometricOverlay.tsx in `src/app/components/IslamicGeometricOverlay.tsx` — all wrapper divs → Box with sx position absolute inset 0 pointerEvents none; floating particles: Math.random() in render → useMemo hook; particle count 12 → 6; SVG patterns remain as-is; motion.div wrappers remain as-is; no dir prop needed (decorative, no text); remove all className strings
- [ ] T013 [P] [US10] Rewrite ImageCarousel.tsx in `src/app/components/ImageCarousel.tsx` — outer container div → Box sx position relative overflow hidden borderRadius 2; nav buttons → IconButton sx bgcolor rgba(0,0,0,0.5) hover bgcolor rgba(0,0,0,0.7); replace ChevronLeft/ChevronRight from lucide → ChevronLeft/ChevronRight from @mui/icons-material (named imports); dot indicators → Box component="button" with sx for active (bgcolor primary.main, width elongated) and inactive (bgcolor rgba(255,255,255,0.5), round); image stays as img; AnimatePresence remains as-is; remove all className strings

**Checkpoint**: FundraisingOverlay, EventModeDisplay, IslamicGeometricOverlay, ImageCarousel all use MUI components, MUI icons imported correctly, particles use useMemo, zero Tailwind

---

## Phase 5: Utility & Root Layout (US11)

**Goal**: Migrate the utility component and root App layout that composes all child components

**Independent Test**: App loads with dark emerald background, diagonal grid pattern, normal/event mode switching with fade animations, full-viewport-height layout

- [ ] T014 [P] Rewrite ImageWithFallback.tsx in `src/app/components/figma/ImageWithFallback.tsx` — error state div → Box sx display inline-block bgcolor grey.100 textAlign center verticalAlign middle; inner flex div → Box sx display flex alignItems center justifyContent center; normal state img stays as img, replace className/style with sx
- [ ] T015 [US11] Rewrite App.tsx in `src/app/App.tsx` — root div → Box sx position relative width 100% height 100vh overflow hidden; background pattern div → Box sx bgcolor background.default + gradient pattern; main content column → Stack sx height 100% for vertical flow; normal mode inner layout → Stack for vertical section stacking; prayer cards grid → Grid container spacing { xs: 1, sm: 1.5 } + Grid size {{ xs: 6, sm: 4, lg: 2 }} per PrayerCard; countdown+weather grid → Grid container + Grid size {{ xs: 12, lg: 6 }}; fix fundraising timer: NodeJS.Timeout → ReturnType<typeof setTimeout>, use useRef for timer; remove Languages import if unused; remove all className strings

**Checkpoint**: App.tsx uses Box/Stack/Grid, timer fixed, all child components render, no Tailwind

---

## Phase 6: Verification & Cross-Cutting Concerns

**Purpose**: Validate all success criteria and functional requirements

- [ ] T016 Run `yarn build` — verify zero TypeScript errors (SC-003). All translations: any replaced with Record<string, string>, prayerIcons typed, NodeJS.Timeout replaced
- [ ] T017 Visual QA — verify all 12 components render at 1920x1080 in dark mode with the dark emerald/gold Islamic theme preserved (SC-002). Test both EN and AR modes
- [ ] T018 Verify event mode toggle — normal mode fades out with scale-down, event mode fades in, CTA button pulses, geometric overlay appears
- [ ] T019 Verify fundraising overlay — opens on schedule, shows collected/goal/donors stats with Arabic numerals in AR mode, progress bar renders gold gradient, 10-second countdown auto-closes, close button works
- [ ] T020 Verify responsive layout at all breakpoints (SC-005) — test at 375px, 600px, 640px, 900px, 960px, 1200px, 1440px, 1920px. Prayer cards: 2 cols at xs, 3 at sm, 6 at lg. Countdown+weather: stacked at xs, side-by-side at lg
- [ ] T021 Search for remaining Tailwind classes (SC-001) — grep with pattern `(bg-|text-\[|px-\[|py-\[|p-\d|m-\d|flex |grid |border-|rounded-|backdrop-|shadow-|hidden |transition-|tracking-|font-bold|font-mono|items-|justify-|gap-|w-\d|h-\d|inset-|absolute |relative |overflow-)` across `src/app/components/` and `src/app/App.tsx` — must return zero matches
- [ ] T022 Verify zero inline style={{ fontFamily }} remain (FR-018) — grep `style={{ fontFamily` across all component files — must return zero matches
- [ ] T023 Verify Arabic numerals on all numeric displays (FR-024) — switch to AR mode and confirm: prayer times (PrayerCard), countdown HH:MM:SS (CountdownBar), Hijri/Gregorian dates (MasjidInfo), temperature + humidity (WeatherWidget), collected/goal/donors/progress (FundraisingOverlay) all show ٠١٢٣٤٥٦٧٨٩ digits
- [ ] T024 Verify no dead Tailwind code remains (FR-023) — grep for empty className="" and dead Tailwind template literals across all component files — must return zero matches. Confirm no unused Tailwind-related imports

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phases 1–4**: All component rewrites (T001–T014) are independent and fully parallelizable — different files, no cross-component API changes
- **Phase 5 (T015 App.tsx)**: Depends on Phase 1–4 completion — child component APIs must be stable
- **Phase 6 (Verification)**: Depends on Phase 5 completion — validates the complete app

### User Story Dependencies

- **US1 (Header)**: Independent — can start immediately
- **US2 (PrayerCard)**: Independent — can start immediately
- **US3 (Countdown + Weather)**: Independent — can start immediately
- **US4 (MasjidInfo)**: Independent — can start immediately
- **US5 (AnnouncementsTicker + Hadith)**: Independent — can start immediately
- **US7 (FundraisingOverlay)**: Independent — can start immediately
- **US8 (EventModeDisplay)**: Independent — can start immediately
- **US9 (IslamicGeometricOverlay)**: Independent — can start immediately
- **US10 (ImageCarousel)**: Independent — can start immediately
- **US11 (App.tsx Root Layout)**: BLOCKS on US1–US10 + ImageWithFallback

### Parallel Opportunities

All tasks T001–T014 can run in parallel (different files, no shared state changes):

```
Developer A: T001 (Header) + T002 (verify)
Developer B: T003 (PrayerCard) + T004 (verify)
Developer C: T005 (CountdownBar) + T008 (WeatherWidget)
Developer D: T010 (FundraisingOverlay) + T011 (EventModeDisplay)
Developer E: T012 (IslamicGeometricOverlay) + T013 (ImageCarousel)
```

---

## Parallel Example: Phase 1–4

```bash
# All 14 component rewrites can run simultaneously:
Task: "Rewrite Header.tsx"          # T001
Task: "Rewrite PrayerCard.tsx"      # T003
Task: "Rewrite CountdownBar.tsx"    # T005
Task: "Rewrite MasjidInfo.tsx"      # T006
Task: "Rewrite HadithPanel.tsx"     # T007
Task: "Rewrite WeatherWidget.tsx"   # T008
Task: "Rewrite AnnouncementsTicker.tsx" # T009
Task: "Rewrite FundraisingOverlay.tsx"  # T010
Task: "Rewrite EventModeDisplay.tsx"    # T011
Task: "Rewrite IslamicGeometricOverlay.tsx" # T012
Task: "Rewrite ImageCarousel.tsx"       # T013
Task: "Rewrite ImageWithFallback.tsx"   # T014
```

---

## Implementation Strategy

### MVP First (User Stories 1+2 only)

1. Complete Phase 1: Header (US1)
2. Complete Phase 2: PrayerCard (US2)
3. **STOP and VALIDATE**: Header + PrayerCard render with MUI, no Tailwind
4. Proceed to remaining phases if MVP looks good

### Incremental Delivery

1. Phases 1–4: All component rewrites (parallel) → 13 files migrated
2. Phase 5: Root layout (App.tsx) → complete app assembled
3. Phase 6: Verification → all 7 success criteria validated
4. Commit after each component or logical group

### Commit Strategy

- Commit after each component rewrite (e.g., "feat: migrate Header to MUI v7")
- Or batch by phase (e.g., "feat: migrate P1 components to MUI v7")
- Final verification commit: "chore: verify Spec 002 migration complete"

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- All 13 component rewrites are independent — no cross-component API changes
- App.tsx (T015) is the only task that depends on others
- Verification tasks (T016–T024) must run after App.tsx is complete
- Use theme tokens (FR-022) for all theme colors: primary.main, background.default, text.primary etc.
- Use Grid (not Grid2) — confirmed @mui/material 7.3.5 exports Grid with size prop
- Import Grid as: `import Grid from '@mui/material/Grid'` (per quickstart.md)
