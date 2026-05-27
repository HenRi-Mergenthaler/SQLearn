<template>
  <q-layout view="hHh Lpr fFf">
    <q-header>
      <q-toolbar v-if="!toolbarLess">
        <slot name="toolbar-start" />

        <q-space />

        <div class="user-actions">
          <q-badge color="primary" class="user-badge">
            {{ userStore.username }}
          </q-badge>

          <q-btn flat round color="red" icon="logout" @click="handleLogout()" />
        </div>
      </q-toolbar>
    </q-header>

    <slot />
  </q-layout>
</template>

<script setup>
import { useUserStore } from 'src/stores/user-store'
import { useRouter } from 'vue-router'

defineProps({
  toolbarLess: Boolean
})

const router = useRouter()
const userStore = useUserStore()

const handleLogout = async () => {
  await router.push({ path: '/login' })
}
</script>

<style lang="scss" scoped>
.q-header {
  background-color: #1f2937;

  .user-actions {
    display: flex;
    align-items: center;
    gap: 6px;

    .user-badge {
      font-size: 16px;
      padding: 6px 12px;
      font-weight: bold;
    }
  }
}
</style>
