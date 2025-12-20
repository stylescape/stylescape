module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-scss',
    'stylelint-config-prettier-scss'
  ],
  plugins: [
    'stylelint-order',
    'stylelint-scss'
  ],
  rules: {
    // General
    'indentation': 2,
    'max-nesting-depth': 4,
    'no-duplicate-selectors': true,
    'color-hex-length': 'short',
    'color-named': 'never',
    'selector-max-id': 0,
    'selector-no-qualifying-type': [
      true,
      {
        ignore: ['attribute', 'class', 'id']
      }
    ],

    // SCSS specific
    'scss/at-rule-no-unknown': true,
    'scss/dollar-variable-pattern': '^[a-z][a-zA-Z0-9_-]*$',
    'scss/at-mixin-pattern': '^[a-z][a-zA-Z0-9_-]*$',
    'scss/at-function-pattern': '^[a-z][a-zA-Z0-9_-]*$',
    'scss/percent-placeholder-pattern': '^[a-z][a-zA-Z0-9_-]*$',
    'scss/selector-no-redundant-nesting-selector': true,
    'scss/comment-no-empty': true,
    'scss/declaration-nested-properties': 'never',
    'scss/dimension-no-non-numeric-values': true,
    'scss/no-duplicate-dollar-variables': true,
    'scss/no-duplicate-mixins': true,
    'scss/operator-no-newline-after': true,
    'scss/operator-no-newline-before': true,
    'scss/operator-no-unspaced': true,

    // Order
    'order/order': [
      'custom-properties',
      'dollar-variables',
      {
        type: 'at-rule',
        name: 'extend'
      },
      {
        type: 'at-rule',
        name: 'include',
        hasBlock: false
      },
      'declarations',
      {
        type: 'at-rule',
        name: 'include',
        hasBlock: true
      },
      'rules'
    ],

    // Disable some rules that conflict with Prettier
    'declaration-empty-line-before': null,
    'value-keyword-case': null,
    'function-name-case': null
  }
};
