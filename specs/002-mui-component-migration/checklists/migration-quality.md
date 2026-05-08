# Migration Quality Checklist: MUI Component Migration

**Purpose**: Validate requirements quality and completeness for the Tailwind → MUI v7 migration across all 12 components
**Created**: 2026-05-08
**Depth**: Comprehensive (full requirements quality gate)
**Actor**: Tech lead + senior engineer (PR review gate)
**Feature**: [spec.md](../spec.md)

## Tailwind Migration Coverage

- [ ] CHK001 - Does FR-001 enumerate all 12 components by name, confirming none are missing from scope? [Completeness, Spec §FR-001]
- [ ] CHK002 - Does the spec identify ALL Tailwind utility categories that must be replaced (layout, spacing, sizing, typography, borders, effects, transitions, visibility)? [Completeness, Gap]
- [ ] CHK003 - Are requirements specified for migrating Tailwind arbitrary value syntax (e.g., `text-[24px]`, `px-[20px]`) to explicit sx numeric values? [Coverage, Gap]
- [ ] CHK004 - Are requirements specified for migrating Tailwind's opacity modifier syntax (e.g., `bg-black/30`, `border-[#D4AF37]/30`) to `rgba()` values? [Coverage, Gap]
- [ ] CHK005 - Does the spec address migration of Tailwind responsive prefixes (`sm:`, `lg:`) to MUI sx breakpoint syntax (`{ xs, sm, md, lg }`)? [Coverage, Gap]
- [ ] CHK006 - Are requirements specified for `hidden sm:inline` visibility patterns migration to MUI sx display toggling? [Coverage, Gap]
- [ ] CHK007 - Does the spec address what happens when a component previously using `className` for Tailwind receives no className post-migration? [Edge Case, Spec §Edge Cases]
- [ ] CHK008 - Does the spec address components that use className for NON-styling purposes (e.g., Framer Motion targeting via class names)? [Edge Case, Gap]

## MUI Component Selection Quality

- [ ] CHK009 - Does the spec define which MUI component replaces each raw HTML element type (div → Box, span → Typography, button → Button)? [Completeness, Gap]
- [ ] CHK010 - Is there a requirement specifying when to use Paper vs. Card vs. Box as container components? [Clarity, Gap]
- [ ] CHK011 - Does FR-001's "only MUI components" requirement explicitly permit raw HTML elements for non-styled structural purposes, or ban them entirely? [Clarity, Ambiguity, Spec §FR-001]
- [ ] CHK012 - Are MUI component prop requirements specified (e.g., Grid2 `size` prop, Paper `elevation`, Backdrop `invisible`)? [Completeness, Gap]
- [ ] CHK013 - Does the spec define whether `sx` prop is the exclusive styling approach, or whether `styled()` API is also permitted? [Clarity, Spec §FR-001]
- [ ] CHK014 - Does FR-002 specify the full MUI component hierarchy for the Header (AppBar > Toolbar > {Button, Typography, Box})? [Completeness, Spec §FR-002]

## Responsive Breakpoint Requirements

- [ ] CHK015 - Does FR-005 define what "no conflicting size values" means — is there a specific rule for resolving breakpoint overlaps? [Clarity, Spec §FR-005]
- [ ] CHK016 - Is the Grid2 column specification in FR-003 consistent — it defines xs:2, sm:3, lg:6 but skips md; is this intentional? [Consistency, Spec §FR-003]
- [ ] CHK017 - Are exact sx breakpoint values specified per component, or only the MUI component choices (leaving specific values to implementation)? [Clarity, Gap]
- [ ] CHK018 - Does SC-005 define specific viewport widths for testing each breakpoint, or only the breakpoint name ranges? [Measurability, Spec §SC-005]
- [ ] CHK019 - Does FR-011 specify the exact breakpoint at which CountdownBar/WeatherWidget switch from stacked to side-by-side? [Clarity, Spec §FR-011]

## Color & Theming Requirements

