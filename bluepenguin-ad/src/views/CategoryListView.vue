<script setup lang="ts">
import { onMounted } from 'vue';
import MainLayout from '../components/layout/MainLayout.vue';
import CategoryListItem from '../components/categories/CategoryListItem.vue';
import { useCategoryStore } from '../stores/categoryStore';
import type { Category } from '../services/CategoryService';

const store = useCategoryStore();

onMounted(() => {
  store.fetchCategories();
});

const handleToggleFeatured = async (category: Category) => {
  try {
    await store.toggleFeatured(category);
  } catch (e: any) {
    // Error is already handled/stored in the store for UI rendering
  }
};

const exportToMarkdown = () => {
  if (!store.categories.length) return;

  const title = '# Category List\n\n';
  const header = '| ID | Name |\n| --- | --- |\n';
  const rows = store.categories.map(c => `| ${c.id} | ${c.name} |`).join('\n');
  
  const markdownContent = title + header + rows;
  const blob = new Blob([markdownContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'categories_export.md';
  a.click();
  
  URL.revokeObjectURL(url);
};
</script>

<template>
  <MainLayout>
    <div class="category-page">
      <div class="page-header justify-between align-center">
        <h2>Categories</h2>
        <div class="header-actions flex gap-4">
          <button class="btn btn-outline flex align-center gap-2" @click="exportToMarkdown">
            <span class="material-icons-outlined">download</span>
            Export
          </button>
          <button class="btn btn-outline flex align-center gap-2">
             <span class="material-icons-outlined">arrow_back</span>
             Categories
          </button>
        </div>
      </div>

      <div v-if="store.error" class="alert alert-error flex align-center gap-2">
        <span class="material-icons-outlined">error_outline</span>
        <span>{{ store.error }}</span>
      </div>

      <div class="category-content card">
        <div class="content-header">
           <div class="search-bar">
              <span class="material-icons-outlined">search</span>
              <input type="text" placeholder="Search categories..." />
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
        </div>

        <div class="list-summary flex justify-between align-center">
           <span class="count-text" v-if="!store.isLoading">{{ store.categories.length }} Categories</span>
           <span class="count-text" v-else>Loading...</span>
           <div class="pagination-simple flex align-center gap-2">
              <span>1–{{ store.categories.length }} of {{ store.categories.length }}</span>
              <button class="nav-btn disabled"><span class="material-icons-outlined">chevron_left</span></button>
              <button class="nav-btn disabled"><span class="material-icons-outlined">chevron_right</span></button>
           </div>
        </div>

        <div class="category-list" v-if="!store.isLoading">
          <CategoryListItem 
            v-for="cat in store.categories" 
            :key="cat.id" 
            :category="cat"
            :is-featured="store.isFeatured(cat.id)"
            @toggle-featured="handleToggleFeatured"
          />
        </div>
        
        <div v-else class="text-center p-4">Loading categories...</div>

        <div class="list-footer flex justify-between align-center">
           <div></div>
           <div class="pagination-simple flex align-center gap-2">
              <span>1–{{ store.categories.length }} of {{ store.categories.length }}</span>
              <button class="nav-btn disabled"><span class="material-icons-outlined">chevron_left</span></button>
              <button class="nav-btn"><span class="material-icons-outlined">chevron_right</span></button>
           </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.category-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 600;
}

.alert {
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  font-size: 14px;
}

.alert-error {
  background-color: #fff5f5;
  color: var(--danger-color, #c53030);
  border: 1px solid #feb2b2;
}

.btn-outline {
  border: 1px solid var(--border-color);
  background: white;
  color: var(--text-main);
  padding: 8px 16px;
}

.category-content {
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

.category-list {
  display: flex;
  flex-direction: column;
}

.list-footer {
  padding: 12px 24px;
  background-color: #fafafa;
}
</style>
