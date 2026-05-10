# Data Model: Production Hardening

**Feature**: 005-production-hardening | **Date**: 2026-05-10

## Entities

### ErrorBoundary

React class component wrapping the entire application.

| Field | Type | Description |
|-------|------|-------------|
| `state.hasError` | `boolean` | Whether an error has been caught |
| `state.error` | `Error \| null` | The caught error object |
| `props.children` | `ReactNode` | Child component tree |
| `recoveryTimer` | `ReturnType<typeof setTimeout> \| null` (instance) | Auto-recovery timer handle |

**State transitions**:
1. `Normal` → `getDerivedStateFromError` → `HasError` (displays fallback UI)
2. `HasError` → `componentDidCatch` schedules recovery → 5s timeout → `resetState` → `Normal`

**Validation rules**:
- Must be a class component (React requirement)
- Timer must be cleared in `componentWillUnmount`
- Fallback must use only MUI components (Box, Typography, CircularProgress)

### CarouselAssets

Three local image files replacing remote Unsplash URLs.

| Field | Type | Description |
|-------|------|-------------|
| `mosque-1.jpg` | Static asset | Replaces `photo-1564769625905-50e93615e769` |
| `mosque-2.jpg` | Static asset | Replaces `photo-1591604466107-ec97de577aff` |
| `mosque-3.jpg` | Static asset | Replaces `photo-1542816417-0983c9c9ad53` |

**Validation rules**:
- Each file < 200KB
- Stored in `src/imports/`
- Imported as Vite modules (type resolves to `string`)

### AccessibilityEnhancements

Cross-cutting attributes applied to existing components. No new entities — modifies existing component props/JSX.

| Component | Attributes Added |
|-----------|-----------------|
| CountdownBar | `aria-live="polite"`, `aria-atomic="true"`, sr-only span with throttled text |
| AnnouncementsTicker (root) | `role="status"`, `aria-live="polite"` |
| AnnouncementsTicker (scroll element) | `role="marquee"` |
| Header language button | `aria-label="Switch to Arabic"` / `"Switch to English"` |
| Header donate button | `aria-label={translations.donate}` |
| Header event mode button | `aria-label={translations.exitEvent}` / `{translations.comingEvent}` |
| FundraisingOverlay root | `role="dialog"`, `aria-modal="true"`, `aria-label="Close fundraising overlay"` |

### ReducedMotionPreference

| Field | Type | Description |
|-------|------|-------------|
| `prefersReducedMotion` | `boolean` | Result of `useMediaQuery("(prefers-reduced-motion: reduce)")` |
| Applied to | `motion.div`, `AnimatePresence` | `transition={{ duration: 0 }}` when true |

### ServiceWorker (Optional)

| Field | Type | Description |
|-------|------|-------------|
| `CACHE_NAME` | `string` | Versioned cache name (e.g., `masjid-v1`) |
| `PRECACHE_URLS` | `string[]` | `["/", "/index.html"]` |
| Strategy | enum | Cache-first for static assets, network-first for HTML |
| Offline indicator | `navigator.onLine === false` | Displayed in Header when offline |

**State transitions**:
1. `install` → precache URLs → `skipWaiting()`
2. `activate` → delete old caches (version mismatch) → `clients.claim()`
3. `fetch` → cache-first (assets) or network-first (HTML) → respond
