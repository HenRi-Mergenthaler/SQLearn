import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  persist: true,

  state: () => ({
    username: ''
  }),

  getters: {
    isAuthenticated: (state) => !!state.username
  },
  
  actions: {
    login(name) {
      this.username = name
    },
    logout() {
      this.username = ''
    }
  }
})
