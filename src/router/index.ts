
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

// Create a new component for experiments
const Playground = () => import('@/views/Playground.vue')


// Add the new HomeRebuilt route
const HomeRebuilt = () => import('@/views/HomeRebuilt.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeRebuilt
  },
  {
    path: '/playground',
    name: 'Playground',
    component: Playground
  },
  {
    path: '/home-rebuilt',
    name: 'HomeRebuilt',
    component: HomeRebuilt,
    meta: {
      title: 'Home Rebuilt'
    }
  }
]

const router = createRouter({
  history: createWebHistory('/futoro-site/'),
  routes
})

export default router

