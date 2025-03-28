
import { createRouter, createWebHistory } from 'vue-router'

// Create a new component for experiments
// const Playground = () => import('@/views/Playground.vue')
const HomePage = () => import('@/views/HomePage.vue')
const WireframeDemo = () => import('@/views/WireframeDemo.vue')

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
  }
]

const router = createRouter({
  history: createWebHistory('/futoro-site/'),
  routes
})

export default router

