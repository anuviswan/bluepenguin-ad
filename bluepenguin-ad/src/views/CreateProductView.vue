<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MainLayout from '../components/layout/MainLayout.vue';
import { ProductService, type Product } from '../services/ProductService';
import { CategoryService } from '../services/CategoryService';
import { CollectionService } from '../services/CollectionService';
import { MaterialService } from '../services/MaterialService';
import { FeatureService } from '../services/FeatureService';
import { FileUploadService } from '../services/FileUploadService';
import { ArtisanFavService } from '../services/ArtisanFavService';

const router = useRouter();

// Tab state
const activeTab = ref('basic');
const tabs = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'care', label: 'Product Care' },
  { id: 'specs', label: 'Specifications' },
  { id: 'features', label: 'Features' },
  { id: 'images', label: 'Images' },
  { id: 'pricing', label: 'Pricing & Availability' }
];

// Form data
const product = ref<Partial<Product>>({
  sku: '',
  name: '',
  description: '',
  productCare: [] as string[],
  specifications: [] as string[],
  category: '',
  collectionCode: '',
  material: '',
  featureCodes: [] as string[],
  price: 0,
  discountPrice: undefined,
  discountExpiryDate: '',
  stock: 0,
  yearCode: new Date().getFullYear(),
  sequenceCode: 1,
  isArtisanFav: false
});

// Dropdown options
const categories = ref<{id: string, name: string}[]>([]);
const collections = ref<{id: string, name: string}[]>([]);
const materials = ref<{id: string, name: string}[]>([]);
const features = ref<{id: string, name: string}[]>([]);

const isLoading = ref(false);
const isSubmitting = ref(false);
const isUploading = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// List item helpers
const newItemCare = ref('');
const newItemSpec = ref('');

const addCareItem = () => {
  if (newItemCare.value.trim() && product.value.productCare) {
    product.value.productCare.push(newItemCare.value.trim());
    newItemCare.value = '';
  }
};

const removeCareItem = (index: number) => {
  if (product.value.productCare) {
    product.value.productCare.splice(index, 1);
  }
};

const addSpecItem = () => {
  if (newItemSpec.value.trim() && product.value.specifications) {
    product.value.specifications.push(newItemSpec.value.trim());
    newItemSpec.value = '';
  }
};

const removeSpecItem = (index: number) => {
  if (product.value.specifications) {
    product.value.specifications.splice(index, 1);
  }
};

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
  const missingFields = [];
  if (!product.value.name) missingFields.push('Product Name');
  if (!product.value.category) missingFields.push('Category');
  if (!product.value.collectionCode) missingFields.push('Collection');
  if (!product.value.material) missingFields.push('Material');
  if (product.value.featureCodes && product.value.featureCodes.length === 0) missingFields.push('Features');
  if (selectedFiles.value.length === 0) missingFields.push('Images');

  if (missingFields.length > 0) {
    error.value = `The following fields are required: ${missingFields.join(', ')}`;
    
    // Navigate to the first tab with an error
    if (!product.value.name || !product.value.category || !product.value.collectionCode || !product.value.material) {
      activeTab.value = 'basic';
    } else if (product.value.featureCodes && product.value.featureCodes.length === 0) {
      activeTab.value = 'features';
    } else if (selectedFiles.value.length === 0) {
      activeTab.value = 'images';
    }
    return;
  }

  isSubmitting.value = true;
  error.value = null;
  
  try {
    const result = await ProductService.create(product.value);
    
    // Determine SKU for image upload
    const skuToUse = product.value.sku || (typeof result === 'string' ? result : (result?.sku || result?.skuId));
    
    if (skuToUse && selectedFiles.value.length > 0) {
      isUploading.value = true;
      successMessage.value = 'Product created! Uploading images...';
      try {
        // Upload primary image first if it exists
        if (primaryImageIndex.value >= 0 && primaryImageIndex.value < selectedFiles.value.length) {
          const primaryFile = selectedFiles.value[primaryImageIndex.value];
          if (primaryFile) {
            await FileUploadService.uploadImage(skuToUse, primaryFile, true);
          }
        }
        
        // Then upload remaining images sequentially
        for (let i = 0; i < selectedFiles.value.length; i++) {
          if (i !== primaryImageIndex.value) {
            const currentFile = selectedFiles.value[i];
            if (currentFile) {
              await FileUploadService.uploadImage(skuToUse, currentFile, false);
            }
          }
        }
      } catch (uploadErr) {
        console.error('Some images failed to upload', uploadErr);
        error.value = 'Product created, but some images failed to upload.';
      } finally {
        isUploading.value = false;
      }
    }

    if (product.value.isArtisanFav && skuToUse) {
      try {
        await ArtisanFavService.create(skuToUse);
      } catch (favErr: any) {
        console.error('Failed to mark as Artisan Fav', favErr);
        // Extract specific error message
        const backendMessage = favErr.message || 'Unknown error marking as artisan fav';
        error.value = `Product created, but failed to mark as Artisan Favorite: ${backendMessage}`;
        // We do not redirect if setting artisan fav fails so user can see the error
        isSubmitting.value = false;
        return;
      }
    }

    successMessage.value = 'Product created successfully! Redirecting...';
    setTimeout(() => {
      router.push('/');
    }, 2000);
  } catch (err: any) {
    const backendMessage = err.message || 'Unknown error';
    error.value = `Failed to create product: ${backendMessage}`;
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
};

