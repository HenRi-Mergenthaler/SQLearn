<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card class="q-pa-md shadow-2 profile-card">
          <q-card-section class="text-center">
            <q-avatar size="120px" font-size="80px" color="grey-3" text-color="grey-6" class="shadow-4">
              <q-icon name="person" />
            </q-avatar>
            <div class="text-h4 q-mt-md q-mb-xs">{{ userStore.username || 'Estudante' }}</div>
            <div class="text-subtitle1 text-grey">Iniciante em SQL</div>
          </q-card-section>
          
          <q-separator inset class="q-my-md" />
          
          <q-card-section>
            <div class="text-h6 q-mb-md">Estatísticas</div>
            <div class="row q-col-gutter-md q-mt-sm">
              <div class="col-6 col-sm-3 text-center">
                <q-icon name="local_fire_department" size="2.5em" color="orange" />
                <div class="text-h5 q-mt-sm">{{ statsStore.ofensiva }}</div>
                <div class="text-caption text-bold text-grey-8">Ofensiva</div>
              </div>
              <div class="col-6 col-sm-3 text-center">
                <q-icon name="bolt" size="2.5em" color="yellow-8" />
                <div class="text-h5 q-mt-sm">{{ statsStore.xp }}</div>
                <div class="text-caption text-bold text-grey-8">XP Total</div>
              </div>
              <div class="col-6 col-sm-3 text-center">
                <q-icon name="emoji_events" size="2.5em" color="amber" />
                <div class="text-h5 q-mt-sm">{{ statsStore.liga }}</div>
                <div class="text-caption text-bold text-grey-8">Liga</div>
              </div>
              <div class="col-6 col-sm-3 text-center">
                <q-icon name="done_all" size="2.5em" color="green" />
                <div class="text-h5 q-mt-sm">{{ statsStore.licoes }}</div>
                <div class="text-caption text-bold text-grey-8">Lições</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useUserStore } from 'src/stores/user-store'
import { useUserStatsStore } from 'src/stores/user-stats-store'

const userStore = useUserStore()
const statsStore = useUserStatsStore()
</script>

<style scoped>
.profile-card {
  border-radius: 16px;
}
</style>
