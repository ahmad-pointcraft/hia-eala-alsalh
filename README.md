# Masjid Prayer Time Display

> **Stack:** React 18 + TypeScript (strict) + MUI v7 + Vite + Yarn
> **Source:** [Figma Design](https://www.figma.com/design/VFg4zYgOYshrC1eyoxlNwQ/Masjid-Prayer-Time-Display)

## Running the Code

```bash
yarn install
yarn dev
```

---

## Constitution

The project constitution lives in `.specify/memory/constitution.md`. It defines 9 articles governing all development:

| Article | Principle                          |
| ------- | ---------------------------------- |
| I       | MUI-Only UI Framework              |
| II      | TypeScript Strict Mode             |
| III     | Yarn Package Management            |
| IV      | Zero Dead Code                     |
| V       | Shared Utilities (DRY)             |
| VI      | Dynamic Data Over Hardcoded Values |
| VII     | Kiosk-First Design                 |
| VIII    | RTL-First Bilingual Support        |
| IX      | Single Timer Principle             |

---

## Spec Index

All specs follow the [Spec Kit](https://github.com/github/spec-kit) Spec-Driven Development (SDD) methodology. Each spec contains 8 steps: Constitution → Specify → Clarify → Checklist → Plan → Tasks → Analyze → Implement.

Specs are stored in `docs/` (gitignored — local only). Read the spec files directly for implementation details.

| Spec | Priority | Description                                                                           |
| ---- | -------- | ------------------------------------------------------------------------------------- |
| 001  | **P0**   | Bootstrap & Cleanup — Remove Tailwind/shadcn, set up MUI, switch to yarn              |
| 002  | **P0**   | MUI Component Migration — Rewrite all 12 components from Tailwind to MUI sx           |
| 003  | **P0**   | Dynamic Data & Shared Utils — Dynamic prayer detection, deduplicate code, type safety |
| 004  | **P1**   | Performance & Type Safety — Shared hooks, API service layer, context providers        |
| 005  | **P2**   | Production Hardening — Error boundaries, local assets, offline, accessibility         |
| 006  | **P3**   | Polish & Theme System — Theme tokens, responsive audit, dead code cleanup             |

### Execution Order

```doc
Spec 001 (Bootstrap) → Spec 002 (MUI Migration) → Spec 003 (Dynamic Data)
                                                          ↓
                                                   Spec 004 (Performance)
                                                          ↓
                                                   Spec 005 (Hardening)
                                                          ↓
                                                   Spec 006 (Polish)
```

Specs 001–003 are sequential (each depends on the previous). Specs 004–006 can partially overlap.
