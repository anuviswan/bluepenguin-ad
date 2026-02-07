<script setup lang="ts">
interface Feature {
  id: string;
  name: string;
  productCount: number;
  isActive: boolean;
}

defineProps<{
  feature: Feature;
}>();
</script>

<template>
  <div class="feature-item">
    <div class="drag-handle">
      <span class="material-icons-outlined">drag_indicator</span>
    </div>
    
    <div class="feature-icon">
      <span class="material-icons-outlined">auto_awesome</span>
    </div>

    <div class="feature-details">
      <span class="feature-id">[{{ feature.id }}]</span>
      <span class="feature-name">{{ feature.name }}</span>
      <span class="product-count">({{ feature.productCount }})</span>
    </div>

    <div class="item-actions">
      <button class="btn-icon edit" title="Edit">
        <span class="material-icons-outlined">edit</span>
      </button>
      <button class="btn-icon delete" title="Delete">
        <span class="material-icons-outlined">delete_outline</span>
      </button>
      <span class="material-icons-outlined more-icon">more_vert</span>
    </div>
  </div>
</template>

<style scoped>
.feature-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: white;
  border-bottom: 1px solid var(--border-color);
  gap: 16px;
  transition: background-color 0.2s;
}

.feature-item:hover {
  background-color: #fcfcfc;
}

.drag-handle {
  color: #ccc;
  cursor: grab;
  display: flex;
  align-items: center;
}

.feature-icon {
  color: #b0bec5;
  display: flex;
  align-items: center;
}

.feature-details {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.feature-name {
  font-weight: 500;
  color: var(--text-main);
}

.feature-id {
  font-family: monospace;
  font-size: 12px;
  color: var(--text-muted);
  background-color: var(--bg-main);
  padding: 2px 6px;
  border-radius: 4px;
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

.btn-icon.edit {
  color: var(--text-muted);
}

.btn-icon.edit:hover {
  background-color: var(--bg-main);
  color: var(--primary-color);
}

.btn-icon.delete {
  color: var(--danger-color);
}

.btn-icon.delete:hover {
  background-color: #fff5f5;
  color: #c53030;
}

.more-icon {
  color: #ccc;
  cursor: pointer;
}
</style>
