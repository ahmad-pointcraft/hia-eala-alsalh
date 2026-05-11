# Quickstart: Production Hardening

**Feature**: 005-production-hardening | **Date**: 2026-05-10

## Prerequisites

- Node.js 18+
- Yarn installed
- Dependencies installed (`yarn install`)

## Development

```bash
yarn dev              # Start Vite dev server
yarn build            # Production build
yarn typecheck        # TypeScript strict mode check
```

## Implementation Phases

### Phase 1: ErrorBoundary (T001, T002)

1. Create `src/app/components/ErrorBoundary.tsx` as a React class component
2. Wrap `<App />` in `<ErrorBoundary>` in `src/main.tsx`
3. Verify: `yarn build` passes

### Phase 2: Local Assets (T003, T004)

1. Download 3 mosque images to `src/imports/mosque-{1,2,3}.jpg`
2. Replace Unsplash URLs in `src/app/App.tsx` with local imports
3. Verify: `grep -r "unsplash" src/` returns 0 matches

### Phase 3: Accessibility (T005–T009, all parallel)

1. Add aria-live to CountdownBar (throttled to 1/min)
2. Add role/status to AnnouncementsTicker
3. Add aria-labels to Header buttons
4. Add reduced-motion support to all Framer Motion components
5. Add focus trap + dialog role to FundraisingOverlay
6. Verify: `yarn build` passes

### Phase 4: Service Worker (T010, optional)

1. Create `public/sw.js` with cache-first strategy
2. Add conditional registration in `src/main.tsx`
3. Add offline indicator to Header
4. Verify: load page, go offline, reload — page renders

### Phase 5: Verification (T011–T014)

1. `yarn build` — zero errors
2. `grep -r "unsplash" src/` — zero matches
3. `grep -r "any" src/app/components/ErrorBoundary.tsx` — zero matches
4. Manual visual check

## Key Files

| File | Role |
|------|------|
| `src/app/components/ErrorBoundary.tsx` | Error boundary with auto-recovery |
| `src/imports/mosque-{1,2,3}.jpg` | Local carousel images |
| `src/app/App.tsx` | Image import migration, reduced-motion |
| `src/app/components/CountdownBar.tsx` | aria-live throttled |
| `src/app/components/AnnouncementsTicker.tsx` | role="status", aria-live |
| `src/app/components/Header.tsx` | aria-labels on buttons |
| `src/app/components/FundraisingOverlay.tsx` | Focus trap, dialog role |
| `public/sw.js` | Optional service worker |
