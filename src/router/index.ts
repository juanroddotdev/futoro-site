
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

// Create a new component for experiments
const Playground = () => import('@/views/Playground.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/playground',
    name: 'Playground',
    component: Playground
  }
]

const router = createRouter({
  history: createWebHistory('/futoro-site/'),
  routes
})

export default router

