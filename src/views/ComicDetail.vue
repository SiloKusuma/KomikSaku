<template>
  <div class="comic-detail-page">
    <div class="container">
      <div v-if="loading" class="loading-container">
        <div class="spinner spinner-lg"></div>
        <p>Memuat detail komik...</p>
      </div>

      <div v-else-if="error" class="alert alert-error">{{ error }}</div>

      <template v-else-if="comic">
        <div class="comic-header">
          <div class="comic-cover-section">
            <img
              :src="comic.cover_image || placeholderCover"
              :alt="comic.title"
              class="comic-cover-main"
            />
          </div>
          <div class="comic-info-section">
            <h1 class="comic-title">{{ comic.title }}</h1>
            <p class="comic-creator">
              oleh <strong>{{ comic.creator_display || comic.creator_name }}</strong>
            </p>
            <p class="comic-description">{{ comic.description }}</p>
            <div class="comic-tags">
              <span class="tag">{{ comic.genre }}</span>
              <span class="tag">{{ comic.status }}</span>
              <span class="tag">{{ formatViews(comic.total_views) }} dibaca</span>
            </div>
            <div class="comic-actions">
              <button
                v-if="authStore.isLoggedIn"
                :class="['btn', isFavorited ? 'btn-secondary' : 'btn-primary']"
                @click="toggleFav"
              >
                {{ isFavorited ? 'Favorit' : 'Favoritkan' }}
              </button>
              <button
                v-if="authStore.isLoggedIn && comic.creator_id !== authStore.user?.id"
                class="btn btn-secondary"
                @click="showTipModal = true"
              >
                Tip Kreator
              </button>
            </div>
            <div class="comic-stats">
              <div class="stat">
                <span class="stat-value">{{ comic.chapters?.length || 0 }}</span>
                <span class="stat-label">Chapter</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ comic.total_tips || 0 }}</span>
                <span class="stat-label">Tips</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ formatViews(comic.total_views) }}</span>
                <span class="stat-label">Dibaca</span>
              </div>
            </div>
          </div>
        </div>

        <section class="chapters-section">
          <h2 class="section-title">Daftar Chapter</h2>
          <div v-if="!comic.chapters || comic.chapters.length === 0" class="empty-state">
            <p>Belum ada chapter.</p>
          </div>
          <div v-else class="chapter-list">
            <router-link
              v-for="ch in comic.chapters"
              :key="ch.id"
              :to="`/read/${comic.slug}/${ch.chapter_number}`"
              class="chapter-item"
            >
              <div class="chapter-info">
                <span class="chapter-number">Chapter {{ ch.chapter_number }}</span>
                <span class="chapter-title">{{ ch.title }}</span>
              </div>
              <div class="chapter-meta">
                <span class="chapter-pages">{{ ch.page_count }} halaman</span>
                <span class="chapter-views">{{ formatViews(ch.views) }}</span>
              </div>
            </router-link>
          </div>
        </section>
      </template>
    </div>

    <Teleport to="body">
      <div v-if="showTipModal" class="modal-overlay" @click.self="showTipModal = false">
        <div class="modal-content card">
          <h3 class="modal-title">Kirim Tip</h3>
          <p class="modal-subtitle">Dukung kreator ini dengan koin</p>

          <div class="tip-amounts">
            <button
              v-for="amt in [5, 10, 25, 50, 100]"
              :key="amt"
              :class="['tip-amount-btn', { active: tipAmount === amt }]"
              @click="tipAmount = amt"
            >{{ amt }}</button>
          </div>

          <div class="form-group">
            <input
              v-model.number="tipAmount"
              type="number"
              class="form-input"
              min="1"
              placeholder="Jumlah koin"
            />
          </div>

          <div class="modal-actions">
            <button class="btn btn-secondary" @click="showTipModal = false">Batal</button>
            <button class="btn btn-primary" :disabled="tipLoading" @click="sendTip">
              <span v-if="tipLoading" class="spinner"></span>
              <span v-else>Kirim {{ tipAmount }} Koin</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useKomikStore } from '../store/komik'
