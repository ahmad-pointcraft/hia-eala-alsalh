import tseslintParser from '@typescript-eslint/parser';
import jsxA11y from 'eslint-plugin-jsx-a11y';

// NARROW A11Y-FOCUSED CONFIG:
// - parser: TS/TSX parsing (dev-only)
// - rules: jsx-a11y recommended static accessibility checks, scoped to the
//   ADMIN app only — the display app is untouched  ;
//   its a11y pass shipped .
// General-purpose linting is intentionally out of scope here.
export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**', 'src/display/**'],
  },
  {
    files: ['src/admin/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslintParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },
];
