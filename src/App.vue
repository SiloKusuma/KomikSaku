<template>
  <div class="app-wrapper">
    <GridBackground />
    <Navbar />
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
    <ToastNotification ref="toastRef" />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import GridBackground from './components/GridBackground.vue'
import Navbar from './components/Navbar.vue'
import ToastNotification from './components/ToastNotification.vue'

const toastRef = ref(null)
provide('toast', {
  show: (message, type = 'error', duration = 3000) => {
    toastRef.value?.show(message, type, duration)
  },
  error: (message) => toastRef.value?.show(message, 'error'),
  success: (message) => toastRef.value?.show(message, 'success'),
  info: (message) => toastRef.value?.show(message, 'info'),
})
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  position: relative;
}

.main-content {
  padding-top: 64px;
  min-height: calc(100vh - 64px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