- [ ] CHK020 - Does FR-004 specify the exact CSS property values for the active card glow (shadow color, spread, blur radius)? [Clarity, Spec §FR-004]
- [ ] CHK021 - Is "scale transformation" in FR-004 defined with an exact scale value (e.g., 1.05 vs 1.10) and which breakpoints it applies to? [Clarity, Spec §FR-004]
- [ ] CHK022 - Does the spec enumerate which color values should reference theme tokens (`primary.main`, `background.paper`) vs. use direct hex (`#D4AF37`, `rgba(...)`)  as one-off values? [Clarity, Gap]
- [ ] CHK023 - Are the color tokens referenced in requirements consistent with the muiTheme.ts palette values established in Spec 001? [Consistency, Gap]
- [ ] CHK024 - Does FR-018 require replacing ALL inline `style={{ fontFamily }}` with theme typography references, or only specific components? [Completeness, Spec §FR-018]
- [ ] CHK025 - Does FR-018 specify whether font references should use `theme.typography.fontFamily` tokens or direct sx `fontFamily` strings? [Clarity, Spec §FR-018]

## RTL & Bilingual Requirements

- [ ] CHK026 - Does FR-006 enumerate ALL physical CSS properties (left, right, margin-left, padding-left, etc.) that must become logical properties? [Completeness, Spec §FR-006]
- [ ] CHK027 - Does FR-006 specify how the `dir` prop propagates — on each component root element, on the app root, or via MUI Theme direction? [Clarity, Spec §FR-006]
- [ ] CHK028 - Are RTL requirements specified for AnnouncementsTicker scroll direction reversal (LTR vs RTL)? [Coverage, Spec §FR-012]
- [ ] CHK029 - Are RTL requirements specified for text alignment migration (text-left/text-right → textAlign: 'start'/'end')? [Coverage, Gap]
- [ ] CHK030 - Is the Arabic numeral conversion requirement specified for ALL numeric displays (prayer times, countdown, dates, temperature)? [Coverage, Gap]
- [ ] CHK031 - Does the spec address RTL behavior when language is toggled mid-render — do MUI components re-render with updated `dir`? [Edge Case, Spec §Edge Cases]

## Icon Strategy Requirements

- [ ] CHK032 - Are FR-007 and FR-008 mutually exclusive — does any icon appear in both the MUI and lucide lists? [Consistency, Spec §FR-007, §FR-008]
- [ ] CHK033 - Are the MUI icon names in FR-007 the exact named imports from `@mui/icons-material` (e.g., `Cloud` not `CloudQueue`)? [Clarity, Spec §FR-007]
- [ ] CHK034 - Does FR-007 specify that MUI icons MUST use named imports (tree-shaking compatible), not barrel imports? [Completeness, Spec §FR-007]
- [ ] CHK035 - Does FR-007 specify the exact lucide → MUI icon replacement mapping (e.g., `X` → `Close`, `Cloud` → `Cloud`)? [Clarity, Spec §FR-007]
- [ ] CHK036 - Are ALL icons currently used across all 12 components accounted for in either FR-007 or FR-008 with no orphans? [Coverage, Gap]
- [ ] CHK037 - Does the spec define import style for retained lucide-react icons (named imports for tree-shaking)? [Completeness, Gap]

## Animation Preservation Requirements

- [ ] CHK038 - Does FR-009 specify whether existing `motion.div` wrappers must be preserved as-is, or can be changed to `motion(Box)` / `motion(Component)`? [Clarity, Spec §FR-009]
- [ ] CHK039 - Are animation timing requirements (duration, easing, delay) explicitly specified, or deferred to "preserve existing behavior"? [Clarity, Spec §FR-009]
- [ ] CHK040 - Does the spec address the `Math.random()` fix in IslamicGeometricOverlay (FR-014 mentions "preserve SVG patterns" but does it mandate the useMemo fix)? [Completeness, Spec §FR-014]
- [ ] CHK041 - Are scroll animation requirements for AnnouncementsTicker (speed, direction, requestAnimationFrame vs CSS) clearly specified? [Clarity, Spec §FR-012]
- [ ] CHK042 - Can SC-006 ("same timing and visual effect") be objectively measured without visual comparison tooling? [Measurability, Spec §SC-006]

