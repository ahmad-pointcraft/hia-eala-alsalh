---
name: Masjid Prayer Time Display
description: "A 24/7 kiosk display for mosques: two-column glassmorphic layout, gold-on-emerald palette, bilingual Arabic RTL + English LTR."
colors:
  mosque-garden-night: "#0a1f0a"
  prayer-lamp-gold: "#D4AF37"
  prayer-lamp-light: "#FFD700"
  prayer-lamp-dark: "#B8960C"
  moonlit-white: "#ffffff"
  stone-whisper: "#9ca3af"
  surface-overlay: "#0000004D"
  surface-raised: "#00000066"
  surface-heavy: "#000000B3"
  border-thin: "#D4AF371F"
  border-medium: "#D4AF374D"
  text-white-muted: "#FFFFFF80"
  text-white-soft: "#FFFFFFB3"
  error-crimson: "#d4183d"
  emerald-accent: "#2E7D32"
typography:
  countdown:
    fontFamily: "Roboto Mono, monospace"
    fontSize: "clamp(36px, 5.5vw, 64px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.05em"
  prayer-name:
    fontFamily: "Open Sans, Noto Naskh Arabic, sans-serif"
    fontSize: "clamp(28px, 3.5vw, 40px)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "normal"
  prayer-time:
    fontFamily: "Open Sans, Noto Naskh Arabic, sans-serif"
    fontSize: "clamp(1.25rem, 2vw, 3rem)"
    fontWeight: 700
    lineHeight: "normal"
    letterSpacing: "normal"
  body:
    fontFamily: "Open Sans, Noto Naskh Arabic, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Open Sans, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: "normal"
    letterSpacing: "0.15em"
rounded:
  dot: "4px"
  card-sm: "8px"
  pill: "16px"
  card: "24px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "20px"
  xl: "24px"
  page: "48px"
components:
  floating-card:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.card}"
    padding: "{spacing.base}"
  pill-button:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.moonlit-white}"
    rounded: "{rounded.pill}"
    padding: "8px 24px"
  pill-button-active:
    backgroundColor: "{colors.border-thin}"
    textColor: "{colors.prayer-lamp-gold}"
    rounded: "{rounded.pill}"
    padding: "8px 24px"
  donate-button:
    backgroundColor: "{colors.prayer-lamp-gold}"
    textColor: "{colors.mosque-garden-night}"
    rounded: "{rounded.pill}"
    padding: "8px 24px"
  prayer-card-active:
    backgroundColor: "{colors.border-thin}"
    textColor: "{colors.prayer-lamp-gold}"
    rounded: "{rounded.pill}"
    padding: "12px"
  prayer-card-inactive:
    backgroundColor: "{colors.surface-overlay}"
    textColor: "{colors.moonlit-white}"
    rounded: "{rounded.pill}"
    padding: "8px"
---

# Design System: Masjid Prayer Time Display

## 1. Overview

**Creative North Star: "The Lantern Sanctuary"**

A worshipper walks into the mosque hall after sunset. The room is dark emerald, the walls carrying the deep green of Islamic tradition. Gold wall sconces cast warm, focused light onto the surfaces that matter: the prayer time board, the countdown, the masjid name. Everything else recedes into translucent shadow. The display is a lantern in this sanctuary, luminous and purposeful, showing exactly what is needed and nothing more.

