import tseslint from 'typescript-eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';

// LAYERS:
// - typescript-eslint recommended: baseline TS quality (dev-only)
// - react-hooks recommended: hook correctness across src/
// - jsx-a11y recommended: static accessibility checks, scoped to the admin
//   app only — the display app's a11y pass shipped separately
export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'public/**'] },
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // React-Compiler-era rules disabled until the data-layer hooks are
      // refactored: the codebase deliberately uses latest-ref patterns and
      // effect-driven cache state machines these rules forbid.
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'off',
    },
  },
  {
    files: ['src/admin/**/*.{ts,tsx}'],
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },
);
