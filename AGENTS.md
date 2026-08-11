<!-- SPECKIT START -->

# AI Agent Roles

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at `specs/015-admin-content/plan.md`.

## Project Context

- **App**: Masjid Prayer Time Display — a 24/7 kiosk display for a mosque
- **Stack**: React 18 + TypeScript (strict) + MUI v7 + Vite + Yarn
- **Source**: Figma export migrated to MUI v7 (Spec 001–004 complete)
- **Current focus**: Admin Content Management — CRUD UIs for announcements, events, donation campaigns, and carousel images (`/content` + `/images` routes); extends the typed `ContentApi` contract (create/update/delete + reorder + `setActiveDonationCampaign` + image ops) backed by MSW mocks. BREAKING type widening gated behind a Phase 0b display-consumer migration. Zero new deps (Spec 015).

## Spec 015 Implementation Artifacts

Read these IN ORDER before implementing any task:

| Priority | File | Purpose |
|----------|------|---------|
| REQUIRED | `specs/015-admin-content/plan.md` | Architecture, file structure, constitution check |
| REQUIRED | `specs/015-admin-content/spec.md` | Feature spec (FR-001→FR-025, SC-001→SC-008, two clarify decisions) |
| REQUIRED | `specs/015-admin-content/research.md` | Design decisions + rationale (12 decisions) |
| REQUIRED | `specs/015-admin-content/data-model.md` | Types, `Update<T>`, `useCrudList<T>`, validation rules, file inventory |
| REQUIRED | `specs/015-admin-content/quickstart.md` | Dev setup, manual E2E test guide |
| REQUIRED | `.specify/memory/constitution.md` | Articles I–X — non-negotiable constraints |
| Reference | `specs/015-admin-content/checklists/content.md` | 51-item requirements-quality checklist (all PASS) |

## Key Design Decisions (binding — re-confirmed at `/speckit.analyze`)

Honor these during implementation (from Step 1b Pre-Specify Corrections + clarify + research):

1. **`Update<T>` = `Partial<Omit<T,'id'|'masqidId'>>`** on every `update*` — identity fields un-patchable (P0-4). `Update<DonationCampaign>` additionally omits `active`.
2. **Event image is an attribute** via `updateEvent({imageUrl})`, NOT a managed list — no `setEventImage` op (P0-5). QR is likewise an attribute (`uploadImage(file,'qr')` → `qrImageUrl`); `StoredImage.kind` is `'carousel'|'event'|'qr'`.
3. **Donation at-most-one-active is type-enforced** (P1-7, Option A) — `active` excluded from `Update<DonationCampaign>`; activation only via `setActiveDonationCampaign`, which atomically deactivates the rest. Delete-active → zero-active → overlay falls back.
4. **`useCrudList<T>`** generic hook with OPTIONAL `reorder` (P1-6) — bound for announcements + carousel; omitted for events + donations.
5. **Reorder via up/down IconButtons only** — NO `@dnd-kit` (P2-12); boundary-disabled (first up / last down).
6. **Realtime = full-collection snapshot** per mutation via `onContentChange` (P1-8) — display replaces the affected collection and re-renders.
7. **Optimistic active toggle** — flip → await → revert + error toast on failure (P1-9).
8. **BREAKING type widening → Phase 0b gate** (P0-2) — migrates every display consumer (`EventSlide`, App.tsx mapping, slideshow, fundraising overlay, Spec 012 fallback) + ticker sanitization (no `dangerouslySetInnerHTML`) + carousel-API-wiring with static fallback; MUST pass `yarn typecheck` before any UI phase.
9. **Admin paths** are `src/admin/{routes,components,hooks,utils}/` — NOT `src/admin/src/` (P0-1).
10. **Mock object URLs** — `URL.createObjectURL` on upload, `URL.revokeObjectURL` on delete/overwrite (P2-13); session-only.
11. **Bilingual** — stacked `BilingualTextField` (rtl ar / ltr en); ≥1 language required to save; display renders the available language when one is empty (Article VIII).
12. **Zero new production deps** — project is at the 12-cap from Spec 014; 015 adds nothing (Article III). `hadith.ts` DRY refactor is OUT of scope (P1-10).

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

Read `.specify/memory/constitution.md` for the 10 governing articles (Articles I–X).
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
