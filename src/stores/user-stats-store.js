import { defineStore } from 'pinia'

export const useUserStatsStore = defineStore('user-stats', {
  persist: true,

  state: () => ({
    ofensiva: 0,
    xp: 0,
    liga: 'Nenhuma',
    licoes: 0,
  }),

  actions: {
    addXp(amount) {
      this.xp += amount
    },
    
    incrementLicoes() {
      this.licoes++
    },

    setOfensiva(val) {
      this.ofensiva = val
    },

    setLiga(liga) {
      this.liga = liga
    },

    resetStats() {
      this.ofensiva = 0
      this.xp = 0
      this.liga = 'Nenhuma'
      this.licoes = 0
    }
  }
})
