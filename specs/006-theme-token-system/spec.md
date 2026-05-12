# Feature Specification: Centralized Theme Token System

**Feature Branch**: `006-theme-token-system`
**Created**: 2026-05-11
**Status**: Draft
**Input**: User description: "Consolidate all hardcoded color values in the Masjid Prayer Time Display into a centralized MUI theme token system, then clean up unused imports."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Single Source of Truth for Colors (Priority: P1)

As a developer maintaining the display, I need all color values defined once in a centralized token system so that changing an accent color (e.g., the gold accent #D4AF37) only requires editing a single file rather than 40+ locations across 14 files.

**Why this priority**: The gold accent color alone appears in every component file with 9 different opacity variants across 40+ locations. A single token file eliminates the highest-maintenance pain point and makes theme changes instant and error-free.

**Independent Test**: Can be tested by modifying one token value in the token source file and verifying the new color propagates to all components that previously used the hardcoded value. Visual regression testing confirms identical rendering.

**Acceptance Scenarios**:

1. **Given** a centralized color token file exists, **When** a developer changes the gold accent token from #D4AF37 to a new value, **Then** all 40+ locations across 14 files render the new color without manual editing of component files
2. **Given** a component uses a gold-based rgba value at opacity 0.3, **When** the developer references the theme palette, **Then** the rendered color is identical to the previous hardcoded `rgba(212, 175, 55, 0.3)`

---

### User Story 2 - Zero Hardcoded Colors in Components (Priority: P1)

As a developer, I want zero hardcoded hex strings, rgba() calls, or CSS color keywords in any component file, so the codebase is fully maintainable and theme-aware.

**Why this priority**: Hardcoded colors scattered across component files are the root cause of maintenance difficulty. Eliminating them completes the token migration and enforces theme discipline.

**Independent Test**: Can be tested by searching the codebase for hex color patterns (# followed by 3-6 hex digits) and rgba() strings in component files — zero results confirms success. All components should reference theme palette or imported tokens only.

**Acceptance Scenarios**:

1. **Given** a component previously used `#D4AF37` in an sx prop, **When** the token migration is complete, **Then** the component uses `theme.palette.gold.main` (or equivalent) and renders identically
2. **Given** a component previously used `rgba(212, 175, 55, 0.3)` in a border style, **When** the token migration is complete, **Then** the component uses a theme palette reference and renders identically
3. **Given** a component previously used `color: "black"` or `bgcolor: "white"` in an sx prop, **When** the token migration is complete, **Then** the component uses theme palette references and renders identically

---

### User Story 3 - Remove Duplicate Background Pattern (Priority: P2)

As a developer, I want the duplicate background image pattern removed from App.tsx since muiTheme.ts already applies the identical pattern via CssBaseline to the body element.

**Why this priority**: The background is rendered twice (once on body from the theme, once on the Box in App.tsx). Removing the App.tsx duplicate reduces code and avoids double-rendering.

**Independent Test**: Can be tested by removing the backgroundImage/backgroundSize/backgroundPosition props from App.tsx's root Box and verifying the display looks identical (the body-level CssBaseline pattern is still applied).

**Acceptance Scenarios**:

1. **Given** App.tsx has a backgroundImage pattern identical to muiTheme.ts CssBaseline, **When** the duplicate is removed from App.tsx, **Then** the display renders identically with only the theme-applied background visible

---

### User Story 4 - Eliminate Dead Code (Priority: P2)

As a developer, I want any unused imports and dead code removed across all component files so the bundle stays minimal.

**Why this priority**: Dead code increases bundle size and adds cognitive overhead. While current analysis shows most imports are in use, a cleanup pass during refactoring ensures nothing is orphaned.

**Independent Test**: Can be tested by running the TypeScript compiler and linter — zero unused-import warnings confirms success.

**Acceptance Scenarios**:

1. **Given** the token migration and background cleanup are complete, **When** a dead code scan is performed, **Then** no unused imports or unreachable code remains in any component file

---

### Edge Cases

- What happens when an SVG attribute requires a raw color string (not a theme reference)? The token file exports typed string constants that can be imported directly for use in SVG `stroke`, `fill`, and `stopColor` attributes.
- What happens when an rgba value uses a unique opacity not covered by standard tokens? The theme palette provides base hex values, and components construct rgba at the needed opacity via CSS color functions or the alpha utility — only the base hex is tokenized.
- What happens if a component references the theme outside of an sx prop context? Components can import token constants directly from the tokens file for use in JavaScript contexts (e.g., framer-motion styles, inline style objects).
- What happens when a gradient string embeds hex values (e.g., `linear-gradient(to right, #D4AF37, #FFD700)`)? The gradient string is constructed using imported token constants concatenated with the gradient syntax — token values are interpolated into the string, never hardcoded.
- What happens when an SVG element inside an MUI component could use `currentColor` instead of a token import? Where the parent MUI component sets the color via theme palette, SVG children SHOULD use `currentColor` to inherit. Token imports are reserved for standalone SVGs or cases where `currentColor` would inherit the wrong value.
- What happens if a migrated component renders a perceptibly different shade after rgba construction? Each migration MUST be visually verified individually. If MUI's `alpha()` utility produces a non-matching result for a specific opacity, the exact rgba string is stored as a named token constant instead of being constructed at runtime.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a centralized color token file (`src/app/theme/tokens.ts`) that exports all color constants with `as const` typing
- **FR-002**: System MUST define token namespaces covering: gold accent (with light/dark variants), surface overlays (dark translucent backgrounds at opacities 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.95), border colors (gold at opacities 0.02, 0.08, 0.12, 0.15, 0.2, 0.3, 0.4, 0.5, 0.8), glow/shadow colors, and semantic colors (text, error, background)
- **FR-003**: The MUI theme (`muiTheme.ts`) MUST consume the centralized tokens instead of defining its own hardcoded values
- **FR-004**: The theme palette MUST be extended with gold, surface, border, and glow namespaces so components can reference `theme.palette.gold.main`, `theme.palette.border.subtle`, etc. Each namespace MUST use a flat object of named string properties (e.g., `gold: { main: "#D4AF37", light: "#FFD700", dark: "#B8960C" }`, `border: { faint: "rgba(...)", subtle: "rgba(...)", default: "rgba(...)", strong: "rgba(...)" }`)
- **FR-005**: All component files MUST replace hardcoded hex strings, rgba() calls, and CSS color keywords with either theme palette references (in sx props), direct token imports (in SVG attributes, gradient strings, inline styles, framer-motion configs), or `currentColor` (where SVG children inherit from a parent MUI element's color). EventModeDisplay.tsx (~20 color instances) MUST be flagged for prioritized verification as the heaviest migration target.
- **FR-006**: The duplicate backgroundImage pattern in App.tsx MUST be removed, relying solely on the theme's CssBaseline application
- **FR-007**: All unused imports, unused variables, and unreachable code across component files MUST be removed, detected via `tsc --noUnusedLocals --noUnusedParameters`
- **FR-008**: The visual output of every component MUST remain pixel-identical after the migration — zero visual regression
- **FR-009**: TypeScript strict mode MUST be satisfied with no `any` types — all tokens typed `as const`, all palette extensions properly declared in the module augmentation

### Key Entities

- **Color Tokens**: A typed object of named color constants (`as const`), covering the full palette: gold accent family (main #D4AF37, light #FFD700, dark #B8960C), green secondary family, background/surface colors, border opacities, glow colors, and text colors
- **Extended Palette**: MUI theme palette augmented with custom namespaces (`gold`, `surface`, `border`, `glow`) that map to the token values, accessible via `theme.palette.*` in sx props
- **Token Imports**: Direct imports from tokens.ts for non-theme contexts (SVG attributes, framer-motion configs, inline style objects) where `theme` is not available

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero hardcoded hex color strings (#xxx or #xxxxxx) remain in any component file outside of tokens.ts and muiTheme.ts — verified by: `grep -rE '#[0-9a-fA-F]{3,8}' src/app/components/ src/app/App.tsx` returning zero matches
- **SC-002**: Zero hardcoded rgba() strings remain in any component file outside of tokens.ts and muiTheme.ts — verified by: `grep -rE 'rgba\(' src/app/components/ src/app/App.tsx` returning zero matches
- **SC-003**: Zero hardcoded CSS color keywords ("black", "white") remain in component sx props — verified by: `grep -rE '"(black|white)"' src/app/components/` returning zero matches
- **SC-004**: Changing a single token value in tokens.ts propagates to all consuming components — verified by: (a) modifying `colors.gold.main` to a distinct test value (e.g., "#FF0000"), (b) running `yarn build`, (c) confirming all gold-accented elements render the test color, then reverting
- **SC-005**: Production build succeeds with zero TypeScript errors and zero unused-import warnings — verified by: `yarn build` exiting with code 0
- **SC-006**: App.tsx contains no backgroundImage/backgroundSize/backgroundPosition props (duplicate removed)
- **SC-007**: Gzipped JS bundle size does not increase by more than 1KB after migration (token constants are inlined; no runtime overhead expected)

## Assumptions

- All gold-based rgba variants (opacities: 0.02, 0.08, 0.12, 0.15, 0.2, 0.3, 0.4, 0.5, 0.8) will be tokenized as border/glow/surface namespace members with semantic names
- All black-based rgba variants (opacities: 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.95) will be tokenized as surface namespace members with semantic names
- Token structure uses flat objects per namespace — each namespace key maps to a semantic name string value (not nested sub-objects)
- Components that need rgba values at non-standard opacities will construct them at runtime from the base token hex value, using CSS color-mix or MUI's alpha utility
- The existing module augmentation pattern in muiTheme.ts (already declaring `gold` on Palette) will be extended to include `surface`, `border`, and `glow` namespaces
- No new npm/yarn dependencies will be added — only existing MUI utilities (e.g., `alpha` from `@mui/material/styles`) may be used
- The token file will be the single source of truth for all raw color values — muiTheme.ts will import from it rather than defining colors inline
- Unused imports found during the current analysis show zero unused imports, but a cleanup pass will still be performed to catch any that emerge from the refactoring
