import { createRouter, createWebHistory } from 'vue-router'

// Create a new component for experiments
// const Playground = () => import('@/views/Playground.vue')
const HomePage = () => import('@/views/HomePage.vue')
const WireframeDemo = () => import('@/views/WireframeDemo.vue')
const ClientFormView = () => import('@/views/ClientFormView.vue')

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
    path: '/client-form',
    name: 'ClientForm',
    component: ClientFormView,
    meta: {
      title: 'Client Questionnaire'
    }
  }
]

const router = createRouter({
  history: createWebHistory('/futoro-site/'),
  routes
})

export default router

