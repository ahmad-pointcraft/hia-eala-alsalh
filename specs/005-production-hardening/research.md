# Research: Production Hardening

**Feature**: 005-production-hardening | **Date**: 2026-05-10

## R1: ErrorBoundary Class Component Design

**Decision**: React class component with `getDerivedStateFromError` + `componentDidCatch`, 5-second auto-recovery via `setTimeout`, cleanup in `componentWillUnmount`.

**Rationale**: Functional components cannot catch rendering errors — only class components with `getDerivedStateFromError` (for state update) and `componentDidCatch` (for side effects like logging) can serve as error boundaries. The 5-second recovery window is short enough to minimize kiosk downtime but long enough for the user to register the error state.

**Alternatives considered**:
- `react-error-boundary` npm package — rejected (Constitution Article IV: no new dependencies)
- Multiple nested boundaries — rejected (over-engineering for a single-page kiosk; spec says one root boundary)

## R2: aria-live Throttling Pattern

**Decision**: Use `useRef` to track the last announced minute. On each render, compare current minute to ref value. Only update the sr-only announcement text when the minute changes. Visual countdown continues updating every render (driven by `useClock`).

**Rationale**: Screen readers announce every DOM mutation in an `aria-live` region. Updating every second (60 times/minute) would flood assistive technology. Once per minute balances information currency with usability. The `useRef` approach avoids `setInterval` (Constitution Article IX: single timer principle).

**Alternatives considered**:
- `setInterval` with 60-second interval — rejected (violates Article IX single timer principle; the existing `useClock` already drives re-renders)
- `aria-live="assertive"` — rejected (interrupts screen reader; too aggressive for countdown updates)

## R3: Focus Trap Implementation

**Decision**: Manual `useEffect` + `addEventListener("keydown")` on `document`. On Tab/Shift+Tab, query focusable elements via `querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')` and cycle focus. Escape calls the close handler. Auto-focus first element on mount via `useRef` + `.focus()`.

**Rationale**: The FundraisingOverlay only has 2–3 interactive elements. A full library is overkill for Tab/Shift+Tab + Escape. No new dependency satisfies Constitution Article IV.

**Alternatives considered**:
- `focus-trap` npm package — rejected (new dependency, Constitution Article IV)
- Native `<dialog>` element — rejected (would require restructuring overlay component; MUI Backdrop-based approach doesn't use native dialog)

## R4: Service Worker Strategy

**Decision**: Handwritten `public/sw.js` (plain JS, not TypeScript). Cache-first for static assets (`.js`, `.css`, `.jpg`, `.png`, `.svg`, `.woff2`), network-first for HTML. Versioned cache name (`masjid-v1`) with activate handler that deletes old caches.

**Rationale**: Workbox adds a build-time dependency and configuration complexity. For a single-page kiosk with static assets, a handwritten service worker is simpler and fully sufficient. Versioned cache names handle cache busting on deploy.

**Alternatives considered**:
- Workbox — rejected (new build dependency, overkill for simple kiosk)
- No service worker at all — viable but reduces resilience for a 24/7 kiosk (spec marks it optional)

## R5: prefers-reduced-motion Detection

**Decision**: Use MUI's `useTheme` + `useMediaQuery("(prefers-reduced-motion: reduce)")` in App.tsx and any component using `motion.div`. When true, set `transition={{ duration: 0 }}` on all Framer Motion `AnimatePresence` and `motion` components.

**Rationale**: MUI's `useMediaQuery` is already available (part of `@mui/material`). No new dependency. Setting duration to 0 is the idiomatic way to disable Framer Motion animations while preserving component structure.

**Alternatives considered**:
- CSS `@media (prefers-reduced-motion: reduce)` global override — rejected (doesn't affect JS-driven Framer Motion animations)
- Custom hook wrapping `window.matchMedia` — rejected (MUI already provides `useMediaQuery`)

## R6: Local Image Import Pattern

**Decision**: Download 3 Unsplash mosque images to `src/imports/mosque-{1,2,3}.jpg`. Import via Vite module imports (`import mosque1 from "../imports/mosque-1.jpg"`). Replace the `carouselImages` array in `App.tsx` lines 29–33 with `[mosque1, mosque2, mosque3]`.

**Rationale**: Vite content-hashes imported assets for automatic cache-busting. The `src/imports/` directory already exists (contains `logo.png`). Module imports are tree-shakeable and included in the build bundle. The array type remains `string[]` since Vite resolves image imports to URL strings.

**Alternatives considered**:
- `public/` directory with static copies — rejected (no content hashing, manual cache management)
- Keep remote URLs with fallback — rejected (network dependency violates kiosk-first principle)
