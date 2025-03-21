import { createRouter, createWebHistory } from 'vue-router'

const lazyLoad = (view: string) => () => import(`../views/${view}/${view}View.vue`)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: lazyLoad('Home'),
    },
    {
      path: '/library',
      name: 'library',
      component: lazyLoad('Library'),
    },
    {
      path: '/book/:id',
      name: 'book',
      component: lazyLoad('Book'),
    },
  ],
})

export default router
