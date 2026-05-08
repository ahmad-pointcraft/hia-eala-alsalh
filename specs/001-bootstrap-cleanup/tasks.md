# Tasks: Bootstrap & Cleanup — MUI Migration Phase 0

**Input**: Design documents from `specs/001-bootstrap-cleanup/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: No test tasks — testing infrastructure is deferred to Spec 004. Verification is via build checks and grep audits.

**Organization**: Tasks are grouped by execution order, then mapped to user stories. Groups must execute sequentially (A→B→C→D→E→F). Within each group, tasks marked [P] can run in parallel.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup — Package Manager Switch (Group A)

**Purpose**: Switch from pnpm to Yarn Berry, establish clean package manager baseline

- [x] T001 Delete `pnpm-workspace.yaml` and `pnpm-lock.yaml` (if exists) from project root
- [x] T002 Remove `pnpm` field and `pnpm` overrides section from `package.json`, set `packageManager` field to `"yarn@4.9.2"` in `package.json`
- [x] T003 Create `.yarnrc.yml` with `nodeLinker: node-modules` at project root; append yarn entries (`.yarn/*`, `!.yarn/patches`, `!.yarn/releases`, `.pnp.*`) to `.gitignore`

**Checkpoint**: pnpm artifacts removed, yarn config ready

---

## Phase 2: Foundational — Dead File Deletion (Group B)

**Purpose**: Remove all dead code before dependency cleanup — prevents phantom imports

**⚠️ CRITICAL**: All tasks in this phase can run in parallel (different files, no dependencies)

- [x] T004 [P] [US3] Delete entire `src/app/components/ui/` directory (48 shadcn component files)
- [x] T005 [P] [US3] Delete entire `src/styles/` directory (5 files: tailwind.css, fonts.css, theme.css, index.css, globals.css)
- [x] T006 [P] [US3] Delete `postcss.config.mjs` from project root
- [x] T007 [P] [US3] Delete `default_shadcn_theme.css` from project root
- [x] T008 [P] [US3] Delete `src/app/components/InfoPanels.tsx`

**Checkpoint**: All dead files removed, only active source files remain

---

## Phase 3: User Story 1 — Clean Dependency Foundation (Group C) (Priority: P1) 🎯 MVP

**Goal**: Remove ~48 unused dependencies, generate fresh yarn.lock with only kept packages

**Independent Test**: Run `yarn install` successfully; verify `package.json` contains only 7 production deps + react/react-dom as peers + 3 dev deps

### Implementation for User Story 1

- [x] T009 [US1] Remove all dead dependencies from `package.json` — delete: @tailwindcss/vite, tailwindcss, tw-animate-css, tailwind-merge, all 26 @radix-ui/react-\* packages, class-variance-authority, cmdk, input-otp, vaul, sonner, react-day-picker, embla-carousel-react, react-resizable-panels, recharts, react-dnd, react-dnd-html5-backend, react-slick, react-hook-form, canvas-confetti, react-popper, @popperjs/core, react-responsive-masonry, react-router, next-themes, clsx. Keep: @mui/material, @mui/icons-material, @emotion/react, @emotion/styled, motion, lucide-react, date-fns (as dependencies), react/react-dom (as peerDependencies with optional: true), @vitejs/plugin-react, typescript, vite (as devDependencies)
- [x] T010 [US1] Run `corepack enable && corepack prepare yarn@stable --activate && yarn install` to generate fresh `yarn.lock`

**Checkpoint**: Clean dependency tree — `yarn install` succeeds, package.json has 7 prod deps

---

## Phase 4: User Story 1 continued — Build Configuration (Group D)

**Goal**: Clean Vite config to remove Tailwind plugin

**Independent Test**: Vite dev server starts without plugin errors

- [x] T011 [US1] Update `vite.config.ts` — remove `import tailwindcss from "@tailwindcss/vite"` import and `tailwindcss()` from plugins array; keep `figmaAssetResolver()` and `react()` plugins

**Checkpoint**: Vite config clean — only figmaAssetResolver + react plugins remain

---

## Phase 5: User Story 2 — MUI Theme Foundation (Group E) (Priority: P2)

**Goal**: Create centralized MUI theme and provider wrapping the app tree

**Independent Test**: Import theme in a test file, verify palette contains primary: #D4AF37, background: #0a1f0a; wrapping component in ThemeProviderWrapper renders with dark mode

### Implementation for User Story 2

- [x] T012 [P] [US2] Create `src/app/theme/muiTheme.ts` with dark emerald/gold palette (primary: #D4AF37, background: #0a1f0a, text: white/#9ca3af), typography (Open Sans + Noto Naskh Arabic), component overrides (CssBaseline, Paper, Card, Button, Chip, Divider), custom gold palette extension via module augmentation
- [x] T013 [P] [US2] Create `src/app/theme/ThemeProviderWrapper.tsx` — React component accepting `children: ReactNode`, wrapping with `<ThemeProvider theme={muiTheme}>` + `<CssBaseline enableColorScheme />` (no explicit Emotion CacheProvider — MUI v7 auto-manages)
- [x] T014 [US2] Update `src/main.tsx` — remove `import "./styles/index.css"`, add `import ThemeProviderWrapper from './app/theme/ThemeProviderWrapper'`, wrap `<App />` with `<ThemeProviderWrapper>`
- [x] T015 [US2] Update `index.html` — add `<link rel="preconnect" href="https://fonts.googleapis.com">`, `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`, and Google Fonts CSS link for `Open Sans:wght@300;400;500;600;700` + `Noto+Naskh+Arabic:wght@400;500;600;700` with `display=swap`

**Checkpoint**: MUI theme infrastructure complete — theme exports valid object, provider wraps app

---

## Phase 6: User Story 3 — Dead Code Elimination Verification (Group F) (Priority: P3)

**Goal**: Verify all dead code removed, build config works, commit

**Independent Test**: grep audit returns clean; `yarn build` runs (component errors acceptable)

### Implementation for User Story 3

- [ ] T016 [US3] Verify no Tailwind/Radix/shadcn references remain — run `grep -rn "tailwind\|@tailwindcss\|@radix-ui\|shadcn\|from.*['\"]clsx['\"]\|from.*['\"]tailwind-merge['\"]" src/ --include="*.ts" --include="*.tsx"` (should return CLEAN or only match ImageWithFallback.tsx which is expected). Also verify all dependency versions in package.json are exact-pinned (no ranges like `^` or `~`)
- [ ] T017 [US3] Verify `yarn build` runs — Vite config must work without plugin errors; TypeScript errors in component files are expected and acceptable
- [ ] T018 [US3] Create `tsconfig.json` at project root with strict TypeScript config (target ES2020, moduleResolution bundler, jsx react-jsx, strict: true, noUnusedLocals, noUnusedParameters, noUncheckedIndexedAccess, path alias @/_→ ./src/_)
- [ ] T019 [US3] Create `tsconfig.node.json` at project root with Vite config TypeScript settings (target ES2022, moduleResolution bundler, include vite.config.ts)

**Checkpoint**: All dead code verified removed, build infrastructure works

---

## Phase 7: Polish & Commit

**Purpose**: Final atomic commit of all Phase 0 changes

- [ ] T020 Stage all changes and commit as single atomic commit with message `feat(001): Phase 0 — bootstrap cleanup and MUI theme setup`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Group A)**: No dependencies — start immediately
- **Phase 2 (Group B)**: No dependency on Phase 1 (different files) but logically follows
- **Phase 3 (Group C)**: Depends on Phase 1 (yarn config) and Phase 2 (dead files removed before deps cleaned)
- **Phase 4 (Group D)**: Can run after Phase 2 (Tailwind files deleted)
- **Phase 5 (Group E)**: Can run after Phase 2 (CSS deleted) — independent of C/D
- **Phase 6 (Group F)**: Depends on all prior phases
- **Phase 7 (Commit)**: Depends on Phase 6 verification passing

### User Story Dependencies

- **US1 (P1)**: Clean Dependency Foundation — Groups A, C, D
- **US2 (P2)**: MUI Theme Foundation — Group E
- **US3 (P3)**: Dead Code Elimination — Groups B, F

### Within Each Group

- **Group A**: Sequential (T001→T002→T003)
- **Group B**: All parallel (T004–T008)
- **Group C**: Sequential (T009→T010)
- **Group D**: Single task (T011)
- **Group E**: T012+T013 parallel, then T014, then T015
- **Group F**: T016+T017+T018+T019 parallel, then T020

### Parallel Opportunities

```bash
# Phase 2: All dead file deletions in parallel
Task: "Delete src/app/components/ui/"
Task: "Delete src/styles/"
Task: "Delete postcss.config.mjs"
Task: "Delete default_shadcn_theme.css"
Task: "Delete InfoPanels.tsx"

# Phase 5: Theme file creation in parallel
Task: "Create src/app/theme/muiTheme.ts"
Task: "Create src/app/theme/ThemeProviderWrapper.tsx"

# Phase 6: Verification + tsconfig creation in parallel
Task: "Grep audit for leftover references"
Task: "Run yarn build"
Task: "Create tsconfig.json"
Task: "Create tsconfig.node.json"
```

---

## Implementation Strategy

### Sequential Execution (Single Developer)

1. Phase 1 (Group A): Switch package manager → **Checkpoint**: yarn config ready
2. Phase 2 (Group B): Delete dead files → **Checkpoint**: dead code gone
3. Phase 3 (Group C): Clean dependencies → **Checkpoint**: yarn install succeeds
4. Phase 4 (Group D): Clean Vite config → **Checkpoint**: no plugin errors
5. Phase 5 (Group E): Create MUI theme → **Checkpoint**: theme wraps app
6. Phase 6 (Group F): Verify + tsconfig → **Checkpoint**: all checks pass
7. Phase 7: Commit all changes atomically

### MVP Scope

Phase 0 is a single atomic unit — all phases must complete together. The "MVP" is the entire cleanup. No partial state should be committed.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- App will NOT compile after Phase 0 — this is intentional (Spec 002 fixes components)
- ImageWithFallback.tsx uses Tailwind classes — will break, fixed in Spec 002
- No test framework in this spec — testing infrastructure deferred to Spec 004
- Single atomic commit at end — no intermediate commits during Phase 0
- `pnpm-lock.yaml` does NOT exist in the repo (audit confirmed) — only pnpm-workspace.yaml needs deletion
- `globals.css` is empty (0 bytes) — safe to delete with rest of src/styles/
