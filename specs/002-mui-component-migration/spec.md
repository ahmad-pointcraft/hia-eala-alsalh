# Feature Specification: MUI Component Migration

**Feature Branch**: `002-mui-component-migration`
**Created**: 2026-05-08
**Status**: Clarified
**Input**: User description: "Migrate all 12 React components from Tailwind CSS utility classes to MUI v7 sx prop styling."

## Clarifications

### Session 2026-05-08

- Q: Should we keep lucide-react for prayer-specific icons (Sunrise, Sunset, CloudSun, Moon, Star) or find MUI equivalents? → A: Keep lucide-react for prayer-specific icons — MUI lacks exact equivalents for Sunrise, Sunset, CloudSun. MUI icons (WbSunny, Brightness3, CloudQueue) are close but visually different enough to warrant keeping the lucide originals
- Q: Should the AnnouncementsTicker use MUI AppBar or Paper? → A: Use Paper with fixed positioning — AppBar is semantically a top-positioned element; Paper is the correct MUI component for a bottom-positioned ticker bar
- Q: Should the IslamicGeometricOverlay SVGs be kept as-is or migrated to MUI components? → A: Keep all SVG patterns and animations as-is — only replace wrapper div elements with MUI Box. SVG decorative patterns are not component-level concerns
- Q: Should the FundraisingOverlay use MUI Dialog or custom Backdrop+Paper? → A: Use Backdrop + Paper — MUI Dialog adds modal behavior (focus trap, aria role) that conflicts with the auto-closing timed overlay. Backdrop + Paper provides full control over the glass morphism effect
- Q: Should the prayer cards grid use MUI Grid2 or Stack? → A: Use Grid2 — it supports responsive column counts (xs:2, sm:3, lg:6). Stack is 1D only and cannot achieve the multi-column responsive layout

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Header & Navigation Bar (Priority: P1)

As a mosque administrator viewing the kiosk display, I want the top navigation bar to render with MUI components (clock, language toggle, event mode button, donate button) so that the header is built on the MUI component system with proper theme integration.

**Why this priority**: The header is always visible and sets the visual baseline for the entire app. Getting it right first establishes the MUI component patterns all other components follow.

**Independent Test**: Can be fully tested by loading the app and verifying the header renders with MUI AppBar/Toolbar/Button components, the clock displays correctly, and language/event/donate buttons are interactive.

**Acceptance Scenarios**:

1. **Given** the app loads in normal mode, **When** the header renders, **Then** it uses MUI AppBar with Toolbar, contains a centered clock in monospace font, a language toggle button on the left, and donate + event mode buttons on the right
2. **Given** the user clicks the language toggle, **When** the language switches to Arabic, **Then** the button label shows "English" and the layout direction respects RTL
3. **Given** the user clicks the event mode button, **When** the mode toggles, **Then** the button label updates and the gold accent color changes to indicate active state

---

### User Story 2 — Prayer Time Cards (Priority: P1)

As a worshiper viewing the kiosk display, I want six prayer time cards arranged in a responsive grid (2 columns on mobile, 3 on tablet, 6 on desktop) so that I can see all prayer times at a glance with the current prayer highlighted.

**Why this priority**: Prayer times are the core purpose of the display. This is the most viewed and most important UI element.

**Independent Test**: Can be fully tested by rendering the prayer cards grid and verifying: 6 cards display, the active card has gold highlight with glow effect, card layout responds to viewport width, and Arabic numeral conversion works in RTL mode.

**Acceptance Scenarios**:

1. **Given** the prayer cards render, **When** one prayer is marked as active, **Then** that card has a gold border, gold glow shadow, and larger text compared to inactive cards
2. **Given** the viewport is mobile width, **When** the cards render, **Then** they display in a 2-column grid; at tablet width 3 columns; at desktop width 6 columns
3. **Given** the language is Arabic, **When** prayer times display, **Then** numerals appear as Arabic digits (٠١٢٣٤٥٦٧٨٩) and the card direction is RTL
4. **Given** the viewport is desktop, **When** the active prayer card renders, **Then** it scales to 110% (not conflicting with other responsive sizes)

