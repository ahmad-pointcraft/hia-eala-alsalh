# Migration Requirements Quality Checklist: Centralized Theme Token System

**Purpose**: Validate that the spec's requirements for color token migration are complete, clear, consistent, and measurable — focused on 7 domains: token completeness, palette extension, component coverage, SVG handling, dead code scope, visual parity, and build validation.
**Created**: 2026-05-11
**Feature**: [spec.md](../spec.md)

**Note**: This checklist tests the *requirements writing quality*, not the implementation. Constitution compliance (Articles I–IX) is deferred to a separate pass.

## Token Completeness

- [ ] CHK001 Are all unique hex color values (e.g., #D4AF37, #FFD700, #B8960C, #0a1f0a) enumerated with their semantic purpose in the spec? [Completeness, Spec §FR-002]
- [ ] CHK002 Are all gold-based rgba opacity variants (0.02, 0.08, 0.12, 0.15, 0.2, 0.3, 0.4, 0.5, 0.8) explicitly listed with intended semantic names? [Completeness, Spec §Assumptions]
- [x] CHK003 Are all black-based rgba opacity variants (0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.95) enumerated in the spec? [Completeness, Resolved — Spec §FR-002 now lists surface overlay opacities; Spec §Assumptions enumerates black-based variants]
- [ ] CHK004 Are all CSS keyword colors ("black", "white") identified with their usage locations? [Completeness, Spec §FR-005]
- [ ] CHK005 Does the spec define a naming convention for token keys (e.g., gold.main, surface.overlay, border.subtle)? [Clarity, Spec §FR-004]
- [x] CHK006 Is it specified whether token values are flat strings or nested objects by namespace? [Clarity, Resolved — Spec §FR-004 specifies flat objects per namespace; Spec §Assumptions confirms flat structure]
- [ ] CHK007 Does the spec require that tokens.ts is the ONLY file allowed to contain raw hex/rgba literals? [Completeness, Spec §FR-001]

## Palette Extension Completeness

- [ ] CHK008 Are all four custom palette namespaces (gold, surface, border, glow) defined with their member properties? [Completeness, Spec §FR-004]
- [ ] CHK009 Does the spec specify what properties each namespace exposes (e.g., gold.main, gold.light, gold.dark)? [Clarity, Spec §FR-004]
- [ ] CHK010 Is the relationship between tokens.ts constants and palette extension values explicitly defined (tokens = single source, palette consumes them)? [Consistency, Spec §FR-003]
- [ ] CHK011 Does the spec require that the existing Palette module augmentation (currently only `gold`) be extended for all four namespaces? [Completeness, Spec §FR-009]
- [ ] CHK012 Are palette extension types required to satisfy TypeScript strict mode without `any`? [Clarity, Spec §FR-009]

## Component Coverage

- [ ] CHK013 Does the spec list all component files requiring color migration? [Completeness, Spec §FR-005]
- [ ] CHK014 Does the spec distinguish between component migration strategies (sx prop vs. token import) for each file? [Clarity, Spec §FR-005]
- [ ] CHK015 Are components with SVG attributes (IslamicGeometricOverlay.tsx) identified as requiring direct token imports rather than theme palette references? [Completeness, Spec §Edge Cases]
- [ ] CHK016 Are components with inline style props (FundraisingOverlay.tsx, IslamicGeometricOverlay.tsx) identified as requiring direct token imports? [Completeness, Spec §Edge Cases]
- [ ] CHK017 Are components with framer-motion style objects (EventModeDisplay.tsx) identified as requiring direct token imports? [Completeness, Spec §Edge Cases]
- [x] CHK018 Is the heaviest-migration file (EventModeDisplay.tsx, ~20 instances) called out for prioritized verification? [Coverage, Resolved — Spec §FR-005 now flags EventModeDisplay.tsx for prioritized verification]

## SVG Handling Strategy

- [ ] CHK019 Is the strategy for SVG stroke/fill/stopColor attributes explicitly documented as "import from tokens.ts"? [Clarity, Spec §Edge Cases]
- [x] CHK020 Are SVG gradient stop colors (used in EventModeDisplay.tsx, IslamicGeometricOverlay.tsx) covered by the migration strategy? [Completeness, Resolved — Spec §FR-005 now includes gradient strings in migration scope]
- [x] CHK021 Is the strategy for constructing gradient strings that embed hex values (e.g., `linear-gradient(..., #D4AF37, ...)`) documented? [Clarity, Resolved — Spec §Edge Cases now documents gradient string construction via token interpolation]
- [x] CHK022 Does the spec address whether SVG elements inside MUI components can use theme-aware alternatives (e.g., CSS currentColor)? [Coverage, Resolved — Spec §Edge Cases now documents when to use currentColor vs token imports]

## Dead Code Scope

- [ ] CHK023 Does FR-007 specify "unused imports" as the only dead code category, or does it also cover unreachable code, unused variables, and unused type imports? [Clarity, Spec §FR-007]
- [x] CHK024 Is the tool/method for detecting dead code specified (e.g., TypeScript compiler --noUnusedLocals, linter rule)? [Clarity, Resolved — Spec §FR-007 now specifies tsc --noUnusedLocals --noUnusedParameters]
- [ ] CHK025 Does the spec acknowledge that the current audit found zero unused imports and FR-007 is a safety-net for refactoring orphans? [Consistency, Spec §Assumptions]

## Visual Parity & Zero Regression

- [ ] CHK026 Is "pixel-identical" (FR-008) defined with a specific verification method (manual visual comparison, screenshot diff, headless browser)? [Clarity, Spec §FR-008]
- [ ] CHK027 Does SC-004 (token propagation) define a specific verification method beyond "confirming visual change"? [Measurability, Spec §SC-004]
- [x] CHK028 Are requirements specified for what happens if a migrated component renders a slightly different shade due to rgba construction differences? [Edge Case, Resolved — Spec §Edge Cases now documents shade mismatch fallback: store exact rgba as token if alpha() doesn't match]
- [ ] CHK029 Is the assumption that MUI's alpha utility produces identical rgba output to hardcoded strings validated or required to be validated? [Assumption, Spec §Assumptions]

## Build Validation

- [x] CHK030 Does the spec specify exact grep patterns or search queries for verifying zero hardcoded colors remain (SC-001, SC-002, SC-003)? [Clarity, Resolved — Spec §SC-001–SC-003 now include exact grep commands]
- [ ] CHK031 Is it specified whether the grep exclusion applies to tokens.ts AND muiTheme.ts, or only tokens.ts? [Consistency, Spec §SC-001 vs §SC-002]
- [ ] CHK032 Does SC-005 require a specific build command (e.g., `yarn build`) and specific error codes to check for? [Clarity, Spec §SC-005]
- [x] CHK033 Are requirements for bundle size impact (regression or improvement) specified or explicitly out of scope? [Coverage, Resolved — Spec §SC-007 now specifies max 1KB increase]

## Notes

- Constitution compliance (Articles I–IX) is deferred to a separate checklist pass.
- The existing `requirements.md` checklist covers general spec quality; this checklist is domain-specific to the token migration.
- All 9 originally flagged gap items have been resolved via spec updates (2026-05-11). Checklist items CHK003, CHK006, CHK018, CHK020, CHK021, CHK022, CHK024, CHK028, CHK030, CHK033 now marked as resolved with references to the updated spec sections.
