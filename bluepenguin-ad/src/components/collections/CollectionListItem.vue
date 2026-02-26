<script setup lang="ts">
import { useRouter } from 'vue-router';

interface Collection {
  id: string;
  name: string;
  productCount: number;
  isActive: boolean;
}

const props = defineProps<{
  collection: Collection;
}>();

const router = useRouter();

const handleEdit = () => {
  router.push(`/collections/edit/${props.collection.id}`);
};

const handleItemClick = () => {
  router.push(`/?collection=${props.collection.id}`);
};
</script>

<template>
  <div class="collection-item flex align-center gap-4 clickable" @click="handleItemClick">
    <div class="col-drag drag-handle" @click.stop>
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
      <button class="btn-icon edit" title="Edit" @click.stop="handleEdit">
        <span class="material-icons-outlined">edit</span>
      </button>
      <span class="material-icons-outlined more-icon" @click.stop>more_vert</span>
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

.collection-item.clickable {
  cursor: pointer;
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

.more-icon {
  color: #ccc;
  cursor: pointer;
}
</style>
