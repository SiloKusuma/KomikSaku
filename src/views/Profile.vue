<template>
  <div class="profile-page">
    <div class="container">
      <div class="profile-header">
        <div class="profile-avatar">
          <span class="avatar-text">{{ initials }}</span>
        </div>
        <div class="profile-info">
          <h1 class="profile-name">{{ user?.display_name || user?.username }}</h1>
          <p class="profile-username">@{{ user?.username }}</p>
          <p v-if="user?.bio" class="profile-bio">{{ user.bio }}</p>
          <div class="profile-badge">
            <span class="badge" :class="user?.role">
              {{ user?.role === 'creator' ? 'Kreator' : 'Pembaca' }}
            </span>
          </div>
        </div>
        <div class="profile-coin">
          <span class="coin-label">Saldo Koin</span>
          <span class="coin-value">{{ authStore.coinBalance }}</span>
          <button class="btn btn-sm btn-primary" @click="showTopUp = true">Isi Ulang</button>
        </div>
      </div>

      <div class="profile-tabs">
        <button
          :class="['tab-btn', { active: activeTab === 'history' }]"
          @click="activeTab = 'history'"
        >Riwayat Baca</button>
        <button
          :class="['tab-btn', { active: activeTab === 'favorites' }]"
          @click="activeTab = 'favorites'"
        >Favorit</button>
        <button
          :class="['tab-btn', { active: activeTab === 'transactions' }]"
          @click="activeTab = 'transactions'"
        >Transaksi</button>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="spinner spinner-lg"></div>
      </div>

      <div v-else-if="activeTab === 'history'" class="tab-content">
        <div v-if="history.length === 0" class="empty-state">
          <p>Belum ada riwayat baca.</p>
          <router-link to="/" class="btn btn-secondary btn-sm">Jelajahi Komik</router-link>
        </div>
        <div v-else class="history-list">
          <router-link
            v-for="item in history"
            :key="item.id"
            :to="`/read/${item.comic_slug}/${item.chapter_number}`"
            class="history-item card"
          >
            <div class="history-info">
              <h4 class="history-comic-title">{{ item.comic_title }}</h4>
              <p class="history-chapter">{{ item.chapter_title }}</p>
              <span class="history-date">{{ formatDate(item.updated_at) }}</span>
            </div>
          </router-link>
        </div>
      </div>

      <div v-else-if="activeTab === 'favorites'" class="tab-content">
        <div v-if="favorites.length === 0" class="empty-state">
          <p>Belum ada komik favorit.</p>
          <router-link to="/" class="btn btn-secondary btn-sm">Temukan Komik</router-link>
        </div>
        <div v-else class="grid grid-3">
          <ComicCard
            v-for="comic in favorites"
            :key="comic.id"
            :comic="comic"
          />
        </div>
      </div>

      <div v-else-if="activeTab === 'transactions'" class="tab-content">
        <div v-if="transactions.length === 0" class="empty-state">
          <p>Belum ada transaksi.</p>
        </div>
        <div v-else class="transaction-list">
          <div v-for="tx in transactions" :key="tx.id" class="transaction-item card">
            <div class="tx-info">
              <span class="tx-type" :class="tx.type">
                {{ tx.type === 'tip' ? 'Tip' : tx.type === 'topup' ? 'Isi Ulang' : tx.type }}
              </span>
              <span class="tx-desc">
                <template v-if="tx.type === 'tip' && tx.sender_id === authStore.user?.id">
                  Ke @{{ tx.receiver_name }}
                </template>
                <template v-else-if="tx.type === 'tip'">
                  Dari @{{ tx.sender_name }}
                </template>
                <template v-else>Isi Ulang Koin</template>
              </span>
            </div>
            <div class="tx-amount">
              <span :class="['amount', tx.sender_id === authStore.user?.id && tx.type === 'tip' ? 'negative' : 'positive']">
                {{ tx.sender_id === authStore.user?.id && tx.type === 'tip' ? '-' : '+' }}{{ tx.amount }}
              </span>
              <span class="tx-date">{{ formatDate(tx.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>

      <Teleport to="body">
        <div v-if="showTopUp" class="modal-overlay" @click.self="showTopUp = false">
          <div class="modal-content card">
            <h3 class="modal-title">Isi Ulang Koin</h3>
            <p class="modal-subtitle">Pilih jumlah koin yang ingin ditambahkan</p>

            <div class="tip-amounts">
              <button
                v-for="amt in [10, 25, 50, 100, 250, 500]"
                :key="amt"
                :class="['tip-amount-btn', { active: topUpAmount === amt }]"
                @click="topUpAmount = amt"
              >{{ amt }}</button>
            </div>

            <div class="modal-actions">
              <button class="btn btn-secondary" @click="showTopUp = false">Batal</button>
              <button class="btn btn-primary" :disabled="topUpLoading" @click="handleTopUp">
                <span v-if="topUpLoading" class="spinner"></span>
                <span v-else>Beli {{ topUpAmount }} Koin</span>
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { useAuthStore } from '../store/auth'
import { useTipStore } from '../store/tip'
import ComicCard from '../components/ComicCard.vue'

const toast = inject('toast')
const authStore = useAuthStore()
const tipStore = useTipStore()

const user = computed(() => authStore.user)
const initials = computed(() => {
  const name = user.value?.display_name || user.value?.username || 'U'
  return name.charAt(0).toUpperCase()
})

const activeTab = ref('history')
const loading = ref(true)
const history = ref([])
const favorites = ref([])
const transactions = ref([])

const showTopUp = ref(false)
const topUpAmount = ref(50)
const topUpLoading = ref(false)

function formatDate(timestamp) {
  if (!timestamp) return ''
  const d = new Date(timestamp * 1000)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function handleTopUp() {
  topUpLoading.value = true

  const result = await tipStore.topUp(topUpAmount.value, authStore.token)

  topUpLoading.value = false

  if (result.status === 'success') {
    toast.success(`${topUpAmount.value} koin berhasil ditambahkan!`)
    authStore.updateUser({
      coin_balance: (authStore.coinBalance || 0) + topUpAmount.value,
    })
    setTimeout(() => {
      showTopUp.value = false
    }, 1000)
  } else {
    toast.error(result.message || 'Gagal top up')
  }
}

onMounted(async () => {
  try {
    const [historyRes, favRes, txRes] = await Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}user/history`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      }),
      fetch(`${import.meta.env.VITE_API_URL}user/favorites`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      }),
      fetch(`${import.meta.env.VITE_API_URL}tip/history`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      }),
    ])

    const [historyJson, favJson, txJson] = await Promise.all([
      historyRes.json(),
      favRes.json(),
      txRes.json(),
    ])

    if (historyJson.status === 'success') {
      history.value = historyJson.data.history
    }
    if (favJson.status === 'success') {
      favorites.value = favJson.data.favorites
    }
    if (txJson.status === 'success') {
      transactions.value = txJson.data.history
    }
  } catch {
  }
  loading.value = false
})
</script>

<style scoped>
.profile-page {
  padding: 2rem 0 3rem;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 10px;
}

.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #3b4a6b;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 0.125rem;
}

.profile-username {
  font-size: 0.875rem;
  color: #7a8ba3;
  margin-bottom: 0.375rem;
}

.profile-bio {
  font-size: 0.875rem;
  color: #3b4a6b;
  margin-bottom: 0.5rem;
}

.badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 3px;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge.creator {
  background: #e8ecf1;
  color: #3b4a6b;
}

.badge.reader {
  background: #f0f2f5;
  color: #5a6a7e;
}

.profile-coin {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  padding: 0.75rem 1.25rem;
  background: #f8f9fb;
  border-radius: 8px;
}

.coin-label {
  font-size: 0.75rem;
  color: #7a8ba3;
}

.coin-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b4a6b;
}

.profile-tabs {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
  background: #f0f2f5;
  padding: 0.25rem;
  border-radius: 8px;
}

.profile-tabs .tab-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  background: transparent;
  color: #5a6a7e;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.profile-tabs .tab-btn.active {
  background: #fff;
  color: #3b4a6b;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.tab-content {
  min-height: 200px;
}

.history-list,
.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.history-item {
  display: block;
  padding: 1rem;
  transition: border-color 0.2s ease;
}

.history-item:hover {
  border-color: #c8d0da;
}

.history-comic-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 0.125rem;
}

.history-chapter {
  font-size: 0.8125rem;
  color: #5a6a7e;
  margin-bottom: 0.25rem;
}

.history-date {
  font-size: 0.75rem;
  color: #7a8ba3;
}

.transaction-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

.tx-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.tx-type {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1a1a2e;
}

.tx-desc {
  font-size: 0.75rem;
  color: #7a8ba3;
}

.tx-amount {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
}

.amount {
  font-size: 1rem;
  font-weight: 700;
}

.amount.positive {
  color: #2e7d32;
}

.amount.negative {
  color: #c0392b;
}

.tx-date {
  font-size: 0.6875rem;
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
  margin-bottom: 1rem;
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
}

@media (max-width: 640px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  .profile-coin {
    flex-direction: row;
    gap: 0.75rem;
  }
}
</style>
