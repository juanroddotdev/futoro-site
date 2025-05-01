import { createRouter, createWebHistory } from 'vue-router'

// Create a new component for experiments
// const Playground = () => import('@/views/Playground.vue')
const HomePage = () => import('@/views/HomePage.vue')
const SimpleHomePage = () => import('@/views/SimpleHomePage.vue')
const WireframeDemo = () => import('@/views/WireframeDemo.vue')
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
    component: ClientFormTwoColumn,
    meta: {
      title: 'Client Questionnaire'
    },
    children: [
      {
        path: '',
        redirect: { name: 'ClientFormAbout' }
      },
      {
        path: 'about',
        name: 'ClientFormAbout',
        component: ClientFormTwoColumn,
        meta: {
          step: 'about',
          title: 'About Your Website'
        }
      },
      {
        path: 'design',
        name: 'ClientFormDesign',
        component: ClientFormTwoColumn,
        meta: {
          step: 'design',
          title: 'Design Style'
        }
      },
      {
        path: 'functionality',
        name: 'ClientFormFunctionality',
        component: ClientFormTwoColumn,
        meta: {
          step: 'functionality',
          title: 'Features & Content'
        }
      },
      {
        path: 'logistics',
        name: 'ClientFormLogistics',
        component: ClientFormTwoColumn,
        meta: {
          step: 'logistics',
          title: 'Project Details'
        }
      }
    ]
  },
  {
    path: '/bento-demo',
    name: 'BentoDemo',
    component: MockBentoDemo,
    meta: {
      title: 'Bento Box Demo'
    }
  }
]

const router = createRouter({
  history: createWebHistory('/futoro-site/'),
  routes
})

export default router

