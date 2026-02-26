```
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import MainLayout from '../components/layout/MainLayout.vue';
import { ProductService, type Product } from '../services/ProductService';
import { CategoryService } from '../services/CategoryService';
import { CollectionService } from '../services/CollectionService';
import { MaterialService } from '../services/MaterialService';
import { FeatureService } from '../services/FeatureService';
import { FileUploadService } from '../services/FileUploadService';
import { ArtisanFavService } from '../services/ArtisanFavService';
import DeleteConfirmModal from '../components/shared/DeleteConfirmModal.vue';

const router = useRouter();
const route = useRoute();
const skuId = route.params.sku as string;

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
  status: 'Active',
  yearCode: 0,
  sequenceCode: 0,
  stock: 0,
  isArtisanFav: false
});

const originalIsArtisanFav = ref(false);

// Dropdown options
const categories = ref<{id: string, name: string}[]>([]);
const collections = ref<{id: string, name: string}[]>([]);
const materials = ref<{id: string, name: string}[]>([]);
const features = ref<{id: string, name: string}[]>([]);

const isLoading = ref(true);
const isSubmitting = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const isDeleteModalOpen = ref(false);
const isDeleting = ref(false);

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
  error.value = null;
  try {
    const [catData, collData, matData, featData, productData, imagesData, favsData] = await Promise.all([
      CategoryService.getAll(),
      CollectionService.getAll(),
      MaterialService.getAll(),
      FeatureService.getAll(),
      ProductService.getBySku(skuId),
      FileUploadService.getAllImagesForSku(skuId),
      ArtisanFavService.getAll()
    ]);
    
    categories.value = catData;
    collections.value = collData;
    materials.value = matData;
    features.value = featData;
    existingImages.value = imagesData;
    
    const isFav = favsData.some(fav => fav.sku === skuId);
    originalIsArtisanFav.value = isFav;
    primaryImageId.value = await FileUploadService.getPrimaryImageIdForSku(skuId);
    
    // Fill the form with existing product data
    product.value = {
      sku: productData.sku || '',
      name: productData.name,
      description: productData.description || '',
      productCare: [...(productData.productCare || [])],
      specifications: [...(productData.specifications || [])],
      category: productData.category,
      collectionCode: productData.collectionCode,
      material: productData.material,
      featureCodes: [...(productData.featureCodes || [])],
      price: productData.price,
      discountPrice: productData.discountPrice,
      discountExpiryDate: productData.discountExpiryDate ? productData.discountExpiryDate.split('T')[0] : '',
      status: productData.status,
      yearCode: productData.yearCode,
      sequenceCode: productData.sequenceCode,
      stock: productData.stock || 0,
      isArtisanFav: isFav
    };
  } catch (err) {
    console.error('Failed to fetch data:', err);
    error.value = 'Failed to load product details or options. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const handleCancel = () => {
  router.push(`/products/${skuId}`);
};

const handleUpdate = async () => {
  if (!product.value.name) {
    error.value = 'Product Name is required';
    activeTab.value = 'basic';
    return;
  }

  isSubmitting.value = true;
  error.value = null;
  
  try {
    await ProductService.update(product.value);
    
    // Update Artisan Fav status if changed
    let failedFavUpdate = false;
    const currentIsFav = !!product.value.isArtisanFav;
    if (currentIsFav !== originalIsArtisanFav.value) {
      try {
        if (currentIsFav) {
          await ArtisanFavService.create(skuId);
        } else {
          await ArtisanFavService.delete(skuId);
        }
        originalIsArtisanFav.value = currentIsFav;
      } catch (favErr: any) {
        console.error('Failed to update Artisan Fav status', favErr);
        const backendMessage = favErr.message || 'Unknown error updating artisan fav';
        error.value = `Product details updated, but ${backendMessage}`;
        // Revert UI toggle since it failed
        product.value.isArtisanFav = originalIsArtisanFav.value;
        failedFavUpdate = true;
      }
    }
    
    // Upload secondary images
    if (selectedFiles.value.length > 0) {
      isUploading.value = true;
      try {
        // Upload primary image first if it exists
        if (primaryImageIndex.value >= 0 && primaryImageIndex.value < selectedFiles.value.length) {
          const primaryFile = selectedFiles.value[primaryImageIndex.value];
          if (primaryFile) {
            await FileUploadService.uploadImage(skuId, primaryFile, true);
          }
        }
        
        // Then upload remaining images sequentially
        for (let i = 0; i < selectedFiles.value.length; i++) {
          if (i !== primaryImageIndex.value) {
            const currentFile = selectedFiles.value[i];
            if (currentFile) {
              await FileUploadService.uploadImage(skuId, currentFile, false);
            }
          }
        }
        selectedFiles.value = [];
        imagePreviews.value = [];
        // Refresh existing images
        existingImages.value = await FileUploadService.getAllImagesForSku(skuId);
      } catch (uploadErr) {
        console.error('Some images failed to upload', uploadErr);
        error.value = 'Product updated, but some images failed to upload.';
      } finally {
        isUploading.value = false;
      }
    }
    
    if (!failedFavUpdate) {
      successMessage.value = 'Product updated successfully! Redirecting...';
      setTimeout(() => {
        router.push(`/products/${skuId}`);
      }, 2000);
    }
  } catch (err: any) {
    const backendMessage = err.message || 'Unknown error';
    error.value = `Failed to update product: ${backendMessage}`;
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

const nextTab = () => {
  const currentIndex = tabs.findIndex(t => t.id === activeTab.value);
  if (currentIndex !== -1 && currentIndex < tabs.length - 1) {
    const next = tabs[currentIndex + 1];
    if (next) activeTab.value = next.id;
  }
};

const prevTab = () => {
  const currentIndex = tabs.findIndex(t => t.id === activeTab.value);
  if (currentIndex !== -1 && currentIndex > 0) {
    const prev = tabs[currentIndex - 1];
    if (prev) activeTab.value = prev.id;
  }
};

// Image Upload Logic (Placeholders for now, similar to CreateProductView)
const fileInput = ref<HTMLInputElement | null>(null);
const imagePreviews = ref<string[]>([]);
const selectedFiles = ref<File[]>([]);
const existingImages = ref<string[]>([]);
const primaryImageId = ref<string | null>(null);
const primaryImageIndex = ref(-1); // -1 means none of the new images is selected as primary
const isUploading = ref(false);

const triggerBrowse = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;

  const files = Array.from(target.files);
  files.forEach(file => {
    selectedFiles.value.push(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviews.value.push(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  });
  
  target.value = '';
};

const removeImage = (index: number) => {
  imagePreviews.value.splice(index, 1);
  selectedFiles.value.splice(index, 1);
  if (primaryImageIndex.value === index) {
    primaryImageIndex.value = -1;
  } else if (primaryImageIndex.value > index) {
    primaryImageIndex.value--;
  }
};

const setPrimaryImage = (index: number) => {
  primaryImageIndex.value = index;
  primaryImageId.value = null; // Unset existing primary if a new one is selected
};

const markExistingAsPrimary = async (imageId: string) => {
  try {
    await FileUploadService.markPrimaryImage(skuId, imageId);
    primaryImageId.value = imageId;
    primaryImageIndex.value = -1; // Unset new image primary if an existing one is selected
    // Show success feedback if needed, but the UI updates automatically via reactivity
  } catch (err) {
    error.value = 'Failed to mark image as primary. Please try again.';
  }
};

const removeExistingImage = async (imageId: string) => {
  if (confirm('Are you sure you want to delete this image permanently?')) {
    try {
      await FileUploadService.deleteImage(skuId, imageId);
      existingImages.value = existingImages.value.filter(id => id !== imageId);
    } catch (err) {
      error.value = 'Failed to delete image. Please try again.';
    }
  }
};

const getImageUrl = (imageId: string) => {
  return FileUploadService.getImageUrl(skuId, imageId);
};

const openDeleteModal = () => {
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  isDeleting.value = true;
  try {
    await ProductService.delete(skuId);
    successMessage.value = 'Product deleted successfully! Redirecting...';
    setTimeout(() => {
      router.push('/');
    }, 1500);
  } catch (err: any) {
    console.error('Failed to delete product', err);
    error.value = `Failed to delete product: ${err.message || 'Unknown error'}`;
  } finally {
    isDeleting.value = false;
    isDeleteModalOpen.value = false;
  }
};
</script>

<template>
  <MainLayout>
    <div class="edit-product-page">
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs flex align-center gap-2">
        <router-link to="/" class="breadcrumb-item">Products</router-link>
        <span class="material-icons-outlined sep">chevron_right</span>
        <router-link :to="`/products/${skuId}`" class="breadcrumb-item">{{ product.name || skuId }}</router-link>
        <span class="material-icons-outlined sep">chevron_right</span>
        <span class="breadcrumb-item active">Edit Product</span>
      </nav>

      <div class="page-header mt-4 flex justify-between align-center">
        <h2>Edit Product</h2>
        <div v-if="product.sku" class="sku-badge">SKU: {{ product.sku }}</div>
      </div>

      <div v-if="isLoading" class="loading-state card p-12 mt-6 flex-center flex-column gap-4">
        <div class="spinner large"></div>
        <p>Loading product details...</p>
      </div>

      <div v-else-if="error && !product.name" class="error-state card p-12 mt-6 flex-center flex-column gap-4 text-danger">
        <span class="material-icons-outlined large-icon">error_outline</span>
        <p>{{ error }}</p>
        <button @click="fetchData" class="btn btn-primary">Retry</button>
      </div>

      <template v-else>
        <!-- Tabs Navigation -->
        <div class="tabs-nav flex gap-8 mt-6">
          <button 
            v-for="(tab, index) in tabs" 
            :key="tab.id"
            class="tab-btn"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
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
                <label for="name">Product Name</label>
                <input id="name" v-model="product.name" type="text" placeholder="Product Name" class="form-input" />
              </div>

              <div class="form-section">
                <label for="sku">SKU (Read-only)</label>
                <input id="sku" v-model="product.sku" type="text" class="form-input disabled" readonly />
              </div>

              <div class="form-section full-width">
                <label for="description">Description</label>
                <textarea id="description" v-model="product.description" rows="4" placeholder="Enter unique and richer specific description..." class="form-input"></textarea>
              </div>

              <div class="form-section">
                <label>Category (Read-only)</label>
                <div class="static-value p-3">
                  {{ categories.find(c => c.id === product.category)?.name || product.category || '-' }}
                  <span v-if="categories.find(c => c.id === product.category)" class="code-suffix">({{ product.category }})</span>
                </div>
              </div>

              <div class="form-section">
                <label>Collection (Read-only)</label>
                <div class="static-value p-3">
                  {{ collections.find(c => c.id === product.collectionCode)?.name || product.collectionCode || '-' }}
                  <span v-if="collections.find(c => c.id === product.collectionCode)" class="code-suffix">({{ product.collectionCode }})</span>
                </div>
              </div>

              <div class="form-section">
                <label>Material (Read-only)</label>
                <div class="static-value p-3">
                  {{ materials.find(m => m.id === product.material)?.name || product.material || '-' }}
                  <span v-if="materials.find(m => m.id === product.material)" class="code-suffix">({{ product.material }})</span>
                </div>
              </div>

              <div class="form-section">
                <label>Status (Read-only)</label>
                <div class="mt-2">
                  <span :class="['badge', product.status === 'In Stock' ? 'badge-success' : 'badge-danger']">
                    {{ product.status }}
                  </span>
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
                <p v-if="!product.productCare || product.productCare.length === 0" class="text-muted text-center p-4">No care instructions added yet.</p>
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
                <p v-if="!product.specifications || product.specifications.length === 0" class="text-muted text-center p-4">No specifications added yet.</p>
              </div>
            </div>
          </div>

          <!-- Features Tab -->
          <div v-if="activeTab === 'features'" class="tab-pane">
            <div class="form-section">
              <label>Product Features (Read-only)</label>
              <div v-if="product.featureCodes && product.featureCodes.length > 0" class="feature-grid mt-4">
                <div 
                  v-for="code in product.featureCodes" 
                  :key="code" 
                  class="choice-label card selected readonly"
                >
                  {{ features.find(f => f.id === code)?.name || code }}
                </div>
              </div>
              <p v-else class="text-muted mt-4">No features assigned to this product.</p>
            </div>
          </div>

          <!-- Images Tab -->
          <div v-if="activeTab === 'images'" class="tab-pane">
            <div class="images-section mb-6">
              <h4 class="mb-3">Existing Images</h4>
              <div v-if="existingImages.length > 0" class="previews-grid">
                <div v-for="imageId in existingImages" :key="imageId" class="image-card" :class="{ 'is-primary': primaryImageId === imageId }">
                  <div class="image-container">
                    <img :src="getImageUrl(imageId)" alt="Product Image" />
                    <button class="small-remove-btn" @click.stop="removeExistingImage(imageId)" title="Delete image">
                      <span class="material-icons-outlined">close</span>
                    </button>
                  </div>
                  <div class="image-footer" @click="markExistingAsPrimary(imageId)">
                    <div class="primary-label">
                      <div class="radio-circle" :class="{ checked: primaryImageId === imageId }">
                        <div v-if="primaryImageId === imageId" class="radio-inner"></div>
                      </div>
                      <span>{{ primaryImageId === imageId ? 'Primary' : 'Set as primary' }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p v-else class="text-muted italic">No images currently uploaded for this product.</p>
            </div>

            <div class="images-section">
              <h4 class="mb-3">Upload New Images</h4>
              <p class="text-muted mb-4">New images will be uploaded when you click "Update Product".</p>
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
                <p>Drag & drop images here, or <span class="browse-link">Browse</span></p>
                <p class="upload-hint">Recommended size: 800x800px</p>
              </div>

              <div v-if="imagePreviews.length > 0" class="previews-grid mt-6">
                <div v-for="(src, index) in imagePreviews" :key="index" class="image-card" :class="{ 'is-primary': primaryImageIndex === index }">
                  <div class="image-container">
                    <img :src="src" alt="Preview" />
                    <button class="small-remove-btn" @click.stop="removeImage(index)" title="Delete image">
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
                <label for="year">Year Code (Read-only)</label>
                <input id="year" v-model.number="product.yearCode" type="number" class="form-input disabled" readonly />
              </div>

              <div class="form-section">
                <label for="sequence">Sequence Code (Read-only)</label>
                <input id="sequence" v-model.number="product.sequenceCode" type="number" class="form-input disabled" readonly />
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
              <button class="btn btn-outline" @click="handleCancel" :disabled="isSubmitting || isDeleting">Cancel</button>
              <button v-if="activeTab !== 'basic'" class="btn btn-outline" @click="prevTab" :disabled="isSubmitting || isDeleting">
                Back
              </button>
              <button class="btn btn-danger flex align-center gap-2" @click="openDeleteModal" :disabled="isSubmitting || isDeleting">
                <span class="material-icons-outlined">delete</span>
                Delete
              </button>
            </div>
            
            <div class="flex gap-4">
              <button v-if="activeTab !== 'pricing'" class="btn btn-primary" @click="nextTab" :disabled="isSubmitting || isDeleting">
                Next
              </button>
              
              <template v-else>
                <button class="btn btn-primary" @click="handleUpdate" :disabled="isSubmitting || isUploading || isDeleting">
                  {{ isSubmitting ? 'Updating...' : (isUploading ? 'Uploading Images...' : 'Update Product') }}
                </button>
              </template>
            </div>
          </div>
        </div>
      </template>

      <DeleteConfirmModal 
        v-model:isOpen="isDeleteModalOpen"
        :itemName="product.name || skuId"
        @confirm="handleDelete"
      />
    </div>
  </MainLayout>
</template>

<style scoped>
.edit-product-page {
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

.sku-badge {
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
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

.form-input.disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
  color: var(--text-muted);
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

.feature-grid {
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

.choice-label.selected.readonly {
  cursor: default;
}

.static-value {
  background-color: #f5f5f5;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 8px;
}

.code-suffix {
  color: var(--text-muted);
  font-size: 12px;
  font-family: monospace;
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

.mt-2 { margin-top: 8px; }

.choice-label.selected {
  border-color: var(--primary-color);
  background-color: var(--primary-light);
  color: var(--primary-color);
  font-weight: 500;
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

.loading-state, .error-state {
  min-height: 400px;
}

.spinner.large {
  width: 48px;
  height: 48px;
  border-width: 4px;
}

.large-icon {
  font-size: 48px;
}

.mt-2 { margin-top: 8px; }
.mt-4 { margin-top: 16px; }
.mt-6 { margin-top: 24px; }
.mt-8 { margin-top: 32px; }
.p-4 { padding: 16px; }
.p-12 { padding: 48px; }

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
.mb-3 { margin-bottom: 12px; }
.mb-6 { margin-bottom: 24px; }
.italic { font-style: italic; }

.images-section h4 {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 8px;
}
</style>
