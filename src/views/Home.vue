<template>
  <div class="home-page">
    <div class="container">
      <section class="hero-section">
        <h1 class="hero-title">Tempatnya Komik Indie</h1>
        <p class="hero-subtitle">Baca dan dukung kreator komik mandiri favoritmu. Setiap tipping membantu mereka berkarya.</p>
        <div class="hero-actions">
          <router-link to="/?sort=popular" class="btn btn-primary">Jelajahi Populer</router-link>
          <router-link to="/register?role=creator" class="btn btn-secondary">Mulai Publikasi</router-link>
        </div>
      </section>

      <div class="tab-bar">
        <button
          :class="['tab-btn', { active: activeTab === 'latest' }]"
          @click="switchTab('latest')"
        >Terbaru</button>
        <button
          :class="['tab-btn', { active: activeTab === 'popular' }]"
          @click="switchTab('popular')"
        >Terpopuler</button>
        <button
          :class="['tab-btn', { active: activeTab === 'featured' }]"
          @click="switchTab('featured')"
        >Rekomendasi</button>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="spinner spinner-lg"></div>
        <p>Memuat komik...</p>
      </div>

      <div v-else-if="error" class="alert alert-error">{{ error }}</div>

      <div v-else-if="comics.length === 0" class="empty-state">
        <p>Belum ada komik untuk ditampilkan.</p>
      </div>

      <div v-else class="comics-grid">
        <ComicCard v-for="comic in comics" :key="comic.id" :comic="comic" />
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <button
          :disabled="currentPage <= 1"
          class="btn btn-sm btn-secondary"
          @click="changePage(currentPage - 1)"
        >Sebelumnya</button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button
          :disabled="currentPage >= totalPages"
          class="btn btn-sm btn-secondary"
          @click="changePage(currentPage + 1)"
        >Selanjutnya</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useKomikStore } from '../store/komik'
import ComicCard from '../components/ComicCard.vue'

const toast = inject('toast')
const route = useRoute()
const router = useRouter()
const komikStore = useKomikStore()

const activeTab = ref(route.query.sort || 'latest')
const currentPage = ref(1)
const totalPages = ref(1)

const comics = komikStore.comics
const loading = komikStore.loading
const error = komikStore.error

async function loadComics() {
  const result = await komikStore.fetchComics(activeTab.value, currentPage.value)
  if (result) {
    totalPages.value = result.pages || 1
  } else {
    toast.error('Gagal memuat komik')
  }
}

function switchTab(tab) {
  activeTab.value = tab
  currentPage.value = 1
  router.replace({ query: { sort: tab } })
  loadComics()
}

function changePage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadComics()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  if (route.query.sort) {
    activeTab.value = route.query.sort
  }
  loadComics()
})

watch(() => route.query.sort, (val) => {
  if (val && val !== activeTab.value) {
    activeTab.value = val
    currentPage.value = 1
    loadComics()
  }
})
</script>

<style scoped>
.home-page {
  padding: 2rem 0 3rem;
}

.hero-section {
  text-align: center;
  padding: 3rem 1rem 2.5rem;
  margin-bottom: 2rem;
}

.hero-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 0.75rem;
}

.hero-subtitle {
  font-size: 1rem;
  color: #5a6a7e;
  max-width: 480px;
  margin: 0 auto 1.5rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.tab-bar {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
  background: #f0f2f5;
  padding: 0.25rem;
  border-radius: 8px;
  max-width: 400px;
}

.tab-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  background: transparent;
  color: #5a6a7e;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: #fff;
  color: #3b4a6b;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.comics-grid {
  margin-top: 0.5rem;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-info {
  font-size: 0.875rem;
  color: #7a8ba3;
}

.comics-grid {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

@media (min-width: 768px) {
  .comics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 1.5rem;
  }
  .hero-subtitle {
    font-size: 0.875rem;
  }
}
</style>
