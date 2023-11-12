module.exports = {
  root: true,
  env: {
    browser: true, es2020: true,
  },
  extends: ['eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'],
  ignorePatterns: ['dist', '!.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'eslint-plugin-react'],
  rules: {
    'react-refresh/only-export-components': ['warn',
      {
        allowConstantExport: true,
      }],
    'no-console': 'warn',
    'prefer-template': 'warn',
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/self-closing-comp': ['warn', {
      'component': true,
      'html': true,
    }],
    'react/jsx-curly-brace-presence': ['warn',
      {
        'props': 'never',
        'children': 'never',
        'propElementValues': 'always',
      }],
    'jsx-quotes': ['warn', 'prefer-double'],
    'quotes': [2, 'single', {
      'avoidEscape': true,
    }],
    'semi': ['warn', 'always'],
    'eol-last': ['warn', 'always'],
    // 'space-in-brackets': ['warn', 'always'],
    'object-curly-spacing': ['warn',
      'always'],
    'comma-dangle': ['error', {
      'arrays': 'never',
      'objects': 'always',
      'imports': 'never',
      'exports': 'never',
      'functions': 'never',
    }],
    // 'max-len': ['warn', {
    //   'code': 200, 'tabWidth': 2,
    // }],
    'indent': ['warn', 2],
    'no-multiple-empty-lines': ['warn', {
      'max': 1, 'maxEOF': 0,
    }],
    'react/jsx-no-useless-fragment': ['warn'],
    // 'array-bracket-newline': ['warn', 'consistent'],
    // 'object-curly-newline': ['warn', 'consistent'], 
  },
};
