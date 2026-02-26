<script setup lang="ts">
import type { Material } from '../../services/MaterialService';

const props = defineProps<{
  material: Material;
}>();

import { useRouter } from 'vue-router';
const router = useRouter();

const handleItemClick = () => {
  router.push(`/?material=${props.material.id}`);
};
</script>

<template>
  <div class="material-item flex align-center gap-4 clickable" @click="handleItemClick">
    <div class="col-drag drag-handle" @click.stop>
      <span class="material-icons-outlined">drag_indicator</span>
    </div>
    
    <div class="col-icon material-icon">
      <span class="material-icons-outlined">texture</span>
    </div>

    <div class="col-id material-id">
      <span>[{{ material.id }}]</span>
    </div>

    <div class="col-name material-name">
      {{ material.name }}
    </div>

    <div class="col-count product-count">
      {{ material.productCount }}
    </div>

    <div class="col-actions item-actions">
      <button class="btn-icon edit" title="Edit" @click.stop>
        <span class="material-icons-outlined">edit</span>
      </button>
      <button class="btn-icon delete" title="Delete" @click.stop>
        <span class="material-icons-outlined">delete_outline</span>
      </button>
      <span class="material-icons-outlined more-icon" @click.stop>more_vert</span>
    </div>
  </div>
</template>

<style scoped>
.material-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: white;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s;
}

.material-item.clickable {
  cursor: pointer;
}

.material-item:hover {
  background-color: #fcfcfc;
}

/* Column Widths (matching MaterialListView header) */
.col-drag { width: 24px; }
.col-icon { width: 32px; }
.col-id { width: 100px; }
.col-name { flex: 2; font-weight: 500; color: var(--text-main); }
.col-count { width: 80px; text-align: center; }
.col-actions { width: 120px; text-align: right; }

.drag-handle {
  color: #ccc;
  cursor: grab;
  display: flex;
  align-items: center;
}

.material-icon {
  color: #b0bec5;
  display: flex;
  align-items: center;
}

.material-id span {
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
