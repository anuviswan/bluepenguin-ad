import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/d'
    },
    {
      path: '/d',
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
    {
      path: '/features/edit/:id',
      name: 'edit-feature',
      component: () => import('../views/EditFeatureView.vue'),
    },
    {
      path: '/collections',
      name: 'collections',
      component: () => import('../views/CollectionListView.vue'),
    },
    {
      path: '/collections/add',
      name: 'add-collection',
      component: () => import('../views/AddCollectionView.vue'),
    },
    {
      path: '/collections/edit/:id',
      name: 'edit-collection',
      component: () => import('../views/EditCollectionView.vue'),
    },
    {
      path: '/materials',
      name: 'materials',
      component: () => import('../views/MaterialListView.vue'),
    },
    {
      path: '/products/create',
      name: 'create-product',
      component: () => import('../views/CreateProductView.vue'),
    },
    {
      path: '/products/:sku',
      name: 'product-details',
      component: () => import('../views/ProductDetailsView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { public: true }
    },
  ],
})

import { useAuthStore } from '../stores/auth';

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isPublic = to.matched.some(record => record.meta.public);

  if (!isPublic && !authStore.isAuthenticated) {
    next({ name: 'login' });
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

export default router
