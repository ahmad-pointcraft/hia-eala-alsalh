# Quickstart: Shared Utilities & Dynamic Prayer Data

**Feature**: 003-shared-utils-dynamic-data
**Date**: 2026-05-09

## Prerequisites

- Node.js 18+ installed
- Yarn 4.9.2 (via corepack)
- Spec 002 complete (all components migrated to MUI)

## Setup

```bash
cd /Users/elshowair/code/pointcraft/Masjid\ Prayer\ Time\ Display
yarn install
yarn dev    # Start dev server at http://localhost:5173
```

## Migration Workflow

### 1. Create Shared Utility Module

```bash
# Create the new helpers file
touch src/app/utils/helpers.ts
```

```typescript
// src/app/utils/helpers.ts
import { Language } from './translations';

export const toArabicNumerals = (text: string): string => {
  const arabicNumerals = ['\u0660', '\u0661', '\u0662', '\u0663', '\u0664', '\u0665', '\u0666', '\u0667', '\u0668', '\u0669'];
  return text.replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)]);
};

export const getFontFamily = (language: Language): string =>
  language === 'ar' ? '"Noto Naskh Arabic", serif' : '"Open Sans", sans-serif';

export const isRTL = (language: Language): boolean =>
  language === 'ar';

export const getDirection = (language: Language): 'rtl' | 'ltr' =>
  language === 'ar' ? 'rtl' : 'ltr';
```

### 2. Create Prayer Times Module

```bash
touch src/app/utils/prayerTimes.ts
```

### 3. Export Translations Type

Add to `src/app/utils/translations.ts`:

```typescript
export type Translations = typeof translations['en'];
```

### 4. Update Each Component

For each component with duplicated utilities:

```typescript
// BEFORE (in each component):
const toArabicNumerals = (text: string): string => { ... };
const fontFamily = language === 'ar' ? '...' : '...';
const isRTL = language === 'ar';
dir={isRTL ? 'rtl' : 'ltr'}
sx={{ fontFamily }}

// AFTER (in each component):
import { toArabicNumerals, getFontFamily, getDirection } from '../utils/helpers';
sx={{ fontFamily: getFontFamily(language) }}
dir={getDirection(language)}
```

### 5. Update App.tsx

```typescript
// BEFORE:
const currentPrayer = "Dhuhr";
<CountdownBar nextPrayerTime="16:15" ... />

// AFTER:
import { getCurrentPrayer, getNextPrayer } from './utils/prayerTimes';
const activePrayer = getCurrentPrayer(prayers, currentTime);
const nextPrayer = getNextPrayer(prayers, currentTime);
<CountdownBar nextPrayerTime={nextPrayer.time} ... />
```

## Verification

```bash
# 1. Zero duplicate toArabicNumerals definitions
grep -rn "const toArabicNumerals" src/app/components/ src/app/App.tsx
# Expected: no matches

# 2. Zero duplicate fontFamily constants
grep -rn "const fontFamily = language" src/app/components/ src/app/App.tsx
# Expected: no matches

# 3. Zero Record<string, string> in component props
grep -rn "translations: Record<string, string>" src/app/components/
# Expected: no matches

# 4. Build passes
yarn build

# 5. Visual check — prayer highlight changes with time
yarn dev
```

## Import Cheat Sheet

| Need | Import |
|---|---|
| Arabic numerals | `import { toArabicNumerals } from '../utils/helpers';` |
| Font family | `import { getFontFamily } from '../utils/helpers';` |
| RTL check | `import { isRTL } from '../utils/helpers';` |
| Direction prop | `import { getDirection } from '../utils/helpers';` |
| Prayer computation | `import { getCurrentPrayer, getNextPrayer } from '../utils/prayerTimes';` |
| Prayer types | `import { PrayerTime, PrayerKey } from '../utils/prayerTimes';` |
| Translations type | `import { Translations } from '../utils/translations';` |
