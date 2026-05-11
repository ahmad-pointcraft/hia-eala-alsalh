# Tasks: Centralized Theme Token System

**Input**: Design documents from `/specs/006-theme-token-system/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not requested — verification via grep patterns and production build.

**Organization**: Tasks grouped by user story. US1 and US2 are both P1 but split: US1 = token foundation, US2 = component migration.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup — Create Token Foundation

**Purpose**: Create the centralized color token file — the single source of truth for all raw color values.

- [ ] T001 [US1] Create `src/app/theme/tokens.ts` exporting a `colors` object typed `as const` with the following flat namespace structure: `gold` (main "#D4AF37", light "#FFD700", dark "#B8960C"), `border` (faint "rgba(212,175,55,0.02)", subtle "rgba(212,175,55,0.08)", thin "rgba(212,175,55,0.12)", light "rgba(212,175,55,0.15)", default "rgba(212,175,55,0.2)", medium "rgba(212,175,55,0.3)", strong "rgba(212,175,55,0.4)", prominent "rgba(212,175,55,0.5)", intense "rgba(212,175,55,0.8)"), `surface` (overlay "rgba(0,0,0,0.3)", raised "rgba(0,0,0,0.4)", medium "rgba(0,0,0,0.5)", deep "rgba(0,0,0,0.6)", heavy "rgba(0,0,0,0.7)", darker "rgba(0,0,0,0.8)", opaque "rgba(0,0,0,0.95)"), `glow` (subtle "rgba(212,175,55,0.3)", medium "rgba(212,175,55,0.5)", strong "rgba(212,175,55,0.8)"), `background` (default "#0a1f0a", paper "rgba(0,0,0,0.3)"), `text` (primary "#ffffff", secondary "#9ca3af", contrast "#0a1f0a", onGold "#0a1f0a", onDark "#ffffff"), `error` (main "#d4183d", light "#ff4d6a", dark "#a30025"), `green` (main "#2E7D32", light "#4CAF50", dark "#1B5E20"), `common` (black "#000000", white "#ffffff"). Add `rgba(255,255,255,0.5)` and `rgba(255,255,255,0.7)` to `text` as whiteMuted and whiteSoft for ImageCarousel dots.

---

## Phase 2: Foundational — Refactor Theme

**Purpose**: Refactor muiTheme.ts to consume tokens and extend the palette — MUST complete before any component migration.

**⚠️ CRITICAL**: No component migration can begin until T002 is complete.

- [ ] T002 [US1] Refactor `src/app/theme/muiTheme.ts`: (1) Import `colors` from `./tokens`. (2) Replace all hardcoded hex/rgba in `palette` with token references (e.g., `primary.main: colors.gold.main`, `background.default: colors.background.default`, `text.primary: colors.text.primary`, `divider: colors.border.thin`). (3) Replace all hardcoded values in `MuiCssBaseline` styleOverrides body (backgroundColor, backgroundImage rgba patterns, scrollbarColor) with token references using template literal interpolation for the backgroundImage gradient string. (4) Replace hardcoded values in `MuiPaper`, `MuiCard`, `MuiButton`, `MuiDivider` styleOverrides with token references (e.g., `backgroundColor: colors.background.paper`, `border: "1px solid " + colors.border.subtle`). (5) Extend the Palette module augmentation to include `surface`, `border`, and `glow` interfaces matching the data-model.md structure (keep existing `gold` augmentation, expand its type to `{ main: string; light: string; dark: string }`). (6) Replace the `muiTheme.palette.gold = { main: "#D4AF37", light: "#FFD700" }` assignment with assignments for all four namespaces: `muiTheme.palette.gold = colors.gold`, `muiTheme.palette.surface = colors.surface`, `muiTheme.palette.border = colors.border`, `muiTheme.palette.glow = colors.glow`. (7) Run `yarn build` to verify zero type errors.

**Checkpoint**: Token system functional — `yarn build` passes, theme consumes tokens, palette extended.

---

## Phase 3: User Story 1 — Single Source of Truth (Priority: P1) 🎯 MVP

**Goal**: Verify the token propagation works end-to-end by migrating the heaviest component first.

**Independent Test**: Change `colors.gold.main` in tokens.ts to "#FF0000", run `yarn build`, verify gold accents render red, then revert.

- [ ] T003 [US1] [US2] Migrate `src/app/components/EventModeDisplay.tsx` (~20 color instances — heaviest file, prioritized per FR-005): (1) Add `import { colors } from "../theme/tokens"` at top. (2) Replace all `rgba(0,0,0,0.6)` with `theme.palette.surface.deep` in sx props (Paper bgcolor). (3) Replace all `rgba(212,175,55,0.5)` with `theme.palette.border.prominent` in sx props (borders). (4) Replace all `rgba(212,175,55,0.4)` with `theme.palette.border.strong` in sx props (corner box borders). (5) Replace all `rgba(212,175,55,0.2)` with `theme.palette.border.default` in sx props (chip bgcolor, detail borders). (6) Replace `rgba(0,0,0,0.4)` with `theme.palette.surface.raised` in sx props (detail box bgcolor). (7) Replace `#D4AF37` and `#FFD700` in gradient strings with `${colors.gold.main}` and `${colors.gold.light}` using template literal interpolation. (8) Replace `rgba(212,175,55,0.5)` in framer-motion boxShadow with `colors.glow.medium` (token import). (9) Replace `rgba(212,175,55,0.15)` in radial gradient with `colors.border.light` (token import). (10) Replace `color: "black"` with `theme.palette.text.onGold` or `colors.text.onGold`. (11) Run `yarn build` to verify.