---

### User Story 3 — Countdown & Weather Widgets (Priority: P2)

As a worshiper, I want a countdown timer to the next prayer and a weather widget side by side so that I can see how long until the next prayer and current conditions.

**Why this priority**: These secondary info panels enhance the display but the app functions without them.

**Independent Test**: Can be fully tested by rendering both widgets in a 2-column layout and verifying: countdown decrements every second, weather shows temperature and conditions, and both adapt to RTL layout.

**Acceptance Scenarios**:

1. **Given** the countdown bar renders, **When** the target prayer time is set, **Then** the countdown shows hours:minutes:seconds in monospace font decrementing in real time
2. **Given** the weather widget renders, **When** data is displayed, **Then** it shows temperature, location name, condition text, humidity percentage, and a weather icon
3. **Given** both widgets render in a row, **When** the viewport is mobile, **Then** they stack vertically; at desktop they display side by side

---

### User Story 4 — Masjid Info & Dates (Priority: P2)

As a worshiper, I want to see the masjid logo, Hijri date, and Gregorian date in a horizontal bar so that I know the current dates in both calendar systems.

**Why this priority**: Contextual information that enhances the display experience.

**Independent Test**: Can be fully tested by rendering the MasjidInfo component and verifying: logo appears on the left, both dates display on the right, Arabic date uses the correct calendar format.

**Acceptance Scenarios**:

1. **Given** the masjid info bar renders, **When** the language is English, **Then** the logo appears on the left, Hijri date on the right followed by Gregorian date separated by a divider
2. **Given** the language is Arabic, **When** the info bar renders, **Then** the layout mirrors to RTL with Arabic numerals for the Hijri date

---

### User Story 5 — Announcements Ticker (Priority: P2)

As a worshiper, I want a scrolling announcements bar at the bottom of the screen so that I can read community announcements while they auto-scroll.

**Why this priority**: Persistent communication channel but not critical to prayer time display.

**Independent Test**: Can be fully tested by rendering the ticker and verifying: text scrolls horizontally, RTL scrolls in the opposite direction, logo on one side, megaphone icon on the other.

**Acceptance Scenarios**:

1. **Given** the announcements ticker renders, **When** multiple announcements exist, **Then** they scroll horizontally with a separator between them, duplicated for seamless looping
2. **Given** the language is Arabic, **When** the ticker scrolls, **Then** it scrolls right-to-left instead of left-to-right
3. **Given** the ticker has a logo on one end and an icon on the other, **When** it renders, **Then** the logo and icon remain fixed while only the text scrolls

---

### User Story 6 — Hadith Panel (Priority: P3)

As a worshiper, I want to see a daily hadith displayed above the prayer cards so that I can read inspiring Islamic teachings.

**Why this priority**: Spiritual enrichment feature, not core functionality.

**Independent Test**: Can be fully tested by rendering the HadithPanel and verifying: title shows "Hadith of the Day", hadith text is centered and italicized, source is aligned opposite to reading direction.

**Acceptance Scenarios**:

1. **Given** the hadith panel renders, **When** it displays, **Then** the title appears top-aligned in gold, hadith text centered in white, and source bottom-aligned in gray
2. **Given** the language is Arabic, **When** the panel renders, **Then** the title aligns right, source aligns left, and text uses Arabic font family

---

### User Story 7 — Fundraising Overlay (Priority: P3)

As a mosque administrator, I want a fundraising popup that appears periodically showing donation progress, QR code placeholder, and auto-closes after a countdown so that the community is informed about fundraising goals.

**Why this priority**: Feature used occasionally, not the primary display purpose.

**Independent Test**: Can be fully tested by triggering the fundraising overlay and verifying: it appears over the main content with a backdrop, shows collected/goal/donors stats, a progress bar, a QR code placeholder, and auto-closes after countdown reaches zero.

