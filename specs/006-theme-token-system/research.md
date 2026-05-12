# Research: Centralized Theme Token System

**Date**: 2026-05-11 | **Branch**: `006-theme-token-system`

## Decision 1: Token File Structure

**Decision**: Single `tokens.ts` file exporting a single `colors` object typed `as const` with flat namespace sub-objects.

**Rationale**: All color values are design constants — they don't vary by runtime conditions. A single object with `as const` gives TypeScript literal types for free, enabling autocomplete and preventing typos. Flat sub-objects (e.g., `colors.gold.main`, `colors.border.subtle`) match MUI's palette convention and are easy to reference.

**Alternatives considered**:
- Multiple files per namespace (gold.ts, surface.ts, etc.) — over-engineered for 4 namespaces
- CSS custom properties — violates Article I (MUI-only)
- JSON config file — loses TypeScript `as const` inference
- Nested objects (e.g., `colors.border.gold.subtle`) — deeper nesting than needed, harder to type

## Decision 2: Palette Extension via Module Augmentation

**Decision**: Extend the existing `declare module "@mui/material/styles"` block in `muiTheme.ts` to add `surface`, `border`, and `glow` to the Palette interface, matching the existing `gold` pattern.

**Rationale**: The codebase already uses module augmentation for `gold` (muiTheme.ts:183-196). Extending the same pattern for 3 more namespaces is consistent and type-safe. Components get autocomplete for `theme.palette.border.subtle` etc.

**Alternatives considered**:
- Use `ThemeOptions` augmentation only — loses type safety in sx callbacks
- Access tokens directly in sx props (no palette) — requires importing tokens everywhere, defeating the purpose of theme palette

## Decision 3: Migration Strategy for SVG and Non-Theme Contexts

**Decision**: Three-tier strategy — (1) `theme.palette.*` in sx props, (2) direct token imports for SVG/style/motion contexts, (3) `currentColor` for SVG children that inherit from MUI parent.

**Rationale**: MUI's `sx` callback provides the theme object, making palette references the cleanest approach for standard styling. SVG attributes (`stroke`, `fill`, `stopColor`) and inline `style` props can't access the theme — direct imports from `tokens.ts` are the only option. For SVG elements nested inside MUI components where the parent sets `color`, `currentColor` is the most idiomatic CSS approach.

**Alternatives considered**:
- `useTheme()` hook for all contexts — adds hook overhead, unnecessary in sx callbacks
- CSS variables — violates Article I
- Inline `useMemo` to build style objects — over-engineered for static color values

## Decision 4: Opacity Token Naming Convention

**Decision**: Semantic names mapped to opacity levels within each namespace, using a consistent naming pattern.

Mapping:

| Namespace | Key | Value | Used In |
|-----------|-----|-------|---------|
| gold | main | #D4AF37 | Primary accent |
| gold | light | #FFD700 | Hover states, gradients |
| gold | dark | #B8960C | Active states |
| border | faint | rgba(212,175,55,0.02) | Background pattern |
| border | subtle | rgba(212,175,55,0.08) | Card/paper borders |
| border | thin | rgba(212,175,55,0.12) | Divider lines |
| border | light | rgba(212,175,55,0.15) | Radial gradients |
| border | default | rgba(212,175,55,0.2) | Chip backgrounds, detail borders |
| border | medium | rgba(212,175,55,0.3) | Active borders, scrollbar |
| border | strong | rgba(212,175,55,0.4) | Corner decorations |
| border | prominent | rgba(212,175,55,0.5) | Box shadows, active borders |
| border | intense | rgba(212,175,55,0.8) | Hover state borders |
| surface | overlay | rgba(0,0,0,0.3) | Inactive cards, paper bg |
| surface | raised | rgba(0,0,0,0.4) | AppBar, ticker, backdrops |
| surface | medium | rgba(0,0,0,0.5) | Navigation buttons, inactive dots |
| surface | deep | rgba(0,0,0,0.6) | Papers, overlays |
| surface | heavy | rgba(0,0,0,0.7) | Button hover states |
| surface | darker | rgba(0,0,0,0.8) | Language/donate buttons |
| surface | opaque | rgba(0,0,0,0.95) | Button hover states |
| glow | subtle | rgba(212,175,55,0.3) | Scrollbar, soft shadows |
| glow | medium | rgba(212,175,55,0.5) | Active card shadow |
| glow | strong | rgba(212,175,55,0.8) | Intense glow effects |

**Rationale**: Semantic names are more maintainable than numeric opacity suffixes (e.g., `border.medium` vs `border.gold30`). Each name describes the visual purpose, making it easy to pick the right token.

**Alternatives considered**:
- Numeric suffixes (gold03, gold05, gold08) — less readable, harder to understand intent
- Group by opacity range — breaks the namespace grouping convention

## Decision 5: Gradient String Handling

**Decision**: Construct gradient strings by interpolating imported token constants using template literals.

```typescript
// Example
const gradient = `linear-gradient(to right, ${colors.gold.main}, ${colors.gold.light})`;
```

**Rationale**: CSS gradient strings are plain strings — they can't reference theme values. Template literal interpolation with token constants is the simplest approach that keeps hex values out of component files.

**Alternatives considered**:
- Store complete gradient strings as tokens — too many unique combinations
- CSS custom properties in gradients — violates Article I

## Decision 6: Dead Code Detection Method

**Decision**: Use `tsc --noUnusedLocals --noUnusedParameters` (already available via `yarn typecheck` with potential flag addition) as the detection method.

**Rationale**: No new dependencies needed. TypeScript compiler catches unused imports, variables, and parameters. The project already has `yarn typecheck` in package.json.

**Alternatives considered**:
- ESLint with `no-unused-vars` rule — would require adding ESLint (new dependency, violates constraints)
- Manual review — error-prone, doesn't scale
