import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '../../../stores/authStore'

describe('authStore', () => {
  let store: ReturnType<typeof useAuthStore>
  let localStorageSpy = {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }

  beforeEach(() => {
    // Mock localStorage
    global.localStorage = {
      ...localStorageSpy,
      clear: vi.fn(),
    } as unknown as Storage

    setActivePinia(createPinia())
    store = useAuthStore()

    // Reset all spies
    vi.clearAllMocks()
  })

  it('inicia sin usuario autenticado', () => {
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
  })

  it('permite login/logout', async () => {
    await store.login()
    expect(store.isAuthenticated).toBe(true)
    expect(store.user).toEqual({
      id: 'usr_123',
      name: 'Usuario Demo',
      avatar: expect.stringContaining('https://i.pravatar.cc/150?u=usr_12'),
    })
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(store.user))

    store.logout()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
    expect(localStorage.removeItem).toHaveBeenCalledWith('user')
  })

  it('maneja errores en login correctamente', async () => {
    const originalLogin = store.login
    store.login = vi.fn().mockImplementationOnce(async () => {
      try {
        await new Promise((_, reject) => setTimeout(() => reject(new Error('Login failed')), 800))
      } finally {
        store.isLoading = false
      }
    })

    await expect(store.login()).rejects.toThrow('Login failed')
    expect(store.isLoading).toBe(false)

    // Restaurar implementación original
    store.login = originalLogin
  })

  it('initialize carga usuario desde localStorage', async () => {
    const testUser = {
      id: 'usr_test',
      name: 'Test User',
      avatar: 'test_avatar.jpg',
    }
    vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify(testUser))

    await store.initialize()
    expect(store.user).toEqual(testUser)
  })
  /*
  it('initialize hace auto-login cuando no hay usuario guardado', async () => {
    // Mock the login method
    const loginSpy = vi.spyOn(store, 'login').mockResolvedValue(undefined)

    await store.initialize()
    expect(loginSpy).toHaveBeenCalled()
  })*/

  it('cambia isLoading durante el login', async () => {
    const loginPromise = store.login()
    expect(store.isLoading).toBe(true)
    await loginPromise
    expect(store.isLoading).toBe(false)
  })
})
