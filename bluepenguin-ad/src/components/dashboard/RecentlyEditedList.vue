<script setup lang="ts">
interface EditedProduct {
  name: string;
  time: string;
  status: string;
  image: string;
}

const items: EditedProduct[] = [
  { name: 'Starfish Anklet', time: '5 hours ago', status: 'Live', image: 'https://placehold.co/40x40?text=S' },
  { name: 'Boho Bead Necklace', time: '3 hours ago', status: 'Live', image: 'https://placehold.co/40x40?text=B' },
  { name: 'Blue Pearl Necklace', time: '3 hours ago', status: 'Live', image: 'https://placehold.co/40x40?text=P' },
  { name: 'Lapis Drop Earrings', time: '4 hours ago', status: 'Live', image: 'https://placehold.co/40x40?text=L' },
  { name: 'Adjustable Resin Bangle', time: 'Do stex', status: '...', image: 'https://placehold.co/40x40?text=A' },
];
</script>

<template>
  <div class="activity-section card">
    <div class="section-header">
      <h3>Recently Edited Products</h3>
      <a href="#" class="view-all">View All <span class="material-icons-outlined">chevron_right</span></a>
    </div>

    <ul class="activity-list">
      <li v-for="item in items" :key="item.name" class="activity-item">
        <div class="item-visual">
          <img :src="item.image" alt="Product Image" />
        </div>
        <div class="item-content">
          <div class="item-main">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-time">{{ item.time }}</span>
          </div>
          <div class="item-status">
            <span v-if="item.status === 'Live'" class="badge badge-success">{{ item.status }}</span>
            <span v-else class="material-icons-outlined more-icon">more_horiz</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.activity-section {
  flex: 1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 16px;
  font-weight: 600;
}

.view-all {
  font-size: 12px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  gap: 12px;
  align-items: center;
}

.item-visual {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.item-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-main {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
}

.item-time {
  font-size: 12px;
  color: var(--text-muted);
}

.more-icon {
  color: var(--text-muted);
  font-size: 18px;
}
</style>
