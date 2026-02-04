import type { Options } from 'promise-portal'
import ElementPlus from 'element-plus'
import { createPromisePortal } from 'promise-portal'
import { createApp, h } from 'vue'

export default (defaultOptions?: Options) => {
  const pInstance = createPromisePortal(defaultOptions)

  const app = createApp(() => h('div'))
  app.use(ElementPlus)
  app.use(pInstance)
  app.mount('#app2')
  return {
    pInstance,
    app,
  }
}
