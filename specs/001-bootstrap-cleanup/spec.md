# Feature Specification: Bootstrap & Cleanup — MUI Migration Phase 0

**Feature Branch**: `001-bootstrap-cleanup`  
**Created**: 2026-05-07  
**Status**: Clarified
**Input**: User description: "Complete Phase 0 — Bootstrap & Cleanup for the Masjid Prayer Time Display app. Greenfield migration from Tailwind CSS + shadcn/ui to MUI v7 only."

## Clarifications

### Session 2026-05-07

- Q: Yarn Classic (v1) or Yarn Berry (v2+)? → A: Yarn Berry (v4+) with `nodeLinker: node-modules` in `.yarnrc.yml` for Vite/MUI compatibility
- Q: Font loading via @fontsource or Google Fonts CDN? → A: Google Fonts CDN in index.html with preconnect hints for performance
- Q: Delete all files in src/styles/ or preserve some? → A: Delete ALL files in src/styles/ — MUI handles all styling via ThemeProvider and CssBaseline; the index.css import in main.tsx is replaced with MUI imports
- Q: Broken build after removing shadcn/Tailwind acceptable? → A: Yes. Phase 0 is intentionally a "clean slate" phase. The app will not compile until Spec 002 migrates components to MUI
- Q: Preserve any custom font loading from fonts.css? → A: No. All font loading moves to index.html via Google Fonts `<link>` tags. Delete fonts.css entirely
- Q: Check in .yarnrc.yml and .yarn/ directory? → A: Check in .yarnrc.yml. Add .yarn/install-state.gz and .yarn/cache to .gitignore (zero-install pattern not used)
- Q: Does pnpm-lock.yaml exist to delete? → A: If it exists, delete it. If not (only pnpm-workspace.yaml), delete the workspace file only
- Q: Add or modify tsconfig.json? → A: If none exists, create minimal one with `strict: true`. If one exists, verify `strict: true` is set. No other compiler option changes
- Q: Keep figmaAssetResolver plugin in vite.config.ts? → A: Keep it. Only remove the Tailwind plugin
- Q: Pin MUI/Emotion to exact versions or use ranges? → A: Keep exact versions (MUI 7.3.5, Emotion 11.14.0/11.14.1) for reproducible builds

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Clean Dependency Foundation (Priority: P1)

As a developer setting up this project, I want all unnecessary dependencies removed and a single package manager (yarn) established so that the project starts from a clean, maintainable baseline with only the libraries actually used.

**Why this priority**: Without a clean dependency tree, every subsequent spec builds on a bloated foundation. Removing ~40 unused packages reduces bundle size, install time, and confusion about what the project actually uses.

**Independent Test**: Can be fully tested by running `yarn install` successfully and verifying `package.json` contains only 12 production dependencies. Running `yarn build` should still invoke Vite (even if it fails on Tailwind-less components — that is expected).

**Acceptance Scenarios**:

1. **Given** the project has pnpm-workspace.yaml and 50+ dependencies, **When** the developer runs the cleanup, **Then** pnpm artifacts are deleted, yarn.lock is generated, and only MUI/React/motion/lucide-react/date-fns dependencies remain
2. **Given** 48 shadcn/ui component files exist in src/app/components/ui/, **When** the cleanup runs, **Then** the entire ui/ directory is deleted along with all @radix-ui/\* packages
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
3. **Given** src/styles/ contains tailwind.css, fonts.css, globals.css, theme.css, and index.css, **When** the cleanup runs, **Then** the entire src/styles/ directory is emptied/deleted; font loading moves to Google Fonts CDN in index.html

---

### Edge Cases

