<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ProductService, type Product } from '../../services/ProductService';
import { CategoryService } from '../../services/CategoryService';
import { CollectionService } from '../../services/CollectionService';
import { MaterialService } from '../../services/MaterialService';
import { FeatureService } from '../../services/FeatureService';
import { FileUploadService } from '../../services/FileUploadService';
import { ArtisanFavService } from '../../services/ArtisanFavService';

const products = ref<Product[]>([]);
const totalCount = ref(0);
const categories = ref<{id: string, name: string}[]>([]);
const collections = ref<{id: string, name: string}[]>([]);
const materials = ref<{id: string, name: string}[]>([]);
const features = ref<{id: string, name: string}[]>([]);
const statuses = ref<string[]>(['Status', 'In Stock', 'Out of Stock']);
const productThumbnails = ref<Record<string, string | null>>({});
const artisanFavs = ref<string[]>([]);

const router = useRouter();

const isLoading = ref(true);
const error = ref<string | null>(null);

// Filters
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedCollection = ref('');
const selectedMaterial = ref('');
const selectedFeature = ref('');
const selectedStatus = ref('Status');

// Pagination
const currentPage = ref(1);
const pageSize = ref(10);

const filteredProducts = computed(() => {
  // We still filter locally for now if search/filters are applied, 
  // but we fetch based on pagination. 
  // Note: True server-side filtering would require updated API parameters for search too.
  return products.value.filter(product => {
    // Search filter (Name or SKU)
    const matchesSearch = !searchQuery.value || 
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (product.sku?.toLowerCase().includes(searchQuery.value.toLowerCase()) ?? false);

    // Status filter
    const matchesStatus = selectedStatus.value === 'Status' || 
      product.status === selectedStatus.value;

    return matchesSearch && matchesStatus;
  });
});

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value));

const setPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchProducts();
  }
};

const nextPage = () => setPage(currentPage.value + 1);
const prevPage = () => setPage(currentPage.value - 1);

const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const hasDropdownFilters = selectedCategory.value || selectedCollection.value || selectedMaterial.value || selectedFeature.value;

    let total;
    let data;

    if (hasDropdownFilters) {
       const filters = {
          category: selectedCategory.value || undefined,
          collection: selectedCollection.value || undefined,
          material: selectedMaterial.value || undefined,
          feature: selectedFeature.value || undefined
       };
       const res = await ProductService.search(filters, currentPage.value, pageSize.value);
       data = res.products;
       total = res.totalCount;
    } else {
       const res = await ProductService.getAll(currentPage.value, pageSize.value);
       data = res.products;
       total = res.totalCount;
    }

    products.value = data;
    totalCount.value = total;
    // Load thumbnails for the visible products
    loadThumbnails(data);
  } catch (err) {
    console.error('Failed to fetch products:', err);
    error.value = 'Failed to load products.';
  } finally {
    isLoading.value = false;
  }
};

const loadThumbnails = async (productList: Product[]) => {
  // Reset or just update the visible ones
  // For better performance, we only fetch for products we don't have yet if they are in the current list
  const fetchPromises = productList.map(async (product) => {
    const sku = product.sku || 'N/A';
    if (!productThumbnails.value[sku]) {
      try {
        const url = await FileUploadService.getThumbnailUrl(sku);
        productThumbnails.value[sku] = url;
      } catch (err) {
        console.warn(`Failed to fetch thumbnail for ${sku}`, err);
        productThumbnails.value[sku] = null;
      }
    }
  });
  await Promise.all(fetchPromises);
};

