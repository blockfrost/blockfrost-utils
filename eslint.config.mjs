import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  { ignores: ['lib/**', 'dist/**', 'coverage/**', '**/OpenApi.ts'] },
  js.configs.recommended,
  ...tseslint.configs['flat/recommended'],
  prettierRecommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
    },
    rules: {
      'no-console': 'off',
      'arrow-parens': ['error', 'as-needed'],
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
      'prefer-destructuring': ['error', { object: true, array: false }],
    },
  },
];
