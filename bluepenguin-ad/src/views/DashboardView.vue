<script setup lang="ts">
import MainLayout from '../components/layout/MainLayout.vue';
import SummaryCard from '../components/dashboard/SummaryCard.vue';
import ProductTable from '../components/dashboard/ProductTable.vue';
import { ref, onMounted } from 'vue';
import { ProductService } from '../services/ProductService';
import { CollectionService } from '../services/CollectionService';
import { MaterialService } from '../services/MaterialService';
import { OccasionService } from '../services/OccasionService';

interface Stat {
  title: string;
  value?: string | number;
  subtitle?: string;
  icon: string;
  iconBgColor?: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  list?: { label: string; value: string | number }[];
}

const summaryStats = ref<Stat[]>([
  { title: 'Materials Used', list: [], icon: 'texture' },
  { title: 'Out of Stock', value: '0', subtitle: 'Needs Restock', icon: 'report_problem', iconBgColor: '#fff5f5' },
  { title: 'Upcoming Occasions', list: [], subtitle: 'Kerala Festivals', icon: 'event' },
  { title: 'Recently & Status', value: '0', icon: 'history' },
]);

const isLoading = ref(true);

const fetchStats = async () => {
  isLoading.value = true;
  try {
    const [collections, materials] = await Promise.all([
      CollectionService.getAll().catch(e => { console.error('Collections fetch error', e); return []; }),
      MaterialService.getAll().catch(e => { console.error('Materials fetch error', e); return []; })
    ]);

    const upcomingOccasions = OccasionService.getUpcoming(2);
    const occasionList = upcomingOccasions.map(o => ({
      label: o.name,
      value: o.date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
    }));

    // Products will be injected via ProductTable emitted event.
    // We just initialize the baseline stats here.
    const collectionsCount = collections.length;
    
    // Default placeholder until the product table loads its data and propagates it up
    summaryStats.value = [
      { title: 'Materials Used', list: [], icon: 'texture' },
      { title: 'Out of Stock', value: '0', subtitle: 'Needs Restock', icon: 'report_problem', iconBgColor: '#fff5f5' },
      { title: 'Upcoming Occasions', list: occasionList, subtitle: 'Kerala Festivals', icon: 'event' },
      { title: 'Recently & Status', value: '0', subtitle: 'Drafts', icon: 'history' },
    ];
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleProductsLoaded = (products: any[], materials: {id: string, name: string}[]) => {
    // Group by material and count from the provided list
    const materialCounts: Record<string, number> = {};
    products.forEach(p => {
      const mat = p.material || '-';
      materialCounts[mat] = (materialCounts[mat] || 0) + 1;
    });

    const materialList = Object.entries(materialCounts)
      .map(([code, count]) => ({
        label: code === '-' ? 'Uncategorized' : (materials.find(m => m.id === code)?.name || code),
        value: count
      }))
      .sort((a, b) => (b.value as number) - (a.value as number))
      .slice(0, 5); // Show top 5 materials

    const outOfStockCount = products.filter(p => p.stock === 0).length;

    // Preserve existing Upcoming Occasions
    const occasionStat = summaryStats.value.find(s => s.title === 'Upcoming Occasions');

    summaryStats.value = [
      { 
        title: 'Materials Used', 
        list: materialList,
        value: materialList.length === 0 ? 'No materials recorded' : undefined,
        icon: 'texture'
      },
      { 
        title: 'Out of Stock', 
        value: outOfStockCount.toString(), 
        subtitle: 'Needs Restock', 
        icon: 'report_problem', 
        iconBgColor: '#fff5f5' 
      },
      occasionStat || { title: 'Upcoming Occasions', list: [], icon: 'event' },
      { 
        title: 'Recently & Status', 
        value: products.slice(0, 10).filter(p => p.status === 'Draft').length.toString(), 
        subtitle: 'Drafts',
        icon: 'history' 
      },
    ];
};

onMounted(() => {
  fetchStats();
});
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

      <ProductTable @products-loaded="handleProductsLoaded" />
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
</style>
