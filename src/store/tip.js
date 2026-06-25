import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTipStore = defineStore('tip', () => {
  const history = ref([])
  const loading = ref(false)

  async function sendTip(receiverId, amount, comicId, token) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}tip/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ receiver_id: receiverId, amount, comic_id: comicId }),
    })
    return await res.json()
  }

  async function topUp(amount, token) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}topup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    })
    return await res.json()
  }

  async function fetchHistory(token) {
    loading.value = true
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}tip/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (json.status === 'success') {
        history.value = json.data.history
      }
      return json
    } finally {
      loading.value = false
    }
  }

  return { history, loading, sendTip, topUp, fetchHistory }
})
