<template>
  <div class="dashboard-page">
    <div class="container">
      <div class="dashboard-header">
        <h1 class="dashboard-title">Dashboard Kreator</h1>
        <p class="dashboard-subtitle">Kelola komik dan lihat statistik</p>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="spinner spinner-lg"></div>
        <p>Memuat dashboard...</p>
      </div>

      <template v-else>
        <div class="stats-grid">
          <div class="stat-card card">
            <span class="stat-icon">K</span>
            <div class="stat-detail">
              <span class="stat-number">{{ stats.total_comics || 0 }}</span>
              <span class="stat-desc">Komik</span>
            </div>
          </div>
          <div class="stat-card card">
            <span class="stat-icon">C</span>
            <div class="stat-detail">
              <span class="stat-number">{{ stats.total_chapters || 0 }}</span>
              <span class="stat-desc">Chapter</span>
            </div>
          </div>
          <div class="stat-card card">
            <span class="stat-icon">V</span>
            <div class="stat-detail">
              <span class="stat-number">{{ formatNumber(stats.total_views) }}</span>
              <span class="stat-desc">Dibaca</span>
            </div>
          </div>
          <div class="stat-card card">
            <span class="stat-icon">T</span>
            <div class="stat-detail">
              <span class="stat-number">{{ stats.total_tips || 0 }}</span>
              <span class="stat-desc">Tips (koin)</span>
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="dashboard-section">
            <h2 class="section-title">Komik Saya</h2>

            <div v-if="myComics.length === 0" class="empty-state">
              <p>Belum ada komik. Buat komik pertamamu!</p>
            </div>

            <div v-else class="my-comics-list">
              <div v-for="c in myComics" :key="c.id" class="my-comic-item card">
                <div class="my-comic-info">
                  <h3 class="my-comic-title">{{ c.title }}</h3>
                  <div class="my-comic-meta">
                    <span>{{ c.chapter_count || 0 }} chapter</span>
                    <span>{{ formatNumber(c.total_views) }} dibaca</span>
                    <span>{{ c.favorite_count || 0 }} favorit</span>
                  </div>
                </div>
                <div class="my-comic-actions">
                  <button
                    class="btn btn-sm btn-secondary"
                    @click="openAddChapter(c.id)"
                  >+ Chapter</button>
                  <router-link
                    :to="`/comic/${c.slug}`"
                    class="btn btn-sm btn-secondary"
                  >Lihat</router-link>
                </div>
              </div>
            </div>
          </div>

          <div class="dashboard-section">
            <h2 class="section-title">Buat Komik Baru</h2>
            <form @submit.prevent="handleCreateComic" class="create-form card">
              <div class="form-group">
                <label class="form-label">Judul Komik</label>
                <input
                  v-model="newComic.title"
                  type="text"
                  class="form-input"
                  placeholder="Judul komik"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">Genre</label>
                <input
                  v-model="newComic.genre"
                  type="text"
                  class="form-input"
                  placeholder="Contoh: Romance, Drama, Action"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Sinopsis</label>
                <textarea
                  v-model="newComic.description"
                  class="form-input form-textarea"
                  placeholder="Ceritakan tentang komikmu..."
                ></textarea>
              </div>

              <button type="submit" class="btn btn-primary" :disabled="createLoading">
                <span v-if="createLoading" class="spinner"></span>
                <span v-else>Buat Komik</span>
              </button>
            </form>

            <div v-if="showChapterForm" class="add-chapter-section">
              <h3 class="section-title">Tambah Chapter</h3>
              <form @submit.prevent="handleAddChapter" class="create-form card">
                <div class="form-group">
                  <label class="form-label">Judul Chapter</label>
                  <input
                    v-model="newChapter.title"
                    type="text"
                    class="form-input"
                    placeholder="Judul chapter"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Nomor Chapter</label>
                  <input
                    v-model.number="newChapter.number"
                    type="number"
                    class="form-input"
                    min="1"
                    placeholder="1"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Upload Halaman</label>
                  <div
                    class="drop-zone"
                    @dragover.prevent
                    @drop.prevent="handleDrop"
                  >
                    <p v-if="!draggedFiles.length">Seret gambar ke sini atau klik untuk memilih</p>
                    <ul v-else class="file-list">
                      <li v-for="(f, i) in draggedFiles" :key="i">{{ f.name }}</li>
                    </ul>
                    <input
                      ref="fileInput"
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      class="file-input-hidden"
                      @change="handleFileSelect"
                    />
                    <button type="button" class="btn btn-sm btn-secondary mt-1" @click="triggerFileInput">
                      Pilih File
                    </button>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary" :disabled="chapterLoading">
                  <span v-if="chapterLoading" class="spinner"></span>
                  <span v-else>Simpan Chapter</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { useKomikStore } from '../store/komik'
