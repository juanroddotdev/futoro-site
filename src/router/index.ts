import { createRouter, createWebHistory } from 'vue-router'
import GridPaperOverlayDemo from '@/views/GridPaperOverlayDemo.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/App.vue')
  },
  {
    path: '/grid-paper-overlay-demo',
    name: 'GridPaperOverlayDemo',
    component: GridPaperOverlayDemo
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
