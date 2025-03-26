
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import ChatSectionsDemo from '@/views/ChatSectionsDemo.vue'

// Create a new component for experiments
const Playground = () => import('@/views/Playground.vue')
const HomeRebuilt = () => import('@/views/HomeRebuilt.vue')
// Add the floating chat demo route
const FloatingChatDemo = () => import('@/views/FloatingChatDemo.vue')

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
  },
  {
    path: '/floating-chat',
    name: 'FloatingChatDemo',
    component: FloatingChatDemo,
    meta: {
      title: 'Floating Chat Demo'
    }
  },
  {
    path: '/chat-sections-demo',
    name: 'ChatSectionsDemo',
    component: ChatSectionsDemo
  }
]

const router = createRouter({
  history: createWebHistory('/futoro-site/'),
  routes
})

export default router

