import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user_data') || 'null'))
  const token = ref(localStorage.getItem('auth_token') || '')

  const isLoggedIn = computed(() => !!token.value)
  const isCreator = computed(() => user.value?.role === 'creator')
  const username = computed(() => user.value?.username || '')
  const coinBalance = computed(() => user.value?.coin_balance || 0)

  function setAuth(userData, authToken) {
    user.value = userData
    token.value = authToken
    localStorage.setItem('user_data', JSON.stringify(userData))
    localStorage.setItem('auth_token', authToken)
  }

  function updateUser(data) {
    user.value = { ...user.value, ...data }
    localStorage.setItem('user_data', JSON.stringify(user.value))
  }

  function clearAuth() {
    user.value = null
    token.value = ''
    localStorage.removeItem('user_data')
    localStorage.removeItem('auth_token')
  }

  async function login(username, password) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const json = await res.json()
    if (json.status === 'success') {
      setAuth(json.data.user, json.data.token)
    }
    return json
  }

  async function register(data) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (json.status === 'success') {
      setAuth(json.data.user, json.data.token)
    }
    return json
  }

  async function logout() {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
      })
    } catch {
    }
    clearAuth()
  }

  async function fetchMe() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}auth/me`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      const json = await res.json()
      if (json.status === 'success') {
        updateUser(json.data.user)
      }
      return json
    } catch {
      return null
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    isCreator,
    username,
    coinBalance,
    setAuth,
    updateUser,
    clearAuth,
    login,
    register,
    logout,
    fetchMe,
  }
})
