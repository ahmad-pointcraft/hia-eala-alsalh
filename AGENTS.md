<!-- SPECKIT START -->

# AI Agent Roles

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at `specs/014-admin-timings/plan.md`.

## Project Context

- **App**: Masjid Prayer Time Display — a 24/7 kiosk display for a mosque
- **Stack**: React 18 + TypeScript (strict) + MUI v7 + Vite + Yarn
- **Source**: Figma export migrated to MUI v7 (Spec 001–004 complete)
- **Current focus**: Admin Portal & Device Pairing Foundation — single repo, single `package.json`, Vite native two-entry MPA (`src/display/` + `src/admin/` + `src/shared/`); device pairing via a typed `ApiClient` contract backed by MSW mocks (Spec 013)

## Spec 014 Implementation Artifacts

Read these IN ORDER before implementing any task:

| Priority | File | Purpose |
|----------|------|---------|
| REQUIRED | `specs/014-admin-timings/plan.md` | Architecture, file structure, constitution check |
| REQUIRED | `specs/014-admin-timings/spec.md` | Feature spec (FR-001→FR-017, SC-001→SC-006, two clarification sessions) |
| REQUIRED | `specs/014-admin-timings/research.md` | Design decisions + rationale (8 decisions) |
| REQUIRED | `specs/014-admin-timings/data-model.md` | Form state shapes, validation rules, file inventory |
| REQUIRED | `specs/014-admin-timings/quickstart.md` | Dev setup, manual E2E test guide |
| REQUIRED | `.specify/memory/constitution.md` | Articles I–X — non-negotiable constraints |
| Reference | `specs/014-admin-timings/checklists/timings.md` | 38-item requirements-quality checklist (all pass) |

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
yarn dev            # Start dev server (display at /, admin at /admin/)
yarn build          # Production build (both entries)
yarn typecheck      # TypeScript strict compilation check
```

## Design Skills

The following design skills are available. Invoke them during Step 2 (Specify) and Step 8 (Implement) of each spec:

- **`design-taste-frontend`** (Taste Skill v2) — Anti-slop frontend discipline. Use FULLY for display-app specs (visual UI, overlays, kiosk modes). Use ANTI-DEFAULT RULES ONLY (§0.D + §14 pre-flight check) for admin-app specs (forms, CRUD tables — Taste Skill v2 explicitly excludes dashboards).
- **Project Design Read**: "Reading this as: a 24/7 mosque kiosk display + admin portal, with a dark emerald + gold reverent aesthetic (display) and a light productivity theme (admin), leaning toward MUI v7 Material Design with custom Islamic geometric tokens."
- See `docs/taste-skill-integration.md` for the full per-spec skill mapping.

<!-- SPECKIT END -->
