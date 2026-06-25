<template>
  <router-link :to="`/comic/${comic.slug}`" class="comic-card card">
    <div class="comic-thumb-wrap">
      <div v-if="!imageLoaded" class="skeleton-pulse"></div>
      <img
        :src="comic.thumbnail || comic.cover_image || placeholderThumb"
        :alt="comic.title"
        loading="lazy"
        class="comic-thumb"
        :class="{ loaded: imageLoaded }"
        @load="imageLoaded = true"
        @error="imageLoaded = true"
      />
      <span v-if="comic.is_featured" class="featured-badge">Pilihan</span>
      <span v-if="comic.status === 'completed'" class="status-badge">Tamat</span>
    </div>
    <div class="comic-body">
      <h3 class="comic-title">{{ comic.title }}</h3>
      <p class="comic-creator">{{ comic.creator_display || comic.creator_name }}</p>
      <p v-if="comic.description" class="comic-desc">{{ truncate(comic.description, 80) }}</p>
      <div class="comic-tags">
        <span v-if="comic.genre" class="tag">{{ comic.genre }}</span>
        <span class="tag">{{ comic.chapter_count || 0 }} chapter</span>
        <span class="tag">{{ formatViews(comic.total_views) }} dibaca</span>
      </div>
      <div class="comic-extra">
        <span class="extra-tip">Tip {{ comic.total_tips || 0 }}</span>
        <span class="extra-date">{{ formatDate(comic.created_at) }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  comic: {
    type: Object,
    required: true,
  },
})

const imageLoaded = ref(false)

const placeholderThumb = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="169" viewBox="0 0 300 169"><rect fill="#e8ecf1" width="300" height="169"/><text fill="#9aa8b9" font-family="Inter" font-size="13" x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">No Thumbnail</text></svg>'
)

function formatViews(views) {
  if (!views) return '0'
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M'
  if (views >= 1000) return (views / 1000).toFixed(1) + 'rb'
  return views.toString()
}

function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(ts * 1000)
  const now = new Date()
  const diff = (now - d) / (1000 * 60 * 60 * 24)
  if (diff < 1) return 'Hari ini'
  if (diff < 2) return 'Kemarin'
  if (diff < 7) return Math.floor(diff) + ' hari lalu'
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

function truncate(text, max) {
  if (!text || text.length <= max) return text
  return text.slice(0, max) + '...'
}
</script>

<style scoped>
.comic-card {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.comic-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.comic-thumb-wrap {
  position: relative;
  flex-shrink: 0;
  width: 200px;
  min-height: 130px;
  overflow: hidden;
  background: #e8ecf1;
}

.skeleton-pulse {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #e8ecf1 25%, #f0f2f5 50%, #e8ecf1 75%);
  background-size: 200% 100%;
  animation: pulse 1.5s ease-in-out infinite;
  z-index: 1;
}

@keyframes pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.comic-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.comic-thumb.loaded {
  opacity: 1;
}

.comic-card:hover .comic-thumb.loaded {
  transform: scale(1.05);
}

.featured-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  padding: 0.2rem 0.5rem;
  background: #3b4a6b;
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 600;
  border-radius: 3px;
  z-index: 2;
}

.status-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.2rem 0.5rem;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 500;
  border-radius: 3px;
  z-index: 2;
}

.comic-body {
  flex: 1;
  padding: 0.875rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.comic-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a2e;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.comic-creator {
  font-size: 0.8125rem;
  color: #7a8ba3;
}

.comic-desc {
  font-size: 0.8125rem;
  color: #5a6a7e;
  line-height: 1.5;
  margin-top: 0.125rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.comic-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: auto;
  padding-top: 0.375rem;
}

.tag {
  font-size: 0.6875rem;
  color: #5a6a7e;
  background: #f0f2f5;
  padding: 0.125rem 0.5rem;
  border-radius: 3px;
}

.comic-extra {
  display: flex;
  gap: 0.75rem;
  font-size: 0.6875rem;
  color: #9aa8b9;
}

@media (max-width: 640px) {
  .comic-thumb-wrap {
    width: 130px;
    min-height: 90px;
  }
  .comic-body {
    padding: 0.625rem;
  }
  .comic-desc {
    display: none;
  }
  .comic-extra {
    display: none;
  }
}
</style>
