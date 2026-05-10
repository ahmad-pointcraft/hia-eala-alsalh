# Feature Specification: Production Hardening

**Feature Branch**: `005-production-hardening`  
**Created**: 2026-05-10  
**Status**: Draft  
**Input**: User description: "Harden the Masjid Prayer Time Display kiosk app for unattended 24/7 production operation — error boundaries, local static assets, accessibility compliance, and optional offline support."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Kiosk Recovers Automatically from Errors (Priority: P1)

As a masjid administrator responsible for the 24/7 kiosk display, when an unexpected JavaScript error occurs, the display shows a branded recovery screen and automatically restores normal operation within seconds — never showing a blank white screen.

**Why this priority**: A blank white screen on a wall-mounted kiosk is the worst possible failure. The display must never appear broken to attendees. This directly supports kiosk-first design principles.

**Independent Test**: Can be fully tested by triggering an error from any child component and observing the branded fallback UI appear, then auto-dismiss after the recovery timeout.

**Acceptance Scenarios**:

1. **Given** the kiosk is running normally, **When** an unhandled JavaScript error occurs in any component, **Then** a branded fallback UI appears within 1 frame (no white flash) with a recovery message and loading indicator
2. **Given** the error fallback is displayed, **When** 5 seconds have elapsed, **Then** the app automatically recovers and displays normal content
3. **Given** multiple errors occur in sequence, **When** the boundary catches each one, **Then** each recovery timer resets correctly without stacking

---

### User Story 2 - Carousel Images Load Without Network (Priority: P1)

As a masjid attendee viewing the kiosk display, the background carousel images always appear instantly regardless of network conditions — even if the internet connection is slow or unavailable.

**Why this priority**: Remote image dependencies introduce latency and a single point of failure for a kiosk that must always look complete. Attendees should never see broken image placeholders.

**Independent Test**: Can be tested by disconnecting the network and reloading the page — carousel images must still appear from bundled assets.

**Acceptance Scenarios**:

1. **Given** the kiosk has no internet connection, **When** the page loads, **Then** all carousel images display correctly from bundled static assets
2. **Given** the page is loaded, **When** the Network tab is inspected, **Then** zero requests are made to any external image CDN
3. **Given** the carousel is cycling, **When** each image transitions, **Then** transitions are smooth with no loading delay

---

### User Story 3 - Screen Reader Users Can Access Prayer Times (Priority: P1)

As a visually impaired masjid attendee using a screen reader, the countdown timer, announcements ticker, and all interactive controls are announced clearly without flooding assistive technology.

**Why this priority**: Accessibility is a core requirement for a public-facing religious institution display. Screen reader support ensures inclusivity for all community members.

**Independent Test**: Can be tested with VoiceOver or NVDA — verify countdown is announced at reasonable intervals, ticker content is accessible, and all buttons have descriptive labels.

**Acceptance Scenarios**:

1. **Given** the countdown is displayed, **When** the minute changes, **Then** the updated countdown is announced via live region at most once per minute (not every second)
2. **Given** the announcements ticker is scrolling, **When** a screen reader scans the ticker, **Then** the full announcement text is accessible via status role and live region
3. **Given** icon-only buttons exist in the header and overlays, **When** a screen reader focuses each button, **Then** a descriptive accessible label is announced
4. **Given** the user has enabled reduced-motion preference, **When** animations play, **Then** all animations are reduced to instant transitions

---

### User Story 4 - Keyboard Users Can Navigate Fundraising Overlay (Priority: P2)

As a keyboard-only user, when the fundraising overlay appears, I can navigate all interactive elements using Tab and Shift+Tab, and dismiss it with Escape — focus never escapes to the page behind the overlay.

**Why this priority**: Focus trapping is essential for modal dialogs to prevent keyboard users from interacting with hidden content. Lower priority than Stories 1-3 because the overlay is temporary and auto-dismisses.

