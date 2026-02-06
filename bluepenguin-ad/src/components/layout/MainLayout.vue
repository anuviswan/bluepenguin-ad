<script setup lang="ts">
import Sidebar from './Sidebar.vue';
import TopBar from './TopBar.vue';
</script>

<template>
  <div class="layout-wrapper">
    <Sidebar />
    <div class="main-content">
      <TopBar />
      <main class="page-body">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout-wrapper {
  display: flex;
}

.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-body {
  padding: calc(var(--topbar-height) + 24px) 24px 24px;
  flex: 1;
}
</style>
