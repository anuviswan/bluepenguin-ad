<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MainLayout from '../components/layout/MainLayout.vue';
import FeatureListItem from '../components/features/FeatureListItem.vue';
import { FeatureService, type Feature } from '../services/FeatureService';

const router = useRouter();
const features = ref<Feature[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

const fetchFeatures = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    features.value = await FeatureService.getAll();
  } catch (err) {
    error.value = 'Failed to load features. Please try again later.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchFeatures();
});

const exportToMarkdown = () => {
  if (!features.value.length) return;

  const title = '# Feature List\n\n';
  const header = '| ID | Name |\n| --- | --- |\n';
  const rows = features.value.map(f => `| ${f.id} | ${f.name} |`).join('\n');
  
  const markdownContent = title + header + rows;
  const blob = new Blob([markdownContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'features_export.md';
  a.click();
  
  URL.revokeObjectURL(url);
};
</script>

<template>
  <MainLayout>
    <div class="feature-page">
      <div class="page-header justify-between align-center">
        <h2>Features</h2>
        <div class="header-actions flex gap-4">
          <button class="btn btn-outline flex align-center gap-2" @click="exportToMarkdown">
            <span class="material-icons-outlined">download</span>
            Export
          </button>
          <button class="btn btn-outline flex align-center gap-2">
             <span class="material-icons-outlined">arrow_back</span>
             Features
          </button>
        </div>
      </div>

      <div class="feature-content card">
        <div class="content-header">
           <div class="search-bar">
              <span class="material-icons-outlined">search</span>
              <input type="text" placeholder="Search features..." />
           </div>
           <div class="filter-actions flex gap-2">
              <button class="btn btn-filter active">
                <span class="material-icons-outlined">filter_list</span>
                Filters
              </button>
              <button class="btn btn-filter">
                <span class="material-icons-outlined">expand_more</span>
              </button>
           </div>
           <button class="btn btn-primary add-feature-btn" @click="router.push('/features/add')">
             <span class="material-icons-outlined">add</span>
             Add Feature
             <span class="material-icons-outlined">expand_more</span>
           </button>
        </div>

        <div class="list-summary flex justify-between align-center">
           <span class="count-text">{{ features.length }} Features</span>
           <div class="pagination-simple flex align-center gap-2">
              <span>1–{{ features.length }} of {{ features.length }}</span>
              <button class="nav-btn disabled"><span class="material-icons-outlined">chevron_left</span></button>
              <button class="nav-btn disabled"><span class="material-icons-outlined">chevron_right</span></button>
           </div>
        </div>

        <div class="feature-list">
          <div v-if="isLoading" class="loading-state flex justify-center align-center p-8">
            <span class="material-icons-outlined rotating">sync</span>
            <span>Loading features...</span>
          </div>
          <div v-else-if="error" class="error-state flex justify-center align-center p-8 text-danger">
            <span class="material-icons-outlined">error_outline</span>
            <span>{{ error }}</span>
            <button @click="fetchFeatures" class="btn btn-link">Retry</button>
          </div>
          <template v-else>
            <div class="list-header flex align-center gap-4">
              <div class="col-drag"></div>
              <div class="col-icon"></div>
              <div class="col-id">Feature ID</div>
              <div class="col-name">Feature Name</div>
              <div class="col-symbolic">Symbolic Text</div>
              <div class="col-count">Count</div>
              <div class="col-actions">Actions</div>
            </div>
            <FeatureListItem 
              v-for="feature in features" 
              :key="feature.id" 
              :feature="feature" 
            />
          </template>
        </div>

        <div class="list-footer flex justify-between align-center">
           <div></div>
           <div class="pagination-simple flex align-center gap-2">
              <span>1–5 of 5</span>
              <button class="nav-btn disabled"><span class="material-icons-outlined">chevron_left</span></button>
              <button class="nav-btn"><span class="material-icons-outlined">chevron_right</span></button>
           </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.feature-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 600;
}

.btn-outline {
  border: 1px solid var(--border-color);
  background: white;
  color: var(--text-main);
  padding: 8px 16px;
}

.feature-content {
  padding: 0;
  overflow: hidden;
}

.content-header {
  display: flex;
  padding: 24px;
  gap: 16px;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  background-color: #fcfcfc;
}

.search-bar input {
  border: none;
  background: none;
  outline: none;
  width: 100%;
}

.search-bar .material-icons-outlined {
  color: var(--text-muted);
}

.btn-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--border-color);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--text-main);
}

.btn-filter.active {
  background-color: #f8f9fa;
}

.loading-state, .error-state {
  flex-direction: column;
  gap: 12px;
  color: var(--text-muted);
  font-size: 14px;
}

.rotating {
  animation: rotate 1.5s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.p-8 {
  padding: 32px;
}

.text-danger {
  color: var(--danger-color);
}

.btn-link {
  background: none;
  border: none;
  color: var(--primary-color);
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
}

.add-feature-btn {
  display: flex;
  align-items: center;
  gap: 8px;
}

.list-summary {
  padding: 12px 24px;
  background-color: #fafafa;
  border-bottom: 1px solid var(--border-color);
}

.count-text {
  font-size: 13px;
  color: var(--text-muted);
}

.pagination-simple {
  font-size: 13px;
  color: var(--text-muted);
}

.nav-btn {
  padding: 2px;
  color: var(--text-main);
}

.nav-btn.disabled {
  color: #ccc;
  cursor: default;
}

.feature-list {
  display: flex;
  flex-direction: column;
}

.list-header {
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid var(--border-color);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.col-drag { width: 24px; }
.col-icon { width: 32px; }
.col-id { width: 100px; }
.col-name { flex: 2; }
.col-symbolic { flex: 2; }
.col-count { width: 80px; text-align: center; }
.col-actions { width: 120px; text-align: right; }

.list-footer {
  padding: 12px 24px;
  background-color: #fafafa;
}
</style>
