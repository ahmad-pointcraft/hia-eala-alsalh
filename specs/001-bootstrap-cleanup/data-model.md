# Data Model: Bootstrap & Cleanup — MUI Migration Phase 0

**Branch**: `001-bootstrap-cleanup` | **Date**: 2026-05-08

## Entities

This spec introduces no persistent data entities. The only entities are the MUI theme configuration and the ThemeProviderWrapper component.

---

### Entity: MUITheme

**Type**: Runtime configuration object (not persisted)

Represents the centralized MUI theme for the mosque kiosk display.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `palette.mode` | `'dark'` | `'dark'` | Always dark mode for kiosk display |
| `palette.primary.main` | `string` | `'#D4AF37'` | Gold accent color |
| `palette.primary.light` | `string` | `'#FFD700'` | Lighter gold |
| `palette.primary.dark` | `string` | `'#B8960C'` | Darker gold |
| `palette.primary.contrastText` | `string` | `'#0a1f0a'` | Dark emerald text on gold |
| `palette.secondary.main` | `string` | `'#2E7D32'` | Green accent |
| `palette.background.default` | `string` | `'#0a1f0a'` | Dark emerald background |
| `palette.background.paper` | `string` | `'rgba(0,0,0,0.3)'` | Semi-transparent paper |
| `palette.text.primary` | `string` | `'#ffffff'` | White text |
| `palette.text.secondary` | `string` | `'#9ca3af'` | Gray secondary text |
| `palette.divider` | `string` | `'rgba(212, 175, 55, 0.12)'` | Subtle gold divider |
| `typography.fontFamily` | `string` | `'"Open Sans", "Noto Naskh Arabic", sans-serif'` | Font stack |
| `shape.borderRadius` | `number` | `8` | Default border radius in px |

**Custom Extension** (via TypeScript module augmentation):

| Field | Type | Value | Description |
|-------|------|-------|-------------|
| `palette.gold.main` | `string` | `'#D4AF37'` | Gold color token |
| `palette.gold.light` | `string` | `'#FFD700'` | Light gold token |

**Validation Rules**:
- Theme must be a valid return value of `createTheme()` from `@mui/material/styles`
- Custom `gold` palette extension requires TypeScript module augmentation (`declare module '@mui/material/styles'`)
- All color values must be valid CSS color strings

**Relationships**:
- Consumed by `ThemeProviderWrapper` component

---

### Entity: ThemeProviderWrapper

**Type**: React component

Wraps the application tree with MUI's ThemeProvider and CssBaseline. No explicit Emotion CacheProvider (MUI v7 auto-manages).

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Application tree to wrap |

**Internal Structure**:
- `<ThemeProvider theme={muiTheme}>` — provides theme to all descendant components
- `<CssBaseline enableColorScheme />` — injects global reset, dark mode defaults, CSS custom properties
- `{children}` — the application tree

**Validation Rules**:
- Must be rendered exactly once, at the root of the component tree
- Must wrap `<App />` in `main.tsx`

**Relationships**:
- Imports `muiTheme` from `./muiTheme`
- Used in `src/main.tsx` to wrap `<App />`

---

## File Locations

| Entity | File | Export |
|--------|------|--------|
| MUITheme | `src/app/theme/muiTheme.ts` | `export default muiTheme` |
| ThemeProviderWrapper | `src/app/theme/ThemeProviderWrapper.tsx` | `export default function ThemeProviderWrapper` |
| Theme type augmentation | `src/app/theme/muiTheme.ts` | `declare module '@mui/material/styles'` |
