# Research: MUI Component Migration

**Feature**: 002-mui-component-migration  
**Date**: 2026-05-09  
**Status**: Complete — all unknowns resolved

## R-001: MUI v7 Grid API (Grid2 → Grid)

- **Decision**: Use `Grid` (not `Grid2`) — MUI v7 renamed `Grid2` to `Grid` as the default
- **Rationale**: In MUI v7, the legacy `Grid` was removed and `Grid2` became the standard `Grid`. The `item` prop is no longer needed. Column sizing uses the `size` prop with responsive objects: `size={{ xs: 6, sm: 4, lg: 2 }}`
- **Alternatives considered**: Legacy `Grid` with `xs`/`sm`/`md`/`lg` props — removed in v7

### Import Pattern

```typescript
import Grid from "@mui/material/Grid";
// NOT: import Grid2 from '@mui/material/Grid2'; (deprecated in v7)
```

### Prayer Card Grid Pattern

```typescript
// 12-column grid: 2 cols (xs) → 3 cols (sm) → 6 cols (lg)
<Grid container spacing={{ xs: 1, sm: 1.5 }}>
  {prayers.map((prayer) => (
    <Grid key={prayer.key} size={{ xs: 6, sm: 4, lg: 2 }}>
      <PrayerCard ... />
    </Grid>
  ))}
</Grid>
```

### Event Details Grid Pattern

```typescript
// 3-column grid for date/time/location
<Grid container spacing={{ xs: 1, sm: 2, lg: 3 }}>
  <Grid size={4}>Date</Grid>
  <Grid size={4}>Time</Grid>
  <Grid size={4}>Location</Grid>
</Grid>
```

---

## R-002: MUI sx Prop — Font Family Resolution (FR-018)

- **Decision**: Use `sx={{ fontFamily: (theme) => language === 'ar' ? '"Noto Naskh Arabic", serif' : theme.typography.fontFamily }}` for language-dependent font switching
- **Rationale**: The MUI theme defines `fontFamily: '"Open Sans", "Noto Naskh Arabic", sans-serif'` at the root, but individual components need Arabic-first font stack when `language === 'ar'`. Since font family is conditional on runtime state, it cannot be purely theme-driven — must use a function inside `sx`
- **Alternatives considered**: Creating two themes (one per language) — overkill for font family switching only

### Pattern for Components

```typescript
const fontFamily = language === 'ar'
  ? '"Noto Naskh Arabic", serif'
  : '"Open Sans", sans-serif';

// In sx:
sx={{ fontFamily }}
// This replaces: style={{ fontFamily }}
```

---

## R-003: Framer Motion + MUI Component Composition

- **Decision**: Keep `motion.div` wrappers around MUI components — do NOT use `motion(Box)` or `motion(Paper)`
- **Rationale**: `motion(MuiComponent)` creates a new component on every render unless memoized at module level. Wrapping MUI components in `motion.div` is simpler, well-tested, and avoids ref forwarding issues. The spec allows both approaches, but `motion.div` is safer
- **Alternatives considered**: `motion(Box)` — works but requires module-level const declarations and adds complexity

### Pattern

```typescript
// ✅ Keep as-is:
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
  <Paper sx={{ ... }}>
    Content
  </Paper>
</motion.div>

// ❌ Avoid (ref forwarding complexity):
const MotionBox = motion(Box);
```

---

## R-004: MUI Backdrop + Paper vs Dialog (FR-010)

- **Decision**: Use `<Backdrop>` + `<Paper>` for FundraisingOverlay
- **Rationale**: MUI Dialog adds focus trap, `aria-modal`, and escape-to-close behavior that conflicts with the auto-closing timer. The fundraising overlay is a non-interactive display overlay — it shows information and auto-closes. Backdrop provides the dimming layer; Paper provides the styled content card. Also, in MUI v7, `onBackdropClick` was removed from Modal/Dialog — another reason to use Backdrop directly
- **Alternatives considered**: Dialog — rejected due to focus trap interfering with kiosk flow

---

## R-005: RTL Logical Properties in MUI sx (FR-006)

- **Decision**: Use MUI's logical properties in `sx` prop: `marginInlineStart`, `marginInlineEnd`, `paddingInlineStart`, `paddingInlineEnd`, `insetInlineStart`, `insetInlineEnd`, plus `textAlign: 'start'` / `textAlign: 'end'`
- **Rationale**: MUI's `sx` prop supports CSS logical properties. Combined with `dir="rtl"` on each component root, these properties auto-flip for RTL layout without conditional left/right logic
- **Alternatives considered**: Conditional `marginLeft`/`marginRight` based on `isRTL` — verbose and error-prone

### Pattern typescript

```typescript
// ✅ Use logical properties:
sx={{ paddingInline: 2, textAlign: 'start', insetInlineEnd: 16 }}

// ❌ Avoid physical properties:
sx={{ paddingLeft: 2, textAlign: isRTL ? 'right' : 'left' }}
```

---

## R-006: IslamicGeometricOverlay Performance (FR-014)

- **Decision**: Use `useMemo` to pre-compute particle positions; reduce from 12 to 6 particles
- **Rationale**: `Math.random()` in render body causes particle positions to change on every re-render. `useMemo` with empty deps computes once. Reducing particles from 12 to 6 halves animation workload — important for kiosk performance (Article VII)
- **Alternatives considered**: `useRef` for positions — `useMemo` is cleaner for derived data

### Pattern particle positions typescript

