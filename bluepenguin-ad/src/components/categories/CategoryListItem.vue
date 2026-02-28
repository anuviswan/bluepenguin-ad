<script setup lang="ts">
import type { Category } from '../../services/CategoryService';
import { useRouter } from 'vue-router';

const props = defineProps<{
  category: Category;
  isFeatured?: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle-featured', category: Category): void
}>();

const router = useRouter();

const handleItemClick = () => {
  router.push(`/?category=${props.category.id}`);
};
</script>

<template>
  <div class="category-item clickable" @click="handleItemClick">
    <div class="drag-handle" @click.stop>
      <span class="material-icons-outlined">drag_indicator</span>
    </div>
    
    <div class="category-icon">
      <span class="material-icons-outlined">folder</span>
    </div>

    <div class="category-details">
      <span class="category-name">{{ category.name }}</span>
      <span class="product-count">({{ category.productCount }})</span>
    </div>

    <div class="item-actions">
      <button 
        class="btn-icon star" 
        :class="{ active: isFeatured }" 
        @click.stop="emit('toggle-featured', category)"
        :title="isFeatured ? 'Remove as Featured' : 'Mark as Featured'"
      >
        <span class="material-icons-outlined">
          {{ isFeatured ? 'star' : 'star_border' }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.category-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: white;
  border-bottom: 1px solid var(--border-color);
  gap: 16px;
  transition: background-color 0.2s;
}

.category-item.clickable {
  cursor: pointer;
}

.category-item:hover {
  background-color: #fcfcfc;
}

.drag-handle {
  color: #ccc;
  cursor: grab;
  display: flex;
  align-items: center;
}

.category-icon {
  color: #b0bec5;
  display: flex;
  align-items: center;
}

.category-details {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-name {
  font-weight: 500;
  color: var(--text-main);
}

.product-count {
  color: var(--text-muted);
  font-size: 13px;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
  background: none;
  border: none;
  cursor: pointer;
}

.btn-icon.star {
  color: #ccc;
}

.btn-icon.star:hover {
  color: #fbc02d;
}

.btn-icon.star.active {
  color: #fbc02d;
}

.btn-icon.star.active:hover {
  color: #f57f17;
}
</style>
