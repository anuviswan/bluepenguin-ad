<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MainLayout from '../components/layout/MainLayout.vue';
import { ProductService } from '../services/ProductService';
import { CategoryService } from '../services/CategoryService';
import { CollectionService } from '../services/CollectionService';
import { MaterialService } from '../services/MaterialService';
import { FeatureService } from '../services/FeatureService';

const router = useRouter();

// Tab state
const activeTab = ref('basic');
const tabs = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'materials', label: 'Materials' },
  { id: 'features', label: 'Features' },
  { id: 'images', label: 'Images' },
  { id: 'pricing', label: 'Pricing & Availability' }
];

// Form data
const product = ref({
  sku: '',
  name: '',
  description: '',
  productCare: '',
  specifications: '',
  category: '',
  collectionCode: '',
  material: '',
  featureCodes: [] as string[],
  price: 0,
  status: 'Active',
  yearCode: new Date().getFullYear(),
  sequenceCode: 1
});

// Dropdown options
const categories = ref<{id: string, name: string}[]>([]);
const collections = ref<{id: string, name: string}[]>([]);
const materials = ref<{id: string, name: string}[]>([]);
const features = ref<{id: string, name: string}[]>([]);

const isLoading = ref(false);
const isSubmitting = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const fetchData = async () => {
  isLoading.value = true;
  try {
    const [catData, collData, matData, featData] = await Promise.all([
      CategoryService.getAll(),
      CollectionService.getAll(),
      MaterialService.getAll(),
      FeatureService.getAll()
    ]);
    categories.value = catData;
    collections.value = collData;
    materials.value = matData;
    features.value = featData;
  } catch (err) {
    console.error('Failed to fetch form data:', err);
    error.value = 'Failed to load options for categories and materials.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const handleCancel = () => {
  router.push('/');
};

const handlePublish = async () => {
  if (!product.value.sku || !product.value.name) {
    error.value = 'SKU and Product Name are required';
    activeTab.value = 'basic';
    return;
  }

  isSubmitting.value = true;
  error.value = null;
  
  try {
    await ProductService.create(product.value);
    successMessage.value = 'Product created successfully! Redirecting...';
    setTimeout(() => {
      router.push('/');
    }, 2000);
  } catch (err) {
    error.value = 'Failed to create product. Please check your data and try again.';
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
};

const toggleFeature = (code: string) => {
  const index = product.value.featureCodes.indexOf(code);
  if (index === -1) {
    product.value.featureCodes.push(code);
  } else {
    product.value.featureCodes.splice(index, 1);
  }
};
</script>

<template>
  <MainLayout>
    <div class="create-product-page">
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs flex align-center gap-2">
        <router-link to="/" class="breadcrumb-item">Products</router-link>
        <span class="material-icons-outlined sep">chevron_right</span>
        <span class="breadcrumb-item active">Create Product</span>
      </nav>

      <div class="page-header mt-4">
        <h2>Create Product</h2>
      </div>

      <!-- Tabs Navigation -->
      <div class="tabs-nav flex gap-8 mt-6">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="form-content card mt-6">
        <!-- Basic Info Tab -->
        <div v-if="activeTab === 'basic'" class="tab-pane">
          <div class="form-grid">
            <div class="form-section">
              <label for="name">Product Name</label>
              <input id="name" v-model="product.name" type="text" placeholder="Product Name" class="form-input" />
            </div>

            <div class="form-section">
              <label for="sku">SKU</label>
              <input id="sku" v-model="product.sku" type="text" placeholder="e.g. SKU-12345" class="form-input" />
            </div>

            <div class="form-section full-width">
              <label for="description">Description</label>
              <textarea id="description" v-model="product.description" rows="4" placeholder="Enter unique and richer specific description..." class="form-input"></textarea>
            </div>

            <div class="form-section full-width">
              <label for="productCare">Product Care Instructions</label>
              <textarea id="productCare" v-model="product.productCare" rows="3" placeholder="How to care for this product..." class="form-input"></textarea>
            </div>

            <div class="form-section full-width">
              <label for="specifications">Specifications</label>
              <textarea id="specifications" v-model="product.specifications" rows="3" placeholder="Technical specifications..." class="form-input"></textarea>
            </div>

            <div class="form-section">
              <label for="category">Category</label>
              <div class="select-wrapper">
                <select id="category" v-model="product.category" class="form-input">
                  <option value="">Select Category</option>
                  <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
                <span class="material-icons-outlined">expand_more</span>
              </div>
            </div>

            <div class="form-section">
              <label for="collection">Collection</label>
              <div class="select-wrapper">
                <select id="collection" v-model="product.collectionCode" class="form-input">
                  <option value="">Select Collection</option>
                  <option v-for="c in collections" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
                <span class="material-icons-outlined">expand_more</span>
              </div>
            </div>

            <div class="form-section">
              <label>Status</label>
              <div class="status-options flex gap-6 mt-2">
                <label class="radio-label">
                  <input type="radio" value="Active" v-model="product.status" />
                  <span class="radio-custom"></span>
                  Active
                </label>
                <label class="radio-label">
                  <input type="radio" value="Draft" v-model="product.status" />
                  <span class="radio-custom"></span>
                  Draft
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Materials Tab -->
        <div v-if="activeTab === 'materials'" class="tab-pane">
          <div class="form-section">
            <label>Select Material</label>
            <div class="material-grid mt-4">
              <label v-for="m in materials" :key="m.id" class="choice-label card" :class="{ selected: product.material === m.id }">
                <input type="radio" :value="m.id" v-model="product.material" />
                {{ m.name }}
              </label>
            </div>
          </div>
        </div>

        <!-- Features Tab -->
        <div v-if="activeTab === 'features'" class="tab-pane">
          <div class="form-section">
            <label>Select Features</label>
            <div class="feature-grid mt-4">
              <div 
                v-for="f in features" 
                :key="f.id" 
                class="choice-label card" 
                :class="{ selected: product.featureCodes.includes(f.id) }"
                @click="toggleFeature(f.id)"
              >
                {{ f.name }}
              </div>
            </div>
          </div>
        </div>

        <!-- Images Tab -->
        <div v-if="activeTab === 'images'" class="tab-pane">
          <div class="upload-area">
            <span class="material-icons-outlined upload-icon">cloud_upload</span>
            <p>Drag & drop images here, or <span class="browse-link" @click="() => {}">Browse</span></p>
            <button class="btn btn-primary mt-4" type="button" @click="() => {}">Upload Images</button>
            <p class="upload-hint">Recommended size: 800x800px</p>
          </div>
        </div>

        <!-- Pricing Tab -->
        <div v-if="activeTab === 'pricing'" class="tab-pane">
          <div class="form-grid">
            <div class="form-section">
              <label for="price">Price (₹)</label>
              <input id="price" v-model.number="product.price" type="number" placeholder="0.00" class="form-input" />
            </div>
            
            <div class="form-section">
              <label for="year">Year Code</label>
              <input id="year" v-model.number="product.yearCode" type="number" class="form-input" />
            </div>

            <div class="form-section">
              <label for="sequence">Sequence Code</label>
              <input id="sequence" v-model.number="product.sequenceCode" type="number" class="form-input" />
            </div>
          </div>
        </div>

        <!-- Status Messages -->
        <div v-if="error" class="error-message p-4 text-danger mt-6">
          {{ error }}
        </div>

        <div v-if="successMessage" class="success-message p-4 text-success mt-6">
          <div class="flex align-center gap-2">
            <span class="material-icons-outlined">check_circle</span>
            {{ successMessage }}
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions flex justify-end gap-4 mt-8">
          <button class="btn btn-outline" @click="handleCancel" :disabled="isSubmitting">Cancel</button>
          <button class="btn btn-outline" @click="() => { product.status = 'Draft'; handlePublish(); }" :disabled="isSubmitting">Save as Draft</button>
          <button class="btn btn-primary" @click="handlePublish" :disabled="isSubmitting">
            {{ isSubmitting ? 'Publishing...' : 'Publish Product' }}
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.create-product-page {
  max-width: 1000px;
  margin: 0 auto;
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

.tabs-nav {
  border-bottom: 1px solid var(--border-color);
}

.tab-btn {
  padding: 12px 4px;
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  position: relative;
}

.tab-btn.active {
  color: var(--primary-color);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--primary-color);
}

.form-content {
  padding: 32px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.full-width {
  grid-column: span 2;
}

.form-section label {
  font-weight: 500;
  font-size: 14px;
  color: var(--text-main);
}

.form-input {
  border: 1px solid var(--border-color);
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  outline: none;
  background-color: #fafafa;
  width: 100%;
}

.form-input:focus {
  border-color: var(--primary-color);
}

textarea.form-input {
  resize: vertical;
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.select-wrapper select {
  appearance: none;
}

.select-wrapper .material-icons-outlined {
  position: absolute;
  right: 12px;
  pointer-events: none;
  color: var(--text-muted);
}

.material-grid, .feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.choice-label {
  padding: 16px;
  text-align: center;
  cursor: pointer;
  border: 1px solid var(--border-color);
  transition: all 0.2s;
  font-size: 14px;
}

.choice-label:hover {
  border-color: var(--primary-color);
}

.choice-label.selected {
  border-color: var(--primary-color);
  background-color: var(--primary-light);
  color: var(--primary-color);
  font-weight: 500;
}

.choice-label input {
  display: none;
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-sm);
  padding: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background-color: #fcfcfc;
}

.upload-icon {
  font-size: 48px;
  color: var(--text-muted);
}

.browse-link {
  color: var(--primary-color);
  cursor: pointer;
  font-weight: 500;
}

.upload-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 8px;
}

.status-options {
  display: flex;
  align-items: center;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
}

.radio-label input {
  display: none;
}

.radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  position: relative;
}

.radio-label input:checked + .radio-custom {
  border-color: var(--primary-color);
}

.radio-label input:checked + .radio-custom::after {
  content: '';
  width: 10px;
  height: 10px;
  background-color: var(--primary-color);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.mt-2 { margin-top: 8px; }
.mt-4 { margin-top: 16px; }
.mt-6 { margin-top: 24px; }
.mt-8 { margin-top: 32px; }
.p-4 { padding: 16px; }

.text-danger { color: var(--danger-color); }
.text-success { color: var(--success-color); }

.error-message {
  border: 1px solid #ffccd1;
  background-color: #fff5f5;
  border-radius: var(--radius-sm);
}

.success-message {
  border: 1px solid #c3e6cb;
  background-color: #d4edda;
  border-radius: var(--radius-sm);
}
</style>
