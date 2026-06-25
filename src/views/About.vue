<template>
  <div class="about-page">
    <div class="container">
      <section class="about-hero">
        <div class="about-brand">
          <span class="about-icon">K</span>
        </div>
        <h1 class="about-title">Tentang KomikSaku</h1>
        <p class="about-tagline">Platform penerbitan komik indie mandiri untuk kreator dan pembaca.</p>
      </section>

      <section class="about-section">
        <h2 class="section-title">Apa itu KomikSaku?</h2>
        <p class="about-text">
          KomikSaku adalah platform digital yang memberdayakan kreator komik indie untuk
          mempublikasikan karya mereka secara mandiri, tanpa perlu melalui penerbit tradisional.
          Kami percaya setiap komikus berhak atas kebebasan berekspresi dan penghasilan yang adil
          dari karya mereka.
        </p>
        <p class="about-text">
          Dengan sistem koin dan tipping mikro, pembaca dapat memberikan dukungan langsung
          kepada kreator favorit mereka. Setiap tip yang diberikan akan masuk sepenuhnya ke kreator,
          memotong rantai distribusi yang tidak perlu.
        </p>
      </section>

      <section class="about-section">
        <h2 class="section-title">Fitur Platform</h2>
        <div class="features-grid">
          <div class="feature-card card">
            <div class="feature-icon">U</div>
            <h3 class="feature-title">Publikasi Mandiri</h3>
            <p class="feature-desc">Unggah komik kapan saja tanpa proses kurasi. Kreator memiliki kendali penuh atas karya mereka.</p>
          </div>
          <div class="feature-card card">
            <div class="feature-icon">T</div>
            <h3 class="feature-title">Tipping Mikro</h3>
            <p class="feature-desc">Dukung kreator favorit dengan sistem koin. Setiap koin yang dikirim langsung masuk ke kreator.</p>
          </div>
          <div class="feature-card card">
            <div class="feature-icon">R</div>
            <h3 class="feature-title">Pembaca Nyaman</h3>
            <p class="feature-desc">Antarmuka pembaca yang bersih, bebas gangguan, dengan lazy loading untuk pengalaman membaca mulus.</p>
          </div>
          <div class="feature-card card">
            <div class="feature-icon">S</div>
            <h3 class="feature-title">Statistik Real-time</h3>
            <p class="feature-desc">Pantau jumlah pembaca, tips, dan popularitas komik melalui dasbor kreator yang informatif.</p>
          </div>
        </div>
      </section>

      <section class="about-section">
        <h2 class="section-title">Cara Kerja</h2>
        <div class="steps">
          <div class="step">
            <span class="step-number">1</span>
            <div class="step-content">
              <h3 class="step-title">Daftar Akun</h3>
              <p class="step-desc">Pilih sebagai pembaca atau kreator. Pendaftaran gratis dan cepat.</p>
            </div>
          </div>
          <div class="step">
            <span class="step-number">2</span>
            <div class="step-content">
              <h3 class="step-title">Jelajahi atau Publikasi</h3>
              <p class="step-desc">Pembaca bisa menemukan komik baru. Kreator bisa mulai mengunggah karya.</p>
            </div>
          </div>
          <div class="step">
            <span class="step-number">3</span>
            <div class="step-content">
              <h3 class="step-title">Dukung Kreator</h3>
              <p class="step-desc">Gunakan koin untuk memberi tip atau isi ulang saldo kapan saja.</p>
            </div>
          </div>
          <div class="step">
            <span class="step-number">4</span>
            <div class="step-content">
              <h3 class="step-title">Nikmati Konten</h3>
              <p class="step-desc">Baca komik dengan nyaman, kapan saja, di perangkat apa pun.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="about-section">
        <h2 class="section-title">Teknologi</h2>
        <div class="tech-list">
          <span class="tech-badge">Vue.js 3</span>
          <span class="tech-badge">Vite</span>
          <span class="tech-badge">PHP 8+</span>
          <span class="tech-badge">SQLite3</span>
          <span class="tech-badge">Pinia</span>
          <span class="tech-badge">Vue Router</span>
        </div>
      </section>

      <section class="about-section about-cta">
        <h2 class="cta-title">Siap Memulai?</h2>
        <p class="cta-text">Gabung sebagai kreator atau pembaca, dan jadilah bagian dari ekosistem komik indie.</p>
        <div class="cta-actions">
          <router-link to="/register?role=creator" class="btn btn-primary btn-lg">Mulai Publikasi</router-link>
          <router-link to="/" class="btn btn-secondary btn-lg">Jelajahi Komik</router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  padding: 2rem 0 3rem;
}

.about-hero {
  text-align: center;
  padding: 3rem 1rem 2.5rem;
  margin-bottom: 2rem;
}

.about-brand {
  margin-bottom: 1rem;
}

.about-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: #3b4a6b;
  color: #fff;
  border-radius: 14px;
  font-size: 1.5rem;
  font-weight: 700;
}

.about-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 0.75rem;
}

.about-tagline {
  font-size: 1.0625rem;
  color: #5a6a7e;
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.6;
}

.about-section {
  max-width: 720px;
  margin: 0 auto 2.5rem;
}

.about-text {
  font-size: 0.9375rem;
  color: #3b4a6b;
  line-height: 1.7;
  margin-bottom: 1rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.feature-card {
  padding: 1.25rem;
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #e8ecf1;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  color: #3b4a6b;
  margin-bottom: 0.75rem;
}

.feature-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 0.375rem;
}

.feature-desc {
  font-size: 0.875rem;
  color: #5a6a7e;
  line-height: 1.5;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 8px;
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #3b4a6b;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 0.25rem;
}

.step-desc {
  font-size: 0.8125rem;
  color: #5a6a7e;
  line-height: 1.5;
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tech-badge {
  padding: 0.375rem 0.75rem;
  background: #e8ecf1;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #3b4a6b;
}

.about-cta {
  text-align: center;
  padding: 2.5rem 1rem;
  margin-bottom: 0;
}

.cta-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
}

.cta-text {
  font-size: 0.9375rem;
  color: #5a6a7e;
  margin-bottom: 1.5rem;
}

.cta-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .about-title {
    font-size: 1.5rem;
  }
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
