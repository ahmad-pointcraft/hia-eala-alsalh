# Quickstart: MUI Component Migration

**Feature**: 002-mui-component-migration  
**Date**: 2026-05-09

## Prerequisites

- Node.js 18+ installed
- Yarn 4.9.2 (via corepack)
- All MUI dependencies already installed (Spec 001 completed)

## Setup

```bash
cd /Users/elshowair/code/pointcraft/Masjid\ Prayer\ Time\ Display
yarn install
yarn dev    # Start dev server at http://localhost:5173
```

## Migration Workflow

### 1. Pick a Component

Start with any independent component (T001–T014 are parallelizable):

```bash
# Open the component
code src/app/components/Header.tsx
```

### 2. Apply the Migration Pattern

For each component, follow this 5-step pattern:

```typescript
// Step 1: Replace HTML imports with MUI
// BEFORE:
// (just using <div>, <span>, <button>)

// AFTER:
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';

// Step 2: Replace Tailwind className with MUI sx
// BEFORE:
<div className="w-full bg-black/40 backdrop-blur-sm border-b border-[#D4AF37]/30 px-[20px] py-[10px]">

// AFTER:
<AppBar
  position="static"
  sx={{
    bgcolor: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(4px)',
    borderBottom: '1px solid rgba(212,175,55,0.3)',
    paddingInline: '20px',
    py: '10px',
    boxShadow: 'none',
  }}
>

// Step 3: Replace style={{ fontFamily }} with sx
// BEFORE:
<div style={{ fontFamily }}>text</div>

// AFTER:
<Typography sx={{ fontFamily }}>text</Typography>

// Step 4: Replace icon imports where applicable
// BEFORE:
import { Cloud } from 'lucide-react';

// AFTER:
import { Cloud } from '@mui/icons-material';

// Step 5: Add dir prop on root element
<AppBar dir={language === 'ar' ? 'rtl' : 'ltr'}>
```

### 3. Verify

```bash
# Type check
yarn typecheck

# Build
yarn build

# Visual check
yarn dev
# Open http://localhost:5173 and verify EN + AR modes
```

## Key Patterns

### Tailwind → MUI sx Cheat Sheet

| Tailwind                     | MUI sx                                          |
| ---------------------------- | ----------------------------------------------- |
| `bg-black/30`                | `bgcolor: 'rgba(0,0,0,0.3)'`                    |
| `text-[#D4AF37]`             | `color: 'primary.main'`                         |
| `border border-[#D4AF37]/30` | `border: '1px solid rgba(212,175,55,0.3)'`      |
| `rounded-lg`                 | `borderRadius: 2`                               |
| `backdrop-blur-sm`           | `backdropFilter: 'blur(4px)'`                   |
| `px-[20px]`                  | `paddingInline: '20px'`                         |
| `py-[10px]`                  | `py: '10px'`                                    |
| `flex items-center`          | `display: 'flex', alignItems: 'center'`         |
| `justify-between`            | `justifyContent: 'space-between'`               |
| `gap-2`                      | `gap: 1` (MUI spacing: 1 = 8px)                 |
| `text-xs sm:text-sm`         | `fontSize: { xs: '0.75rem', sm: '0.875rem' }`   |
| `hidden sm:inline`           | `display: { xs: 'none', sm: 'inline' }`         |
| `w-4 h-4`                    | `width: 16, height: 16` (or sx on icon wrapper) |
| `text-left` / `text-right`   | `textAlign: 'start'` / `textAlign: 'end'`       |
| `shrink-0`                   | `flexShrink: 0`                                 |

### Grid Layout (Prayer Cards)

```typescript
import Grid from '@mui/material/Grid';

<Grid container spacing={{ xs: 1, sm: 1.5 }}>
  {prayers.map((prayer) => (
    <Grid key={prayer.key} size={{ xs: 6, sm: 4, lg: 2 }}>
      <PrayerCard ... />
    </Grid>
  ))}
</Grid>
```

### Responsive Breakpoints

MUI v7 breakpoints:

- `xs`: 0px (mobile)
- `sm`: 600px (tablet)
- `md`: 900px (small desktop)
- `lg`: 1200px (desktop/kiosk)
- `xl`: 1536px (large displays)

## Verification Checklist

After all components are migrated:

```bash
# 1. Zero Tailwind classes
grep -rn "className=" src/app/components/ src/app/App.tsx

# 2. Zero inline style={{ fontFamily }}
grep -rn "style={{ fontFamily" src/app/components/ src/app/App.tsx

# 3. Build passes
yarn build

# 4. Visual verification
yarn dev
# Test: EN mode, AR mode, event mode toggle, fundraising overlay
```