**Independent Test**: Can be tested by opening the fundraising overlay and pressing Tab — focus must cycle within the overlay only. Escape must close it.

**Acceptance Scenarios**:

1. **Given** the fundraising overlay is open, **When** the user presses Tab, **Then** focus moves to the next focusable element within the overlay
2. **Given** focus is on the last focusable element in the overlay, **When** the user presses Tab, **Then** focus wraps to the first focusable element (not the page behind)
3. **Given** the fundraising overlay is open, **When** the user presses Escape, **Then** the overlay closes
4. **Given** the fundraising overlay opens, **When** it mounts, **Then** focus is automatically moved to the first focusable element inside the overlay

---

### User Story 5 - Kiosk Operates Offline with Cached Assets (Priority: P3)

As a masjid administrator, the kiosk display continues to function (showing prayer times, images, and clock) even when the internet connection drops, by serving cached static assets from a service worker.

**Why this priority**: Nice-to-have resilience for a single-page kiosk. The core app already works without APIs (hardcoded data). The service worker adds an extra layer of offline reliability but is not critical since images become local in Story 2.

**Independent Test**: Can be tested by loading the page once, going offline in browser tools, reloading, and confirming the page still renders.

**Acceptance Scenarios**:

1. **Given** the page has been loaded at least once, **When** the network goes offline and the page is reloaded, **Then** the page renders from cached assets
2. **Given** the service worker is active, **When** static assets are requested, **Then** they are served from cache first
3. **Given** the kiosk is offline, **When** the user views the header, **Then** a subtle offline indicator is displayed
4. **Given** the service worker registration is removed, **When** the app is deployed, **Then** no service worker is registered (feature is fully opt-in)

---

### Edge Cases

- What happens if the error boundary's own fallback UI throws an error? React does not catch errors in error boundaries' own render — the fallback must be minimal with no complex logic to minimize this risk.
- What happens if the auto-recovery timer fires but the underlying error persists? The boundary resets state, React re-renders children, and if the error recurs, the catch handler fires again scheduling a new recovery — a safe retry loop.
- What happens if a user toggles language while the error fallback is shown? The fallback uses hardcoded English text with no translations dependency — degraded but safe.
- What happens if the countdown's throttled minute-tracker becomes stale after language toggle? The tracker holds a numeric minute value which is language-independent — it remains valid.
- What happens if the service worker cache becomes corrupted? The user must clear browser data. Acceptable for a controlled kiosk environment.
- What happens if two overlays are open simultaneously? The current app logic prevents simultaneous overlays — the fundraising overlay auto-dismisses and event mode replaces main content.

## Clarifications

### Session 2026-05-10

