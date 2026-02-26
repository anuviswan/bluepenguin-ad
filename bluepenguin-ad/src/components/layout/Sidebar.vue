<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="logo-container">
        <img src="../../assets/Logo 3.png" alt="Blue Penguin Logo" class="brand-logo" />
      </div>
    </div>

    <nav class="nav-menu">
      <ul>
        <li v-for="item in navItems" :key="item.name" :class="{ active: isActive(item.path) }">
          <router-link :to="item.path" class="nav-link">
            <span class="material-icons-outlined">{{ item.icon }}</span>
            <span class="nav-text">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <button @click="handleLogout" class="logout-button">
        <span class="material-icons-outlined">logout</span>
        <span class="nav-text">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

interface NavItem {
  name: string;
  icon: string;
  path: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', icon: 'dashboard', path: '/d' },
  { name: 'Products', icon: 'shopping_bag', path: '/products/create' },
  { name: 'Categories', icon: 'category', path: '/categories' },
  { name: 'Collections', icon: 'collections', path: '/collections' },
  { name: 'Materials', icon: 'texture', path: '/materials' },
  { name: 'Features', icon: 'auto_awesome', path: '/features' },
];

const isActive = (path: string) => {
  if (path === '/' && route.path === '/') return true;
  if (path !== '/' && route.path.startsWith(path)) return true;
  return false;
};

const handleLogout = () => {
  authStore.clearAuth();
  router.push('/login');
};
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}

.brand {
  height: var(--topbar-height);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.brand-logo {
  max-width: 100%;
  max-height: 50px;
  object-fit: contain;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-color);
}

.nav-menu {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
}

.nav-menu ul {
  padding: 0 12px;
}

.nav-menu li {
  margin-bottom: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  gap: 12px;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  transition: all 0.2s;
}

.nav-link:hover {
  background-color: var(--bg-main);
  color: var(--primary-color);
}

.active .nav-link {
  background-color: var(--primary-light);
  color: var(--primary-color);
  font-weight: 600;
}

.material-icons-outlined {
  font-size: 20px;
}

.nav-text {
  font-size: 14px;
}

.sidebar-footer {
  padding: 16px 12px;
  border-top: 1px solid var(--border-color);
}

.logout-button {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px 12px;
  gap: 12px;
  border: none;
  background: none;
  border-radius: var(--radius-sm);
  color: #ef4444;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.logout-button:hover {
  background-color: #fef2f2;
}

.logout-button .material-icons-outlined {
  font-size: 20px;
}
</style>
