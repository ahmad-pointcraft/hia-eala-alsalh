<!-- SPECKIT START -->

# AI Agent Roles

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at `specs/012-dynamic-data-integration/plan.md`.

## Project Context

- **App**: Masjid Prayer Time Display — a 24/7 kiosk display for a mosque
- **Stack**: React 18 + TypeScript (strict) + MUI v7 + Vite + Yarn
- **Source**: Figma export migrated to MUI v7 (Spec 001–004 complete)
- **Current focus**: Dynamic Data Integration — Replace hardcoded data with API-backed sources, offline caching, adhan prayer calculation (Spec 012)

## Spec 012 Implementation Artifacts

Read these IN ORDER before implementing any task:

| Priority | File | Purpose |
|----------|------|---------|
| REQUIRED | `specs/012-dynamic-data-integration/tasks.md` | 44 tasks (T001–T044) across 9 phases — **authoritative task definitions** |
| REQUIRED | `specs/012-dynamic-data-integration/spec.md` | Feature spec with TR-01→TR-08 technical reference (types, API contracts) |
| REQUIRED | `specs/012-dynamic-data-integration/plan.md` | Architecture, project structure, constitution check |
| REQUIRED | `.specify/memory/constitution.md` | Articles I–IX — non-negotiable constraints |
| Reference | `specs/012-dynamic-data-integration/data-model.md` | Entity relationships, type definitions, validation rules |
| Reference | `specs/012-dynamic-data-integration/contracts/hooks.md` | Hook interface contracts (props, return types, behavior) |
| Reference | `specs/012-dynamic-data-integration/research.md` | Design decisions and rationale for each data source |
| Reference | `specs/012-dynamic-data-integration/quickstart.md` | Architecture overview, data flow, offline behavior matrix |

## Key Design Decisions (post-analysis)

These were resolved during `/speckit.analyze` remediation. Honor them during implementation:

1. **IqamaPrayerConfig** is a discriminated union: `{ mode: 'offset'; value: number } | { mode: 'fixed'; value: string }` — NOT a single interface with `value: number | string`
2. **CacheStore** is a singleton class with `Map<string, CacheEntry<unknown>>` internally and typed `get<T>()/set<T>()` public methods — NOT per-type instances
3. **useCachedData** accepts `currentTime: Date` in its options object (passed from caller who gets it from `useClock`) — NOT coupled to useClock internally
4. **HijriDateInfo** type is defined in `src/app/types/mosqueConfig.ts` along with `formatHijriDate()` helper — NOT in a separate file
5. **BUKHARI_HADITH_COUNT = 7563** is a named constant exported from `src/app/types/hadith.ts` — NOT a magic number
6. **adhanMethodToAladhanId()** maps 12 AdhanMethod strings to Aladhan numeric IDs — defined in `src/app/utils/adhanMethodFactory.ts`
7. **Service error handling**: Every service function (aladhan, hadith, quran, googleSheets) wraps fetch in try/catch, returns cached data on failure, throws typed `ServiceError` on total failure — never propagates raw network errors
8. **Active filtering**: Google Sheets service returns ALL rows (including inactive) — hooks (`useAnnouncements`, `useEvents`) apply the `active === true` filter
9. **hijriDayOfYear** formula: `(hijriDate.month - 1) * 30 - Math.floor((hijriDate.month - 1) / 2) + hijriDate.day` — same in both useDailyHadith and useDailyQuranVerse
10. **Midnight rollover**: Date-scoped cache keys change when `currentTime`'s date portion changes → cache miss → re-fetch. No explicit date-boundary detection logic needed.
11. **Hadith fallback chain**: CDN `.min.json` → `.json` retry → hadith #1 → `ServiceError` (caller falls back to Translations defaults)

## Spec Files

All implementation specs are in `docs/` (gitignored). Read them in order:

| Spec | Priority | File                                         |
| ---- | -------- | -------------------------------------------- |
| 001  | P0       | `docs/spec-001-bootstrap-cleanup.md`         |
| 002  | P0       | `docs/spec-002-mui-component-migration.md`   |
| 003  | P0       | `docs/spec-003-dynamic-data-shared-utils.md` |
| 004  | P1       | `docs/spec-004-performance-type-safety.md`   |
| 005  | P2       | `docs/spec-005-production-hardening.md`      |
| 006  | P3       | `docs/spec-006-polish-theme-system.md`       |
| 009  | P2       | `docs/spec-009-light-theme.md`               |

## Constitution

Read `.specify/memory/constitution.md` for the 9 governing articles (Articles I–IX).
Key rules: MUI-only, TypeScript strict, Yarn, zero dead code, no `any` types.

## Key Commands

```bash
yarn install        # Install dependencies
yarn dev            # Start dev server
yarn build          # Production build
yarn typecheck      # TypeScript strict compilation check
```

<!-- SPECKIT END -->
