<script setup lang="ts">
defineProps<{
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
}>();
</script>

<template>
  <div class="summary-card">
    <div class="card-content">
      <div class="card-info">
        <h3 class="card-title">{{ title }}</h3>
        <div v-if="value" class="card-value">{{ value }}</div>
        <div v-if="list && list.length > 0" class="card-list mt-2">
          <div v-for="item in list" :key="item.label" class="list-item">
            <span class="item-label">{{ item.label }}</span>
            <span class="item-value">{{ item.value }}</span>
          </div>
        </div>
        <div v-if="subtitle || trend" class="card-footer mt-2">
          <span v-if="subtitle" class="card-subtitle">{{ subtitle }}</span>
          <div v-if="trend" :class="['trend', trend.isUp ? 'trend-up' : 'trend-down']">
            <span class="material-icons-outlined">{{ trend.isUp ? 'arrow_drop_up' : 'arrow_drop_down' }}</span>
          </div>
        </div>
      </div>
      <div class="card-icon" :style="{ backgroundColor: iconBgColor || 'var(--primary-light)' }">
        <span class="material-icons-outlined">{{ icon }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  flex: 1;
  transition: var(--transition-base);
  cursor: default;
  position: relative;
  overflow: hidden;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
  border-color: var(--primary-light);
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-info {
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.card-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 4px;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--text-main);
}

.item-label {
  font-weight: 500;
}

.item-value {
  color: var(--text-muted);
  font-weight: 600;
}

.mt-2 { margin-top: 8px; }

.card-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-subtitle {
  font-size: 12px;
  color: var(--text-muted);
}

.card-icon {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-base);
  background: linear-gradient(135deg, var(--primary-light) 0%, #ffffff 100%);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.summary-card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color) 100%);
}

.summary-card:hover .card-icon .material-icons-outlined {
  color: white;
}

.card-icon .material-icons-outlined {
  font-size: 24px;
  color: var(--primary-color);
}

.trend {
  display: flex;
  align-items: center;
}

.trend-up { color: var(--success-color); }
.trend-down { color: var(--danger-color); }
</style>