const fetchData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const [categoriesData, collectionsData, materialsData, featuresData, favsData] = await Promise.all([
      CategoryService.getAll(),
      CollectionService.getAll(),
      MaterialService.getAll(),
      FeatureService.getAll(),
      ArtisanFavService.getAll()
    ]);

    categories.value = categoriesData.map(c => ({ id: c.id, name: c.name }));
    collections.value = collectionsData.map(c => ({ id: c.id, name: c.name }));
    materials.value = materialsData.map(m => ({ id: m.id, name: m.name }));
    features.value = featuresData.map(f => ({ id: f.id, name: f.name }));
    artisanFavs.value = favsData.map(f => f.sku);
    
    // Fetch products based on current filters
    await fetchProducts();
  } catch (err) {
    console.error('Failed to fetch dashboard data:', err);
    error.value = 'Failed to load dashboard data. Please try again later.';
  } finally {
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

const isDiscountActive = (product: Product) => {
  if (!product.discountPrice) return false;
  if (!product.discountExpiryDate) return true;
  return new Date(product.discountExpiryDate) > new Date();
};

onMounted(() => {
  // Read feature, category, and collection query params and initialize filters
  const currentRoute = router.currentRoute.value;
  if (currentRoute.query.feature) {
    selectedFeature.value = currentRoute.query.feature as string;
  }
  if (currentRoute.query.category) {
    selectedCategory.value = currentRoute.query.category as string;
  }
  if (currentRoute.query.collection) {
    selectedCollection.value = currentRoute.query.collection as string;
  }
  if (currentRoute.query.material) {
    selectedMaterial.value = currentRoute.query.material as string;
  }
  
  fetchData();
});

// Watch for changes that require a complete refresh (resetting pagination)
watch([selectedCategory, selectedCollection, selectedMaterial, selectedFeature], () => {
  currentPage.value = 1;
  fetchData();
});

// Watch for pagination changes
watch(currentPage, () => {
  fetchData();
});
</script>

<template>
  <div class="product-section card">
    <div class="section-header">
      <h2>Products</h2>
      <button class="btn btn-primary" @click="router.push('/products/create')">
        <span class="material-icons-outlined">add</span>
        Add Product
      </button>
    </div>

    <div class="filters">
      <div class="filter-group">
        <div class="search-box">
          <span class="material-icons-outlined">search</span>
          <input type="text" placeholder="Search..." v-model="searchQuery" @input="currentPage = 1" />
        </div>
        
        <div class="select-wrapper">
          <select v-model="selectedCategory" @change="currentPage = 1">
            <option value="">Category</option>
            <option v-for="opt in categories" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
          </select>
          <span class="material-icons-outlined">expand_more</span>
        </div>

        <div class="select-wrapper">
          <select v-model="selectedCollection" @change="currentPage = 1">
            <option value="">Collection</option>
            <option v-for="opt in collections" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
          </select>
          <span class="material-icons-outlined">expand_more</span>
        </div>

        <div class="select-wrapper">
          <select v-model="selectedMaterial" @change="currentPage = 1">
            <option value="">Material</option>
            <option v-for="opt in materials" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
          </select>
          <span class="material-icons-outlined">expand_more</span>
        </div>

        <div class="select-wrapper">
          <select v-model="selectedFeature" @change="currentPage = 1">
            <option value="">Feature</option>
            <option v-for="opt in features" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
          </select>
          <span class="material-icons-outlined">expand_more</span>
        </div>

        <div class="select-wrapper">
          <select v-model="selectedStatus" @change="currentPage = 1">
            <option v-for="opt in statuses" :key="opt" :value="opt">{{ opt }}</option>
          </select>
          <span class="material-icons-outlined">expand_more</span>
        </div>
      </div>
    </div>

    <div v-if="error" class="error-message p-4 text-danger mb-4">
      {{ error }}
    </div>

    <div v-if="isLoading" class="loading-state p-8 flex-center">
      <div class="spinner"></div>
      <p class="ml-4">Loading products...</p>
    </div>

    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>SKU</th>
            <th>Name</th>
            <th>Category</th>
            <th>Collection</th>
            <th>Material</th>
            <th>Price</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
                <tr v-for="product in filteredProducts" :key="product.sku || product.name" @click="router.push(`/products/${product.sku || 'N/A'}`)" class="clickable-row">
            <td>
              <div class="thumbnail-wrapper">
                <img v-if="product.sku && productThumbnails[product.sku]" :src="productThumbnails[product.sku]!" alt="Thumbnail" class="thumbnail" />
                <div v-else class="thumbnail-placeholder">
                  <span class="material-icons-outlined">image</span>
                </div>
              </div>
            </td>
            <td>{{ product.sku }}</td>
            <td>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="product-name">{{ product.name }}</span>
                <span v-if="artisanFavs.includes(product.sku!)" class="artisan-badge" title="Artisan's Favorite">
                  <span class="material-icons-outlined">star</span>
                </span>
              </div>
            </td>
            <td>{{ getCategoryName(product.category) }}</td>
            <td>{{ getCollectionName(product.collectionCode) }}</td>
            <td>{{ getMaterialName(product.material) }}</td>
            <td>
              <div class="price-cell">
                <span :class="['price-val', { 'strikethrough': isDiscountActive(product) }]">₹{{ product.price }}</span>
                <span v-if="isDiscountActive(product)" class="discount-val">₹{{ product.discountPrice }}</span>
              </div>
            </td>
            <td>
              <span :class="['badge', product.status === 'In Stock' ? 'badge-success' : 'badge-danger']">
                <span class="dot"></span>
                {{ product.status }}
              </span>
            </td>
            <td class="actions-cell">
              <span class="material-icons-outlined">more_horiz</span>
            </td>
          </tr>
          <tr v-if="filteredProducts.length === 0">
            <td colspan="9" class="text-center p-8 text-muted">No products found for the selected filters.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <span class="results-count">
        Showing {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, totalCount) }} of {{ totalCount }} Products
      </span>
      <div class="pages" v-if="totalPages > 1">
        <button class="page-btn" @click="prevPage" :disabled="currentPage === 1">
          <span class="material-icons-outlined">chevron_left</span>
        </button>
        <button 
          v-for="page in totalPages" 
          :key="page" 
          class="page-btn" 
          :class="{ active: currentPage === page }"
          @click="setPage(page)"
        >
          {{ page }}
        </button>
        <button class="page-btn" @click="nextPage" :disabled="currentPage === totalPages">
          <span class="material-icons-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-section {
  margin-top: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 700;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filters {
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 6px 12px;
  gap: 8px;
  flex: 1;
  min-width: 200px;
}

