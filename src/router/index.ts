import { createRouter, createWebHistory } from 'vue-router'

// Create a new component for experiments
// const Playground = () => import('@/views/Playground.vue')
const HomePage = () => import('@/views/HomePage.vue')
const SimpleHomePage = () => import('@/views/SimpleHomePage.vue')
const WireframeDemo = () => import('@/views/WireframeDemo.vue')
const ClientFormView = () => import('@/views/ClientFormView.vue')
const ClientFormTwoColumn = () => import('@/views/ClientFormTwoColumn.vue')
const MockBentoDemo = () => import('@/pages/MockBentoDemo.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: SimpleHomePage
  },
  {
    path: '/classic',
    name: 'ClassicHome',
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
  },
  {
    path: '/client-form-2col',
    name: 'ClientFormTwoColumn',
    component: ClientFormTwoColumn,
    meta: {
      title: 'Client Questionnaire (Two Column)'
    }
  },
  {
    path: '/bento-demo',
    name: 'BentoDemo',
    component: MockBentoDemo,
    meta: {
      title: 'Bento Box Demo'
    }
  },
  {
    path: '/client-form-alt',
    name: 'ClientFormAlt',
    component: () => import('@/views/ClientFormAltView.vue'),
    meta: {
      title: 'Client Questionnaire (Alternative)'
    }
  }
]

const router = createRouter({
  history: createWebHistory('/futoro-site/'),
  routes
})

export default router

