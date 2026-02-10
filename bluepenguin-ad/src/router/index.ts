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
  ],
})

export default router
