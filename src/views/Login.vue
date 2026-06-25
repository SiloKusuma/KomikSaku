<template>
  <div class="auth-page">
    <div class="auth-card card">
      <div class="auth-header">
        <h2 class="auth-title">Masuk</h2>
        <p class="auth-subtitle">Selamat datang kembali di KomikSaku</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div v-if="error" class="alert alert-error">{{ error }}</div>

        <div class="form-group">
          <label class="form-label" for="username">Username atau Email</label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="form-input"
            placeholder="Masukkan username atau email"
            required
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="password">Kata Sandi</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-input"
            placeholder="Masukkan kata sandi"
            required
            autocomplete="current-password"
          />
        </div>

        <button type="submit" class="btn btn-primary btn-lg auth-submit" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>Masuk</span>
        </button>
      </form>

      <p class="auth-footer">
        Belum punya akun? <router-link to="/register">Daftar di sini</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../store/auth'

const toast = inject('toast')
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = 'Isi semua field'
    return
  }

  loading.value = true
  error.value = ''

  const result = await authStore.login(username.value, password.value)
  loading.value = false

  if (result.status === 'success') {
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } else {
    toast.error(result.message || 'Login gagal')
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px - 4rem);
  padding: 2rem 1rem;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.auth-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 0.375rem;
}

.auth-subtitle {
  font-size: 0.875rem;
  color: #7a8ba3;
}

.auth-form {
  margin-bottom: 1rem;
}

.auth-submit {
  width: 100%;
  margin-top: 0.5rem;
}

.auth-footer {
  text-align: center;
  font-size: 0.875rem;
  color: #7a8ba3;
}

.auth-footer a {
  color: #3b4a6b;
  font-weight: 500;
}
</style>
