<template>
  <BaseLayout>
    <LeftMenu />

    <q-page-container>
      <router-view />
    </q-page-container>
  </BaseLayout>
</template>

<script setup>
import LeftMenu from 'components/LeftMenu.vue'
import BaseLayout from './BaseLayout.vue'
</script>
