<script setup lang="ts">
interface Collection {
  id: string;
  name: string;
  productCount: number;
  isActive: boolean;
}

defineProps<{
  collection: Collection;
}>();
</script>

<template>
  <div class="collection-item flex align-center gap-4">
    <div class="col-drag drag-handle">
      <span class="material-icons-outlined">drag_indicator</span>
    </div>
    
    <div class="col-icon collection-icon">
      <span class="material-icons-outlined">collections</span>
    </div>

    <div class="col-id collection-id">
      <span>[{{ collection.id }}]</span>
    </div>

    <div class="col-name collection-name">
      {{ collection.name }}
    </div>

    <div class="col-count product-count">
      {{ collection.productCount }}
    </div>

    <div class="col-actions item-actions">
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
.collection-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: white;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s;
}

.collection-item:hover {
  background-color: #fcfcfc;
}

/* Column Widths (matching CollectionListView header) */
.col-drag { width: 24px; }
.col-icon { width: 32px; }
.col-id { width: 100px; }
.col-name { flex: 4; font-weight: 500; color: var(--text-main); }
.col-count { width: 80px; text-align: center; }
.col-actions { width: 120px; text-align: right; }

.drag-handle {
  color: #ccc;
  cursor: grab;
  display: flex;
  align-items: center;
}

.collection-icon {
  color: #b0bec5;
  display: flex;
  align-items: center;
}

.collection-id span {
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

.text-muted {
  color: #ccc;
  font-size: 12px;
}

.item-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
