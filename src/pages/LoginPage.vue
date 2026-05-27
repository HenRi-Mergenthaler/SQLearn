<template>
  <div class="login-page">
    <!-- Estado 1: Formulário de Login Padrão -->
    <div
      v-show="currentModel === 'form'"
      class="form-container"
      data-morph-group="login"
      data-morph-id="card"
    >
      <q-form @submit.prevent="handleStartMorph" class="login-form">
        <q-input
          v-model="username"
          label="Nome de usuário"
          rounded
          outlined
          dense
          color="primary"
          class="q-mb-sm"
        />
        <q-btn
          label="Entrar"
          rounded
          type="submit"
          color="primary"
          :disable="!validForm"
          class="full-width text-weight-bold"
          size="lg"
        />
      </q-form>
    </div>

    <!-- Estado 2: Console Monaco SQL em Tela Cheia / Centralizado -->
    <q-dialog v-model="showDialog" persistent transition-show="fade" transition-hide="fade">
      <FakeMonaco
        v-show="currentModel === 'code'"
        title="login_query.sql"
        status-text="Executando..."
        data-morph-group="login"
        data-morph-id="card"
      >
        <div class="code-line row items-center">
          <span class="line-number q-mr-md text-grey-6 text-right">1</span>
          <span class="token-keyword">ALTER TABLE</span>
          <span class="token-identifier q-ml-xs">users</span>
        </div>
        <div class="code-line row items-center">
          <span class="line-number q-mr-md text-grey-6 text-right">2</span>
          <span class="token-keyword">SET</span>
          <span class="token-column q-ml-xs">autenticado</span>
          <span class="token-operator q-mx-xs">=</span>
          <span class="token-value">true</span>
        </div>
        <div class="code-line row items-center">
          <span class="line-number q-mr-md text-grey-6 text-right">3</span>
          <span class="token-keyword">WHERE</span>
          <span class="token-column q-ml-xs">nome</span>
          <span class="token-operator q-mx-xs">=</span>
          <span class="token-string">"{{ username }}"</span><span class="cursor-blink">|</span>
        </div>

        <!-- Loader de execução -->
        <div class="row items-center q-mt-xl q-gutter-sm text-grey-4">
          <q-spinner-gears color="primary" size="2em" />
          <span class="text-caption">Gravando estado na sessão SQLite...</span>
        </div>
      </FakeMonaco>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/user-store'
import { morph } from 'quasar'
import FakeMonaco from 'src/components/FakeMonaco.vue'

const username = ref('')
const router = useRouter()
const userStore = useUserStore()

const currentModel = ref('form')
const showDialog = ref(false)

const validForm = computed(() => !!username.value.trim())

const handleStartMorph = () => {
  if (!validForm.value) return

  // Ativa o dialog que contém o elemento de destino oculto
  showDialog.value = true

  // Realiza a animação de Morph do Quasar
  setTimeout(() => {
    morph({
      from: '[data-morph-id="card"][data-morph-group="login"]:not(.q-dialog *)',
      to: '.q-dialog [data-morph-id="card"][data-morph-group="login"]',
      duration: 600,
      easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
      onToggle() {
        currentModel.value = 'code'
      },
      onEnd() {
        // Simula a execução da query de login e faz o redirecionamento
        setTimeout(() => {
          userStore.login(username.value.trim())
          showDialog.value = false
          router.push('/')
        }, 2200)
      }
    })
  }, 50)
}
</script>

<style lang="scss" scoped>
$my-radius: 16px;

.login-page {
  width: 100%;
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

