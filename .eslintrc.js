module.exports = {
  root: true,
  env: {
    node: true
  },
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
  ],
  rules: {
    'comma-dangle': [ 2, 'always-multiline' ],
    // 'semi': [ 2, 'always' ],
    // 'curly': [ 2, 'multi-line' ],
    // 'space-before-function-paren': [ 2, 'always' ],
    // 'no-console': 0,
    // 'sort-vars': 2,
  }
}
