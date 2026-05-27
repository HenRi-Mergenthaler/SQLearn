<template>
  <q-item
    clickable
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <q-item-section avatar>
      <q-icon name="more_horiz" />
    </q-item-section>
    <q-item-section>
      <q-item-label>Mais</q-item-label>
    </q-item-section>

    <q-menu
      v-model="menuOpen"
      anchor="bottom right"
      self="top right"
      no-focus
      @mouseenter="onMenuMouseEnter"
      @mouseleave="onMenuMouseLeave"
    >
      <q-list style="min-width: 150px">
        <q-item clickable v-close-popup @click="handleLogout">
          <q-item-section>Sair</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-item>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const menuOpen = ref(false)
let closeTimeout = null

const onMouseEnter = () => {
  if (closeTimeout) clearTimeout(closeTimeout)
  menuOpen.value = true
}

const onMouseLeave = () => {
  closeTimeout = setTimeout(() => {
    menuOpen.value = false
  }, 100)
}

const onMenuMouseEnter = () => {
  if (closeTimeout) clearTimeout(closeTimeout)
}

const onMenuMouseLeave = () => {
  menuOpen.value = false
}

const handleLogout = async () => {
  menuOpen.value = false
  await router.push({ path: '/login' })
}
</script>
