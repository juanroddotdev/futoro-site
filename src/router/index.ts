import { createRouter, createWebHistory } from 'vue-router'
// import SpotlightTest from '../components/SpotlightTest.vue'

// Create a new component for experiments
// const Playground = () => import('@/views/Playground.vue')
const HomePage = () => import('@/views/HomePage.vue')
const WireframeDemo = () => import('@/views/WireframeDemo.vue')
const SpotlightTest = () => import('@/views/SpotlightTest.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  // {
  //   path: '/playground',
  //   name: 'Playground',
  //   component: Playground
  // },
  {
    path: '/wireframe-demo',
    name: 'WireframeDemo',
    component: WireframeDemo,
    meta: {
      title: 'Wireframe Demo'
    }
  },
  {
    path: '/spotlight-test',
    name: 'SpotlightTest',
    component: SpotlightTest,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

