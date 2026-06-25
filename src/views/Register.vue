<template>
  <div class="auth-page">
    <div class="auth-card card">
      <div class="auth-header">
        <h2 class="auth-title">Daftar Akun</h2>
        <p class="auth-subtitle">Gabung sebagai pembaca atau kreator</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div v-if="error" class="alert alert-error">{{ error }}</div>

        <div class="form-group">
          <label class="form-label" for="reg-username">Username</label>
          <input
            id="reg-username"
            v-model="username"
            type="text"
            class="form-input"
            placeholder="Pilih username"
            required
            minlength="3"
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-email">Email</label>
          <input
            id="reg-email"
            v-model="email"
            type="email"
            class="form-input"
            placeholder="Masukkan email"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-display">Nama Tampilan</label>
          <input
            id="reg-display"
            v-model="displayName"
            type="text"
            class="form-input"
            placeholder="Nama yang ditampilkan"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-password">Kata Sandi</label>
          <input
            id="reg-password"
            v-model="password"
            type="password"
            class="form-input"
            placeholder="Minimal 6 karakter"
            required
            minlength="6"
            autocomplete="new-password"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Daftar sebagai</label>
          <div class="role-selector">
            <label :class="['role-option', { active: role === 'reader' }]">
              <input type="radio" v-model="role" value="reader" />
              <span class="role-label">Pembaca</span>
              <span class="role-desc">Baca dan dukung komik</span>
            </label>
            <label :class="['role-option', { active: role === 'creator' }]">
              <input type="radio" v-model="role" value="creator" />
              <span class="role-label">Kreator</span>
              <span class="role-desc">Publikasikan komikmu</span>
            </label>
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-lg auth-submit" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>Daftar</span>
        </button>
      </form>

      <p class="auth-footer">
        Sudah punya akun? <router-link to="/login">Masuk di sini</router-link>
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
const email = ref('')
const displayName = ref('')
const password = ref('')
const role = ref(route.query.role || 'reader')
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  if (!username.value || !email.value || !password.value) {
    error.value = 'Isi semua field wajib'
    return
  }

  loading.value = true
  error.value = ''

  const result = await authStore.register({
    username: username.value,
    email: email.value,
    password: password.value,
    display_name: displayName.value || username.value,
    role: role.value,
  })

  loading.value = false

  if (result.status === 'success') {
    router.push('/')
  } else {
    toast.error(result.message || 'Registrasi gagal')
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
  max-width: 440px;
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

.role-selector {
  display: flex;
  gap: 0.75rem;
}

.role-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  border: 2px solid #e8ecf1;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.role-option input {
  display: none;
}

.role-option.active {
  border-color: #3b4a6b;
  background: rgba(59, 74, 107, 0.04);
}

.role-label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 0.25rem;
}

.role-desc {
  font-size: 0.75rem;
  color: #7a8ba3;
}
</style>
