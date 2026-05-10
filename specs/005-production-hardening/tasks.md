# Tasks: Production Hardening

**Input**: Design documents from `/specs/005-production-hardening/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: No tests requested in the feature specification. Verification tasks use build and grep checks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (ErrorBoundary Infrastructure)

**Purpose**: Create the ErrorBoundary component — the foundational safety net for the entire application

- [x] T001 [US1] Create ErrorBoundary class component in `src/app/components/ErrorBoundary.tsx`: getDerivedStateFromError (sets hasError: true), componentDidCatch (console.error + schedules 5s auto-recovery via setTimeout), componentWillUnmount (clears recovery timer), MUI-branded fallback UI (Box, Typography, CircularProgress with sx prop). Props: { children: ReactNode }. State: { hasError: boolean, error: Error | null }. Reset method clears state to recover.

---

## Phase 2: Foundation (Wire ErrorBoundary + Local Assets)

**Purpose**: Wire ErrorBoundary into app and migrate carousel images from remote Unsplash URLs to local Vite module imports

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [US1] Update `src/main.tsx`: import ErrorBoundary from "./app/components/ErrorBoundary", wrap `<ThemeProviderWrapper><App /></ThemeProviderWrapper>` in `<ErrorBoundary>`
- [x] T003 [P] Download 3 Unsplash mosque images to `src/imports/mosque-1.jpg`, `src/imports/mosque-2.jpg`, `src/imports/mosque-3.jpg` (replace photo-1564769625905, photo-1591604466107, photo-1542816417 from App.tsx lines 30–32). Each compressed to <200KB
- [x] T004 [US2] Update `src/app/App.tsx`: import mosque1 from "../imports/mosque-1.jpg", mosque2 from "../imports/mosque-2.jpg", mosque3 from "../imports/mosque-3.jpg". Replace carouselImages array (lines 29–33) with `[mosque1, mosque2, mosque3]`

**Checkpoint**: ErrorBoundary wraps the app; carousel images are local. `yarn build` should pass.

---

## Phase 3: User Stories 1 & 2 — Error Recovery + Local Images Verification (Priority: P1)

**Goal**: Verify ErrorBoundary auto-recovery and zero network dependency for carousel images

**Independent Test US1**: Trigger an error from any child component and observe the branded fallback UI appear, then auto-dismiss after 5 seconds

**Independent Test US2**: Disconnect network and reload page — carousel images must still appear from bundled assets

**Note**: US1 implementation was completed in Phase 1 (T001) and Phase 2 (T002). US2 implementation was completed in Phase 2 (T003, T004). This phase verifies both stories work correctly.

### Verification for User Stories 1 & 2

- [ ] T005 [P] [US1] Verify ErrorBoundary auto-recovery: trigger a test error (e.g., throw from a child component), confirm branded fallback UI appears within 1 frame, confirms auto-recovery after 5 seconds, confirms sequential errors reset timer correctly in `src/app/components/ErrorBoundary.tsx`
- [ ] T006 [P] [US2] Verify zero remote image requests: open browser Network tab, confirm zero requests to images.unsplash.com after page load. Confirm carousel transitions are smooth in `src/app/App.tsx`

**Checkpoint**: User Stories 1 & 2 fully functional — kiosk never shows a white screen and carousel loads without network

---

## Phase 4: User Story 3 - Screen Reader Users Can Access Prayer Times (Priority: P1)

**Goal**: Countdown timer, announcements ticker, and all interactive controls are announced clearly without flooding assistive technology

**Independent Test**: Test with VoiceOver or NVDA — verify countdown is announced once per minute, ticker content is accessible, all buttons have descriptive labels

### Implementation for User Story 3

- [x] T007 [P] [US3] Update `src/app/components/CountdownBar.tsx`: add `aria-live="polite"` and `aria-atomic="true"` on the countdown container. Add a visually-hidden `<span>` (sr-only) containing the accessible announcement text. Use `useRef` to track last announced minute — only update the sr-only text when the minute value changes. The existing visual countdown (driven by useClock, updates every second via parent re-render) remains unchanged (FR-006: preserved behavior)
- [x] T008 [P] [US3] Update `src/app/components/AnnouncementsTicker.tsx`: add `role="status"` and `aria-live="polite"` on the root Paper component. Add `aria-label` with announcements description on root. Add `role="marquee"` on the scrolling Box element (the one with `ref={scrollRef}`)
- [x] T009 [P] [US3] Update `src/app/components/Header.tsx`: add `aria-label="Switch to Arabic"` / `aria-label="Switch to English"` on the language toggle button (condition on language state). Add `aria-label={translations.donate}` on the donate button. Add `aria-label={eventMode ? translations.exitEvent : translations.comingEvent}` on the event mode button. Add `role="timer"` and `aria-live="polite"` and `aria-atomic="true"` on the clock Typography element
- [x] T010 [P] [US3] Add `prefers-reduced-motion` support in `src/app/App.tsx`: import `useTheme` from `@mui/material/styles` and `useMediaQuery` from `@mui/material/useMediaQuery`. Call `const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)")`. When `prefersReducedMotion` is true, set `transition={{ duration: 0 }}` on all `motion.div` and `AnimatePresence` components. When false, preserve existing animation behavior unchanged
- [ ] T011 [US3] Verify accessibility: open browser DevTools Accessibility panel, confirm all icon-only buttons have accessible labels, confirm live regions are present on CountdownBar and AnnouncementsTicker, confirm reduced-motion works via OS accessibility settings

