import { createRouter, createWebHistory } from 'vue-router'

// Lazy load the views for better performance
const ProcessView = () => import('@/views/ProcessView.vue')
const FinalView = () => import('@/views/FinalView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'process',
      component: ProcessView
    },
    {
      path: '/final',
      name: 'final',
      component: FinalView
    }
  ]
})

export default router