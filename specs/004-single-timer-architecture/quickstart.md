# Quickstart: Single Timer Architecture

**Branch**: `004-single-timer-architecture` | **Date**: 2026-05-10 | **Spec**: [spec.md](./spec.md)

## Prerequisites

- Node.js 20.9.0+
- Yarn installed
- Branch `004-single-timer-architecture` checked out

## Setup

```bash
yarn install
```

## Development

```bash
yarn dev
```

Open the kiosk display in a browser. Verify:
1. Header clock ticks every second
2. Gregorian date shows today's date
3. Countdown decrements every second
4. Prayer card highlighting switches at correct times

## Verification Commands

```bash
# Build must pass with zero errors
yarn build

# No setInterval in consolidated files (must return 0 matches / exit code 1)
grep "setInterval" src/app/App.tsx src/app/components/Header.tsx src/app/components/MasjidInfo.tsx src/app/components/CountdownBar.tsx

# Exactly 3 setInterval in allowed files
grep "setInterval" src/app/utils/useClock.ts src/app/components/ImageCarousel.tsx src/app/components/FundraisingOverlay.tsx

# No any types in changed files
grep -r "any" src/app/utils/useClock.ts src/app/components/Header.tsx src/app/components/MasjidInfo.tsx src/app/components/CountdownBar.tsx
```

## What Changed

| Before | After |
|--------|-------|
| 4 independent `setInterval(1000)` timers | 1 shared `useClock` hook |
| Each component manages its own clock | App.tsx passes `currentTime` prop |
| CountdownBar shows `'03:45:23'` placeholder on mount | Countdown computed correctly on first render |
| `nextPrayerLabel` prop (unused) | Removed (dead code) |

## Files Modified

| File | Action |
|------|--------|
| `src/app/utils/useClock.ts` | Created |
| `src/app/App.tsx` | Modified |
| `src/app/components/Header.tsx` | Modified |
| `src/app/components/MasjidInfo.tsx` | Modified |
| `src/app/components/CountdownBar.tsx` | Modified |