**Checkpoint**: User Story 3 fully functional — screen reader users can access all content

---

## Phase 5: User Story 4 - Keyboard Users Can Navigate FundraisingOverlay (Priority: P2)

**Goal**: Tab/Shift+Tab cycles within the overlay; Escape closes it; focus never escapes to the page behind

**Independent Test**: Open fundraising overlay and press Tab — focus cycles within overlay only. Escape closes it.

### Implementation for User Story 4

- [x] T012 [US4] Update `src/app/components/FundraisingOverlay.tsx` (covers FR-010, FR-011, FR-012): add `role="dialog"`, `aria-modal="true"`, and `aria-label="Close fundraising overlay"` on the root overlay container (FR-012). Add keyboard focus trap via `useEffect` + `addEventListener("keydown")` on document: Tab cycles forward through focusable elements (selector: `'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'`), Shift+Tab cycles backward with wrapping, Escape calls onClose (FR-010). Auto-focus first focusable element on mount via `useRef` + `.focus()` (FR-011). Clean up event listener in effect return
- [ ] T013 [US4] Verify focus trap: open fundraising overlay, press Tab multiple times — focus cycles within overlay without escaping. Shift+Tab cycles backward. Escape closes overlay. Focus auto-moves to first element on mount

**Checkpoint**: User Story 4 fully functional — keyboard users can fully navigate the overlay

---

## Phase 6: User Story 5 - Kiosk Operates Offline with Cached Assets (Priority: P3, Optional)

**Goal**: Kiosk display continues to function when internet connection drops by serving cached static assets

**Independent Test**: Load page once, go offline in browser tools, reload — page still renders

### Implementation for User Story 5

- [ ] T014 [US5] Create `public/sw.js`: plain JS service worker. Define `CACHE_NAME = "masjid-v1"`. Install handler: pre-cache `["/", "/index.html"]`, call `skipWaiting()`. Activate handler: delete caches not matching current CACHE_NAME, call `clients.claim()`. Fetch handler: cache-first for `.js/.css/.jpg/.png/.svg/.woff2` extensions, network-first for HTML
- [ ] T015 [US5] Update `src/main.tsx`: add conditional service worker registration guarded by `'serviceWorker' in navigator`, wrapped in `window.addEventListener('load', ...)` to avoid blocking first paint. Register `'./sw.js'`
- [ ] T016 [US5] Update `src/app/components/Header.tsx`: add offline indicator — conditionally render a subtle indicator (e.g., small dot or text) when `navigator.onLine === false`, with `aria-live="polite"` for accessibility
- [ ] T017 [US5] Verify offline: load page once, go offline in browser DevTools, reload page — confirm page renders from cache. Confirm offline indicator appears in Header

