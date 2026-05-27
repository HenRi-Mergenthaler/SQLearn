<template>
  <transition name="sidebar-slide">
    <q-drawer v-if="!isSession" v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu Principal </q-item-label>

        <SidebarLink v-for="link in linksList" :key="link.title" v-bind="link" />

        <SidebarMoreMenu />
      </q-list>
    </q-drawer>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import SidebarLink from 'components/SidebarLink.vue'
import SidebarMoreMenu from 'components/SidebarMoreMenu.vue'

const route = useRoute()
const leftDrawerOpen = ref(false)

const isSession = computed(() => !!route.meta.session)

const linksList = [
  {
    title: 'Aprender',
    caption: 'Trilha de aprendizado SQL',
    icon: 'school',
    link: '/',
  },
  {
    title: 'Praticar',
    caption: 'Exercícios e Desafios',
    icon: 'fitness_center',
    link: '/practice',
  },
  {
    title: 'Perfil',
    caption: 'Estatísticas e conquistas',
    icon: 'person',
    link: '/profile',
  },
]
</script>

<style scoped>
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}

.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>