const toggleFeature = (code: string) => {
  if (product.value.featureCodes) {
    const index = product.value.featureCodes.indexOf(code);
    if (index === -1) {
      product.value.featureCodes.push(code);
    } else {
      product.value.featureCodes.splice(index, 1);
    }
  }
};

const validateTab = (tabId: string): boolean => {
  error.value = null;
  if (tabId === 'basic') {
    const missing = [];
    if (!product.value.name) missing.push('Product Name');
    if (!product.value.category) missing.push('Category');
    if (!product.value.collectionCode) missing.push('Collection');
    if (!product.value.material) missing.push('Material');
    
    if (missing.length > 0) {
      error.value = `Please fill in mandatory fields: ${missing.join(', ')}`;
      return false;
    }
  } else if (tabId === 'features') {
    if (product.value.featureCodes && product.value.featureCodes.length === 0) {
      error.value = 'Please select at least one feature.';
      return false;
    }
  } else if (tabId === 'images') {
    if (selectedFiles.value.length === 0) {
      error.value = 'Please upload at least one image.';
      return false;
    }
  }
  return true;
};

const nextTab = () => {
  if (!validateTab(activeTab.value)) return;
  
  const currentIndex = tabs.findIndex(t => t.id === activeTab.value);
  if (currentIndex !== -1 && currentIndex < tabs.length - 1) {
    const next = tabs[currentIndex + 1];
    if (next) activeTab.value = next.id;
  }
};

const switchTab = (tabId: string) => {
  const currentIndex = tabs.findIndex(t => t.id === activeTab.value);
  const targetIndex = tabs.findIndex(t => t.id === tabId);
  
  if (targetIndex > currentIndex) {
    // Going forward, validate all tabs between current and target
    for (let i = currentIndex; i < targetIndex; i++) {
        const tab = tabs[i];
      if (tab && !validateTab(tab.id)) {
        // Stop at the first invalid tab
        activeTab.value = tab.id;
        return;
      }
    }
  }
  activeTab.value = tabId;
};

const prevTab = () => {
  const currentIndex = tabs.findIndex(t => t.id === activeTab.value);
  if (currentIndex !== -1 && currentIndex > 0) {
    const prev = tabs[currentIndex - 1];
    if (prev) activeTab.value = prev.id;
  }
};

// Image Upload Logic
const fileInput = ref<HTMLInputElement | null>(null);
const imagePreviews = ref<string[]>([]);
const selectedFiles = ref<File[]>([]);
const primaryImageIndex = ref(0);

const triggerBrowse = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;

  const files = Array.from(target.files);
  const maxFileSize = 500 * 1024; // 500KB
  const requiredWidth = 1200;
  const requiredHeight = 1200;

  for (const file of files) {
    if (file.size > maxFileSize) {
      error.value = `Image ${file.name} exceeds the maximum allowed size of 500KB.`;
      continue;
    }

    try {
      // Check image dimensions
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      await new Promise((resolve, reject) => {
        img.onload = () => resolve(true);
        img.onerror = reject;
        img.src = objectUrl;
      });

      if (img.width !== requiredWidth || img.height !== requiredHeight) {
        error.value = `Image ${file.name} must be exactly 1200x1200px. Current size: ${img.width}x${img.height}px.`;
        URL.revokeObjectURL(objectUrl);
        continue;
      }
      
      URL.revokeObjectURL(objectUrl);
      
      // Image is valid
      selectedFiles.value.push(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviews.value.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error validating image dimensions:', err);
      error.value = `Failed to validate image ${file.name}.`;
    }
  }
  
  // Reset input value to allow selecting same file again
  target.value = '';
};

const removeImage = (index: number) => {
  imagePreviews.value.splice(index, 1);
  selectedFiles.value.splice(index, 1);
  if (primaryImageIndex.value === index) {
    primaryImageIndex.value = 0;
  } else if (primaryImageIndex.value > index) {
    primaryImageIndex.value--;
  }
};