**Checkpoint**: User Story 5 fully functional — kiosk operates offline after first load

---

## Phase 7: Verification (Cross-Cutting)

**Purpose**: Final validation across all user stories

- [ ] T018 Run `yarn build` — must exit with code 0 and zero errors (implicitly verifies FR-016: no new external dependencies)
- [ ] T019 Verify no remote image URLs remain: `grep -r "unsplash" src/` — must return 0 matches
- [ ] T020 Verify no `any` types in new code: `grep -r "any" src/app/components/ErrorBoundary.tsx` — must return 0 matches (FR-016: type safety compliance)
- [ ] T021 Manual visual verification: ErrorBoundary fallback, aria attributes on all components, focus trap on FundraisingOverlay, reduced-motion support, offline indicator (if SW enabled)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — can start immediately
- **Phase 2 (Foundation)**: T002 depends on T001; T004 depends on T003
- **Phase 3 (US1 + US2 verification)**: Depends on T001–T004 (ErrorBoundary wired + local images in place)
- **Phase 4 (US3)**: No dependencies on other stories — can start immediately after Phase 2
- **Phase 5 (US4)**: No dependencies on other stories — can start immediately after Phase 2
- **Phase 6 (US5)**: Depends on T002 (SW registration goes in main.tsx). Optional — can be skipped
- **Phase 7 (Verification)**: Depends on all implemented stories

### User Story Dependencies

- **US1 (P1)**: Depends on T001 + T002 (ErrorBoundary created and wired)
- **US2 (P1)**: Depends on T003 + T004 (images downloaded and imported)
- **US3 (P1)**: No story dependencies — accessibility tasks are independent component modifications
- **US4 (P2)**: No story dependencies — focus trap is self-contained in FundraisingOverlay
- **US5 (P3)**: Optional. Depends on T002 (main.tsx already modified). Can be skipped entirely

### Dependency Graph

```
T001 ──────┐
T002 ◄─────┘
T003 ──────┐
T004 ◄─────┘
T007 [P] ◄─┐
T008 [P] ◄─┤
T009 [P] ◄─┤── (no dependencies, can start after Phase 2)
T010 [P] ◄─┤
T012 ──────┘
T014 ──────── T002
T018 ──────┐
T019 [P] ──┤── depends on all implementation tasks
T020 [P] ──┤
T021 [P] ──┘
```

### Parallel Opportunities

- T003 runs in parallel with T001 + T002 (different files)
- T007, T008, T009, T010 all run in parallel (different component files)
- T012 runs in parallel with T007–T010 (different file: FundraisingOverlay.tsx)
- T018, T019, T020 all run in parallel (read-only verification)

---

## Parallel Example: Phase 4 (US3 Accessibility)

```bash
# Launch all accessibility tasks together (different component files):
Task: "T007 — aria-live on CountdownBar.tsx"
Task: "T008 — aria-live on AnnouncementsTicker.tsx"
Task: "T009 — aria-labels on Header.tsx"
Task: "T010 — reduced-motion in App.tsx"
Task: "T012 — focus trap on FundraisingOverlay.tsx (US4)"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: T001 (ErrorBoundary)
2. Complete Phase 2: T002, T003, T004 (wire boundary + local images)
3. Complete Phase 3: T005 + T006 (verify US1 + US2)
4. **STOP and VALIDATE**: `yarn build` passes, no white screen on error, carousel loads without network

### Incremental Delivery

1. Setup + Foundation → ErrorBoundary wired, images local
2. Add US3 (accessibility) → T007–T010 in parallel → Test with screen reader
3. Add US4 (focus trap) → T012 → Test with keyboard
4. Add US5 (offline SW) → T014–T016 (optional) → Test offline
5. Final verification → T018–T021

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each phase. Run `yarn build` after each phase
- US5 (service worker) is fully optional — skip without affecting other stories
- Avoid: vague tasks, same file conflicts, cross-story dependencies
