<script setup lang="ts">
import MainLayout from '../components/layout/MainLayout.vue';
import SummaryCard from '../components/dashboard/SummaryCard.vue';
import ProductTable from '../components/dashboard/ProductTable.vue';
import RecentlyEditedList from '../components/dashboard/RecentlyEditedList.vue';
import LowInventoryList from '../components/dashboard/LowInventoryList.vue';
import QuickLinks from '../components/dashboard/QuickLinks.vue';

interface Stat {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  iconBgColor?: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
}

const summaryStats: Stat[] = [
  { title: 'Active Products', value: '342', subtitle: 'Products', icon: 'inventory_2', trend: { value: '+12%', isUp: true } },
  { title: 'Out of Stock', value: '18', subtitle: 'Out of Stock', icon: 'report_problem', iconBgColor: '#fff5f5' },
  { title: 'Collections Live', value: '5', subtitle: 'Recently Added', icon: 'category', trend: { value: '+2', isUp: true } },
  { title: 'Recently & Status', value: '34', icon: 'history' },
];
</script>

<template>
  <MainLayout>
    <div class="dashboard-content">
      <div class="summary-grid">
        <SummaryCard 
          v-for="stat in summaryStats" 
          :key="stat.title"
          v-bind="stat"
        />
      </div>

      <ProductTable />

      <div class="activity-grid">
        <RecentlyEditedList />
        <LowInventoryList />
      </div>

      <QuickLinks />
    </div>
  </MainLayout>
</template>

<style scoped>
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.activity-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .activity-grid {
    grid-template-columns: 1fr;
  }
}
</style>
