import js from '@eslint/js'
import perfectionist from 'eslint-plugin-perfectionist'
import solid from 'eslint-plugin-solid/configs/typescript'
import { defineConfig } from 'eslint/config'
import ts from 'typescript-eslint'

export default defineConfig([
  { ignores: ['api.d.ts', 'auto-import.d.ts', 'public/**/*', 'dist/**/*'] },
  js.configs.recommended,
  ts.configs.strictTypeChecked,
  ts.configs.stylisticTypeChecked,
  perfectionist.configs['recommended-natural'],
  solid as object,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      'solid/jsx-no-undef': ['off'],
    },
  },
])
