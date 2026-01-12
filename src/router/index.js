import { supabase } from '@/lib/supabaseClient';
import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

let user = null;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'index',
      path: '/',
      component: HomeView,
      meta: { requiresAuth: true }
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

const getUser = async (next) => {
  user = await supabase.auth.getSession();
  if (user.data.session === null || user === null) {
    next({ name: 'auth' })
  } else {
    next();
  }
}

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    await getUser(next)
  } else {
    next()
  }
})

export default router