---

## Phase 4: User Story 2 — Zero Hardcoded Colors in Components (Priority: P1)

**Goal**: Migrate all remaining 9 component files to use theme palette or token imports exclusively.

**Independent Test**: `grep -rE '#[0-9a-fA-F]{3,8}' src/app/components/ src/app/App.tsx` returns zero matches. `grep -rE 'rgba\(' src/app/components/ src/app/App.tsx` returns zero matches.

- [ ] T004 [P] [US2] Migrate `src/app/components/Header.tsx` (~10 rgba references): (1) Replace `rgba(0,0,0,0.4)` with `theme.palette.surface.raised` (AppBar bgcolor). (2) Replace `rgba(212,175,55,0.3)` with `theme.palette.border.medium` (border bottom). (3) Replace `rgba(0,0,0,0.8)` with `theme.palette.surface.darker` (language/donate btn bgcolor). (4) Replace `rgba(212,175,55,0.5)` with `theme.palette.border.prominent` (btn borders). (5) Replace `rgba(0,0,0,0.95)` with `theme.palette.surface.opaque` (btn hover). (6) Replace `rgba(212,175,55,0.8)` with `theme.palette.border.intense` (event mode btn). (7) Run `yarn build`.
- [ ] T005 [P] [US2] Migrate `src/app/components/FundraisingOverlay.tsx` (~10 color instances): (1) Add `import { colors } from "../theme/tokens"`. (2) Replace `rgba(0,0,0,0.4)` with `theme.palette.surface.raised` (Backdrop bgcolor). (3) Replace `rgba(0,0,0,0.6)` with `theme.palette.surface.deep` (Paper bgcolor). (4) Replace `rgba(212,175,55,0.3)` with `theme.palette.border.medium` (dividers, top border). (5) Replace `#D4AF37` and `#FFD700` in gradient strings with `${colors.gold.main}` and `${colors.gold.light}`. (6) Replace `bgcolor: "white"` with `bgcolor: "common.white"` or `colors.common.white`. (7) Replace `color: "black"` with `colors.text.onDark` or `theme.palette.text.contrast`. (8) Run `yarn build`.
- [ ] T006 [P] [US2] Migrate `src/app/components/IslamicGeometricOverlay.tsx` (~14 color instances — SVG + inline styles): (1) Add `import { colors } from "../theme/tokens"`. (2) Replace all `stroke="#D4AF37"` SVG attributes with `stroke={colors.gold.main}`. (3) Replace `#D4AF37` in gradient string interpolation with `${colors.gold.main}`. (4) Replace `#D4AF37` in particle backgroundColor with `colors.gold.main`. (5) Replace `rgba(212, 175, 55, 0.3)` in boxShadow keyframes with `colors.glow.subtle`. (6) Replace `rgba(212, 175, 55, 0.5)` in boxShadow keyframes with `colors.glow.medium`. (7) Replace `rgba(212, 175, 55, 0.3)` in radial gradient with `colors.border.medium`. (8) Run `yarn build`.
- [ ] T007 [P] [US2] Migrate `src/app/components/PrayerCard.tsx` (~5 rgba references): (1) Replace `rgba(212,175,55,0.2)` with `theme.palette.border.default` (active bgcolor). (2) Replace `rgba(212,175,55,0.5)` with `theme.palette.glow.medium` (active boxShadow). (3) Replace `rgba(0,0,0,0.3)` with `theme.palette.surface.overlay` (inactive bgcolor). (4) Replace `rgba(212,175,55,0.3)` with `theme.palette.border.medium` (inactive border). (5) Run `yarn build`.
- [ ] T008 [P] [US2] Migrate `src/app/components/AnnouncementsTicker.tsx` (~4 color instances): (1) Replace `rgba(0,0,0,0.4)` with `theme.palette.surface.raised` (Paper bgcolor). (2) Replace `rgba(212,175,55,0.3)` with `theme.palette.border.medium` (border). (3) Replace `rgba(0,0,0,0.6)` with `theme.palette.surface.deep` (logo area bgcolor). (4) Replace inline `color: 'black'` on Megaphone icon with `colors.text.onDark` (add `import { colors } from "../theme/tokens"`). (5) Run `yarn build`.
- [ ] T009 [P] [US2] Migrate `src/app/components/ImageCarousel.tsx` (~6 rgba references): (1) Replace `rgba(0,0,0,0.3)` with `theme.palette.surface.overlay` (box bgcolor). (2) Replace `rgba(212,175,55,0.3)` with `theme.palette.border.medium` (box border). (3) Replace `rgba(0,0,0,0.5)` with `theme.palette.surface.medium` (prev/next btn bgcolor). (4) Replace `rgba(0,0,0,0.7)` with `theme.palette.surface.heavy` (btn hover). (5) Replace `rgba(255,255,255,0.5)` with `theme.palette.text.whiteMuted` (inactive dot) — add whiteMuted and whiteSoft to tokens.ts `text` namespace if not already there. (6) Replace `rgba(255,255,255,0.7)` with `theme.palette.text.whiteSoft` (dot hover). (7) Run `yarn build`.
- [ ] T010 [P] [US2] Migrate `src/app/components/CountdownBar.tsx` (~1 rgba reference): (1) Replace `rgba(212,175,55,0.3)` with `theme.palette.border.medium` (border). (2) Run `yarn build`.
- [ ] T011 [P] [US2] Migrate `src/app/components/HadithPanel.tsx` (~1 rgba reference): (1) Replace `rgba(212,175,55,0.3)` with `theme.palette.border.medium` (border). (2) Run `yarn build`.
- [ ] T012 [P] [US2] Migrate `src/app/components/WeatherWidget.tsx` (~1 rgba reference): (1) Replace `rgba(212,175,55,0.3)` with `theme.palette.border.medium` (border). (2) Run `yarn build`.