- What happens when a developer accidentally imports from a deleted shadcn/ui file? The import will fail at compile time — this is intentional and will be caught when components are migrated in Spec 002.
- What happens if yarn.lock conflicts with an existing pnpm-lock.yaml? Both lockfiles should not coexist; pnpm-lock.yaml must be deleted first.
- What happens to CSS custom properties defined in theme.css? They are deleted — the MUI theme in muiTheme.ts will define equivalent values via the theme palette.
- What happens to the `figmaAssetResolver()` Vite plugin? It must be kept — it resolves Figma asset imports used by existing components.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The project MUST use Yarn Berry (v4+) as the sole package manager with `nodeLinker: node-modules` in `.yarnrc.yml`, a valid yarn.lock, and no pnpm artifacts. The `packageManager` field in package.json MUST be set to the latest stable Yarn Berry version (e.g., `yarn@4.9.2`). The `pnpm` overrides field MUST be removed from package.json
- **FR-002**: The project MUST have zero Tailwind CSS dependencies (@tailwindcss/vite, tailwindcss, tw-animate-css, tailwind-merge removed from package.json)
- **FR-003**: The project MUST have zero shadcn/ui component files (entire src/app/components/ui/ directory deleted)
- **FR-004**: The project MUST have zero @radix-ui/* dependencies (all 26 packages removed)
- **FR-005**: The project MUST remove unused dependencies: recharts, react-dnd, react-dnd-html5-backend, react-slick, react-hook-form, canvas-confetti, react-popper, @popperjs/core, react-responsive-masonry, react-router, next-themes, clsx, class-variance-authority, cmdk, input-otp, vaul, sonner, react-day-picker, embla-carousel-react, react-resizable-panels. The project MUST also remove the `pnpm` field (overrides section) from package.json
- **FR-006**: The project MUST delete all files in src/styles/ (tailwind.css, globals.css, theme.css, fonts.css, index.css) and delete dead files: InfoPanels.tsx, default_shadcn_theme.css, postcss.config.mjs, pnpm-workspace.yaml
- **FR-007**: The project MUST create src/app/theme/muiTheme.ts with a dark emerald/gold palette (primary: #D4AF37, background: #0a1f0a, text: white/#9ca3af), including typography configuration (Open Sans, Noto Naskh Arabic) and baseline component overrides (CssBaseline, Paper, Card, Button, Chip, Divider) via module augmentation for extended palette types
- **FR-008**: The project MUST create src/app/theme/ThemeProviderWrapper.tsx that provides ThemeProvider + CssBaseline. No explicit Emotion CacheProvider is needed — MUI v7 auto-manages the Emotion cache internally
- **FR-009**: The project MUST update main.tsx to remove the `import "./styles/index.css"` CSS import and wrap the app in ThemeProviderWrapper
- **FR-010**: The project MUST update vite.config.ts to remove the Tailwind CSS plugin, keeping both @vitejs/plugin-react and the figmaAssetResolver() plugin
- **FR-011**: The project MUST keep these dependencies: @mui/material, @mui/icons-material, @emotion/react, @emotion/styled, motion, lucide-react, date-fns. React and react-dom MUST remain as peerDependencies (with `optional: true` in peerDependenciesMeta)
- **FR-012**: The project MUST keep the figmaAssetResolver() Vite plugin for resolving Figma asset imports
- **FR-013**: Google Fonts (Open Sans, Noto Naskh Arabic) MUST be loaded via `<link>` tags in index.html with preconnect hints, replacing the CSS @import approach. The Google Fonts URL MUST include weights 300;400;500;600;700 for Open Sans and 400;500;600;700 for Noto Naskh Arabic, with `display=swap`
- **FR-014**: All dependencies MUST use exact pinned versions for reproducible builds: MUI (7.3.5), Emotion (11.14.0/11.14.1), motion, lucide-react, date-fns, vite, typescript, @vitejs/plugin-react
- **FR-015**: The project MUST have a tsconfig.json with `strict: true` enabled, plus `noUnusedLocals`, `noUnusedParameters`, and `noUncheckedIndexedAccess` (create if missing, verify if existing). A companion tsconfig.node.json MUST also be created for Vite configuration
- **FR-016**: The project MUST add .yarn/install-state.gz and .yarn/cache to .gitignore while checking in .yarnrc.yml

### Key Entities

- **MUI Theme**: Centralized design configuration containing palette (dark emerald/gold), typography (Open Sans, Noto Naskh Arabic), component overrides for the mosque display aesthetic
- **ThemeProviderWrapper**: React component that wraps the app tree with MUI ThemeProvider and CssBaseline (dark mode). No explicit Emotion CacheProvider needed (MUI v7 auto-manages)

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: The project has exactly 7 production dependencies (down from 55+), react/react-dom as peerDependencies, and 3 dev dependencies (typescript, @vitejs/plugin-react, vite)
- **SC-002**: Running `yarn install` completes without errors and generates a valid yarn.lock
- **SC-003**: The shadcn/ui directory (48 files) is completely removed — zero .tsx files remain in src/app/components/ui/
- **SC-004**: The MUI theme renders with correct dark palette when the app loads (verifiable by inspecting CSS custom properties or MUI theme in browser DevTools)
- **SC-005**: No Tailwind CSS artifacts remain — searching for "tailwind" in package.json returns zero results
- **SC-006**: The Vite dev server starts without plugin errors (component render errors are acceptable at this phase)
- **SC-007**: tsconfig.json exists with `strict: true` enabled
- **SC-008**: .yarnrc.yml exists with `nodeLinker: node-modules` and is tracked in git

## Assumptions

- The application components (Header, PrayerCard, etc.) will not compile after this phase because Tailwind utility classes and shadcn imports are removed — this is intentionally a "clean slate" phase. The app will not be functional until Spec 002 migrates components to MUI
- The Vite build WILL produce TypeScript errors after this phase — this is acceptable and expected
- All files in src/styles/ are deleted (tailwind.css, globals.css, theme.css, fonts.css, index.css) — MUI handles all styling via ThemeProvider and CssBaseline
- The CSS custom properties in theme.css are NOT preserved — they are deleted along with the rest of src/styles/. The MUI theme will define equivalent values
- The src/app/components/figma/ImageWithFallback.tsx file will be kept as it may be used by future components. It currently uses Tailwind classes (inline-block, bg-gray-100, flex, etc.) — these will break after cleanup and will be migrated to MUI in Spec 002
- The figmaAssetResolver() Vite plugin is kept — only the Tailwind plugin is removed
- MUI and Emotion versions are pinned exactly (7.3.5 / 11.14.0 / 11.14.1) for reproducible builds
- Yarn Berry v4+ with nodeLinker: node-modules is used (not Yarn Classic, not PnP)
- .yarnrc.yml is checked in; .yarn/cache and .yarn/install-state.gz are gitignored
