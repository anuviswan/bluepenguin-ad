<script setup lang="ts">
import { ref } from 'vue';

interface Product {
  sku: string;
  name: string;
  category: string;
  collection: string;
  price: string;
  status: string;
}

const products: Product[] = [
  { sku: 'BP-001', name: 'Blue Pearl Necklace', category: 'Necklace', collection: '-', price: '$45', status: 'Live' },
  { sku: 'BP-002', name: 'Ocean Dream Pendant', category: 'Ocean Dreams', collection: 'Ocean Dreams', price: '$35', status: 'Live' },
  { sku: 'BP-005', name: 'Starfish Anklet', category: 'Anklet', collection: '-', price: '$25', status: 'Live' },
  { sku: 'BP-007', name: 'Lapis Drop Earrings', category: 'Earrings', collection: 'Ocean Dreams', price: '$48', status: 'Live' },
  { sku: 'BP-006', name: 'Lapis Drop Necklace', category: 'Necklace', collection: '-', price: '$48', status: 'Live' },
  { sku: 'BP-009', name: 'Adjustable Resin Bangle', category: '-', collection: '-', price: '$...', status: 'Out of Stock' },
];

const categories: string[] = ['Category', 'Necklace', 'Ocean Dreams', 'Anklet', 'Earrings'];
const collections: string[] = ['Collection', 'Ocean Dreams'];
const materials: string[] = ['Material', 'Silver', 'Gold', 'Bead'];
const statuses: string[] = ['Status', 'Live', 'Out of Stock', 'Archived'];
</script>

<template>
  <div class="product-section card">
    <div class="section-header">
      <h2>Products</h2>
      <button class="btn btn-primary">
        <span class="material-icons-outlined">add</span>
        Add Product
      </button>
    </div>

    <div class="filters">
      <div class="filter-group">
        <div class="search-box">
          <span class="material-icons-outlined">search</span>
          <input type="text" placeholder="Search..." />
        </div>
        <div class="select-wrapper" v-for="filter in [categories, collections, materials, statuses]" :key="filter[0]">
          <select>
            <option v-for="opt in filter" :key="opt">{{ opt }}</option>
          </select>
          <span class="material-icons-outlined">expand_more</span>
        </div>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Category</th>
            <th>Collection</th>
            <th>Price</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.sku">
            <td>{{ product.sku }}</td>
            <td class="product-name">{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.collection }}</td>
            <td>{{ product.price }}</td>
            <td>
              <span :class="['badge', product.status === 'Live' ? 'badge-success' : 'badge-warning']">
                <span class="dot"></span>
                {{ product.status }}
              </span>
            </td>
            <td class="actions-cell">
              <span class="material-icons-outlined">more_horiz</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <span class="results-count">342 Products</span>
      <div class="pages">
        <button class="page-btn"><span class="material-icons-outlined">chevron_left</span></button>
        <button class="page-btn active">1</button>
        <button class="page-btn">2</button>
        <button class="page-btn">3</button>
        <button class="page-btn">4</button>
        <button class="page-btn"><span class="material-icons-outlined">chevron_right</span></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-section {
  margin-top: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 700;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filters {
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 6px 12px;
  gap: 8px;
  flex: 1;
  min-width: 200px;
}

.search-box input {
  border: none;
  outline: none;
  width: 100%;
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.select-wrapper select {
  padding: 8px 32px 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: white;
  appearance: none;
  font-size: 13px;
  color: var(--text-muted);
  cursor: pointer;
}

.select-wrapper .material-icons-outlined {
  position: absolute;
  right: 8px;
  pointer-events: none;
  font-size: 18px;
  color: var(--text-muted);
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 12px;
  font-size: 12px;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-color);
  font-weight: 500;
}

td {
  padding: 16px 12px;
  font-size: 13px;
  border-bottom: 1px solid var(--border-color);
}

.product-name {
  font-weight: 500;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}

.actions-cell {
  text-align: right;
  color: var(--text-muted);
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.results-count {
  font-size: 12px;
  color: var(--text-muted);
}

.pages {
  display: flex;
  gap: 8px;
}

.page-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: white;
  font-size: 13px;
  color: var(--text-muted);
}

.page-btn.active {
  background-color: var(--primary-light);
  border-color: var(--primary-color);
  color: var(--primary-color);
  font-weight: 600;
}
</style>
