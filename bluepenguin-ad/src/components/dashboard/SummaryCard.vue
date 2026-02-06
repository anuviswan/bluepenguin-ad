<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  iconBgColor?: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
}>();
</script>

<template>
  <div class="summary-card">
    <div class="card-content">
      <div class="card-info">
        <h3 class="card-title">{{ title }}</h3>
        <div class="card-value">{{ value }}</div>
        <div v-if="subtitle || trend" class="card-footer">
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
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  flex: 1;
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
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
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
