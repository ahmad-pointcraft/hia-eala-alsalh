# Data Model: MUI Component Migration

**Feature**: 002-mui-component-migration  
**Date**: 2026-05-09

## Overview

This feature does not introduce new data entities. It is a UI-layer migration from Tailwind CSS to MUI v7 components. The data model documents the component props interfaces that are modified during migration.

---

## Entity: Component Props Interfaces

All 13 component files (12 components + 1 utility) have their props interfaces modified. No new props are added — only type refinements.

### HeaderProps (Header.tsx)

| Field             | Type                             | Change                                                              |
| ----------------- | -------------------------------- | ------------------------------------------------------------------- |
| eventMode         | `boolean`                        | No change                                                           |
| onToggleEventMode | `() => void`                     | No change                                                           |
| language          | `Language`                       | No change                                                           |
| onToggleLanguage  | `() => void`                     | No change                                                           |
| onShowFundraising | `() => void`                     | No change                                                           |
| translations      | `any` → `Record<string, string>` | FR-019: eliminates `any`. Full `Translations` interface is Spec 004 |

### PrayerCardProps (PrayerCard.tsx)

| Field      | Type                       | Change    |
| ---------- | -------------------------- | --------- |
| name       | `string`                   | No change |
| time       | `string`                   | No change |
| iqamaTime  | `string`                   | No change |
| isActive   | `boolean` (default: false) | No change |
| language   | `Language`                 | No change |
| iqamaLabel | `string`                   | No change |
| prayerKey  | `string`                   | No change |

#### Module-Level Constants

| Constant    | Type Before           | Type After                                                    |
| ----------- | --------------------- | ------------------------------------------------------------- |
| prayerIcons | `Record<string, any>` | `Record<string, React.ComponentType<{ className?: string }>>` |

### CountdownBarProps (CountdownBar.tsx)

| Field           | Type       | Change    |
| --------------- | ---------- | --------- |
| nextPrayer      | `string`   | No change |
| nextPrayerTime  | `string`   | No change |
| language        | `Language` | No change |
| nextPrayerLabel | `string`   | No change |

### MasjidInfoProps (MasjidInfo.tsx)

| Field        | Type                             | Change                                                              |
| ------------ | -------------------------------- | ------------------------------------------------------------------- |
| language     | `Language`                       | No change                                                           |
| translations | `any` → `Record<string, string>` | FR-019: eliminates `any`. Full `Translations` interface is Spec 004 |

### HadithPanelProps (HadithPanel.tsx)

| Field        | Type                             | Change                                                              |
| ------------ | -------------------------------- | ------------------------------------------------------------------- |
| language     | `Language`                       | No change                                                           |
| translations | `any` → `Record<string, string>` | FR-019: eliminates `any`. Full `Translations` interface is Spec 004 |

### WeatherWidgetProps (WeatherWidget.tsx)

| Field        | Type                             | Change                                                              |
| ------------ | -------------------------------- | ------------------------------------------------------------------- |
| language     | `Language`                       | No change                                                           |
| translations | `any` → `Record<string, string>` | FR-019: eliminates `any`. Full `Translations` interface is Spec 004 |

### AnnouncementsTickerProps (AnnouncementsTicker.tsx)

| Field              | Type       | Change    |
| ------------------ | ---------- | --------- |
| language           | `Language` | No change |
| announcementsLabel | `string`   | No change |
| announcements      | `string[]` | No change |

### FundraisingOverlayProps (FundraisingOverlay.tsx)

| Field        | Type                             | Change                                                              |
| ------------ | -------------------------------- | ------------------------------------------------------------------- |
| onClose      | `() => void`                     | No change                                                           |
| language     | `Language`                       | No change                                                           |
| translations | `any` → `Record<string, string>` | FR-019: eliminates `any`. Full `Translations` interface is Spec 004 |

### EventModeDisplayProps (EventModeDisplay.tsx)

| Field        | Type                             | Change                                                              |
| ------------ | -------------------------------- | ------------------------------------------------------------------- |
| language     | `Language`                       | No change                                                           |
| translations | `any` → `Record<string, string>` | FR-019: eliminates `any`. Full `Translations` interface is Spec 004 |

### IslamicGeometricOverlay (IslamicGeometricOverlay.tsx)

- No props — stateless decorative component
- Internal state: `particlePositions` computed via `useMemo` (new)

### ImageCarouselProps (ImageCarousel.tsx)

| Field    | Type       | Change    |
| -------- | ---------- | --------- |
| images   | `string[]` | No change |
| interval | `number?`  | No change |

### ImageWithFallback (figma/ImageWithFallback.tsx)

| Field | Type                                        | Change    |
| ----- | ------------------------------------------- | --------- |
| props | `React.ImgHTMLAttributes<HTMLImageElement>` | No change |

---

## State Management

No state management changes. All component-local state (useState, useEffect, useRef) is preserved as-is.

### App.tsx Timer Fix

| Variable         | Type Before      | Type After                      |
| ---------------- | ---------------- | ------------------------------- |
| fundraisingTimer | `NodeJS.Timeout` | `ReturnType<typeof setTimeout>` |

---

## Validation Rules

- FR-019: `prayerIcons` must be typed as `Record<string, React.ComponentType<{ className?: string }>>`
- FR-019: `translations: any` replaced with `Record<string, string>` in all component interfaces. Full `Translations` interface with nested keys is Spec 004 scope
- FR-024: `toArabicNumerals()` must be applied to all numeric string outputs when `language === 'ar'`
