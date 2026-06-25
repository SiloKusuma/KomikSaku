<template>
  <nav class="navbar">
    <div class="navbar-inner container">
      <router-link to="/" class="navbar-brand">
        <span class="brand-icon">K</span>
        <span class="brand-text">KomikSaku</span>
      </router-link>

      <div class="navbar-links">
        <router-link to="/" class="nav-link">Beranda</router-link>
        <router-link to="/about" class="nav-link">About</router-link>
        <router-link v-if="store.isCreator" to="/dashboard" class="nav-link">Dashboard</router-link>
      </div>

      <div class="navbar-actions">
        <template v-if="store.isLoggedIn">
          <span class="coin-badge">
            <span class="coin-icon">K</span>
            {{ store.coinBalance }}
          </span>
          <router-link to="/profile" class="nav-link profile-link">
            {{ store.username }}
          </router-link>
          <button class="btn btn-sm btn-secondary" @click="handleLogout">Keluar</button>
        </template>
        <template v-else>
          <router-link to="/login" class="btn btn-sm btn-secondary">Masuk</router-link>
          <router-link to="/register" class="btn btn-sm btn-primary">Daftar</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const store = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await store.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #e8ecf1;
  height: 64px;
}

.navbar-inner {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 2rem;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.125rem;
  color: #1a1a2e;
}

.brand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #3b4a6b;
  color: #fff;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 700;
}

.brand-text {
  color: #1a1a2e;
}

.navbar-links {
  display: flex;
  gap: 1.25rem;
  flex: 1;
}

.nav-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: #5a6a7e;
  padding: 0.375rem 0;
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.nav-link:hover,
.nav-link.router-link-exact-active {
  color: #3b4a6b;
  border-bottom-color: #3b4a6b;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.coin-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  background: #e8ecf1;
  border-radius: 12px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #3b4a6b;
}

.coin-icon {
  font-size: 0.75rem;
  font-weight: 700;
  color: #5a7a9a;
}

.profile-link {
  font-weight: 600;
}

@media (max-width: 640px) {
  .navbar-links {
    display: none;
  }
  .navbar-actions .btn-secondary {
    display: none;
  }
}
</style>
