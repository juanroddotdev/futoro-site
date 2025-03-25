
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

// Create a new component for experiments
const Playground = () => import('@/views/Playground.vue')
// Add the new PhoneTest route
const PhoneTest = () => import('@/views/PhoneTest.vue')
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
    path: '/phone-test',
    name: 'PhoneTest',
    component: PhoneTest,
    meta: {
      title: 'Phone Component Testing'
    }
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

