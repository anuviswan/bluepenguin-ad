<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '../components/layout/MainLayout.vue';
import { ProductService, type Product } from '../services/ProductService';
import { FeatureService, type Feature } from '../services/FeatureService';
import { CategoryService, type Category } from '../services/CategoryService';
import { CollectionService, type Collection } from '../services/CollectionService';
import { MaterialService, type Material } from '../services/MaterialService';
import { FileUploadService } from '../services/FileUploadService';

const route = useRoute();
const router = useRouter();
const sku = route.params.sku as string;

const product = ref<Product | null>(null);
const features = ref<Feature[]>([]);
const categories = ref<Category[]>([]);
const collections = ref<Collection[]>([]);
const materials = ref<Material[]>([]);
const productImages = ref<string[]>([]);
const primaryImageId = ref<string | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const fetchProductAndMetadata = async () => {
  const currentSku = route.params.sku as string;
  console.log('ProductDetailsView: Fetching for SKU:', currentSku);
  isLoading.value = true;
  error.value = null;
  
  try {
    // Fetch product data first as it's the primary content
    console.log('ProductDetailsView: Fetching product data...');
    const productData = await ProductService.getBySku(currentSku);
    console.log('ProductDetailsView: Product data received:', productData);
    product.value = productData;
    
    // Once we have product data, we can stop showing the main loading spinner
    isLoading.value = false;

    // Fetch metadata in background
    Promise.all([
      FeatureService.getAll().then(res => features.value = res).catch(e => console.warn('Features fetch failed', e)),
      CategoryService.getAll().then(res => categories.value = res).catch(e => console.warn('Categories fetch failed', e)),
      CollectionService.getAll().then(res => collections.value = res).catch(e => console.warn('Collections fetch failed', e)),
      MaterialService.getAll().then(res => materials.value = res).catch(e => console.warn('Materials fetch failed', e)),
      FileUploadService.getAllImagesForSku(currentSku).then(res => productImages.value = res).catch(e => console.warn('Images fetch failed', e)),
      FileUploadService.getPrimaryImageIdForSku(currentSku).then(res => primaryImageId.value = res).catch(e => console.warn('Primary image fetch failed', e))
    ]);
  } catch (err) {
    console.error('ProductDetailsView: Fatal fetch error:', err);
    error.value = 'Failed to load product details. Please try again later.';
    isLoading.value = false;
  }
};

const getCategoryName = (code: string) => {
  const item = categories.value.find(c => c.id === code);
  return item ? `${item.name} (${code})` : code;
};

const getCollectionName = (code: string) => {
  const item = collections.value.find(c => c.id === code);
  return item ? `${item.name} (${code})` : code;
};

const getMaterialName = (code: string) => {
  const item = materials.value.find(m => m.id === code);
  return item ? `${item.name} (${code})` : code;
};

const getFeatureName = (code: string) => {
  const feature = features.value.find(f => f.id === code);
  return feature ? feature.name : code;
};

const getImageUrl = (imageId: string) => {
  const skuVal = (route.params.sku as string) || product.value?.sku || '';
  return FileUploadService.getImageUrl(skuVal, imageId);
};

const productFeatures = computed(() => {
  if (!product.value || !product.value.featureCodes) return [];
  
  // Defensive check in case it's not an array (e.g. if API returns it as a string)
  const codes = Array.isArray(product.value.featureCodes) 
    ? product.value.featureCodes 
    : [];
    
  return codes.map(code => ({
    code,
    name: getFeatureName(code)
  }));
});

onMounted(() => {
  fetchProductAndMetadata();
});

const goBack = () => {
  router.back();
};
</script>

