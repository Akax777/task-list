// tests/unit/TaskInput.spec.ts
import { mount } from '@vue/test-utils'
import TaskInput from '@/components/TaskInput.vue'
import UserAvatar from '@/components/UserAvatar.vue' // Importa UserAvatar
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTaskInput } from '@/composables/useTaskInput'
import { useAuthStore } from '@/stores/authStore' // Importa useAuthStore
import { useTaskStore } from '@/stores/taskStore' // Importa useTaskStore
import { ref } from 'vue'

// Mock del composable
vi.mock('@/composables/useTaskInput', () => ({
  useTaskInput: vi.fn().mockImplementation(() => {
    const isFocused = ref(false)
    return {
      inputRef: { value: document.createElement('input') },
      rawText: 'Test input',
      displayHtml: '<span>Test input</span>',
      isFocused,
      focusInput: vi.fn(),
      handleConfirm: vi.fn(),
      handleBlur: vi.fn(() => {
        isFocused.value = false
      }),
      handleFocus: vi.fn(() => {
        isFocused.value = true
      }),
    }
  }),
}))

// Mock de los stores
vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: '1', name: 'Test User' },
  })),
}))

vi.mock('@/stores/taskStore', () => ({
  useTaskStore: vi.fn(() => ({
    addTask: vi.fn(),
  })),
}))

describe('TaskInput.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renderiza el input', () => {
    const wrapper = mount(TaskInput)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('muestra el placeholder cuando no hay texto', () => {
    vi.mocked(useTaskInput).mockImplementation(() => ({
      inputRef: { value: document.createElement('input') },
      rawText: '',
      displayHtml: '',
      isFocused: ref(false),
      focusInput: vi.fn(),
      handleConfirm: vi.fn(),
      handleBlur: vi.fn(),
      handleFocus: vi.fn(),
    }))

    const wrapper = mount(TaskInput)
    expect(wrapper.text()).toContain('Type to add new task')
  })

  it('llama focusInput al hacer clic en el botón plus', async () => {
    const wrapper = mount(TaskInput)
    const focusSpy = vi.spyOn(wrapper.vm, 'focusInput')
    await wrapper.find('button').trigger('click')
    expect(focusSpy).toHaveBeenCalled()
  })

  it('maneja eventos de teclado', async () => {
    const wrapper = mount(TaskInput)
    const input = wrapper.find('input')
    const confirmSpy = vi.spyOn(wrapper.vm, 'handleConfirm')

    await input.trigger('keydown.enter')
    expect(confirmSpy).toHaveBeenCalled()
  })

  it('maneja eventos de focus/blur', async () => {
    const mockUseTaskInput = vi.mocked(useTaskInput)
    const isFocused = ref(false)

    mockUseTaskInput.mockImplementation(() => ({
      inputRef: { value: document.createElement('input') },
      rawText: '',
      displayHtml: '',
      isFocused,
      focusInput: vi.fn(),
      handleConfirm: vi.fn(),
      handleBlur: vi.fn(() => {
        isFocused.value = false
      }),
      handleFocus: vi.fn(() => {
        isFocused.value = true
      }),
    }))

    const wrapper = mount(TaskInput)
    const input = wrapper.find('input')

    await input.trigger('focus')
    expect(wrapper.vm.isFocused).toBe(true)

    await input.trigger('blur')
    expect(wrapper.vm.isFocused).toBe(false)
  })

  it('muestra UserAvatar cuando el input está enfocado', async () => {
    const wrapper = mount(TaskInput)
    await wrapper.find('input').trigger('focus')
    expect(wrapper.findComponent(UserAvatar).exists()).toBe(true)
  })

  it('muestra UserAvatar cuando hay texto en el input', async () => {
    // Mock con texto pero sin foco
    vi.mocked(useTaskInput).mockImplementation(() => ({
      inputRef: { value: document.createElement('input') },
      rawText: 'Texto de prueba',
      displayHtml: '<span>Texto de prueba</span>',
      isFocused: ref(false), // No enfocado
      focusInput: vi.fn(),
      handleConfirm: vi.fn(),
      handleBlur: vi.fn(),
      handleFocus: vi.fn(),
    }))

    // Mock de authStore con usuario
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '1', name: 'Test User' },
    })

    const wrapper = mount(TaskInput)

    // Debug: muestra el HTML del componente
    console.log(wrapper.html())

    expect(wrapper.findComponent(UserAvatar).exists()).toBe(true)
  })

  it('no muestra el placeholder cuando hay texto', () => {
    vi.mocked(useTaskInput).mockImplementation(() => ({
      inputRef: { value: document.createElement('input') },
      rawText: 'Texto existente',
      displayHtml: '<span>Texto existente</span>',
      isFocused: ref(false),
      focusInput: vi.fn(),
      handleConfirm: vi.fn(),
      handleBlur: vi.fn(),
      handleFocus: vi.fn(),
    }))

    const wrapper = mount(TaskInput)
    expect(wrapper.text()).not.toContain('Type to add new task')
  })

  it('pasa los stores correctamente al composable', () => {
    // Configura los mocks primero
    const mockAuthStore = { user: { id: '1', name: 'Test User' } }
    const mockTaskStore = { addTask: vi.fn() }

    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)
    vi.mocked(useTaskStore).mockReturnValue(mockTaskStore)

    mount(TaskInput)

    // Verifica que useTaskInput fue llamado con los stores mockeados
    expect(useTaskInput).toHaveBeenCalledWith(mockTaskStore, mockAuthStore)
  })
})
