import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Index from './pages/index.vue'
import Basic from './pages/basic/index.vue'
import Context from './pages/context/index.vue'
import Instance from './pages/instance/index.vue'
import CpApp from './pages/context-provider/App.vue'
import CpIndex from './pages/context-provider/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Index,
  },
  {
    path: '/basic',
    component: Basic,
  },
  {
    path: '/context',
    component: Context,
  },
  {
    path: '/instance',
    component: Instance,
  },
  {
    path: '/context-provider',
    component: CpApp,
    children: [
      {
        path: '',
        component: CpIndex,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