**Acceptance Scenarios**:

1. **Given** the fundraising overlay opens, **When** it renders, **Then** it shows title, description, collected amount, goal amount, donor count, and a gold progress bar
2. **Given** the overlay is showing, **When** the 10-second countdown reaches zero, **Then** the overlay automatically closes
3. **Given** the user clicks the close button, **When** the overlay is visible, **Then** it closes immediately

---

### User Story 8 — Event Mode Display (Priority: P3)

As a mosque administrator, I want a full-screen event mode that shows event details (title, speaker, date, time, location) with decorative animations so that special events are prominently displayed.

**Why this priority**: Used for special occasions only, not the default display mode.

**Independent Test**: Can be fully tested by toggling event mode and verifying: the event card fills the screen, shows event type badge, speaker info, details grid, description, and CTA button with animations.

**Acceptance Scenarios**:

1. **Given** event mode is activated, **When** the display renders, **Then** a centered card shows event badge, title, speaker name, date/time/location grid, description, and a pulsing CTA button
2. **Given** event mode renders, **When** the decorative elements animate, **Then** the Islamic geometric overlay appears, corner ornaments show on desktop, and the CTA button pulses with a scale animation

---

### User Story 9 — Islamic Geometric Overlay (Priority: P3)

As a viewer, I want a decorative geometric pattern overlay with subtle rotating animations during event mode so that the display has an elegant Islamic aesthetic.

**Why this priority**: Visual enhancement for event mode only.

**Independent Test**: Can be fully tested by enabling event mode and verifying: SVG geometric patterns appear, they rotate slowly in opposite directions, gold accent glows pulse on edges, and subtle floating particles animate.

**Acceptance Scenarios**:

1. **Given** event mode is active, **When** the geometric overlay renders, **Then** two SVG patterns (8-pointed star and hexagonal tessellation) rotate in opposite directions at different speeds
2. **Given** the overlay is visible, **When** the accent animations run, **Then** gold glow lines pulse on top and bottom edges, corner radial gradients fade in and out, and gold particles float upward

---

### User Story 10 — Image Carousel (Priority: P3)

As a viewer, I want a photo slideshow with auto-advance and manual navigation controls so that I can view mosque community images.

**Why this priority**: Visual content feature, not core prayer display.

**Independent Test**: Can be fully tested by providing image URLs and verifying: images transition with fade animation, auto-advance at the specified interval, navigation arrows work, and dot indicators show current slide.

**Acceptance Scenarios**:

1. **Given** multiple images are provided, **When** the carousel renders, **Then** images auto-advance every 5 seconds with a fade transition
2. **Given** the carousel is showing an image, **When** the user clicks a navigation arrow, **Then** it advances to the next/previous image
3. **Given** the carousel has multiple images, **When** the dot indicators render, **Then** the active dot is gold and elongated, inactive dots are white/semi-transparent

---

### User Story 11 — Root Layout & Mode Switching (Priority: P1)

As a developer, I want the root App component to use MUI Box/Stack for layout instead of Tailwind utility classes so that the overall app structure follows the MUI component system with proper theme integration.

**Why this priority**: The root layout wraps everything — it must be migrated before individual components can be properly composed.

**Independent Test**: Can be fully tested by loading the app and verifying: the dark emerald background renders, the diagonal grid pattern appears, normal mode and event mode switch with fade animations, and the layout is full-viewport-height.

**Acceptance Scenarios**:

