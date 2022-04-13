module.exports = {
  plugins: ['@typescript-eslint'],
  extends: ['next/core-web-vitals', 'prettier'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',

    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
      },
    ],
    '@typescript-eslint/no-require-imports': 'warn',
    // Disabled for now because of yelling on every React component
    '@typescript-eslint/naming-convention': 'off',
    'prefer-const': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    // Disabled prop-types rule for the React components because we already did specify it by typescript
    'react/prop-types': 'off',
    // Disable because just duplicates "@typescript-eslint/no-unused-vars" rule
    'no-unused-vars': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
  },
  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: false,
  },
};
