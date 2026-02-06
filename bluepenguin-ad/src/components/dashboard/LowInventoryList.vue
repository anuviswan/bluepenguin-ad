<script setup lang="ts">
interface LowInventoryMaterial {
  name: string;
  count: number;
  type: string;
  icon: string;
}

const items: LowInventoryMaterial[] = [
  { name: 'Aquamarine Beads', count: 12, type: 'Bead-Based', icon: 'https://placehold.co/40x40?text=Aq' },
  { name: 'Moonstone Beads', count: 8, type: 'Bead-Based', icon: 'https://placehold.co/40x40?text=Mo' },
  { name: 'Silver Spacer Beads', count: 6, type: 'Bead-Based', icon: 'https://placehold.co/40x40?text=Si' },
  { name: 'Lapis Lazuli Beads', count: 43, type: 'Bead-Based', icon: 'https://placehold.co/40x40?text=La' },
];
</script>

<template>
  <div class="activity-section card">
    <div class="section-header">
      <h3>Low Inventory Materials</h3>
      <a href="#" class="view-all">View All <span class="material-icons-outlined">chevron_right</span></a>
    </div>

    <ul class="activity-list">
      <li v-for="item in items" :key="item.name" class="activity-item">
        <div class="item-visual">
          <img :src="item.icon" alt="Material Icon" />
        </div>
        <div class="item-content">
          <div class="item-main">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-type">{{ item.type }}</span>
          </div>
          <div class="item-count" :class="{ 'warning': item.count < 10 }">
            {{ item.count }}
            <span class="material-icons-outlined warning-icon">warning</span>
          </div>
        </div>
      </li>
    </ul>

    <div class="view-all-footer">
      <a href="#" class="view-all">View All <span class="material-icons-outlined">chevron_right</span></a>
    </div>
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

.item-type {
  font-size: 12px;
  color: var(--text-muted);
}

.item-count {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.item-count.warning {
  color: #c05621;
}

.warning-icon {
  font-size: 14px;
}

.view-all-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
