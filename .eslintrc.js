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
    'semi': [ 2, 'always' ],
  },
};
