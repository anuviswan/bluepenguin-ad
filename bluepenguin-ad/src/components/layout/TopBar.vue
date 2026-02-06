<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  searchPlaceholder?: string;
  actionText?: string;
  onAction?: () => void;
}>();

const searchQuery = ref('');
</script>

<template>
  <header class="topbar">
    <div class="search-container">
      <span class="material-icons-outlined">search</span>
      <input 
        type="text" 
        v-model="searchQuery" 
        :placeholder="searchPlaceholder || 'Search products, SKUs, materials...'" 
        class="search-input"
      />
    </div>

    <div class="actions">
      <button class="btn-add" @click="onAction">
        <span class="material-icons-outlined">add</span>
        <span>{{ actionText || 'Add Product' }}</span>
      </button>

      <div class="user-profile">
        <div class="avatar">
          <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="User Avatar" />
        </div>
        <div class="user-info">
          <span class="user-name">Admin</span>
          <span class="material-icons-outlined">expand_more</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  height: var(--topbar-height);
  background-color: #ffffff;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: fixed;
  top: 0;
  left: var(--sidebar-width);
  right: 0;
  z-index: 999;
}

.search-container {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 8px 16px;
  width: 400px;
  gap: 12px;
}

.search-container span {
  color: var(--text-muted);
}

.search-input {
  border: none;
  background: none;
  outline: none;
  width: 100%;
  font-size: 14px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #ffffff;
  border: 1px solid var(--border-color);
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-weight: 500;
  color: var(--text-main);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 8px;
  border: 1px solid var(--border-color);
  border-radius: 30px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.user-name {
  font-weight: 500;
  font-size: 13px;
}
</style>
