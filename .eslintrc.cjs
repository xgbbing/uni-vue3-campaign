module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript'
  ],
  // 声明 uni-app 和小程序的全局变量，防止误报
  globals: {
    uni: 'readonly',
    wx: 'readonly',
    getCurrentPages: 'readonly',
    getApp: 'readonly',
    UniApp: 'readonly',
    UniHelper: 'readonly',
    App: 'readonly',
    Page: 'readonly',
    Component: 'readonly',
    AnyObject: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'max-len': ['warn', { code: 200 }],
    // 允许单字组件名（uni-app 页面常见）
    'vue/multi-word-component-names': 'off',
    // 允许使用 any 类型
    '@typescript-eslint/no-explicit-any': 'off',
    // 允许未使用的变量以 _ 开头
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    // 1. 允许单行写多个属性，只要没超过 Prettier 的长度限制，就不会强行换行
    'vue/max-attributes-per-line': ['warn', {
      singleline: 3,  // 单行标签最多允许 3 个属性
      multiline: 3    // 多行标签每行 3 个属性
    }],

    // 2. 关闭强制每个属性换行的规则
    'vue/first-attribute-linebreak': 'off'
  },
  ignorePatterns: ['dist/', 'node_modules/'],
};