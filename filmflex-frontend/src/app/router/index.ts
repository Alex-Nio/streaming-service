import { createWebHistory, createRouter } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: '',
      path: '/',
      component: () => import('@/pages/Home.vue')
    },
    {
      name: 'search',
      path: '/search',
      component: () => import('@/pages/Search.vue')
    },
    {
      name: 'movie',
      path: '/movies/:id',
      component: () => import('@/pages/Movie.vue')
    }
  ]
});

export default router;
