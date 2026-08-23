import tseslintParser from '@typescript-eslint/parser';
import jsxA11y from 'eslint-plugin-jsx-a11y';

// NARROW A11Y-FOCUSED CONFIG:
// - parser: TS/TSX parsing (dev-only)
// - rules: jsx-a11y recommended static accessibility checks, scoped to the
//   ADMIN app only — the display app is untouched;
//   its a11y pass shipped.
// General-purpose linting is intentionally out of scope here.
export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslintParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    // NO-OP DEFINITIONS — DISPLAY FILES CARRY INLINE react-hooks DISABLE
    // DIRECTIVES; WITHOUT A DEFINITION ESLINT ERRORS ON "RULE NOT FOUND"
    rules: {
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  {
    files: ['src/admin/**/*.{ts,tsx}'],
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },
];