import { useAuthStore } from '../store/auth'
import { useTipStore } from '../store/tip'

const toast = inject('toast')
const route = useRoute()
const komikStore = useKomikStore()
const authStore = useAuthStore()
const tipStore = useTipStore()

const comic = ref(null)
const loading = ref(true)
const error = ref('')
const isFavorited = ref(false)
const showTipModal = ref(false)
const tipAmount = ref(10)
const tipLoading = ref(false)

const placeholderCover = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect fill="#e8ecf1" width="300" height="400"/><text fill="#7a8ba3" font-family="Inter" font-size="14" x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">No Cover</text></svg>'
)

function formatViews(views) {
  if (!views) return '0'
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M'
  if (views >= 1000) return (views / 1000).toFixed(1) + 'rb'
  return views.toString()
}

async function toggleFav() {
  const result = await komikStore.toggleFavorite(comic.value.id, authStore.token)
  if (result.status === 'success') {
    isFavorited.value = !isFavorited.value
  }
}

async function sendTip() {
  if (tipAmount.value < 1) {
    toast.error('Jumlah koin minimal 1')
    return
  }

  tipLoading.value = true

  const result = await tipStore.sendTip(
    comic.value.creator_id,
    tipAmount.value,
    comic.value.id,
    authStore.token
  )

  tipLoading.value = false

  if (result.status === 'success') {
    toast.success(`Tip ${tipAmount.value} koin terkirim!`)
    authStore.updateUser({ coin_balance: result.data.new_balance })
    setTimeout(() => {
      showTipModal.value = false
    }, 1000)
  } else {
    toast.error(result.message || 'Gagal mengirim tip')
  }
}

onMounted(async () => {
  const slug = route.params.slug
  const result = await komikStore.fetchComic(slug)
  if (result) {
    comic.value = result
  } else {
    error.value = komikStore.error
  }
  loading.value = false
})
</script>

<style scoped>
.comic-detail-page {
  padding: 2rem 0 3rem;
}

.comic-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.comic-cover-section {
  flex-shrink: 0;
  width: 280px;
}

.comic-cover-main {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.comic-info-section {
  flex: 1;
}

.comic-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
}

.comic-creator {
  font-size: 0.9375rem;
  color: #7a8ba3;
  margin-bottom: 1rem;
}

.comic-description {
  font-size: 0.9375rem;
  color: #3b4a6b;
  line-height: 1.7;
  margin-bottom: 1rem;
}

.comic-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.tag {
  padding: 0.25rem 0.625rem;
  background: #f0f2f5;
  border-radius: 4px;
  font-size: 0.8125rem;
  color: #5a6a7e;
}

.comic-actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.comic-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1a2e;
}

.stat-label {
  font-size: 0.75rem;
  color: #7a8ba3;
}

.chapter-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chapter-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.chapter-item:hover {
  border-color: #c8d0da;
  background: #fafbfc;
}

.chapter-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.chapter-number {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #3b4a6b;
}

.chapter-title {
  font-size: 0.875rem;
  color: #1a1a2e;
}

.chapter-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8125rem;
  color: #7a8ba3;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
}

.modal-content {
  width: 100%;
  max-width: 380px;
  padding: 1.5rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 0.25rem;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: #7a8ba3;
  margin-bottom: 1rem;
}

.tip-amounts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.tip-amount-btn {
  padding: 0.5rem 1rem;
  background: #f0f2f5;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #3b4a6b;
  transition: all 0.2s ease;
}

.tip-amount-btn.active {
  background: #3b4a6b;
  color: #fff;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .comic-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .comic-cover-section {
    width: 200px;
  }
  .comic-stats {
    justify-content: center;
  }
  .comic-actions {
    justify-content: center;
  }
  .comic-tags {
    justify-content: center;
  }
}
</style>