- Q: Should the ErrorBoundary fallback use MUI components or minimal plain HTML? → A: MUI components (Box, Typography, CircularProgress) — branded recovery screen (Constitution Article I)
- Q: Should aria-live on CountdownBar update every second or be throttled? → A: Throttled to once per minute — visual countdown still updates every second, only the aria announcement text is throttled
- Q: Should the focus trap use an external library or manual implementation? → A: Manual useEffect + addEventListener — no new dependencies (Constitution Article IV)
- Q: Should the service worker use Workbox or be handwritten? → A: Handwritten (public/sw.js) — no build dependency, cache-first for assets, network-first for HTML
- Q: Should carousel images be in src/imports/ (Vite module imports) or public/ (static copies)? → A: src/imports/ with Vite module imports — content-hashed, auto-bundled

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide an error boundary that catches JavaScript errors in its child component tree, displays a MUI-branded fallback UI (Box, Typography, CircularProgress), and auto-recovers after 5 seconds
- **FR-002**: The root application MUST be wrapped in the error boundary so that all runtime errors are caught at the top level
- **FR-003**: Carousel images MUST be stored as local static assets and imported at build time (not fetched from external URLs at runtime)
- **FR-004**: The carousel image collection MUST use locally-imported asset paths instead of remote URLs — the type remains an array of strings since build tools resolve image imports to hashed URL strings
- **FR-005**: The countdown display MUST include a live region with atomic updates where the accessible text updates only once per minute to avoid flooding assistive technology
- **FR-006**: The visual countdown MUST continue updating every second for sighted users — only the accessibility announcement text is throttled
- **FR-007**: The announcements ticker MUST have a status role and polite live region on its root container, with a marquee role on the scrolling text element
- **FR-008**: All icon-only buttons MUST have descriptive accessible labels (language toggle, donate, event mode, overlay close)
- **FR-009**: All components with motion animations MUST respect the user's reduced-motion preference — when enabled, animation durations are set to zero
- **FR-010**: The fundraising overlay MUST implement a keyboard focus trap covering Tab, Shift+Tab, and Escape-to-close
- **FR-011**: The fundraising overlay MUST set focus to the first focusable element on mount
- **FR-012**: The fundraising overlay MUST have a dialog role and modal attribute
- **FR-013**: (Optional) A service worker MUST implement cache-first strategy for static assets and network-first for the HTML shell
- **FR-014**: (Optional) Service worker registration MUST be conditional and deferred to avoid blocking first paint
- **FR-015**: (Optional) A subtle offline indicator MUST display when the device has no network connectivity, using a polite live region
- **FR-016**: No new external dependencies MUST be introduced — all solutions use existing packages only

### Key Entities

- **Error Boundary**: A top-level error handler wrapping the entire application. Catches unhandled errors, displays branded recovery UI, and auto-recovers after a fixed delay. Cleans up resources on unmount.
- **Carousel Assets**: Three local image files stored in the imports directory, referenced via build-time module imports. Eliminates runtime network dependency for carousel images.
- **Accessibility Enhancements**: Cross-cutting concern applied to four components: live region with throttling on countdown, status role on ticker, labels on icon buttons, and focus trap on overlay dialog.
- **Reduced Motion**: A global preference check that modifies animation behavior across all motion-enabled components. When the user's system preference indicates reduced motion, all animation durations collapse to zero.
- **Service Worker**: An optional background script that caches static assets for offline use. Uses versioned cache names for cache busting on updates.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The error boundary catches errors and displays fallback UI within 1 frame, auto-recovers after 5 seconds — verified by triggering a test error and observing the full cycle
- **SC-002**: Zero network requests to external image hosts after page load — verified via browser network inspection
- **SC-003**: All icon-only buttons have accessible labels — verified via DOM inspection where no button lacks a descriptive label
- **SC-004**: Focus trap prevents focus from leaving the fundraising overlay while open — verified by Tab key testing
- **SC-005**: Reduced-motion preference causes all animations to have zero duration — verified via OS accessibility settings and visual observation
- **SC-006**: The production build completes with zero errors
- **SC-007**: No untyped code is introduced in new files — verified via code search
- **SC-008**: Service worker (if deployed) serves the page offline — verified by loading once, disconnecting, and reloading successfully

## Assumptions

- The error boundary wraps the entire application at the root level — there is only one boundary for the whole app
- Carousel images are decorative background images and do not require alt text
- The imports directory already exists (used for the masjid logo)
- Three mosque images will be downloaded from Unsplash and committed as binary assets, each compressed to under 200KB
- The countdown's live region throttling (once per minute) balances accessibility with information currency
- Focus trap is only needed for the fundraising overlay — no other modal dialogs exist in the current application
- The service worker is optional and can be disabled by removing the registration block without affecting any other functionality
- The kiosk runs in a controlled environment (single browser, no user accounts) — service worker cache corruption risk is minimal
- Reduced-motion affects motion library animations only — CSS transitions (hover effects) are already short enough to not cause issues
- No new packages are needed — all solutions use existing libraries only
- Existing untyped code in translation utilities may remain (pre-existing, not introduced by this spec)
- The app uses MUI exclusively for all styling — no other CSS framework utility classes are used
