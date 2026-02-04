import { createPromisePortal, detectPromisePortalInstance } from 'promise-portal'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'dayjs/locale/zh-cn'

const app = createApp(App)
app.use(router)
app.use(createPromisePortal())
app.mount('#app')

if (import.meta.env.DEV) {
  detectPromisePortalInstance({
    text: 'Detected unreleased promise-portal instance.',
  })
  window.addEventListener('unhandledrejection', e => ElMessage.error(e.reason?.message || 'unhandled rejected promise error'))
}
