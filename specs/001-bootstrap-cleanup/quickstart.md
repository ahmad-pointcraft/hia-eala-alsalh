# Quickstart: Bootstrap & Cleanup — MUI Migration Phase 0

**Branch**: `001-bootstrap-cleanup` | **Date**: 2026-05-08

## Prerequisites

- Node.js 18+ installed
- Git initialized (already done)
- Repository on branch `001-bootstrap-cleanup`

## Setup Steps

```bash
# 1. Switch to feature branch
git checkout 001-bootstrap-cleanup

# 2. Enable Yarn via corepack
corepack enable
corepack prepare yarn@stable --activate

# 3. Install dependencies (after cleanup is applied)
yarn install

# 4. Verify build (component errors expected — only Vite config must work)
yarn build
```

## Expected Behavior After Phase 0

### What Works
- `yarn install` completes successfully
- `yarn dev` starts the Vite dev server without plugin errors
- MUI ThemeProvider wraps the app tree
- Dark emerald/gold theme is applied via CssBaseline
- Google Fonts (Open Sans 300–700, Noto Naskh Arabic 400–700) load via CDN with `display=swap`

### What's Broken (Expected)
- Application components will have TypeScript errors:
  - They reference deleted `src/app/components/ui/` imports
  - They use Tailwind CSS class names that no longer exist
  - They import from deleted CSS files
- `yarn build` will produce TypeScript compilation errors in component files
- The app will NOT render in the browser
- `figma/ImageWithFallback.tsx` uses Tailwind classes that will break

### What's Next
- **Spec 002**: MUI Component Migration — migrates all components from Tailwind/shadcn to MUI

## Verification Checklist

```bash
# Verify yarn is the package manager
cat .yarnrc.yml  # Should show: nodeLinker: node-modules

# Verify clean dependency tree
grep -c "tailwind" package.json  # Should be: 0
grep -c "radix" package.json    # Should be: 0

# Verify shadcn/ui is gone
ls src/app/components/ui/ 2>&1 | grep "No such file"  # Should succeed

# Verify MUI theme exists
head -3 src/app/theme/muiTheme.ts  # Should show createTheme import

# Verify tsconfig strict mode
grep "strict" tsconfig.json  # Should show: "strict": true

# Verify tsconfig.node.json exists
cat tsconfig.node.json  # Should show Vite config TS settings
```

## Key Files Created

| File | Purpose |
|------|---------|
| `.yarnrc.yml` | Yarn Berry configuration (nodeLinker: node-modules) |
| `tsconfig.json` | TypeScript strict config with @/* path alias |
| `tsconfig.node.json` | TypeScript config for Vite |
| `src/app/theme/muiTheme.ts` | MUI theme (dark emerald/gold) |
| `src/app/theme/ThemeProviderWrapper.tsx` | ThemeProvider + CssBaseline wrapper |

## Key Files Modified

| File | Change |
|------|--------|
| `package.json` | Removed ~48 deps, added packageManager field, react/react-dom as peers |
| `vite.config.ts` | Removed Tailwind plugin, kept figmaAssetResolver + react |
| `src/main.tsx` | Removed CSS import, wrapped App in ThemeProviderWrapper |
| `index.html` | Added Google Fonts link tags (weights + display=swap) |
| `.gitignore` | Added yarn artifact entries |

## Key Files Deleted

| File/Directory | Reason |
|----------------|--------|
| `src/app/components/ui/` (48 files) | shadcn/ui components |
| `src/styles/` (5 files) | Tailwind CSS files |
| `postcss.config.mjs` | Tailwind PostCSS config |
| `default_shadcn_theme.css` | shadcn theme duplicate |
| `src/app/components/InfoPanels.tsx` | Dead component (no imports) |
| `pnpm-workspace.yaml` | Switching to yarn |

## Dependency Count After Cleanup

| Category | Count | Packages |
|----------|-------|----------|
| Production dependencies | 7 | @mui/material, @mui/icons-material, @emotion/react, @emotion/styled, motion, lucide-react, date-fns |
| Peer dependencies | 2 | react, react-dom (optional) |
| Dev dependencies | 3 | typescript, @vitejs/plugin-react, vite |
