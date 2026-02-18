<script setup lang="ts">
</script>

<template>
  <header class="topbar">
    <div class="actions">
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
  justify-content: flex-end;
  padding: 0 24px;
  position: fixed;
  top: 0;
  left: var(--sidebar-width);
  right: 0;
  z-index: 999;
}

.actions {
  display: flex;
  align-items: center;
  gap: 20px;
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
