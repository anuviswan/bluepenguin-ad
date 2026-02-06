<script setup lang="ts"></script>

<template>
  <div class="quick-links">
    <div class="link-card card">
      <div class="link-info">
        <h3>Quick Links</h3>
        <button class="action-btn">
          <div class="btn-main">
            <span class="material-icons-outlined icon-plus">add</span>
            <span>Add New Product</span>
          </div>
          <span class="material-icons-outlined">chevron_right</span>
        </button>
      </div>
    </div>

    <div class="link-card card secondary">
      <div class="link-info">
        <div class="promo-text">
          <span class="dot"></span>
          <span>Bunt $21 $42 Products</span>
        </div>
        <button class="action-btn">
          <div class="btn-main">
            <span class="material-icons-outlined icon-folder">folder</span>
            <span>Create New Collection</span>
          </div>
          <span class="material-icons-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quick-links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 24px;
}

.link-card {
  padding: 24px;
}

.link-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
}

.action-btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f8f9fa;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: var(--primary-light);
  border-color: var(--primary-color);
}

.btn-main {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
}

.icon-plus { color: var(--primary-color); }
.icon-folder { color: var(--primary-color); }

.promo-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.dot {
  width: 4px;
  height: 4px;
  background-color: var(--primary-color);
  border-radius: 50%;
}
</style>
