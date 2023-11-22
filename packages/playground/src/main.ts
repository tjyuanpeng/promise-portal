import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import router from './router'
import 'dayjs/locale/zh-cn'
import Antd from 'ant-design-vue'
import ElementPlus from 'element-plus'
import { createPromisePortal, detectPromisePortalInstance } from 'promise-portal'
import App from './App.vue'

const app = createApp(App)
app.use(Antd)
app.use(router)
app.use(ElementPlus)
app.use(createPromisePortal())
app.mount('#app')

if (import.meta.env.DEV) {
  detectPromisePortalInstance({
    text: 'Detected unreleased promise-portal instance',
  })
}
