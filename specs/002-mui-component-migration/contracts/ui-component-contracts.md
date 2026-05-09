# UI Contract: MUI Component API Surface

**Feature**: 002-mui-component-migration  
**Date**: 2026-05-09

## Overview

This contract documents the public API surface of each component after MUI migration. Since this is a UI-only project (no backend, no external APIs), the "contracts" are the component props interfaces and the MUI component tree each component renders.

All component props interfaces remain unchanged — the migration changes only the internal rendering (Tailwind → MUI sx prop). No consumer-facing API changes.

---

## Component Rendering Contracts

### Header.tsx

**MUI Component Tree**:

```structure
AppBar (position="static")
└── Toolbar
    ├── Box (flex-1, justify start)
    │   └── Button (variant="outlined", language toggle)
    │       ├── Languages (lucide-react)
    │       └── Typography component="span" (label, hidden on xs)
    ├── Box (flex center)
    │   └── Typography (clock, monospace)
    └── Box (flex-1, justify end)
        ├── Button (variant="outlined", donate)
        │   ├── Heart (lucide-react)
        │   └── Typography component="span" (label, hidden below lg)
        └── Button (variant="contained", event mode)
            ├── CalendarClock (lucide-react)
            └── Typography component="span" (label, hidden on xs)
```

### PrayerCard.tsx

**MUI Component Tree**:

```structure
Card (interactive, dir=rtl/ltr)
└── CardContent
    ├── Box (icon wrapper)
    │   └── [lucide icon] (Sunrise/Sun/CloudSun/Sunset/Moon/Star)
    ├── Typography (prayer name, overline-like)
    ├── Typography (prayer time, large)
    └── Typography (iqama label + time)
```

### CountdownBar.tsx

**MUI Component Tree**:

```structure
Paper (dir=rtl/ltr)
└── Box (flex, space-between)
    ├── Typography (prayer text)
    └── Typography (countdown, monospace)
```

### MasjidInfo.tsx

**MUI Component Tree**:

```structure
Box (dir=rtl/ltr)
└── Box (flex, space-between)
    ├── Box (shrink-0)
    │   └── img (masjid logo)
    └── Box (flex, dates)
        ├── Typography component="span" (Hijri date)
        ├── Typography component="span" (divider •)
        └── Typography component="span" (Gregorian date)
```

### HadithPanel.tsx

**MUI Component Tree**:

```structure
Paper (dir=rtl/ltr)
└── Box (flex-col)
    ├── Typography (title, gold, textAlign start)
    ├── Typography (hadith text, center, italic)
    └── Typography (source, textAlign end)
```

### WeatherWidget.tsx

**MUI Component Tree**:

```structure
Paper (dir=rtl/ltr)
└── Box (flex, space-between)
    ├── Box (flex, icon + temp)
    │   ├── Cloud (MUI icon)
    │   └── Box
    │       ├── Typography (temperature)
    │       └── Typography (city name)
    └── Box (text-end)
        ├── Typography (condition)
        └── Box (flex, humidity)
            ├── Droplets (lucide)
            └── Typography component="span" (humidity %)
```

### AnnouncementsTicker.tsx

**MUI Component Tree**:

```structure
Paper (dir=rtl/ltr, fixed bottom)
└── Box (flex, h-8/9/10)
    ├── Box (logo section, bg-black/60)
    │   └── img (logo)
    ├── Box (flex-1, overflow-hidden)
    │   └── Box ref={scrollRef} (scrolling text)
    │       └── Typography component="span" (announcements)
    └── Box (megaphone section, bg-gold)
        └── Megaphone (lucide)
```

### FundraisingOverlay.tsx

**MUI Component Tree**:

