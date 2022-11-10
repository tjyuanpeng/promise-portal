import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { createVuePortal } from 'vue-portal'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.use(createVuePortal())
app.mount('#app')
