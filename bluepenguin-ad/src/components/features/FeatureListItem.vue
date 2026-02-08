<script setup lang="ts">
interface Feature {
  id: string;
  name: string;
  symbolicText?: string;
  productCount: number;
  isActive: boolean;
}

defineProps<{
  feature: Feature;
}>();
</script>

<template>
  <div class="feature-item flex align-center gap-4">
    <div class="col-drag drag-handle">
      <span class="material-icons-outlined">drag_indicator</span>
    </div>
    
    <div class="col-icon feature-icon">
      <span class="material-icons-outlined">auto_awesome</span>
    </div>

    <div class="col-id feature-id">
      <span>[{{ feature.id }}]</span>
    </div>

    <div class="col-name feature-name">
      {{ feature.name }}
    </div>

    <div class="col-symbolic">
      <span v-if="feature.symbolicText" class="feature-symbolic" :title="'Symbolic: ' + feature.symbolicText">
         <span class="material-icons-outlined">token</span>
         {{ feature.symbolicText }}
      </span>
      <span v-else class="text-muted">-</span>
    </div>

    <div class="col-count product-count">
      {{ feature.productCount }}
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
.feature-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: white;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s;
}

.feature-item:hover {
  background-color: #fcfcfc;
}

/* Column Widths (matching FeatureListView header) */
.col-drag { width: 24px; }
.col-icon { width: 32px; }
.col-id { width: 100px; }
.col-name { flex: 2; font-weight: 500; color: var(--text-main); }
.col-symbolic { flex: 2; }
.col-count { width: 80px; text-align: center; }
.col-actions { width: 120px; text-align: right; }

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

.feature-id span {
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

.feature-symbolic {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--primary-color);
  background-color: #f0f7ff;
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px solid #e0efff;
}

.feature-symbolic .material-icons-outlined {
  font-size: 14px;
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
