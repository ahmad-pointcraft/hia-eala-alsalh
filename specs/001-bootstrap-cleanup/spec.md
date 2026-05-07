# Feature Specification: Bootstrap & Cleanup — MUI Migration Phase 0

**Feature Branch**: `001-bootstrap-cleanup`  
**Created**: 2026-05-07  
**Status**: Draft  
**Input**: User description: "Complete Phase 0 — Bootstrap & Cleanup for the Masjid Prayer Time Display app. Greenfield migration from Tailwind CSS + shadcn/ui to MUI v7 only."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Clean Dependency Foundation (Priority: P1)

As a developer setting up this project, I want all unnecessary dependencies removed and a single package manager (yarn) established so that the project starts from a clean, maintainable baseline with only the libraries actually used.

**Why this priority**: Without a clean dependency tree, every subsequent spec builds on a bloated foundation. Removing ~40 unused packages reduces bundle size, install time, and confusion about what the project actually uses.

**Independent Test**: Can be fully tested by running `yarn install` successfully and verifying `package.json` contains only 12 production dependencies. Running `yarn build` should still invoke Vite (even if it fails on Tailwind-less components — that is expected).

**Acceptance Scenarios**:

1. **Given** the project has pnpm-workspace.yaml and 50+ dependencies, **When** the developer runs the cleanup, **Then** pnpm artifacts are deleted, yarn.lock is generated, and only MUI/React/motion/lucide-react/date-fns dependencies remain
2. **Given** 48 shadcn/ui component files exist in src/app/components/ui/, **When** the cleanup runs, **Then** the entire ui/ directory is deleted along with all @radix-ui/* packages
3. **Given** Tailwind CSS is configured via @tailwindcss/vite plugin, **When** the cleanup runs, **Then** the Tailwind plugin is removed from vite.config.ts, tailwind.css is deleted, and postcss.config.mjs is deleted

---

### User Story 2 — MUI Theme Foundation (Priority: P2)

As a developer building UI components, I want a centralized MUI theme configured with the mosque's dark emerald/gold color palette and both English and Arabic font support so that every component I write in later specs has a consistent design system to draw from.

**Why this priority**: The theme provider must exist before any component migration (Spec 002) can begin. It establishes the visual DNA of the entire application.

**Independent Test**: Can be fully tested by importing the theme in a test file and verifying the palette contains the correct colors (primary: #D4AF37 gold, background: #0a1f0a dark emerald) and that wrapping a component in ThemeProviderWrapper renders with dark mode active.

**Acceptance Scenarios**:

1. **Given** no MUI theme exists, **When** the developer creates src/app/theme/muiTheme.ts, **Then** the theme defines a dark palette with gold primary, emerald background, and proper typography for Open Sans + Noto Naskh Arabic
2. **Given** the theme is configured, **When** the developer wraps the app in ThemeProviderWrapper, **Then** CssBaseline injects dark mode defaults and font loading
3. **Given** the MUI provider wraps the app, **When** main.tsx renders, **Then** the app shell loads without runtime errors (components may be visually broken — that is expected at this phase)

---

### User Story 3 — Dead Code Elimination (Priority: P3)

As a developer maintaining this codebase, I want all unused files, duplicate configurations, and dead CSS removed so that the project structure is clean and there is no confusion about which files are active vs. artifacts from the Figma export.

**Why this priority**: Dead code creates confusion and maintenance burden. Removing it before building new code ensures nothing accidentally depends on leftover artifacts.

**Independent Test**: Can be fully tested by verifying the following files no longer exist: InfoPanels.tsx, globals.css, default_shadcn_theme.css, postcss.config.mjs, pnpm-workspace.yaml, src/styles/tailwind.css, src/styles/fonts.css (replaced by MUI font loading).

**Acceptance Scenarios**:

1. **Given** InfoPanels.tsx exists but is never imported, **When** the cleanup runs, **Then** the file is deleted
2. **Given** default_shadcn_theme.css duplicates theme.css, **When** the cleanup runs, **Then** the duplicate is deleted
3. **Given** src/styles/ contains tailwind.css, fonts.css, and globals.css, **When** the cleanup runs, **Then** tailwind.css and globals.css are deleted; fonts.css content is replaced by MUI CssBaseline font loading

---

### Edge Cases

- What happens when a developer accidentally imports from a deleted shadcn/ui file? The import will fail at compile time — this is intentional and will be caught when components are migrated in Spec 002.
- What happens if yarn.lock conflicts with an existing pnpm-lock.yaml? Both lockfiles should not coexist; pnpm-lock.yaml must be deleted first.
- What happens to CSS custom properties defined in theme.css? They should be preserved as they provide useful design tokens that the MUI theme can reference.
- What happens to the `figmaAssetResolver()` Vite plugin? It must be kept — it resolves Figma asset imports used by existing components.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project MUST use yarn as the sole package manager with a yarn.lock file and no pnpm artifacts
- **FR-002**: The project MUST have zero Tailwind CSS dependencies (@tailwindcss/vite, tailwindcss, tw-animate-css, tailwind-merge removed from package.json)
- **FR-003**: The project MUST have zero shadcn/ui component files (entire src/app/components/ui/ directory deleted)
- **FR-004**: The project MUST have zero @radix-ui/* dependencies (all 20+ packages removed)
- **FR-005**: The project MUST remove unused dependencies: recharts, react-dnd, react-dnd-html5-backend, react-slick, react-hook-form, canvas-confetti, react-popper, @popperjs/core, react-responsive-masonry, react-router, next-themes, clsx, class-variance-authority, cmdk, input-otp, vaul, sonner, react-day-picker, embla-carousel-react, react-resizable-panels
- **FR-006**: The project MUST delete dead files: InfoPanels.tsx, globals.css, default_shadcn_theme.css, postcss.config.mjs, pnpm-workspace.yaml, src/styles/tailwind.css
- **FR-007**: The project MUST create src/app/theme/muiTheme.ts with a dark emerald/gold palette (primary: #D4AF37, background: #0a1f0a, text: white/gray-400)
- **FR-008**: The project MUST create src/app/theme/ThemeProviderWrapper.tsx that provides ThemeProvider + CssBaseline + Emotion cache
- **FR-009**: The project MUST update main.tsx to wrap the app in ThemeProviderWrapper
- **FR-010**: The project MUST update vite.config.ts to remove the Tailwind CSS plugin and keep only @vitejs/plugin-react
- **FR-011**: The project MUST keep these dependencies: @mui/material, @mui/icons-material, @emotion/react, @emotion/styled, motion, lucide-react, date-fns
- **FR-012**: The project MUST keep the figmaAssetResolver() Vite plugin for resolving Figma asset imports
- **FR-013**: Google Fonts (Open Sans, Noto Naskh Arabic) MUST be loaded via link tags in index.html or MUI CssBaseline, replacing the CSS @import approach

### Key Entities

- **MUI Theme**: Centralized design configuration containing palette (dark emerald/gold), typography (Open Sans, Noto Naskh Arabic), component overrides for the mosque display aesthetic
- **ThemeProviderWrapper**: React component that wraps the app tree with MUI ThemeProvider, CssBaseline (dark mode), and Emotion CacheProvider

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The project has exactly 9 production dependencies (down from 50+) plus 2 dev dependencies
- **SC-002**: Running `yarn install` completes without errors and generates a valid yarn.lock
- **SC-003**: The shadcn/ui directory (48 files) is completely removed — zero .tsx files remain in src/app/components/ui/
- **SC-004**: The MUI theme renders with correct dark palette when the app loads (verifiable by inspecting CSS custom properties or MUI theme in browser DevTools)
- **SC-005**: No Tailwind CSS artifacts remain — searching for "tailwind" in package.json returns zero results
- **SC-006**: The Vite dev server starts without plugin errors (component render errors are acceptable at this phase)

## Assumptions

- The application components (Header, PrayerCard, etc.) will be visually broken after this phase because Tailwind utility classes are removed — this is expected and will be fixed in Spec 002
- The Vite build may produce TypeScript errors due to missing Tailwind types — this is acceptable at this phase
- The CSS custom properties in theme.css will be preserved as they may be referenced by the MUI theme or future components
- The src/app/components/figma/ImageWithFallback.tsx file will be kept as it may be used by future components
- The `motion` library (Framer Motion) is kept because 8+ components use it for animations
- The `lucide-react` library is kept because components use icons not available in @mui/icons-material (Sunrise, Sunset, CalendarClock, Languages)
- The `date-fns` library is kept for future Hijri date calculation and date formatting
- The app will not be visually functional until Spec 002 completes the MUI component migration
