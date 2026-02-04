import antfu from '@antfu/eslint-config'

export default antfu({
  lessOpinionated: true,
  typescript: true,
  formatters: {
    css: true,
    html: true,
    markdown: true,
  },
  ignores: ['tests'],
}).overrideRules({
  'no-console': 'off',
  'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
  'vue/brace-style': ['error', '1tbs', { allowSingleLine: true }],
})
