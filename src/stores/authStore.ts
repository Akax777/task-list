import { defineStore } from 'pinia'
import { ref, computed } from 'vue' // Añade computed

interface User {
  id: string
  name: string
  avatar: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)

  // Añade esta propiedad computada
  const isAuthenticated = computed(() => !!user.value)

  const login = async () => {
    isLoading.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      user.value = {
        id: 'usr_123',
        name: 'Usuario Demo',
        avatar: `https://i.pravatar.cc/150?u=usr_12`,
      }
      localStorage.setItem('user', JSON.stringify(user.value))
    } finally {
      isLoading.value = false
    }
  }

  const initialize = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    } else {
      login() // Auto-login para desarrollo
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  return {
    user,
    isLoading,
    isAuthenticated, // Exporta la nueva propiedad
    login,
    logout,
    initialize,
  }
})
