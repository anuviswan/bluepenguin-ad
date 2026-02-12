<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '../components/layout/MainLayout.vue';
import { FeatureService } from '../services/FeatureService';

const route = useRoute();
const router = useRouter();
const featureId = ref('');
const featureName = ref('');
const symbolicText = ref('');
const status = ref('active');
const isSubmitting = ref(false);
const isLoading = ref(true);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const id = route.params.id as string;

const fetchFeature = async () => {
  isLoading.value = true;
  try {
    const feature = await FeatureService.getById(id);
    if (feature) {
      featureId.value = feature.id;
      featureName.value = feature.name;
      symbolicText.value = feature.symbolicText || '';
      status.value = feature.isActive ? 'active' : 'draft';
    } else {
      error.value = 'Feature not found';
    }
  } catch (err) {
    error.value = 'Failed to load feature details.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchFeature();
});

const handleCancel = () => {
  router.push('/features');
};

const handleSave = async () => {
  if (!featureName.value.trim()) {
    error.value = 'Feature name is required';
    return;
  }

  isSubmitting.value = true;
  error.value = null;
  
  try {
    await FeatureService.update(featureId.value, featureName.value.trim(), symbolicText.value.trim());
    successMessage.value = `Feature '${featureName.value.trim()}' has been updated successfully! Redirecting...`;
    
    setTimeout(() => {
      router.push('/features');
    }, 2000);
  } catch (err: any) {
    error.value = `Failed to update feature: ${err.message || 'Unknown error'}`;
    console.error(err);
    isSubmitting.value = false;
  }
};
</script>

<template>
  <MainLayout>
    <div class="edit-feature-page">
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs flex align-center gap-2">
        <router-link to="/features" class="breadcrumb-item">Features</router-link>
        <span class="material-icons-outlined sep">chevron_right</span>
        <span class="breadcrumb-item active">Edit Feature</span>
      </nav>

      <div class="page-header">
        <h2>Edit Feature</h2>
      </div>

      <div v-if="isLoading" class="loading-state card p-8 flex justify-center align-center">
        <span class="material-icons-outlined rotating">sync</span>
        <span class="ml-2">Loading feature details...</span>
      </div>

      <div v-else class="form-container card">
        <div class="form-section">
          <label for="featureId">Feature ID</label>
          <input 
            id="featureId" 
            v-model="featureId" 
            type="text" 
            class="form-input"
            disabled
          />
          <small class="text-muted">Feature ID cannot be changed.</small>
        </div>

        <div class="form-section">
          <label for="featureName">Feature Name</label>
          <input 
            id="featureName" 
            v-model="featureName" 
            type="text" 
            placeholder="Enter feature name..." 
            class="form-input"
            :disabled="isSubmitting"
          />
        </div>

        <div class="form-section">
          <label for="symbolicText">Symbolic Text</label>
          <input 
            id="symbolicText" 
            v-model="symbolicText" 
            type="text" 
            placeholder="Enter symbolic representation..." 
            class="form-input"
            :disabled="isSubmitting"
          />
        </div>

        <div class="form-section">
          <label>Status</label>
          <div class="status-options flex gap-6">
            <label class="radio-label">
              <input type="radio" value="active" v-model="status" name="status" />
              <span class="radio-custom"></span>
              Active
            </label>
            <label class="radio-label">
              <input type="radio" value="draft" v-model="status" name="status" />
              <span class="radio-custom"></span>
              Draft
            </label>
          </div>
        </div>

        <div v-if="error" class="error-message p-4 text-danger mb-4">
          {{ error }}
        </div>

        <div v-if="successMessage" class="success-message p-4 text-success mb-4">
          <div class="flex align-center gap-2">
            <span class="material-icons-outlined">check_circle</span>
            {{ successMessage }}
          </div>
        </div>

        <div class="form-actions flex justify-end gap-4 mt-8">
          <button class="btn btn-outline" @click="handleCancel" :disabled="isSubmitting">Cancel</button>
          <button class="btn btn-primary" @click="handleSave" :disabled="isSubmitting">
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.edit-feature-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
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

.form-container {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
}

.form-input:focus {
  border-color: var(--primary-color);
}

.form-input:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
  color: var(--text-muted);
}

.status-options {
  margin-top: 4px;
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
  width: 18px;
  height: 18px;
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

.mt-8 { margin-top: 32px; }
.mb-4 { margin-bottom: 16px; }
.p-4 { padding: 16px; }
.ml-2 { margin-left: 8px; }

.text-danger {
  color: var(--danger-color);
}

.text-success {
  color: var(--success-color);
}

.text-muted {
  color: var(--text-muted);
  font-size: 12px;
}

.error-message {
  border: 1px solid #ffccd1;
  background-color: #fff5f5;
  border-radius: var(--radius-sm);
  font-size: 14px;
}

.success-message {
  border: 1px solid #c3e6cb;
  background-color: #d4edda;
  border-radius: var(--radius-sm);
  font-size: 14px;
}

.loading-state {
  color: var(--text-muted);
}

.rotating {
  animation: rotate 1.5s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