```typescript
const particlePositions = useMemo(
 () =>
  Array.from({ length: 6 }, () => ({
   left: `${Math.random() * 100}%`,
   top: `${Math.random() * 100}%`,
   duration: 8 + Math.random() * 4,
   delay: Math.random() * 3,
  })),
 [],
);
```

---

## R-007: NodeJS.Timeout Type Fix

- **Decision**: Replace `NodeJS.Timeout` with `ReturnType<typeof setTimeout>` in App.tsx
- **Rationale**: `NodeJS.Timeout` is a Node.js type — not available in browser environments without `@types/node`. `ReturnType<typeof setTimeout>` resolves to `number` in browsers, which is correct for `window.setTimeout`. The current code compiles only because `@types/node` is a transitive dependency
- **Alternatives considered**: Adding `@types/node` to devDependencies — violates Article IV (no unjustified dependencies)

---

## R-008: MUI AppBar for Header (FR-002)

- **Decision**: Use `<AppBar position="static">` with `<Toolbar>` for the Header component
- **Rationale**: The header is always at the top of the page — `AppBar` is semantically correct. Using `position="static"` keeps it in document flow (not fixed/sticky) since the app is a full-screen kiosk display. Toolbar provides proper spacing and flexbox alignment for child elements
- **Alternatives considered**: `Paper` — rejected because `AppBar` provides semantic nav context

### Pattern header typescript

```typescript
<AppBar
  position="static"
  dir={language === 'ar' ? 'rtl' : 'ltr'}
  sx={{
    bgcolor: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(4px)',
    borderBottom: '1px solid rgba(212,175,55,0.3)',
    boxShadow: 'none',
  }}
>
  <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
    ...
  </Toolbar>
</AppBar>
```

---

## R-009: MUI LinearProgress for Fundraising Progress Bar

- **Decision**: Use MUI `LinearProgress` with `variant="determinate"` for the donation progress bar
- **Rationale**: LinearProgress provides built-in progress semantics and accessibility. The gold gradient can be applied via sx override on the bar
- **Alternatives considered**: Custom div with percentage width — lacks accessibility

### Pattern progress bar

```typescript
<LinearProgress
  variant="determinate"
  value={progress}
  sx={{
    height: 12,
    borderRadius: 6,
    bgcolor: 'grey.800',
    '& .MuiLinearProgress-bar': {
      borderRadius: 6,
      background: 'linear-gradient(to right, #D4AF37, #FFD700)',
    },
  }}
/>
```

---

## R-010: Icon Migration Audit (FR-007 / FR-008)

### MUI Icons (replace lucide imports)

| Lucide Import | MUI Import    | Used In            |
| ------------- | ------------- | ------------------ |
| Cloud         | Cloud         | WeatherWidget      |
| ChevronLeft   | ChevronLeft   | ImageCarousel      |
| ChevronRight  | ChevronRight  | ImageCarousel      |
| X             | Close         | FundraisingOverlay |
| Calendar      | CalendarMonth | EventModeDisplay   |
| Clock         | AccessTime    | EventModeDisplay   |
| MapPin        | LocationOn    | EventModeDisplay   |
| Users         | Groups        | EventModeDisplay   |

### Lucide Icons (keep — no MUI equivalent)

| Lucide Import | Used In                  |
| ------------- | ------------------------ |
| Sunrise       | PrayerCard (Fajr)        |
| Sun           | PrayerCard (Asr/Sunrise) |
| Sunset        | PrayerCard (Maghrib)     |
| CloudSun      | PrayerCard (Dhuhr)       |
| Moon          | PrayerCard (Isha)        |
| Star          | PrayerCard (fallback)    |
| Languages     | Header, App              |
| CalendarClock | Header                   |
| Heart         | Header                   |
| Megaphone     | AnnouncementsTicker      |
| Droplets      | WeatherWidget            |

### Mutual Exclusivity Verified

Every icon in the codebase appears in exactly one list. No overlap between FR-007 and FR-008.

---

## R-011: ImageWithFallback.tsx Migration (FR-017)

- **Decision**: Replace Tailwind classes (`inline-block`, `bg-gray-100`, `flex items-center justify-center`) with MUI `Box` + `sx` prop
- **Rationale**: ImageWithFallback uses Tailwind for error state styling. It should follow the same MUI-only pattern as all other components
- **Alternatives considered**: Removing the component entirely — rejected because error fallback is a kiosk resilience concern (Article VII)

---

## R-012: `translations: any` Type Replacement (FR-019)

- **Decision**: Replace `translations: any` with `Record<string, string>` in 6 components (Header, MasjidInfo, HadithPanel, WeatherWidget, FundraisingOverlay, EventModeDisplay) per FR-019
- **Rationale**: FR-019 explicitly requires `Record<string, string>` — the `any` type violates Article II. While the actual translations object is deeply nested (e.g., `translations.weather.partlyCloudy`), the components receive pre-extracted flat keys from App.tsx via props. The nested access patterns are resolved at the call site, not inside the component. `Record<string, string>` is accurate for the component's own prop contract
- **Alternatives considered**: `Record<string, unknown>` — more precise but requires type assertions at every access point, adding noise without safety gain. Full `Translations` interface — deferred to Spec 004

**Note**: Components that access nested translation keys directly (e.g., `translations.weather.partlyCloudy`) will require type assertions like `(translations as Record<string, Record<string, string>>).weather.partlyCloudy` or refactoring the prop to pass flat strings. The full `Translations` interface in Spec 004 will resolve this cleanly.

Type `prayerIcons` as `Record<string, React.ComponentType<{ className?: string }>>`.
