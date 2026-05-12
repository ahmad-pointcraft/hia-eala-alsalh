# Quickstart: Centralized Theme Token System

**Date**: 2026-05-11 | **Branch**: `006-theme-token-system`

## Overview

This guide shows how to use the centralized token system after migration is complete.

## Using Tokens in Components

### Strategy 1: Theme Palette (sx props)

Use this when the `sx` prop callback is available — the most common case.

```tsx
<Box sx={(theme) => ({ color: theme.palette.gold.main })}>
<Box sx={(theme) => ({ borderColor: theme.palette.border.medium })}>
<Box sx={(theme) => ({ bgcolor: theme.palette.surface.deep })}>
```

### Strategy 2: Direct Token Import (SVG, style, motion)

Use this when the theme object is not available.

```tsx
import { colors } from "../theme/tokens";

<svg stroke={colors.gold.main}>
<div style={{ background: `linear-gradient(${colors.gold.main}, ${colors.gold.light})` }}>
<motion.div style={{ boxShadow: `0 0 10px ${colors.glow.medium}` }}>
```

### Strategy 3: currentColor (SVG inside MUI components)

Use this when an SVG element is nested inside a MUI component that sets the color.

```tsx
<Button sx={{ color: (t) => t.palette.gold.main }}>
  <svg><path stroke="currentColor" /></svg>
</Button>
```

## Adding a New Color

1. Add the value to the appropriate namespace in `src/app/theme/tokens.ts`
2. If it's a new namespace property, update the Palette augmentation in `src/app/theme/muiTheme.ts`
3. If it's a new namespace, add the assignment: `muiTheme.palette.newNamespace = colors.newNamespace;`

## Changing an Existing Color

1. Edit the single value in `src/app/theme/tokens.ts`
2. All components automatically render the new color

## Verification Commands

```bash
# Zero hardcoded hex in components
grep -rE '#[0-9a-fA-F]{3,8}' src/app/components/ src/app/App.tsx

# Zero hardcoded rgba in components
grep -rE 'rgba\(' src/app/components/ src/app/App.tsx

# Zero CSS color keywords
grep -rE '"(black|white)"' src/app/components/

# Production build
yarn build
```
