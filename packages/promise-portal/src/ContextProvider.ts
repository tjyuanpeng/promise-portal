import type { App } from 'vue'
import { defineComponent, getCurrentInstance } from 'vue'

export const appMap = new WeakMap<App, any>()

export const getProvidesFromContextProvider = (app: App) => appMap.get(app)

export const ContextProvider = defineComponent({
  name: 'PromisePortalContextProvider',
  setup(_props, { slots }) {
    const ci = getCurrentInstance()
    if (ci) {
      const app = ci.appContext.app
      app && appMap.set(app, (ci as any).provides)
    }
    return () => slots.default?.()
  },
})
