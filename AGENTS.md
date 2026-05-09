<!-- SPECKIT START -->

# AI Agent Roles

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at `specs/002-mui-component-migration/plan.md`.

## Project Context

- **App**: Masjid Prayer Time Display — a 24/7 kiosk display for a mosque
- **Stack**: React 18 + TypeScript (strict) + MUI v7 + Vite + Yarn
- **Source**: Figma export currently using Tailwind CSS + shadcn/ui (being removed)
- **Migration target**: MUI v7 only, no Tailwind, no shadcn

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

## Constitution

Read `.specify/memory/constitution.md` for the 9 governing articles (Articles I–IX).
Key rules: MUI-only, TypeScript strict, Yarn, zero dead code, no `any` types.

## Key Commands

```bash
yarn install        # Install dependencies
yarn dev            # Start dev server
yarn build          # Production build
```

<!-- SPECKIT END -->
