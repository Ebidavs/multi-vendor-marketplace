import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      // eslint-plugin-react-hooks >=5 exposes the flat config as
      // `recommended-latest`; `configs.flat` no longer exists.
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    plugins: { react },
    rules: {
      // Core `no-unused-vars` does not know that a component used inside JSX
      // (e.g. `<Link />`) counts as a use. Without these two rules every
      // JSX-only import is reported as unused.
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'error',
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