1. **Given** the app loads, **When** normal mode is active, **Then** the layout shows header at top, masjid info, scrollable middle section (countdown, weather, carousel), bottom section (hadith, prayer cards), and ticker at the bottom
2. **Given** event mode is toggled, **When** the transition happens, **Then** the normal mode fades out with a scale-down effect and event mode fades in
3. **Given** the app renders, **When** the background is visible, **Then** the dark emerald (#0a1f0a) color fills the viewport with the diagonal gold grid pattern overlay

---

### Edge Cases

- What happens when a component previously using `className` for Tailwind receives no className after migration? It should render purely via MUI `sx` prop styling with no visual regression.
- What happens when RTL is toggled mid-render? All MUI components should respond to the `dir` attribute and logical CSS properties (marginInline, paddingInline instead of marginLeft/right).
- What happens when responsive breakpoints are hit? Components should smoothly transition between xs/sm/md/lg layouts without conflicting size rules.
- What happens when the `ImageWithFallback.tsx` component (in figma/) still uses Tailwind classes? It should be migrated alongside the other components since it's imported by components in scope.
- What happens to components using `translations: any`? The type should be properly defined or imported, but full type safety is Spec 004 scope — this spec should at minimum avoid introducing new `any` types.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: All 12 application components (App, Header, PrayerCard, CountdownBar, MasjidInfo, HadithPanel, WeatherWidget, AnnouncementsTicker, FundraisingOverlay, EventModeDisplay, IslamicGeometricOverlay, ImageCarousel) MUST render using only MUI components and the `sx` prop for styling — zero Tailwind CSS utility classes or inline `className` strings for styling purposes
- **FR-002**: The Header component MUST use MUI AppBar and Toolbar as its container, with MUI Button or IconButton for interactive elements
- **FR-003**: Prayer cards MUST use MUI Card or Paper as their container, arranged in a responsive grid using MUI Grid2 (not Stack — Stack is 1D only) with breakpoints: 2 columns (xs), 3 columns (sm), 6 columns (lg)
- **FR-004**: The active prayer card MUST display with a gold border, gold glow shadow effect (rgba(212, 175, 55, 0.5)), and scale transformation — visually matching the original Tailwind implementation
- **FR-005**: All responsive sizing MUST use MUI's responsive breakpoints ({ xs, sm, md, lg }) consistently — no conflicting size values for the same element at the same breakpoint
- **FR-006**: RTL (right-to-left) layout MUST be preserved using MUI's `dir` prop on containers and logical CSS properties (marginInline, paddingInline, insetInline) instead of physical left/right properties
- **FR-007**: Icons from `@mui/icons-material` MUST be used where direct equivalents exist: Cloud (WeatherWidget), ChevronLeft/ChevronRight (ImageCarousel), Close (FundraisingOverlay, replacing X from lucide-react)
- **FR-008**: Icons from `lucide-react` MUST be kept for prayer-specific and unique icons where MUI lacks a visually equivalent icon: Sunrise (Fajr), Sunset (Maghrib), CloudSun (Dhuhr), Moon (Isha), Star (fallback), CalendarClock (Header), Languages (Header), Heart (Header), Megaphone (AnnouncementsTicker), Droplets (WeatherWidget)
- **FR-009**: All Framer Motion (`motion/react`) animations MUST be preserved — motion components can wrap MUI components (e.g., `motion(Box)`, `motion(Card)`) or coexist with MUI layout
- **FR-010**: The FundraisingOverlay MUST use MUI Backdrop for the overlay layer and Paper for the content card (not Dialog — to avoid focus trap and modal behavior that conflicts with the auto-closing timer), LinearProgress for the donation progress bar, and a close button using Close icon from `@mui/icons-material`
- **FR-011**: The CountdownBar and WeatherWidget MUST render side by side in a 2-column grid at lg breakpoint, stacking vertically at xs/sm
- **FR-012**: The AnnouncementsTicker MUST use MUI Paper as its container (not AppBar — AppBar is semantically top-positioned), fixed at the bottom of the viewport with logo on one end and megaphone icon on the other, text scrolling via requestAnimationFrame
- **FR-013**: The EventModeDisplay MUST use MUI Paper or Card for the event card with decorative corner elements, Chip for the event type badge, and a pulsing CTA button with the gold gradient
- **FR-014**: The IslamicGeometricOverlay MUST preserve all SVG patterns, rotation animations, gold accent glows, corner radial gradients, and floating particle animations — only the wrapper div elements MUST be replaced with MUI Box (SVG content stays as-is)
- **FR-015**: The ImageCarousel MUST use MUI IconButton for navigation arrows, and dot indicators must use MUI's `sx` prop for active/inactive states (gold elongated for active, white/semi-transparent for inactive)
- **FR-016**: The root App component MUST use MUI Box for layout containers with `sx` prop for the diagonal grid background pattern, and Stack for vertical/horizontal flow layouts
- **FR-017**: The `ImageWithFallback.tsx` component in `src/app/components/figma/` MUST also be migrated to use MUI `sx` prop styling instead of Tailwind classes
- **FR-018**: Font family resolution MUST use the centralized MUI theme typography instead of inline `style={{ fontFamily }}` objects — components should reference `theme.typography` values via the `sx` prop
- **FR-019**: All component props interfaces MUST NOT use `any` type — use the existing `Language` type and proper translation interfaces or `Record<string, string>` where full typing is deferred to Spec 004

### Key Entities

- **MUI Styled Component**: Any React component rendered using MUI's component system (Box, Stack, Grid2, Paper, Card, Typography, Button, IconButton, AppBar, Toolbar, Chip, Backdrop, LinearProgress) with `sx` prop for all visual styling
- **Responsive Theme Values**: Theme-aware responsive values using the `sx` prop's breakpoint syntax (e.g., `fontSize: { xs: '10px', sm: '16px' }`) replacing Tailwind's responsive prefixes
- **Translation Strings**: Existing translation data structure (`Language` type, `translations` object) unchanged in structure but consumed via properly typed props

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Zero Tailwind CSS utility classes remain in any component — searching for `className=` in component files returns zero matches for Tailwind patterns (bg-, text-, px-, py-, flex, grid, border-, rounded-, etc.)
- **SC-002**: All 12 components render visually matching the original Figma design when viewed on a 1920x1080 display in dark mode — the dark emerald/gold Islamic theme is preserved
- **SC-003**: The app builds successfully with `yarn build` producing no new TypeScript errors beyond pre-existing ones
- **SC-004**: RTL mode renders correctly with all text, layouts, and scroll directions reversed for Arabic language
- **SC-005**: Responsive behavior works at all four breakpoints (xs: <600px, sm: 600-900px, md: 900-1200px, lg: >1200px) without conflicting size rules
- **SC-006**: All Framer Motion animations (fade, scale, slide, rotate, pulse) execute at the same timing and visual effect as the original implementation
- **SC-007**: The bundle size remains under 500KB gzipped after migration

## Assumptions

- The MUI theme (`muiTheme.ts`) created in Spec 001 is the single source of truth for all color, typography, and spacing values — components reference theme tokens via `sx` prop
- The `translations.ts` file structure remains unchanged — no translation key additions or removals in this spec
- The `motion/react` (Framer Motion) library continues to be used for all animations — no migration to MUI's animation system
- Component prop interfaces may use simplified types (e.g., `Record<string, string>` for translations) rather than full type definitions — full type safety is Spec 004 scope
- The duplicate `toArabicNumerals` utility function across 4 components is noted but consolidation to `src/app/utils/` is Spec 003 scope — this spec copies it inline where needed
- External image URLs in the carousel (Unsplash) are placeholder data — dynamic data loading is Spec 003 scope
- Hardcoded prayer times, weather data, and fundraising amounts remain as placeholders — dynamic data is Spec 003 scope
- The `figma/ImageWithFallback.tsx` component is in scope for migration since it uses Tailwind classes
- Multiple `setInterval` timers across components (Header clock, CountdownBar countdown, MasjidInfo clock) are noted — consolidation to a single timer is Spec 004 scope (Article IX)
- `NodeJS.Timeout` type usage in App.tsx should be replaced with `ReturnType<typeof setTimeout>` for browser compatibility
