module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    '@react-native',
    '@react-native/eslint-config-typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  plugins: ['react', 'react-native', 'import'],
  env: { 'react-native/react-native': true, jest: true },
  settings: {
    'import/ignore': ['react-native'],
    react: { version: 'detect' },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/order': ['warn', {
      'groups': ['builtin','external','internal','parent','sibling','index','object','type'],
      'newlines-between': 'always',
      'alphabetize': { order: 'asc', caseInsensitive: true },
    }],
    'react-native/no-inline-styles': 'off',
  },
};
