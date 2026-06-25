import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
  },
  {
    path: '/comic/:slug',
    name: 'ComicDetail',
    component: () => import('../views/ComicDetail.vue'),
  },
  {
    path: '/read/:slug/:chapter',
    name: 'Reader',
    component: () => import('../views/Reader.vue'),
  },
  {
    path: '/dashboard',
    name: 'CreatorDashboard',
    component: () => import('../views/CreatorDashboard.vue'),
    meta: { requiresAuth: true, requiresCreator: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const user = JSON.parse(localStorage.getItem('user_data') || 'null')

  if (to.meta.requiresAuth && !token) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.requiresCreator && (!user || user.role !== 'creator')) {
    next({ name: 'Home' })
    return
  }

  next()
})

export default router
