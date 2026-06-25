import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useKomikStore = defineStore('komik', () => {
  const comics = ref([])
  const currentComic = ref(null)
  const loading = ref(false)
  const error = ref('')

  async function fetchComics(sort = 'latest', page = 1) {
    loading.value = true
    error.value = ''
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}comics?sort=${sort}&page=${page}`
      )
      const json = await res.json()
      if (json.status === 'success') {
        comics.value = json.data.comics
        return json.data
      }
      error.value = json.message
      return null
    } catch (e) {
      error.value = 'Failed to load comics'
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchComic(slug) {
    loading.value = true
    error.value = ''
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}comics/${slug}`)
      const json = await res.json()
      if (json.status === 'success') {
        currentComic.value = json.data.comic
        return json.data.comic
      }
      error.value = json.message
      return null
    } catch {
      error.value = 'Failed to load comic'
      return null
    } finally {
      loading.value = false
    }
  }

  async function createComic(data, token) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}comics/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    return await res.json()
  }

  async function addChapter(comicId, data, token) {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}comics/${comicId}/chapters`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    )
    return await res.json()
  }

  async function fetchChapterPages(chapterId) {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}chapters/${chapterId}/pages`
    )
    return await res.json()
  }

  async function toggleFavorite(comicId, token) {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}comics/${comicId}/favorite`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    return await res.json()
  }

  return {
    comics,
    currentComic,
    loading,
    error,
    fetchComics,
    fetchComic,
    createComic,
    addChapter,
    fetchChapterPages,
    toggleFavorite,
  }
})
