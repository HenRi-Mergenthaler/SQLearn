<template>
  <BaseLayout>
    <q-page-container class="auth-background column">
      <div class="row col justify-center items-center">
        <div class="auth-region col-12 col-md-5">
          <!-- Logo de imagem ou logo fictícia em HTML -->
          <div v-if="showImageLogo" class="logo-wrapper">
            <img src="../assets/project-logo.png" alt="logo" class="project-logo" />
            <span class="project-logo-tagline">SQLearn</span>
          </div>
          <div v-else class="fake-logo-container">
            <div class="fake-logo-circle">
              <q-icon name="dns" size="72px" color="primary" class="q-mb-sm" />
              <div class="fake-logo-title text-weight-bolder text-primary">SQLearn</div>
              <div class="fake-logo-subtitle text-weight-medium text-grey-7">Aprenda brincando</div>
            </div>
          </div>
        </div>

        <div class="auth-region col-12 col-md-5">
          <q-card class="auth-card">
            <div class="text-h5 text-weight-bold text-center text-primary q-mb-md">Entrar no SQLearn</div>
            <router-view />
          </q-card>
        </div>
      </div>
    </q-page-container>
  </BaseLayout>
</template>

<script setup>
import { ref } from 'vue'
import BaseLayout from './BaseLayout.vue'

// Altere para true se desejar testar com a imagem real de logo
const showImageLogo = ref(false)
</script>

<style scoped>
.auth-background {
  background: linear-gradient(135deg, #1976D2 0%, #ffffff 100%);
  min-height: 100vh;
}

.auth-region {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px;
  gap: 8px;
}

.logo-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.project-logo {
  max-width: 100%;
  object-fit: contain;
}

.project-logo-tagline {
  margin: 0;
  font-size: 2rem;
  color: #1976d2;
  font-weight: 700;
  line-height: 1.4;
  white-space: nowrap;
}

.fake-logo-container {
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fake-logo-circle {
  border: 6px solid #1976D2;
  border-radius: 50%;
  width: 220px;
  height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  box-shadow: 0 10px 25px rgba(25, 118, 210, 0.15);
  transition: transform 0.3s ease;
}

.fake-logo-circle:hover {
  transform: scale(1.05);
}

.fake-logo-title {
  font-size: 1.8rem;
  line-height: 1;
  letter-spacing: 1px;
}

.fake-logo-subtitle {
  font-size: 0.75rem;
  margin-top: 4px;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}
</style>
