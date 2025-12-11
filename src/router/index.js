import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'index',
      path: '/',
      component: HomeView
    },
    {
      name: 'auth',
      path: '/auth',
      component: () => import('../views/AuthView.vue')
    },
    {
      name: 'reset-password',
      path: '/reset-password',
      component: () => import('../views/ResetPassword.vue')
    },
  ],
})

export default router
