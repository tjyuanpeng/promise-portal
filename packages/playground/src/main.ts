import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { createPromisePortal, detectPromisePortalInstance } from 'promise-portal'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPromisePortal({ unmountDelay: 203 }))
app.mount('#app')

if (import.meta.env.DEV) {
  detectPromisePortalInstance()
}
console.log(import.meta.env.DEV)