This system is built for the 3-second glance from 5 meters away in warm ambient light. Hierarchy is extreme: the active prayer countdown dominates, the clock anchors the header, and everything else serves those two elements. Typography scales are aggressive (64px countdown, 40px prayer name, 13px label, a 1:5 ratio from label to countdown). The gold accent (#D4AF37) is reserved for active states, prayer names, and the single donate call-to-action. It is never decorative.

Depth comes from layered translucency: frosted glass surfaces with `backdrop-filter: blur(12-16px)`, progressive black-opacity layers from 0.3 to 0.7, and gold glow on the active prayer card. There are no opaque panels, no solid cards, no heavy shadows. The emerald background shows through every surface.

**Key Characteristics:**
- Monospace countdown digits as the primary visual anchor (Roboto Mono, 64px, letter-spacing 0.05em)
- Gold accent used on less than 15% of any given screen surface
- Translucent surfaces throughout, no opaque containers
- Bilingual-first: every component adapts RTL/LTR direction, font family, and numeral system
- Kiosk-optimized: 1920x1080 target, no hover states for primary interactions, 24/7 reliability

## 2. Colors

The palette is Committed: one saturated gold carries the visual identity against a dominant dark emerald surface. The gold is used for active prayer states, countdown accents, the donate button, and geometric pattern strokes. It is never used for decorative borders, backgrounds, or inactive elements.

### Primary

- **Prayer Lamp Gold** (#D4AF37): The single accent. Used for active prayer name, countdown highlight, donate button background, progress bar gradient, geometric overlay strokes, and the pulsing edge glow during the post-iqama dimmed state. Its rarity is the point: when gold appears, it means "this is now."
- **Prayer Lamp Light** (#FFD700): The lighter endpoint of gold gradients. Used exclusively in the fundraising progress bar and donate button hover.
- **Prayer Lamp Dark** (#B8960C): The deeper endpoint of gold gradients. Used in the donate button `linear-gradient(135deg, #B8960C, #D4AF37)`.

### Neutral

- **Mosque Garden Night** (#0a1f0a): The dominant surface. Dark emerald background that carries the entire UI. Never pure black. The green tint ties to Islamic architectural tradition and distinguishes this from generic dark-mode tools.
- **Moonlit White** (#ffffff): Primary text. High contrast on emerald at kiosk distance. Used for countdown digits, clock, primary prayer times, and card titles.
- **Stone Whisper** (#9ca3af): Muted text for inactive prayer names, secondary labels. Cool gray that reads as neutral against the warm gold and green.
- **White Muted** (rgba(255,255,255,0.5)): Subdued text for labels, subtitles, less prominent metadata. "Next Prayer" label, hadith source, weather city name, auto-close timers.
- **White Soft** (rgba(255,255,255,0.7)): Semi-prominent text for hadith quotes, weather condition, event details, fundraising description. One step above White Muted in the hierarchy.

### Surface

- **Surface Overlay** (rgba(0,0,0,0.3)): Lightest translucent layer. Prayer card inactive backgrounds, sunrise/sunset boxes.
- **Surface Raised** (rgba(0,0,0,0.4)): Default card surface. Floating cards, header pills, ticker footer.
- **Surface Heavy** (rgba(0,0,0,0.7)): Dialog surfaces. Event dialog, fundraising overlay paper, progress bar track.

### Border

All borders are gold-tinted at varying opacity. There are no white borders, no gray borders, no colored side stripes.

- **Border Thin** (rgba(212,175,55,0.12)): Default card and divider borders. Subtle, present, consistent.
- **Border Medium** (rgba(212,175,55,0.3)): Hover states, scrollbars, elevated separators.

### Semantic

- **Error Crimson** (#d4183d): Offline indicator, error states.
- **Emerald Accent** (#2E7D32): Secondary palette. Used in MUI theme `secondary.main` for subtle green accents.

**The Earned Gold Rule.** Prayer Lamp Gold appears on less than 15% of any screen surface. It is used exclusively for: the active prayer card (name, time, glow), the countdown highlight, the donate button, progress bars, and geometric overlay strokes. If gold appears on an inactive element, it is wrong.

## 3. Typography

**Display Font:** Roboto Mono (monospace, for countdowns and clock)
**Body Font:** Open Sans (English) / Noto Naskh Arabic (Arabic)
**Label Font:** Open Sans at small caps tracking

**Character:** Three families serving distinct roles. Roboto Mono gives countdown digits the precision of an airport departure board. Open Sans carries all English body text with functional clarity. Noto Naskh Arabic provides traditional Arabic calligraphic warmth for prayer names and religious text. The families never compete: mono for time, sans for information, naskh for Arabic.

### Hierarchy

- **Countdown** (Roboto Mono, 700, clamp(36px, 5.5vw, 64px), line-height 1.1, letter-spacing 0.05em): The single largest element. Next prayer countdown in the right column. Monospace ensures stable digit widths. Letter-spacing prevents digit collision at scale.
- **Prayer Name** (Open Sans/Noto Naskh Arabic, 800, clamp(28px, 3.5vw, 40px), line-height 1.2): Active prayer name below the countdown. Weight 800 for emphasis without reaching black.
- **Prayer Time** (Open Sans/Noto Naskh Arabic, 700, clamp(1.25rem, 2vw, 3rem)): Prayer times in the horizontal bar. Active card scales up to 3rem; inactive cards at 1.25rem to 1.5rem.
- **Clock** (Roboto Mono, 700, clamp(28px, 3.5vw, 44px), line-height 1, letter-spacing 0.05em): Header center. 24-hour format. Pill container with glassmorphic backdrop.
- **Body** (Open Sans/Noto Naskh Arabic, 400, 1rem, line-height 1.5): Hadith quotes, event descriptions, fundraising copy. Max line length 65-75ch where possible.
- **Label** (Open Sans, 600, 9-13px, letter-spacing 0.1-0.15em, uppercase): Overline labels. "Next Prayer", "Hadith of the Day", "Sunrise", "Sunset". Always uppercase. Always letter-spaced. Always muted color.

**The Scale Ratio Rule.** Typography steps use a ratio of at least 1.25 between adjacent hierarchy levels. Label (13px) to Body (16px) is 1.23. Body to Prayer Time (20px minimum) is 1.25. Prayer Time to Prayer Name (40px) is 2.0. Prayer Name to Countdown (64px) is 1.6. Flat scales are prohibited.

## 4. Elevation

Depth is conveyed through layered translucency, not shadows. Every surface is semi-transparent black over the emerald background, with `backdrop-filter: blur()` creating the frosted glass separation between layers. There are no opaque panels.

**The Frosted Layer Rule.** Surfaces are translucent by default. Opaque backgrounds are prohibited except for the root emerald (#0a1f0a) and the post-iqama dim overlay (rgba(10,31,10,0.85)).

### Shadow Vocabulary

Shadows are used sparingly, only for ambient depth on floating elements and gold glow on the active prayer.

- **Card Ambient** (`0 8px 32px rgba(0,0,0,0.3)`): Floating cards in the main zone. Subtle depth beneath translucent surfaces.
- **Dialog Elevated** (`0 16px 64px rgba(0,0,0,0.5)`): Event dialog and fundraising overlay. Stronger lift for modal surfaces.
- **Active Prayer Glow** (`0 0 30px rgba(212,175,55,0.5)`): The only colored shadow. Appears on the active prayer card to create the gold glow effect.
- **Geometric Edge Pulse** (`0 0 20px 4px rgba(212,175,55,0.3)` to `0 0 40px 8px rgba(212,175,55,0.5)`): Pulsing keyframe animation on the Islamic geometric overlay during the post-iqama dimmed state.

### Backdrop Filter Scale

- **Subtle** (blur(4px)): Event mode backdrop, behind the dialog.
- **Standard** (blur(12px)): Header pills, ticker footer.
- **Strong** (blur(16px)): Floating cards, dialog surfaces, fundraising paper.

## 5. Components

Every interactive component has default, hover, and active states. The kiosk context means hover is rare; focus and active states carry more weight. All components adapt to RTL/LTR direction.

### Floating Cards

The primary container pattern. Used for countdown, hadith, weather, and carousel wrapper.

- **Corner Style:** Gently rounded (24px radius)
- **Background:** Surface Raised (rgba(0,0,0,0.4)) with `backdrop-filter: blur(16px)`
- **Border:** 1px solid Border Thin (rgba(212,175,55,0.12))
- **Shadow:** Card Ambient (0 8px 32px rgba(0,0,0,0.3))
- **Internal Padding:** 16px (tight) to 24px (spacious), varying for rhythm

### Pill Buttons

Language toggle, donate, and events use pill-shaped containers.

- **Shape:** Pill (24px border-radius)
- **Background:** Surface Raised (rgba(0,0,0,0.4)) with `backdrop-filter: blur(12px)`
- **Active State:** Background shifts to Border Thin (rgba(212,175,55,0.12)), text shifts to Prayer Lamp Gold
- **Hover:** Background shifts to Border Medium (rgba(212,175,55,0.3))
- **Donate Variant:** Solid gold background (`linear-gradient(135deg, #B8960C, #D4AF37)`), Mosque Garden Night text

### Prayer Bar Cards

Five prayer cards in a horizontal flex row. Active card is visually dominant.

- **Inactive Shape:** Rounded (16px), flex 1, equal width
- **Active Shape:** Rounded (16px), flex 1.5, scale(1.05-1.10), gold border + glow
- **Inactive Background:** Surface Overlay (rgba(0,0,0,0.3)), border Border Medium
- **Active Background:** Border Thin (rgba(212,175,55,0.12)), border Prayer Lamp Gold
- **Sunrise/Sunset Pills:** Small flanking indicators (16px radius, Surface Overlay bg, Border Thin border)

### Ticker Footer

Full-width scrolling bar at the bottom.

- **Background:** Surface Raised (rgba(0,0,0,0.4)) with `backdrop-filter: blur(12px)`, top border Border Thin
- **Left:** Masjid logo (22-30px height, configurable per deployment)
- **Right:** PointCraft company logo (16-20px height, 60% opacity, never prominent)
- **Center:** Scrolling announcement text (marquee via requestAnimationFrame, 0.4px/frame)

### Event Dialog

Floating card list replacing full-screen event mode. Shows 3-4 upcoming events.

- **Container:** Surface Heavy (rgba(0,0,0,0.7)) with `backdrop-filter: blur(16px)`, Dialog Elevated shadow
- **Auto-dismiss:** 30 seconds
- **Dismissal:** Close button or backdrop click
- **Entrance Animation:** opacity 0 to 1, scale 0.95 to 1, y 20 to 0, 300ms ease-out

### Fundraising Overlay

Modal overlay with progress tracking, QR code, and auto-close timer.

- **Backdrop:** Surface Raised (rgba(0,0,0,0.4)) with `backdrop-filter: blur(8px)`, z-index 50
- **Paper:** Surface Heavy (rgba(0,0,0,0.7)) with `backdrop-filter: blur(16px)`, Dialog Elevated shadow
- **Progress Bar:** 12px height, rounded (6px), gold gradient (`linear-gradient(to right, #D4AF37, #FFD700)`)
- **Top Accent Strip:** 4px height gold gradient bar
- **Auto-close:** 10 second countdown

### Post-Iqama Dimmed State

Full-screen overlay active for 5 minutes after each iqama time.

- **Background:** rgba(10,31,10,0.85) over the emerald base
- **Geometric Pattern:** IslamicGeometricOverlay at 30% opacity
- **Z-index:** 20 (above main content, below fundraising/events)
- **Auto-restore:** After 5 minutes, overlay fades and normal UI returns

## 6. Do's and Don'ts

### Do:

- **Do** use Prayer Lamp Gold (#D4AF37) only for active states, the donate button, progress indicators, and geometric overlay strokes. Its rarity is the design.
- **Do** use Roboto Mono for all time displays (clock, countdown, prayer times in the bar, sunrise/sunset times). Monospace at kiosk distance prevents digit jitter.
- **Do** maintain a minimum 1.25 ratio between adjacent typography levels. Label (13px) to Body (16px) is the tightest permitted step.
- **Do** use `backdrop-filter: blur(12-16px)` on floating cards, pills, and the ticker footer. The frosted glass effect is the system's elevation strategy.
- **Do** use responsive font sizes (`clamp` or MUI responsive props) for all display typography. The kiosk may run at 1280x720 as a fallback.
- **Do** keep the PointCraft logo at 60% opacity in the ticker footer. It is present but never prominent. White-label identity belongs to the masjid.
- **Do** ensure all components mirror cleanly for Arabic RTL: use `insetInlineStart`/`insetInlineEnd` instead of `left`/`right`, and `getDirection(language)` for container direction.
- **Do** respect `prefers-reduced-motion`: all animation durations collapse to 0ms when the user preference is set.

### Don't:

- **Don't** use Prayer Lamp Gold on inactive elements, decorative borders, or background fills. If gold appears on something the user cannot act on, remove it.
- **Don't** use opaque card backgrounds. Every container surface must be semi-transparent (rgba) with backdrop-filter blur. Opaque panels break the layered translucency system.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe. Borders are uniform on all sides at 1px.
- **Don't** use `background-clip: text` with gradients. Emphasis comes from weight and size, not decorative effects.
- **Don't** use pure black (#000000) or pure white (#ffffff) as background or surface colors. All neutrals are tinted: the emerald #0a1f0a for backgrounds, rgba layers with gold-tinted borders for surfaces.
- **Don't** create identical card grids. The active prayer card must be visually distinct (larger, gold border, glow shadow). Same-sized cards with identical treatment are prohibited.
- **Don't** use display fonts (serif, decorative) in UI labels, buttons, or data. Roboto Mono for time, Open Sans for everything else.
- **Don't** add motion that doesn't convey state. Entrance animations are permitted (300ms, ease-out). Continuous decorative animation is limited to the Islamic geometric overlay during the dimmed state.
- **Don't** make the interface look like a corporate dashboard, SaaS tool, gaming interface, or generic Islamic template. PRODUCT.md explicitly rejects: charts, data-heavy grids, neon, gaming aesthetics, clip-art crescents, and stock green banners.
