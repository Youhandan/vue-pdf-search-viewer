module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    //override
    'no-undef': 'off',
    'no-restricted-globals': 'off',
    'max-len': 'off',
    'comma-dangle': 'off',
    'func-names': 'off',
    'object-curly-newline': 'off',
    'no-underscore-dangle': "off",
    'no-return-assign': "off",
    'consistent-return': "off",
    'no-plusplus': "off",
    'one-var-declaration-per-line': 'off',
    'one-var': 'off',
    // 0 disable, 1 warn, 2 error
    "global-require": 0,
    "import/no-unresolved": 0,
    "no-param-reassign": 0,
    "no-redeclare": 0,
    "no-fallthrough": 0,
    "no-cond-assign": 0,
    "no-shadow": 0,
    "import/extensions": 0,
    "import/newline-after-import": 0,
    "no-multi-assign": 0,
    "no-extra-semi": 0,
    "semi": 0,
    "vue/html-self-closing": 0,
    "vue/attributes-order": 0,
    "no-duplicate-imports": 2,
    "linebreak-style": 0,
    "no-unused-vars": [
      2,
      {
        // 允许声明未使用变量
        "vars": "local",
        // 参数不检查
        "args": "none"
      }
    ],
    "vue/max-attributes-per-line": [
      2,
      {
        singleline: 3,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ]
  }
};