<template>
  <MainLayout>
    <div class="product-details-page">
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs flex align-center gap-2">
        <router-link to="/" class="breadcrumb-item">Products</router-link>
        <span class="material-icons-outlined sep">chevron_right</span>
        <span class="breadcrumb-item active">{{ product?.name || 'Product Details' }}</span>
      </nav>

      <div class="page-header mt-6 flex justify-between align-center">
        <div class="flex align-center gap-4">
          <button class="btn-icon back-btn" @click="goBack" title="Back">
            <span class="material-icons-outlined">arrow_back</span>
          </button>
          <h2>{{ product?.name }}</h2>
          <span v-if="product" :class="['badge', product.status === 'Active' ? 'badge-success' : 'badge-warning']" style="height: fit-content; margin-top: 4px;">
            <span class="dot"></span>
            {{ product.status }}
          </span>
        </div>
        <div class="header-actions flex gap-4">
          <router-link :to="`/products/edit/${sku}`" class="btn btn-outline flex align-center gap-2">
            <span class="material-icons-outlined">edit</span>
            Edit Product
          </router-link>
        </div>
      </div>

      <div v-if="isLoading" class="loading-state p-12 flex-center flex-column gap-4">
        <div class="spinner large"></div>
        <p>Loading product details...</p>
      </div>

      <div v-else-if="error" class="error-state p-12 flex-center flex-column gap-4 text-danger">
        <span class="material-icons-outlined large-icon">error_outline</span>
        <p>{{ error }}</p>
        <button @click="fetchProductAndMetadata" class="btn btn-primary">Retry</button>
      </div>

      <div v-else-if="product" class="details-content mt-6">
        <div class="details-grid">
          <!-- Left Column - Main Info -->
          <div class="main-column flex-column gap-6">
            <div v-if="productImages.length > 0" class="card p-6">
              <h3 class="section-title">Product Images</h3>
              <div class="image-gallery mt-4">
                <div v-for="imageId in productImages" :key="imageId" class="gallery-item" :class="{ 'is-primary': imageId === primaryImageId }">
                  <img :src="getImageUrl(imageId)" alt="Product" />
                  <div v-if="imageId === primaryImageId" class="primary-overlay-tag">
                    <span class="material-icons-outlined">stars</span>
                    Primary
                  </div>
                </div>
              </div>
            </div>

            <div class="card p-6">
              <h3 class="section-title">General Information</h3>
              <div class="info-grid mt-4">
                <div class="info-item">
                  <label>SKU</label>
                  <span>{{ product.sku }}</span>
                </div>
                <div class="info-item">
                  <label>Price</label>
                  <span class="price-text">₹{{ product.price.toLocaleString() }}</span>
                </div>
                <div class="info-item">
                  <label>Category</label>
                  <span>{{ getCategoryName(product.category) }}</span>
                </div>
                <div class="info-item">
                  <label>Material</label>
                  <span>{{ getMaterialName(product.material) }}</span>
                </div>
                <div class="info-item">
                  <label>Collection</label>
                  <span>{{ getCollectionName(product.collectionCode) }}</span>
                </div>
                <div class="info-item">
                  <label>Year / Sequence</label>
                  <span>{{ product.yearCode }} / {{ product.sequenceCode }}</span>
                </div>
              </div>
            </div>

            <div class="card p-6">
              <h3 class="section-title">Description</h3>
              <p class="description-text mt-4">{{ product.description || 'No description provided.' }}</p>
            </div>

            <div class="card p-6">
              <h3 class="section-title">Features</h3>
              <div v-if="productFeatures.length > 0" class="features-list mt-4 flex flex-wrap gap-2">
                <span v-for="feature in productFeatures" :key="feature.code" class="feature-tag">
                  {{ feature.name }}
                </span>
              </div>
              <p v-else class="text-muted mt-4">No features assigned.</p>
            </div>
          </div>

          <!-- Right Column - Sidebar Style Info -->
          <div class="side-column flex-column gap-6">
            <div class="card p-6">
              <h3 class="section-title">Product Care</h3>
              <ul v-if="product.productCare?.length" class="care-list mt-4">
                <li v-for="(instruction, index) in product.productCare" :key="index">
                  <span class="material-icons-outlined">check_circle</span>
                  {{ instruction }}
                </li>
              </ul>
              <p v-else class="text-muted mt-4">No care instructions provided.</p>
            </div>

            <div class="card p-6">
              <h3 class="section-title">Specifications</h3>
              <div v-if="product.specifications?.length" class="specs-list mt-4">
                <div v-for="(spec, index) in product.specifications" :key="index" class="spec-item p-3 mb-2">
                  {{ spec }}
                </div>
              </div>
              <p v-else class="text-muted mt-4">No specifications provided.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.product-details-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.breadcrumbs {
  font-size: 14px;
}

.breadcrumb-item {
  color: var(--text-muted);
  text-decoration: none;
}

.breadcrumb-item.active {
  color: var(--text-main);
  font-weight: 500;
}

.sep {
  font-size: 18px;
  color: #ccc;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.back-btn {
  background-color: white;
  border: 1px solid var(--border-color);
  color: var(--text-main);
}

.back-btn:hover {
  background-color: var(--bg-main);
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.details-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.main-column, .side-column {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 12px;
  margin-bottom: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item span {
  font-size: 15px;
  color: var(--text-main);
}

.price-text {
  font-weight: 600;
  color: var(--primary-color);
  font-size: 18px !important;
}

.description-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-main);
  white-space: pre-line;
}

.feature-tag {
  background-color: var(--primary-light);
  color: var(--primary-color);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.care-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.care-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  color: var(--text-main);
}

.care-list li .material-icons-outlined {
  font-size: 18px;
  color: var(--success-color);
  margin-top: 1px;
}

.specs-list {
  display: flex;
  flex-direction: column;
}

.spec-item {
  background-color: #fafafa;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--text-main);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}

.spinner.large {
  width: 48px;
  height: 48px;
  border-width: 4px;
}

.large-icon {
  font-size: 48px;
}

.mt-6 { margin-top: 24px; }
.p-12 { padding: 48px; }
.gap-6 { gap: 24px; }

@media (max-width: 992px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
}
.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.gallery-item {
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--border-color);
  position: relative;
  transition: all 0.2s ease;
}

.gallery-item.is-primary {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(43, 87, 154, 0.2);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.primary-overlay-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: var(--primary-color);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  z-index: 10;
}

.primary-overlay-tag .material-icons-outlined {
  font-size: 14px;
}
</style>
