module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
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
    AnyObject: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'max-len': [
      'warn',
      {
        code: 100,
        ignoreStrings: true, // 忽略包含单/双引号字符串的行
        ignoreTemplateLiterals: true, // 忽略包含模板字符串（反引号）的行
        ignoreRegExpLiterals: true, // 忽略正则表达式
        ignoreUrls: true, // 忽略包含 URL 的行
        ignoreComments: true, // 忽略注释行
      },
    ],
    // 允许单字组件名（uni-app 页面常见）
    'vue/multi-word-component-names': 'off',
    // 允许使用 any 类型
    '@typescript-eslint/no-explicit-any': 'off',
    // 允许未使用的变量以 _ 开头
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    // 1. 允许单行写多个属性，只要没超过 Prettier 的长度限制，就不会强行换行
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: 10, // 单行标签最多允许属性个数
        multiline: 10, // 多行标签每行属性个数
      },
    ],

    // 2. 关闭强制每个属性换行的规则
    'vue/first-attribute-linebreak': 'off',

    // 3. 控制 HTML 标签闭合括号的位置，防止 > 被挤到下一行
    // 'vue/html-closing-bracket-newline': [
    //   'warn',
    //   {
    //     singleline: 'always', // 单行标签的 > 不换行
    //     multiline: 'always', // 多行标签的 > 也不换行
    //   },
    // ],

    // 4. 控制标签内容的换行（最关键：防止文字被强制换行）
    'vue/singleline-html-element-content-newline': 'off', // 关闭单行元素内容强制换行
    'vue/multiline-html-element-content-newline': 'off', // 关闭多行元素内容强制换行
  },
  ignorePatterns: ['dist/', 'node_modules/'],
}