## Acceptance Criteria Quality

- [ ] CHK043 - Can SC-001 (zero Tailwind classes) be objectively verified with a specific, enumerated grep pattern or linter rule? [Measurability, Spec §SC-001]
- [ ] CHK044 - Can SC-002 ("visually matching the original Figma design") be objectively measured, or is it inherently subjective? [Measurability, Spec §SC-002]
- [ ] CHK045 - Does "no new TypeScript errors beyond pre-existing ones" in SC-003 define what constitutes "pre-existing"? [Clarity, Spec §SC-003]
- [ ] CHK046 - Does SC-004 define specific RTL verification criteria (text direction, layout mirroring, scroll reversal) or just "renders correctly"? [Measurability, Spec §SC-004]
- [ ] CHK047 - Can SC-007 (bundle under 500KB gzipped) be verified with a specific build output command? [Measurability, Spec §SC-007]

## Requirement Consistency

- [ ] CHK048 - Is the icon strategy in FR-007/FR-008 consistent with the icon references in User Stories (e.g., US3 mentions Cloud icon for weather)? [Consistency, Spec §FR-007, §US3]
- [ ] CHK049 - Is the Grid2 column count in FR-003 consistent with User Story 2's description of "2 columns mobile, 3 tablet, 6 desktop"? [Consistency, Spec §FR-003, §US2]
- [ ] CHK050 - Does FR-010's Backdrop + Paper requirement (not Dialog) align with Clarification #4 and US7? [Consistency, Spec §FR-010, Clarification #4]
- [ ] CHK051 - Does FR-012's Paper requirement (not AppBar) align with Clarification #2 and US5? [Consistency, Spec §FR-012, Clarification #2]

## Constitution Compliance (Articles I, II, VII)

- [ ] CHK052 - Does FR-001 satisfy Article I (MUI-only) by explicitly banning all non-MUI styling approaches (Tailwind, CSS files, inline styles)? [Constitution, Article I, Spec §FR-001]
- [ ] CHK053 - Does FR-019 adequately satisfy Article II (no `any`) — does it cover ALL props interfaces across all 12 components? [Constitution, Article II, Spec §FR-019]
- [ ] CHK054 - Is the `NodeJS.Timeout` → `ReturnType<typeof setTimeout>` requirement in assumptions elevated to a functional requirement, or left as optional guidance? [Constitution, Article II, Spec §Assumptions]
- [ ] CHK055 - Does the spec address Article VII (kiosk-first) requirements — error boundaries, offline resilience, no white-screen crashes during migration? [Constitution, Article VII, Gap]
- [ ] CHK056 - Are the deferred items (duplicate `toArabicNumerals`, multiple `setInterval` timers) clearly scoped out with references to the correct future specs? [Constitution, Article V/IX, Spec §Assumptions]
- [ ] CHK057 - Does the spec comply with Article IV (zero dead code) — are requirements specified for removing unused Tailwind-related imports after migration? [Constitution, Article IV, Gap]

## Edge Cases & Missing Scenarios

- [ ] CHK058 - Does the spec address components that have BOTH Tailwind classes AND inline `style={{}}` — which takes priority during migration? [Edge Case, Gap]
- [ ] CHK059 - Are requirements specified for MUI component default styles that may conflict with the dark emerald theme (e.g., Paper's default elevation shadow)? [Edge Case, Gap]
- [ ] CHK060 - Does the spec define what constitutes a "visual regression" for SC-002 acceptance — pixel-level comparison, manual review, specific component checklist? [Measurability, Spec §SC-002]
- [ ] CHK061 - Is the behavior specified for the `prayerIcons` Record type in PrayerCard.tsx that currently uses `Record<string, any>` for icon components? [Completeness, Spec §FR-019]
- [ ] CHK062 - Does the spec address whether the `figma/ImageWithFallback.tsx` migration follows the same MUI component patterns as the main components? [Consistency, Spec §FR-017]
