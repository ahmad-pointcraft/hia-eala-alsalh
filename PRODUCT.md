# Masjid Prayer Time Display — AI Design Context

## Design Context

### Users

This is a **white-label kiosk product** deployed in many different mosques worldwide. Each deployment has its own masjid name and logo. The primary users are **mosque attendees** who glance up at a wall-mounted TV screen (1920x1080) for 3–10 seconds at a time. Their context:

- Walking into or out of the mosque
- Waiting for prayer to begin
- Checking iqama times for the current or next prayer
- Reading community announcements between prayers

The **secondary users** are mosque administrators who configure the display remotely (masjid name, logo, prayer times, announcements, events, fundraising goals).

**Job to be done**: Instantly answer "When is the next prayer?" and "What's happening at the masjid?" at a glance, while evoking a sense of spiritual presence.

### Brand Personality

**Grand. Elegant. Timeless.** — Like classical Islamic architecture: intricate yet balanced, impressive without being ostentatious.

The product itself (PointCraft) should feel like a premium, trusted platform. Individual masjid deployments should feel like they belong to that specific mosque — the masjid's own logo and identity should be prominent, with PointCraft branding subtle (a small logo, not a sales pitch).

### Emotional Tone

**Quiet awe** — The interface should evoke a moment of spiritual presence. When someone glances up, they should feel:

- Reverence and calm (the dark emerald + gold palette, Islamic geometric patterns)
- Instant clarity (prayer times are immediately legible from across a room)
- Warmth and belonging (community announcements, hadith, events)
- Trust (the information is accurate, the design feels permanent and reliable)

### Aesthetic Direction

**Visual tone**: Dark, luminous, geometrically refined — inspired by mosque interiors at night (dark emerald walls lit by warm gold light).

**References**:

- Islamic calligraphy and architecture (geometric patterns, arches, proportioned grids)
- Airport flight information displays (high-contrast, large typography, glanceable hierarchy from 10+ meters away)

**Anti-references** (must NOT look like):

- Corporate dashboards or SaaS apps (no charts, no data-heavy grids)
- Flashy/trendy UI (no neon, no gaming aesthetics, no chasing trends)
- Generic Islamic templates (no clip-art crescents, no stock green banners)

**Theme**: Dark mode only. The emerald-green (#0a1f0a) background with gold (#D4AF37) accents is the core identity. Glassmorphism with subtle backdrop blur creates depth without distraction.

**Typography hierarchy** (at kiosk viewing distance):

- Clock and countdown: largest, monospace (Roboto Mono), white
- Active prayer: significantly larger than other prayers, gold
- Prayer names: uppercase, small caps tracking
- Hadith/announcements: body text, secondary color
- Labels (Iqama, Hadith of the Day): uppercase overline style, muted

**Layout** (Mockup 7 — Floating Widgets):

- Header: language toggle (pill) | clock (pill) | donate + events buttons
- Left zone: image carousel (dominant) + hadith card below
- Right zone: countdown timer (prominent) + weather widget
- Bottom bar: 6 prayer cards in a row (active one enlarged with gold glow)
- Footer: scrolling announcements ticker with masjid logo + PointCraft logo

### Design Principles

1. **Glanceable from 5 meters** — Every critical piece of information (next prayer, countdown, current time) must be legible at kiosk viewing distance. Size and contrast beat decoration.

2. **One visual hierarchy** — The active/next prayer is always the single most prominent element. Nothing competes with it. Secondary information (weather, hadith, images) supports but never distracts.

3. **Quiet elegance, not loud decoration** — Islamic geometric patterns and gold accents are used as texture and atmosphere, never as visual noise. The beauty is in the restraint.

4. **Configurable identity, consistent quality** — Each masjid deployment has its own name and logo, but the design system ensures every installation feels premium. The PointCraft brand is present but never intrusive.

5. **Resilient by design** — The display runs 24/7 unattended. It must never show a blank screen, a crash, or broken layout. Error states are handled gracefully. Offline mode shows cached data. Animations respect `prefers-reduced-motion`.

6. **Bilingual by default** — Arabic (RTL) and English (LTR) are first-class. Layout direction, numeral conversion, font family, and text alignment all adapt seamlessly. Neither language is an afterthought.

### Color Palette

| Role           | Token                | Value             | Usage                                    |
| -------------- | -------------------- | ----------------- | ---------------------------------------- |
| Background     | `background.default` | `#0a1f0a`         | Main background — dark emerald           |
| Surface        | `background.paper`   | `rgba(0,0,0,0.3)` | Card backgrounds with glassmorphism      |
| Primary/Accent | `primary.main`       | `#D4AF37`         | Gold — active states, countdown, accents |
| Text primary   | `text.primary`       | `#ffffff`         | Main text — high contrast on dark        |
| Text secondary | `text.secondary`     | `#9ca3af`         | Labels, descriptions, muted text         |
| Error          | `error.main`         | `#d4183d`         | Error states, offline indicators         |

### Typography
 
| Role            | Font              | Weights                 |
| --------------- | ----------------- | ----------------------- |
| English body    | Open Sans         | 300, 400, 500, 600, 700 |
| Arabic body     | Noto Naskh Arabic | 400, 500, 600, 700      |
| Clock/countdown | Roboto Mono       | 600, 700                |

### Feature Inventory

| Feature                           | Status  | Notes                                    |
| --------------------------------- | ------- | ---------------------------------------- |
| Prayer times (5 + sunrise/sunset) | Built   | Active prayer highlighted with gold glow |
| Countdown to next prayer          | Built   | Monospace, prominent                     |
| Clock (HH:MM:SS)                  | Built   | Header center, 24h format                |
| Language toggle (AR/EN)           | Built   | Pill-style button in header              |
| Donate dialog                     | Built   | Overlay triggered from header button     |
| Upcoming events                   | Built   | Full-screen event mode                   |
| Hadith of the day                 | Built   | Card below image carousel                |
| Image carousel                    | Built   | Auto-rotating mosque photos              |
| Announcements ticker              | Built   | Scrolling footer with masjid logo        |
| Weather widget                    | Built   | Temperature, conditions, humidity        |
| Masjid name/logo (per deployment) | Partial | Name hardcoded, logo asset in /assets    |
| PointCraft company branding       | Needed  | Should appear in ticker/footer area      |
| Islamic geometric overlay         | Built   | Animated pattern for event mode          |
| Fundraising progress overlay      | Built   | Auto-rotates between prayers             |
