<template>
  <div class="login-page">
    <q-form @submit.prevent="onSubmit" class="login-form">
      <q-input
        v-model="username"
        label="Nome de usuário"
        rounded
        outlined
        dense
      />
      <q-btn
        label="Entrar"
        rounded
        type="submit"
        color="primary"
        :disable="!validForm"
      />
    </q-form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/user-store'

const username = ref('')
const router = useRouter()
const userStore = useUserStore()

const validForm = computed(() => !!username.value.trim())

const onSubmit = () => {
  if (validForm.value) {
    userStore.login(username.value.trim())
    router.push('/')
  }
}
</script>

<style lang="scss" scoped>
$my-radius: 16px;

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: $my-radius;
  padding: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;

  :deep(.q-field--rounded .q-field__control),
  :deep(.q-btn--rounded) {
    border-radius: $my-radius !important;
  }
}
</style>
