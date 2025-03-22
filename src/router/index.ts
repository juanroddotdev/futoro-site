import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/playground',
    name: 'Playground',
    component: () => import('@/views/PlaygroundView.vue'),
    meta: {
      title: 'Component Playground'
    }
  }
]

const router = createRouter({
  history: createWebHistory('/futoro-site/'),
  routes
})

export default router
