import { h, createApp } from 'vue'
import ElementPlus from 'element-plus'
import { createPromisePortal, Options } from 'promise-portal'

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
