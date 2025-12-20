// eslint.config.js
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  // Global ignores
  {
    ignores: [
      '**/*.min.js',
      '**/dist/**',
      '**/build/**',
      '**/vendor/**',
      '**/tmp/**',
      '.cache',
      '.idea',
      '.vscode',
      'node_modules/**',
      'coverage/**',
      'package.json',
      'package-lock.json',
      '**/*.d.ts'
    ]
  },

  // Base JavaScript configuration
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly'
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-console': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'comma-dangle': ['error', 'es5'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'arrow-parens': ['error', 'always'],
      'prefer-arrow-callback': 'error',
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }]
    }
  },

  // TypeScript configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/semi': ['error', 'always'],
      '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],
      '@typescript-eslint/indent': ['error', 2, { SwitchCase: 1 }],
      '@typescript-eslint/comma-dangle': ['error', 'es5'],
      '@typescript-eslint/member-delimiter-style': ['error', {
        multiline: { delimiter: 'semi', requireLast: true },
        singleline: { delimiter: 'semi', requireLast: false }
      }]
    }
  }
];
