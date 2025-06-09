// stores/auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: string
  name: string
  avatar: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)

  // Simula login con API
  const login = async () => {
    isLoading.value = true
    try {
      // Simulamos delay de red
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Datos simulados como si vinieran de una API real
      user.value = {
        id: 'usr_123',
        name: 'Usuario Demo',
        avatar: `https://i.pravatar.cc/150?u=usr_12`, // Avatar único basado en ID
      }

      // Simulamos persistencia en localStorage
      localStorage.setItem('user', JSON.stringify(user.value))
    } finally {
      isLoading.value = false
    }
  }

  // Cargar usuario al iniciar (como si validáramos sesión)
  const initialize = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    } else {
      login() // Auto-login para desarrollo
    }
  }

  return { user, isLoading, login, initialize }
})