.search-box input {
  border: none;
  outline: none;
  width: 100%;
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.select-wrapper select {
  padding: 8px 32px 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: white;
  appearance: none;
  font-size: 13px;
  color: var(--text-muted);
  cursor: pointer;
}

.select-wrapper .material-icons-outlined {
  position: absolute;
  right: 8px;
  pointer-events: none;
  font-size: 18px;
  color: var(--text-muted);
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 12px;
  font-size: 12px;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-color);
  font-weight: 500;
}

td {
  padding: 12px;
  font-size: 13px;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.thumbnail-wrapper {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-placeholder {
  color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-placeholder .material-icons-outlined {
  font-size: 20px;
}

.product-name {
  font-weight: 500;
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.clickable-row:hover {
  background-color: #f8f9fa;
}

.product-name {
  font-weight: 500;
}

.artisan-badge {
  color: #fbbf24; /* Gold color */
  display: inline-flex;
  align-items: center;
}

.artisan-badge .material-icons-outlined {
  font-size: 16px;
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

.actions-cell {
  text-align: right;
  color: var(--text-muted);
  cursor: pointer;
}

.price-cell {
  display: flex;
  flex-direction: column;
}

.price-val.strikethrough {
  text-decoration: line-through;
  font-size: 11px;
  color: var(--text-muted);
}

.discount-val {
  color: var(--danger-color);
  font-weight: 600;
  font-size: 14px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.results-count {
  font-size: 12px;
  color: var(--text-muted);
}

.pages {
  display: flex;
  gap: 8px;
}

.page-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: white;
  font-size: 13px;
  color: var(--text-muted);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.ml-4 { margin-left: 16px; }
.text-center { text-align: center; }

.error-message {
  border: 1px solid #ffccd1;
  background-color: #fff5f5;
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--danger-color);
}
</style>