**Checkpoint**: All component files migrated. `grep -rE '#[0-9a-fA-F]{3,8}' src/app/components/` should return zero matches (except any false positives in comments/strings that aren't color values).

---

## Phase 5: User Story 3 — Remove Duplicate Background (Priority: P2)

**Goal**: Remove the duplicate backgroundImage pattern from App.tsx, relying solely on CssBaseline.

**Independent Test**: Display renders identically after removal — body-level CssBaseline still applies the pattern.

- [ ] T013 [US3] Remove duplicate background from `src/app/App.tsx`: (1) Find the root `<Box>` that has `backgroundImage`, `backgroundSize`, and `backgroundPosition` props. (2) Remove all three props (backgroundImage, backgroundSize, backgroundPosition). (3) Keep the `bgcolor: "background.default"` if present (it maps to theme, not a duplicate). (4) Run `yarn build` and visually verify the display still shows the checkerboard pattern from CssBaseline.

---

## Phase 6: User Story 4 — Eliminate Dead Code (Priority: P2)

**Goal**: Remove all unused imports, variables, and unreachable code introduced during the migration.

**Independent Test**: `yarn build` succeeds with zero unused-import warnings.

- [ ] T014 [US4] Dead code audit across all modified files: (1) Check each file modified in T003–T013 for unused imports — especially any old color-related imports that may no longer be needed. (2) Check if any components no longer need imports that were only used for hardcoded colors (e.g., if `alpha` was imported from MUI but is no longer used). (3) Run `npx tsc --noUnusedLocals --noUnusedParameters` (or add flags to `yarn typecheck`) and fix any reported issues. (4) Check `src/app/components/MasjidInfo.tsx` specifically for unused imports (flagged in original audit). (5) Run `yarn build` to confirm zero errors.

---

## Phase 7: Verification & Polish

**Purpose**: Final validation against all success criteria from the spec.

- [ ] T015 Verify SC-001: Run `grep -rE '#[0-9a-fA-F]{3,8}' src/app/components/ src/app/App.tsx` — must return zero matches (no hardcoded hex in components/App). Run `grep -rE '#[0-9a-fA-F]{3,8}' src/app/theme/tokens.ts src/app/theme/muiTheme.ts` — confirm these files DO contain the expected hex values.
- [ ] T016 Verify SC-002: Run `grep -rE 'rgba\(' src/app/components/ src/app/App.tsx` — must return zero matches (no hardcoded rgba in components/App). Confirm tokens.ts and muiTheme.ts still contain rgba values as expected.
- [ ] T017 Verify SC-003: Run `grep -rE '"(black|white)"' src/app/components/` — must return zero matches (no CSS keyword colors in sx props).
- [ ] T018 Verify SC-004 (token propagation): (1) Open `src/app/theme/tokens.ts`, change `gold.main` from "#D4AF37" to "#FF0000". (2) Run `yarn build`. (3) Open the app and verify all gold accents now render red. (4) Revert the change back to "#D4AF37". (5) Run `yarn build` again.
- [ ] T019 Verify SC-005 and SC-006: (1) Run `yarn build` — must exit with code 0 and zero TypeScript errors. (2) Open `src/app/App.tsx` and confirm no backgroundImage/backgroundSize/backgroundPosition props exist.
- [ ] T020 Verify SC-007 (bundle size): (1) Record the gzipped JS bundle size from `yarn build` output. (2) Compare with pre-migration baseline (should be ≤1KB increase). Token constants are inlined at build time, so overhead should be negligible.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on T001 — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on T002 — proves token propagation works
- **US2 (Phase 4)**: Depends on T002 — all component migrations need palette extension
- **US3 (Phase 5)**: Depends on T002 — App.tsx changes need theme consuming tokens
- **US4 (Phase 6)**: Depends on T003–T013 — audit after all migrations complete
- **Verification (Phase 7)**: Depends on all phases complete

### User Story Dependencies

- **US1 (P1)**: Depends on T001+T002 only. MVP = tokens.ts + muiTheme.ts + EventModeDisplay.tsx
- **US2 (P1)**: Depends on T002. Can start after foundational. T003 serves both US1 and US2.
- **US3 (P2)**: Depends on T002. Independent of US2 component migrations.
- **US4 (P2)**: Depends on all migration tasks completing (T003–T013).

### Parallel Opportunities

- **T004–T012**: ALL component migrations are [P] — different files, no dependencies on each other
- **T013**: Can run in parallel with T004–T012 (different file)
- **T015–T017**: Verification grep checks can run in parallel

---

## Parallel Example: Phase 4 (Component Migration)

```text
# Launch all component migrations together (after T002 completes):
T004: Migrate Header.tsx
T005: Migrate FundraisingOverlay.tsx
T006: Migrate IslamicGeometricOverlay.tsx
T007: Migrate PrayerCard.tsx
T008: Migrate AnnouncementsTicker.tsx
T009: Migrate ImageCarousel.tsx
T010: Migrate CountdownBar.tsx
T011: Migrate HadithPanel.tsx
T012: Migrate WeatherWidget.tsx
```

---

## Implementation Strategy

### MVP First (Phase 1–3)

1. T001: Create tokens.ts
2. T002: Refactor muiTheme.ts
3. T003: Migrate EventModeDisplay.tsx (heaviest — proves the system works)
4. **STOP and VALIDATE**: Run `yarn build`, verify EventModeDisplay renders correctly

### Full Migration (Phase 4–6)

5. T004–T012: Migrate all remaining components (parallel)
6. T013: Remove duplicate background
7. T014: Dead code audit

### Final Validation (Phase 7)

8. T015–T020: Run all verification checks

---

## Notes

- [P] tasks = different files, no dependencies — safe to parallelize
- [Story] label maps each task to its user story for traceability
- T003 serves both US1 (proves propagation) and US2 (eliminates hardcoded colors)
- Each component migration includes a `yarn build` verification step
- If a shade mismatch is detected during migration, store the exact rgba as a named token instead of using `theme.palette.*` reference (shade mismatch fallback per spec)
- Commit after each task or logical group of parallel tasks
