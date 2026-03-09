import antfu from '@antfu/eslint-config'

export default antfu({
  lessOpinionated: true,
  typescript: true,
  formatters: {
    css: true,
    html: true,
    markdown: true,
  },
}).overrideRules({
  'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
  'vue/brace-style': ['error', '1tbs', { allowSingleLine: true }],
})
