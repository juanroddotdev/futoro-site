
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

// Create a new component for experiments
const Playground = () => import('@/views/Playground.vue')

// Add the new StickyPlayground route
const StickyPlayground = () => import('@/views/StickyPlayground.vue')

// Add the new HomeTest route
const HomeTest = () => import('@/views/HomeTest.vue')

// Add the new HomeHeroTest route
const HomeHeroTest = () => import('@/views/HomeHeroTest.vue')

// Add the new HomeRebuilt route
const HomeRebuilt = () => import('@/views/HomeRebuilt.vue')

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
  },
  {
    path: '/home-test',
    name: 'HomeTest',
    component: HomeTest
  },
  {
    path: '/sticky-playground',
    name: 'StickyPlayground',
    component: StickyPlayground
  },
  {
    path: '/home-hero-test',
    name: 'HomeHeroTest',
    component: HomeHeroTest
  },
  {
    path: '/flexible-content-test',
    name: 'FlexibleContentTest',
    component: () => import('@/views/FlexibleContentTest.vue'),
    meta: {
      title: 'Flexible Content Test'
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