```structure
Backdrop (open, dir=rtl/ltr)
└── Paper
    ├── Box (gold gradient top line)
    ├── IconButton (close, insetInlineEnd)
    │   └── Close (MUI icon)
    ├── Box (title + description)
    │   ├── Typography (title, h2-like)
    │   └── Typography (description)
    ├── Box (stats row)
    │   ├── Box (collected)
    │   ├── Box (divider, hidden xs)
    │   ├── Box (goal)
    │   ├── Box (divider, hidden xs)
    │   └── Box (donors)
    ├── Box (progress section)
    │   ├── Box (labels)
    │   └── LinearProgress (determinate)
    └── Box (QR + countdown)
        ├── Box (QR + link)
        └── Typography (auto-close countdown)
```

### EventModeDisplay.tsx

**MUI Component Tree**:

```structure
motion.div (fade in/out)
└── motion.div (scale animation)
    ├── Box (glow border, absolute)
    └── Paper (event card)
        ├── Box[4] (corner ornaments, hidden xs)
        ├── motion.div → Chip (event badge)
        ├── motion.div (title + speaker)
        │   ├── Typography (title, h1)
        │   ├── Typography (guest speaker label)
        │   ├── Typography (speaker name)
        │   └── Typography (speaker title)
        ├── motion.div → Grid container (details)
        │   ├── Grid (date) → Box + CalendarMonth (MUI) + Typography[3]
        │   ├── Grid (time) → Box + AccessTime (MUI) + Typography[3]
        │   └── Grid (location) → Box + LocationOn (MUI) + Typography[3]
        ├── motion.div → Paper (description)
        │   └── Typography
        ├── motion.div (CTA)
        │   └── motion.div → Button (pulsing, gold gradient)
        │       ├── Groups (MUI icon)
        │       └── Typography component="span"
        └── motion.div (light rays, absolute)
```

### IslamicGeometricOverlay.tsx

**MUI Component Tree**:

```structure
Box (absolute inset-0, pointer-events-none)
├── motion.div (rotate 360, 120s)
│   └── svg (8-pointed star pattern)
├── motion.div (rotate -360, 180s)
│   └── svg (hexagonal tessellation)
├── motion.div (top gold glow)
├── motion.div (bottom gold glow)
├── motion.div[4] (corner accents)
│   └── Box (radial gradient)
└── motion.div[6] (floating particles, useMemo positions)
```

### ImageCarousel.tsx

**MUI Component Tree**:

```structure
Box (relative, overflow-hidden)
├── AnimatePresence
│   └── motion.div → img (current slide)
├── IconButton (prev, absolute left)
│   └── ChevronLeft (MUI icon)
├── IconButton (next, absolute right)
│   └── ChevronRight (MUI icon)
└── Box (dots, absolute bottom center)
    └── Box[n] (dot indicators, sx active/inactive)
```

### App.tsx

**MUI Component Tree**:

```structure
Box (relative, fullscreen)
├── Box (absolute, bg pattern)
├── AnimatePresence → IslamicGeometricOverlay (event mode)
├── Box (relative, z-10, flex-col, fullheight)
│   ├── Header
│   ├── AnimatePresence
│   │   ├── motion.div (event mode)
│   │   │   └── EventModeDisplay
│   │   └── motion.div (normal mode)
│   │       ├── Box (shrink-0) → MasjidInfo
│   │       ├── Box (flex-1, overflow-auto)
│   │       │   ├── motion.div → Grid container (countdown + weather)
│   │       │   │   ├── Grid (CountdownBar)
│   │       │   │   └── Grid (WeatherWidget)
│   │       │   └── motion.div → Box (carousel)
│   │       │       └── ImageCarousel
│   │       └── Box (shrink-0, bottom)
│   │           ├── motion.div → HadithPanel
│   │           └── motion.div → Grid container (prayer cards)
│   │               └── Grid[6] → motion.div → PrayerCard
│   └── AnnouncementsTicker
└── FundraisingOverlay (conditional)
```

### figma/ImageWithFallback.tsx

**MUI Component Tree**:

```structure
// Error state:
Box (inline-block)
└── Box (flex, center)
    └── img (error placeholder SVG)

// Normal state:
img (src, alt, sx, onError)
```
