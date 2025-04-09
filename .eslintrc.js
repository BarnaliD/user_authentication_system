module.exports = {
  env: {
    node: true,
    jest: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
  ],
  plugins: ['jest'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'script',
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
  },
};

