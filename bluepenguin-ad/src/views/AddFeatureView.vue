<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MainLayout from '../components/layout/MainLayout.vue';
import { FeatureService } from '../services/FeatureService';

const router = useRouter();
const featureId = ref('');
const featureName = ref('');
const symbolicText = ref('');
const status = ref('active');
const isSubmitting = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const handleCancel = () => {
  router.push('/features');
};

const handleCreate = async () => {
  if (!featureId.value.trim()) {
    error.value = 'Feature ID is required';
    return;
  }
  if (!featureName.value.trim()) {
    error.value = 'Feature name is required';
    return;
  }

  isSubmitting.value = true;
  error.value = null;
  
  try {
    await FeatureService.create(featureId.value.trim(), featureName.value.trim(), symbolicText.value.trim());
    successMessage.value = `Feature '${featureName.value.trim()}' has been created successfully! Redirecting...`;
    
    setTimeout(() => {
      router.push('/features');
    }, 2000);
  } catch (err: any) {
    if (err.message && err.message.includes('401')) {
      error.value = 'Unauthorized: Your session may have expired. Please login again.';
    } else {
      error.value = `Failed to create feature: ${err.message || 'Unknown error'}`;
    }
    console.error('[Feature Creation Error]', err);
    isSubmitting.value = false;
  }
};
</script>

<template>
  <MainLayout>
    <div class="add-feature-page">
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs flex align-center gap-2">
        <router-link to="/features" class="breadcrumb-item">Features</router-link>
        <span class="material-icons-outlined sep">chevron_right</span>
        <span class="breadcrumb-item active">Add Feature</span>
      </nav>

      <div class="page-header">
        <h2>Add Feature</h2>
      </div>

      <div class="form-container card">
        <div class="form-section">
          <label for="featureId">Feature ID</label>
          <input 
            id="featureId" 
            v-model="featureId" 
            type="text" 
            placeholder="Enter feature ID (e.g., F001)..." 
            class="form-input"
            :disabled="isSubmitting"
          />
        </div>

        <div class="form-section">
          <label for="featureName">Feature Name</label>
          <input 
            id="featureName" 
            v-model="featureName" 
            type="text" 
            placeholder="Enter feature name (e.g., Anti-Tarnish)..." 
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
          <button class="btn btn-primary" @click="handleCreate" :disabled="isSubmitting">
            {{ isSubmitting ? 'Creating...' : 'Add Feature' }}
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.add-feature-page {
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

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-sm);
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background-color: #fcfcfc;
}

.upload-icon {
  font-size: 40px;
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

.mt-4 { margin-top: 16px; }
.mt-8 { margin-top: 32px; }
.mb-4 { margin-bottom: 16px; }
.p-4 { padding: 16px; }

.text-danger {
  color: var(--danger-color);
}

.text-success {
  color: var(--success-color);
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

.btn-secondary {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  font-weight: 500;
  cursor: pointer;
}
</style>
