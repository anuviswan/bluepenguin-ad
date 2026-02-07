import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoryListView.vue'),
    },
    {
      path: '/features',
      name: 'features',
      component: () => import('../views/FeatureListView.vue'),
    },
    {
      path: '/features/add',
      name: 'add-feature',
      component: () => import('../views/AddFeatureView.vue'),
    },
  ],
})

export default router
