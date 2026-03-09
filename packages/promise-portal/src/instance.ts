import type { App } from 'vue'

let activeApp: App | undefined

export const getActiveApp = () => activeApp

export const setActiveApp = (app: App) => activeApp = app

export const createPromisePortal = () => {
  return {
    install(app: App) {
      if (activeApp === app) {
        return
      }
      activeApp = app
      const cleanup = () => activeApp === app && (activeApp = undefined)
      if ('onUnmount' in app && typeof app.onUnmount === 'function') {
        app.onUnmount(cleanup)
      } else {
        app.mixin({
          mounted() {
            !this.$parent && this.$once('hook:unmounted', cleanup)
          },
        })
      }
    },
  }
}
