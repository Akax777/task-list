import { mount } from '@vue/test-utils'
import UserAvatar from '@/components/UserAvatar.vue'
import { createTestingPinia } from '@pinia/testing'
import { useAuthStore } from '@/stores/authStore'
import { describe, expect, it, vi } from 'vitest'

describe('UserAvatar + authStore Integration', () => {
  it('muestra el avatar del usuario autenticado', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        auth: {
          user: {
            id: '1',
            name: 'Test User',
            avatar: 'https://example.com/avatar.jpg',
          },
        },
      },
    })

    const authStore = useAuthStore()
    authStore.user = {
      id: '1',
      name: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
    }

    const wrapper = mount(UserAvatar, {
      props: {
        user: authStore.user, // Pasar el usuario directamente como prop
        hasText: true,
      },
      global: {
        plugins: [pinia],
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 200))

    // Verificar el HTML renderizado
    console.log(wrapper.html())

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/avatar.jpg')
  })
})
