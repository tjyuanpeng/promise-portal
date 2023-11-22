import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import App from './App.vue'
import Index from './pages/index.vue'
import Basic from './pages/basic/index.vue'
import Context from './pages/context/index.vue'
import Instance from './pages/instance/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: App,
    children: [
      {
        path: '',
        component: Index,
      },
      {
        path: 'basic',
        component: Basic,
      },
      {
        path: 'context',
        component: Context,
      },
      {
        path: 'instance',
        component: Instance,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
