<script setup lang="ts">
import { ref } from 'vue';
import MainLayout from '../components/layout/MainLayout.vue';
import FeatureListItem from '../components/features/FeatureListItem.vue';

interface Feature {
  id: string;
  name: string;
  productCount: number;
  isActive: boolean;
}

const features = ref<Feature[]>([
  { id: '1', name: 'Anti-Tarnish', productCount: 122, isActive: true },
  { id: '2', name: 'Water-Resistant', productCount: 93, isActive: true },
  { id: '3', name: 'Hypoallergenic', productCount: 57, isActive: true },
  { id: '4', name: 'Recycled Silver', productCount: 81, isActive: true },
  { id: '5', name: 'Handcrafted', productCount: 29, isActive: true },
]);
</script>

<template>
  <MainLayout>
    <div class="feature-page">
      <div class="page-header justify-between align-center">
        <h2>Features</h2>
        <div class="header-actions flex gap-4">
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
           <button class="btn btn-primary add-feature-btn">
             <span class="material-icons-outlined">add</span>
             Add Feature
             <span class="material-icons-outlined">expand_more</span>
           </button>
        </div>

        <div class="list-summary flex justify-between align-center">
           <span class="count-text">5 Features</span>
           <div class="pagination-simple flex align-center gap-2">
              <span>1–5 of 5</span>
              <button class="nav-btn disabled"><span class="material-icons-outlined">chevron_left</span></button>
              <button class="nav-btn disabled"><span class="material-icons-outlined">chevron_right</span></button>
           </div>
        </div>

        <div class="feature-list">
          <FeatureListItem 
            v-for="feature in features" 
            :key="feature.id" 
            :feature="feature" 
          />
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

.list-footer {
  padding: 12px 24px;
  background-color: #fafafa;
}
</style>