const setPrimaryImage = (index: number) => {
  primaryImageIndex.value = index;
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
          v-for="(tab, index) in tabs" 
          :key="tab.id"
          class="tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="switchTab(tab.id)"
        >
          <span class="step-num">{{ index + 1 }}</span>
          {{ tab.label }}
        </button>
      </div>

      <div class="form-content card mt-6">
        <!-- Basic Info Tab -->
        <div v-if="activeTab === 'basic'" class="tab-pane">
          <div class="form-grid">
            <div class="form-section">
              <label for="name">Product Name <span class="required">*</span></label>
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

            <div class="form-section">
              <label for="category">Category <span class="required">*</span></label>
              <div class="select-wrapper">
                <select id="category" v-model="product.category" class="form-input">
                  <option value="">Select Category</option>
                  <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
                <span class="material-icons-outlined">expand_more</span>
              </div>
            </div>

            <div class="form-section">
              <label for="collection">Collection <span class="required">*</span></label>
              <div class="select-wrapper">
                <select id="collection" v-model="product.collectionCode" class="form-input">
                  <option value="">Select Collection</option>
                  <option v-for="c in collections" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
                <span class="material-icons-outlined">expand_more</span>
              </div>
            </div>

            <div class="form-section">
              <label for="material">Material <span class="required">*</span></label>
              <div class="select-wrapper">
                <select id="material" v-model="product.material" class="form-input">
                  <option value="">Select Material</option>
                  <option v-for="m in materials" :key="m.id" :value="m.id">{{ m.name }}</option>
                </select>
                <span class="material-icons-outlined">expand_more</span>
              </div>
            </div>

            <div class="form-section full-width">
              <div class="toggle-container card p-4 flex justify-between align-center">
                <div class="toggle-info">
                  <label class="toggle-label flex align-center gap-2 mb-1">
                    <span class="material-icons-outlined text-warning">star</span>
                    Artisan's Favorite
                  </label>
                  <p class="text-muted text-sm m-0">Mark this product to be featured prominently as an Artisan's Favorite.</p>
                </div>
                <label class="switch">
                  <input type="checkbox" v-model="product.isArtisanFav">
                  <span class="slider round"></span>
                </label>
              </div>
            </div>

          </div>
        </div>

        <!-- Product Care Tab -->
        <div v-if="activeTab === 'care'" class="tab-pane">
          <div class="form-section">
            <label>Care Instructions</label>
            <div class="list-input-group flex gap-2">
              <input v-model="newItemCare" type="text" placeholder="Add care instruction..." class="form-input" @keyup.enter="addCareItem" />
              <button class="btn btn-primary" @click="addCareItem">Add</button>
            </div>
            <div class="items-list mt-4">
              <div v-for="(item, index) in product.productCare" :key="index" class="list-item flex justify-between align-center p-3 mb-2 card">
                <span>{{ item }}</span>
                <button class="btn-icon text-danger" @click="removeCareItem(index)">
                  <span class="material-icons-outlined">delete</span>
                </button>
              </div>
              <p v-if="product.productCare && product.productCare.length === 0" class="text-muted text-center p-4">No care instructions added yet.</p>
            </div>
          </div>
        </div>

        <!-- Specifications Tab -->
        <div v-if="activeTab === 'specs'" class="tab-pane">
          <div class="form-section">
            <label>Specifications</label>
            <div class="list-input-group flex gap-2">
              <input v-model="newItemSpec" type="text" placeholder="Add specification..." class="form-input" @keyup.enter="addSpecItem" />
              <button class="btn btn-primary" @click="addSpecItem">Add</button>
            </div>
            <div class="items-list mt-4">
              <div v-for="(item, index) in product.specifications" :key="index" class="list-item flex justify-between align-center p-3 mb-2 card">
                <span>{{ item }}</span>
                <button class="btn-icon text-danger" @click="removeSpecItem(index)">
                  <span class="material-icons-outlined">delete</span>
                </button>
              </div>
              <p v-if="product.specifications && product.specifications.length === 0" class="text-muted text-center p-4">No specifications added yet.</p>
            </div>
          </div>
        </div>

        <!-- Features Tab -->
        <div v-if="activeTab === 'features'" class="tab-pane">
          <div class="form-section">
            <label>Select Features <span class="required">*</span></label>
            <div class="feature-grid mt-4">
              <div 
                v-for="f in features" 
                :key="f.id" 
                class="choice-label card" 
                :class="{ selected: product.featureCodes && product.featureCodes.includes(f.id) }"
                @click="toggleFeature(f.id)"
              >
                {{ f.name }}
              </div>
            </div>
          </div>
        </div>

        <!-- Images Tab -->
        <div v-if="activeTab === 'images'" class="tab-pane">
          <input 
            type="file" 
            ref="fileInput" 
            multiple 
            accept="image/*" 
            class="hidden-input" 
            @change="handleFileChange"
          />
          
          <div class="upload-area" @click="triggerBrowse">
            <span class="material-icons-outlined upload-icon">cloud_upload</span>
            <p>Drag & drop images here, or <span class="browse-link">Browse</span> <span class="required">*</span></p>
            <p class="upload-hint">Exactly 1200x1200px. Max size 500KB.</p>
          </div>

          <div v-if="imagePreviews.length > 0" class="previews-grid mt-6">
            <div v-for="(src, index) in imagePreviews" :key="index" class="image-card" :class="{ 'is-primary': primaryImageIndex === index }">
              <div class="image-container">
                <img :src="src" alt="Preview" />
                <button class="small-remove-btn" @click.stop="removeImage(index)" title="Remove image">
                  <span class="material-icons-outlined">close</span>
                </button>
              </div>
              <div class="image-footer" @click="setPrimaryImage(index)">
                <label class="primary-label">
                  <div class="radio-circle" :class="{ checked: primaryImageIndex === index }">
                    <div v-if="primaryImageIndex === index" class="radio-inner"></div>
                  </div>
                  <span>{{ primaryImageIndex === index ? 'Primary' : 'Set as primary' }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Pricing Tab -->
        <div v-if="activeTab === 'pricing'" class="tab-pane">
          <div class="form-grid">
            <div class="form-section">
              <label for="price">Regular Price (₹)</label>
              <input id="price" v-model.number="product.price" type="number" placeholder="0.00" class="form-input" />
            </div>

            <div class="form-section">
              <label for="discountPrice">Discount Price (₹)</label>
              <input id="discountPrice" v-model.number="product.discountPrice" type="number" placeholder="0.00" class="form-input" />
            </div>

            <div class="form-section">
              <label for="discountExpiry">Discount Expiry Date</label>
              <input id="discountExpiry" v-model="product.discountExpiryDate" type="date" class="form-input" />
            </div>
            
            <div class="form-section">
              <label for="stock">Stock Quantity</label>
              <input id="stock" v-model.number="product.stock" type="number" placeholder="0" class="form-input" />
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
        <div class="form-actions flex justify-between gap-4 mt-8">
          <div class="flex gap-4">
            <button class="btn btn-outline" @click="handleCancel" :disabled="isSubmitting">Cancel</button>
            <button v-if="activeTab !== 'basic'" class="btn btn-outline" @click="prevTab" :disabled="isSubmitting">
              Back
            </button>
          </div>
          
          <div class="flex gap-4">
            <button v-if="activeTab !== 'pricing'" class="btn btn-primary" @click="nextTab" :disabled="isSubmitting">
              Next
            </button>
            
            <template v-else>
              <button class="btn btn-primary" @click="handlePublish" :disabled="isSubmitting || isUploading">
                {{ isSubmitting ? 'Publishing...' : (isUploading ? 'Uploading Images...' : 'Publish Product') }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.create-product-page {
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
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-num {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #eee;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
}

.tab-btn.active .step-num {
  background-color: var(--primary-color);
  color: white;
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
  display: flex;
  align-items: center;
}

.required {
  color: var(--danger-color);
  margin-left: 4px;
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

.text-warning {
  color: #f59e0b;
}

.text-sm {
  font-size: 13px;
}

.m-0 {
  margin: 0;
}

.toggle-container {
  border-left: 4px solid #f59e0b;
  background: linear-gradient(to right, #fffbeb, white);
}

.toggle-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 4px;
}

/* Toggle Switch Styles */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #f59e0b;
}

input:focus + .slider {
  box-shadow: 0 0 1px #f59e0b;
}

input:checked + .slider:before {
  transform: translateX(22px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.hidden-input {
  display: none;
}

.previews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.image-card {
  position: relative;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  overflow: hidden;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.image-card.is-primary {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(43, 87, 154, 0.15);
}

.image-container {
  position: relative;
  aspect-ratio: 1;
  width: 100%;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.small-remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.image-card:hover .small-remove-btn {
  opacity: 1;
}

.small-remove-btn .material-icons-outlined {
  font-size: 14px;
}

.image-footer {
  padding: 8px;
  border-top: 1px solid var(--border-color);
  background: #fafafa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-card.is-primary .image-footer {
  background: var(--primary-light);
  border-top-color: var(--primary-color);
}

.primary-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
}

.image-card.is-primary .primary-label {
  color: var(--primary-color);
}

.radio-circle {
  width: 14px;
  height: 14px;
  border: 1.5px solid #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.radio-circle.checked {
  border-color: var(--primary-color);
}

.radio-inner {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--primary-color);
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

.list-item {
  background-color: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.btn-icon:hover {
  background-color: #fff5f5;
}

.btn-icon.text-danger {
  color: var(--danger-color);
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
