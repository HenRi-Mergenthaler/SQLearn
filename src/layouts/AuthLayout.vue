<template>
  <BaseLayout toolbar-less>
    <q-page-container class="auth-background column">
      <div class="row col">
        <div class="auth-region col-6">
          <img src="../assets/project-logo.png" alt="logo" class="project-logo" />
          <span class="project-logo-tagline">
            SQLearn
          </span>
        </div>

        <div class="auth-region col-6">
          <q-card class="auth-card">
            <router-view />
          </q-card>
        </div>
      </div>
    </q-page-container>
  </BaseLayout>
</template>

<script setup>
import BaseLayout from './BaseLayout.vue'
</script>

<style scoped>
.auth-background {
  background-image: url('../assets/login-background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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

.project-logo {
  max-width: 100%;
  object-fit: contain;
}

.project-logo-tagline {
  margin: 0;
  font-size: 1.125rem;
  color: #ffffff;
  font-weight: 400;
  line-height: 1.4;
  white-space: nowrap;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
