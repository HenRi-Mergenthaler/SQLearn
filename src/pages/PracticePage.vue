<template>
  <q-page class="flex flex-center bg-grey-1">
    <div class="text-center q-pa-md" style="max-width: 500px">
      <q-icon name="fitness_center" size="5em" color="secondary" class="q-mb-md animate-bounce" />
      <h3 class="text-h3 text-weight-bold text-primary q-my-xs">Prática de SQL</h3>
      <p class="text-subtitle1 text-grey-7 q-mb-xl">
        Aperfeiçoe suas habilidades resolvendo desafios interativos ou escrevendo suas próprias consultas.
      </p>

      <div class="column q-gutter-y-md">
        <q-btn
          color="primary"
          size="lg"
          icon="code"
          label="Abrir Editor SQL Livre"
          to="/practice/editor"
          class="shadow-3 text-weight-bold"
          style="border-radius: 12px; height: 60px"
        />
        
        <q-btn
          outline
          color="grey-6"
          size="md"
          icon="lock"
          label="Desafios Diários (Bloqueado)"
          class="text-weight-bold text-grey-6 cursor-not-allowed"
          style="border-radius: 12px; height: 50px"
          disable
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
</script>
