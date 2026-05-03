import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    'node_modules',
    '_bmad',
    '_bmad-output',
    '.firebase',
    'coverage',
    'src/test',
  ]),

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['**/*.config.js', 'vite.config.js', 'vitest.config.js'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],
    plugins: {
      react,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
      parser: tseslint.parser,
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
    rules: {
      // React rules
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // Unused vars
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',

      // General
      'no-unused-vars': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'prefer-const': 'warn',
      'no-var': 'error',

      // Prettier compatibility
      'react/self-closing-comp': 'warn',
      'jsx-quotes': ['warn', 'prefer-single'],
    },
  },

  // TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unnecessary-type-constraint': 'warn',
    },
  },

  // Test files
  {
    files: ['src/test/**/*'],
    languageOptions: {
      globals: {
        ...globals.vitest,
      },
    },
  },
])