import { useAuthStore } from '../store/auth'

const toast = inject('toast')
const komikStore = useKomikStore()
const authStore = useAuthStore()

const loading = ref(true)
const stats = ref({})
const myComics = ref([])

const newComic = ref({ title: '', genre: '', description: '' })
const createLoading = ref(false)

const showChapterForm = ref(false)
const activeComicId = ref(null)
const newChapter = ref({ title: '', number: 1 })
const chapterLoading = ref(false)
const draggedFiles = ref([])
const fileInput = ref(null)

function formatNumber(n) {
  if (!n) return '0'
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'rb'
  return n.toString()
}

function openAddChapter(comicId) {
  activeComicId.value = comicId
  showChapterForm.value = true
  newChapter.value = { title: '', number: 1 }
  draggedFiles.value = []
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(e) {
  draggedFiles.value = Array.from(e.target.files)
}

function handleDrop(e) {
  draggedFiles.value = Array.from(e.dataTransfer.files)
}

async function handleCreateComic() {
  if (!newComic.value.title) {
    toast.error('Judul komik wajib diisi')
    return
  }

  createLoading.value = true

  const result = await komikStore.createComic(newComic.value, authStore.token)

  createLoading.value = false

  if (result.status === 'success') {
    toast.success('Komik berhasil dibuat!')
    newComic.value = { title: '', genre: '', description: '' }
    loadMyComics()
  } else {
    toast.error(result.message || 'Gagal membuat komik')
  }
}

async function handleAddChapter() {
  if (!newChapter.value.title || !newChapter.value.number) {
    toast.error('Judul dan nomor chapter wajib diisi')
    return
  }

  chapterLoading.value = true

  const result = await komikStore.addChapter(activeComicId.value, {
    title: newChapter.value.title,
    chapter_number: newChapter.value.number,
  }, authStore.token)

  if (result.status === 'success') {
    if (draggedFiles.value.length > 0) {
      const formData = new FormData()
      formData.append('chapter_id', result.data.chapter_id)
      draggedFiles.value.forEach((f) => formData.append('pages[]', f))

      try {
        await fetch(`${import.meta.env.VITE_API_URL}upload/pages`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${authStore.token}` },
          body: formData,
        })
      } catch {
      }
    }

    toast.success('Chapter berhasil ditambahkan!')
    newChapter.value = { title: '', number: 1 }
    draggedFiles.value = []
    loadMyComics()
    setTimeout(() => {
      showChapterForm.value = false
    }, 1500)
  } else {
    toast.error(result.message || 'Gagal menambah chapter')
  }

  chapterLoading.value = false
}

async function loadMyComics() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}comics/my`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    const json = await res.json()
    if (json.status === 'success') {
      myComics.value = json.data.comics
    }
  } catch {
  }
}

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}user/stats`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    const json = await res.json()
    if (json.status === 'success') {
      stats.value = json.data.stats
    } else {
      toast.error(json.message)
    }
  } catch {
    toast.error('Gagal memuat statistik')
  }

  await loadMyComics()
  loading.value = false
})
</script>

<style scoped>
.dashboard-page {
  padding: 2rem 0 3rem;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 0.25rem;
}

.dashboard-subtitle {
  font-size: 0.875rem;
  color: #7a8ba3;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
}

.stat-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: #e8ecf1;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  color: #3b4a6b;
  flex-shrink: 0;
}

.stat-detail {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a2e;
}

.stat-desc {
  font-size: 0.75rem;
  color: #7a8ba3;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.dashboard-section {
  min-width: 0;
}

.my-comics-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.my-comic-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

.my-comic-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 0.25rem;
}

.my-comic-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #7a8ba3;
}

.my-comic-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.create-form {
  padding: 1.25rem;
}

.drop-zone {
  border: 2px dashed #d5dbe3;
  border-radius: 6px;
  padding: 1.5rem;
  text-align: center;
  color: #7a8ba3;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.drop-zone:hover {
  border-color: #3b4a6b;
}

.file-input-hidden {
  display: none;
}

.file-list {
  list-style: none;
  font-size: 0.8125rem;
  color: #3b4a6b;
  text-align: left;
}

.file-list li {
  padding: 0.25rem 0;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
