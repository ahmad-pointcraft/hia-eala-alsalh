# Research: Bootstrap & Cleanup — MUI Migration Phase 0

**Branch**: `001-bootstrap-cleanup` | **Date**: 2026-05-08

## Research Tasks

All items were resolved during `/speckit.clarify` and the 40-item checklist validation. This document consolidates the research findings for key technical decisions.

---

### R1: Package Manager — Yarn Berry v4+ with node-modules linker

**Decision**: Use Yarn Berry (v4+) with `nodeLinker: node-modules` in `.yarnrc.yml`.

**Rationale**: Yarn Berry v4+ is the modern standard. The `nodeLinker: node-modules` mode provides maximum compatibility with Vite, MUI, and Emotion — all of which expect traditional `node_modules` resolution. Plug'n'Play (PnP) mode causes issues with some packages that expect `node_modules` to exist.

**Alternatives Considered**:
- Yarn Classic (v1): Deprecated, lacks modern features like constraints and caching
- Yarn Berry PnP: Faster installs but incompatible with packages using `require.resolve()` patterns
- pnpm: Currently in project but project standardizes on yarn per constitution Article III
- npm: Explicitly excluded by constitution

---

### R2: Font Loading — Google Fonts CDN in index.html

**Decision**: Load Open Sans (weights 300–700) and Noto Naskh Arabic (weights 400–700) via Google Fonts CDN `<link>` tags in `index.html` with preconnect hints and `display=swap`.

**Rationale**: Google Fonts CDN provides automatic font updates, global CDN caching, and zero bundle size impact. Preconnect hints (`<link rel="preconnect">`) ensure fast loading. The `display=swap` parameter prevents FOIT (Flash of Invisible Text). The kiosk display will cache fonts after first load.

**Alternatives Considered**:
- @fontsource npm packages: Increases bundle size, requires version updates manually. Deferred to Spec 005 if offline requirements demand it.
- Self-hosted font files: Maximum control but requires font file management.
- CSS @import in stylesheets: Current approach (being removed). Render-blocking, no preconnect support, slower.

---

### R3: CSS Cleanup — Delete all of src/styles/

**Decision**: Delete the entire `src/styles/` directory (5 files: tailwind.css, globals.css, theme.css, fonts.css, index.css).

**Rationale**: MUI v7's `CssBaseline` component handles global resets and dark mode defaults. MUI's `ThemeProvider` manages all design tokens. No CSS files are needed — all component styling uses the `sx` prop or `styled()` API per constitution Article VII.

**Alternatives Considered**:
- Preserve theme.css and convert CSS custom properties: Unnecessary duplication. MUI theme is the single source of truth per constitution Article III.
- Keep index.css as empty file: Dead code, violates Article IV.

---

### R4: Broken Build Acceptability

**Decision**: Accept that the app will not compile after Phase 0. This is intentional.

**Rationale**: Phase 0 removes Tailwind CSS utility classes and shadcn/ui components that existing application components depend on. Application components use Tailwind class names in their `className` props and import from `src/app/components/ui/`. These will break at compile time. This is acceptable because:
1. Phase 0 is explicitly a "clean slate" phase
2. Spec 002 migrates all components to MUI
3. Broken imports are caught at compile time, not runtime
4. The MUI theme infrastructure must exist before component migration can begin

**Alternatives Considered**:
- Migrate components simultaneously: Violates single-responsibility principle for specs.
- Keep shadcn/ui until components are migrated: Defeats the purpose of clean slate — dead code remains.

---

### R5: Vite Plugin — Keep figmaAssetResolver

**Decision**: Keep the `figmaAssetResolver()` Vite plugin. Only remove the Tailwind plugin (`@tailwindcss/vite`).

**Rationale**: The `figmaAssetResolver()` plugin resolves `figma:asset/` import paths used by existing components (e.g., `ImageWithFallback.tsx`). It is a custom plugin specific to this project's Figma export pipeline. Removing it would break asset imports. Audit confirms exactly 3 plugins exist: figmaAssetResolver(), react(), tailwindcss().

**Alternatives Considered**:
- Remove and replace imports: Premature — asset path migration belongs in Spec 002.
- Refactor plugin: No need — it works correctly as-is.

---

### R6: TypeScript Configuration — tsconfig.json + tsconfig.node.json

**Decision**: Create `tsconfig.json` with `strict: true` and standard Vite/React settings. Create companion `tsconfig.node.json` for Vite config. No tsconfig.json currently exists.

**Rationale**: The project has no `tsconfig.json` (Figma export didn't include one). TypeScript strict mode is required by constitution Article II. The configuration follows Vite's recommended setup for React + TypeScript projects.

**Key compiler options**:
- `strict: true` — enables all strict type-checking options
- `noUnusedLocals: true` — prevents dead code accumulation
- `noUnusedParameters: true` — catches unused function parameters
- `noUncheckedIndexedAccess: true` — requires null checks on indexed values
- `jsx: "react-jsx"` — modern JSX transform (no React import needed)
- `moduleResolution: "bundler"` — Vite-compatible module resolution
- Path alias `@/* → ./src/*` per constitution Article IX

---

### R7: Version Pinning Strategy

**Decision**: Pin MUI and Emotion to exact versions (7.3.5, 11.14.0, 11.14.1). Pin all other kept dependencies to existing exact versions.

**Rationale**: Exact versions ensure reproducible builds across environments. This is critical for a kiosk display that runs 24/7 — version drift could introduce visual or behavioral changes.

---

### R8: MUI Theme — Dark Emerald/Gold Kiosk Palette

**Decision**: Create a dark theme with emerald green background (#0a1f0a) and gold accent (#D4AF37) reflecting the mosque's aesthetic. No explicit Emotion CacheProvider — MUI v7 auto-manages the Emotion cache internally.

**Rationale**: MUI v7's ThemeProvider handles Emotion cache automatically. Adding an explicit CacheProvider is unnecessary and could cause dual-cache issues. The color palette is drawn from the original Figma design's CSS custom properties.

---

### R9: react/react-dom as peerDependencies

**Decision**: Move react and react-dom to `peerDependencies` with `optional: true` in `peerDependenciesMeta`.

**Rationale**: This is the standard pattern for libraries and avoids version conflicts. The `optional: true` flag prevents install failures when react is not explicitly installed. Vite and MUI resolve react from the project's node_modules.

---

### R10: ImageWithFallback.tsx — Known Breakage

**Decision**: Keep the file but document that it uses Tailwind classes (inline-block, bg-gray-100, flex, items-center, justify-center, w-full, h-full) that will break after cleanup. Migration deferred to Spec 002.

**Rationale**: The file is in `src/app/components/figma/` and may be used by future components. Deleting it would lose the fallback logic. The Tailwind breakage is caught at compile time and fixed in Spec 002 alongside other component migrations.

---

## Resolved Clarifications Summary

All 10 clarification questions from `/speckit.clarify` are resolved. See [spec.md](./spec.md) § Clarifications for full details. All 40 checklist items from the migration-readiness checklist are resolved. See [checklists/migration-readiness.md](./checklists/migration-readiness.md).
