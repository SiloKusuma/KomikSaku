<template>
  <div class="reader-page" @scroll="handleScroll">
    <div v-if="loading" class="loading-container">
      <div class="spinner spinner-lg"></div>
      <p>Memuat halaman komik...</p>
    </div>

    <div v-else-if="error" class="alert alert-error container">{{ error }}</div>

    <template v-else>
      <header :class="['reader-header', { hidden: headerHidden }]">
        <div class="reader-header-inner container">
          <div class="reader-nav-left">
            <router-link :to="`/comic/${slug}`" class="btn btn-sm btn-secondary">
              Kembali
            </router-link>
            <span class="reader-title">{{ comicTitle }} - Chapter {{ chapterNumber }}</span>
          </div>
          <div class="reader-nav-right">
            <button
              v-if="prevChapter"
              class="btn btn-sm btn-secondary"
              @click="goToChapter(prevChapter)"
            >Sebelumnya</button>
            <button
              v-if="nextChapter"
              class="btn btn-sm btn-secondary"
              @click="goToChapter(nextChapter)"
            >Selanjutnya</button>
          </div>
        </div>
      </header>

      <div class="reader-content">
        <div v-for="page in pages" :key="page.id" class="page-wrapper">
          <img
            :src="page.image_path"
            :alt="'Halaman ' + page.page_number"
            class="page-image"
            loading="lazy"
            @load="onPageLoad"
          />
        </div>
      </div>

      <footer class="reader-footer">
        <div class="reader-footer-inner container">
          <button
            v-if="prevChapter"
            class="btn btn-secondary"
            @click="goToChapter(prevChapter)"
          >Chapter Sebelumnya</button>
          <button
            v-if="nextChapter"
            class="btn btn-primary"
            @click="goToChapter(nextChapter)"
          >Chapter Selanjutnya</button>
        </div>
      </footer>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useKomikStore } from '../store/komik'
import { useAuthStore } from '../store/auth'

const route = useRoute()
const router = useRouter()
const komikStore = useKomikStore()
const authStore = useAuthStore()

const pages = ref([])
const slug = ref('')
const comicTitle = ref('')
const chapterNumber = ref(1)
const prevChapter = ref(null)
const nextChapter = ref(null)
const loading = ref(true)
const error = ref('')
const headerHidden = ref(false)
let lastScrollY = 0

function handleScroll() {
  const currentScrollY = window.scrollY
  headerHidden.value = currentScrollY > lastScrollY && currentScrollY > 64
  lastScrollY = currentScrollY
}

function onPageLoad() {
}

function goToChapter(chapterNum) {
  router.push(`/read/${slug.value}/${chapterNum}`)
}

onMounted(async () => {
  slug.value = route.params.slug
  chapterNumber.value = parseInt(route.params.chapter)

  const comicResult = await komikStore.fetchComic(slug.value)
  if (!comicResult) {
    error.value = komikStore.error || 'Komik tidak ditemukan'
    loading.value = false
    return
  }

  comicTitle.value = comicResult.title

  const chapters = comicResult.chapters || []
  const currentIdx = chapters.findIndex(
    (c) => c.chapter_number === chapterNumber.value
  )

  if (currentIdx === -1) {
    error.value = 'Chapter tidak ditemukan'
    loading.value = false
    return
  }

  if (currentIdx > 0) {
    prevChapter.value = chapters[currentIdx - 1].chapter_number
  }
  if (currentIdx < chapters.length - 1) {
    nextChapter.value = chapters[currentIdx + 1].chapter_number
  }

  const pagesResult = await komikStore.fetchChapterPages(chapters[currentIdx].id)
  if (pagesResult.status === 'success') {
    pages.value = pagesResult.data.pages
  } else {
    error.value = 'Gagal memuat halaman'
  }

  loading.value = false

  if (authStore.isLoggedIn) {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}user/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify({
          comic_id: comicResult.id,
          chapter_id: chapters[currentIdx].id,
          last_page: 1,
        }),
      })
    } catch {
    }
  }

  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.reader-page {
  min-height: 100vh;
  background: #f0f2f5;
}

.reader-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #e8ecf1;
  height: 56px;
  transition: transform 0.3s ease;
}

.reader-header.hidden {
  transform: translateY(-100%);
}

.reader-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  gap: 1rem;
}

.reader-nav-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.reader-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #3b4a6b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}

.reader-nav-right {
  display: flex;
  gap: 0.5rem;
}

.reader-content {
  padding-top: 72px;
  padding-bottom: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.page-wrapper {
  margin-bottom: 0;
  line-height: 0;
}

.page-image {
  width: 100%;
  height: auto;
  display: block;
}

.reader-footer {
  padding: 1.5rem 0 3rem;
}

.reader-footer-inner {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

@media (max-width: 640px) {
  .reader-title {
    max-width: 120px;
    font-size: 0.8125rem;
  }
  .reader-header {
    height: 48px;
  }
  .reader-content {
    padding-top: 64px;
  }
}
</style>
