import { mount } from '@vue/test-utils'
import TaskItem from '../../../components/TaskItem.vue'
import CheckIcon from '@/components/icons/CheckIcon.vue'
import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useTaskStore } from '../../../stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import { nextTick } from 'vue'

describe('TaskItem.vue', () => {
  let wrapper: ReturnType<typeof mount>
  let store: ReturnType<typeof useTaskStore>
  let pinia: ReturnType<typeof createTestingPinia>

  const baseTask = {
    id: '1',
    text: 'Test task',
    completed: false,
    createdAt: new Date(),
    metadata: {
      rawText: 'Test task',
      categories: [],
      users: [],
      emails: [],
      urls: [],
    },
  }

  beforeEach(() => {
    pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        tasks: {
          tasks: [baseTask],
          editingTaskId: null,
          isInputFocused: false,
          editableText: '',
        },
      },
      stubActions: false,
    })

    store = useTaskStore(pinia)
  })

  afterEach(() => {
    wrapper?.unmount()
    vi.clearAllMocks()
  })

  const mountComponent = (taskProps = baseTask) => {
    wrapper = mount(TaskItem, {
      props: { task: taskProps },
      global: {
        plugins: [pinia],
      },
    })
    return wrapper
  }

  it('alterna estado completado', async () => {
    const toggleCompleteSpy = vi.spyOn(store, 'toggleComplete')
    mountComponent()

    await wrapper.find('button').trigger('click')
    expect(toggleCompleteSpy).toHaveBeenCalledWith('1')
  })

  it('entra en modo edición al hacer clic', async () => {
    mountComponent()
    await wrapper.trigger('click')
    expect(store.editingTaskId).toBe('1')
  })

  it('cancela edición al hacer blur', async () => {
    mountComponent()
    store.setEditingTask('1')
    await nextTick()

    await wrapper.find('input').trigger('blur')
    expect(store.editingTaskId).toBeNull()
  })

  it('muestra texto parseado correctamente', async () => {
    const taskWithMetadata = {
      ...baseTask,
      text: 'Test #tag @user',
      metadata: {
        rawText: 'Test #tag @user',
        categories: ['#tag'],
        users: ['@user'],
        emails: [],
        urls: [],
      },
    }

    mountComponent(taskWithMetadata)
    await nextTick()

    // Verifica que las clases específicas para elementos parseados están presentes
    expect(wrapper.find('.text-category').exists()).toBe(true)
    expect(wrapper.find('.text-user').exists()).toBe(true)

    // O verifica el texto renderizado
    expect(wrapper.text()).toContain('#tag')
    expect(wrapper.text()).toContain('@user')
  })
  it('actualiza windowWidth al cambiar el tamaño de la ventana', async () => {
    mountComponent()
    const originalWidth = wrapper.vm.windowWidth

    // Simular cambio de tamaño de ventana
    window.innerWidth = 800
    window.dispatchEvent(new Event('resize'))

    await nextTick()
    expect(wrapper.vm.windowWidth).toBe(800)

    // Restaurar
    window.innerWidth = originalWidth
  })

  it('limpia el event listener al desmontar', async () => {
    const removeListenerSpy = vi.spyOn(window, 'removeEventListener')
    const wrapper = mountComponent()

    wrapper.unmount()
    expect(removeListenerSpy).toHaveBeenCalledWith('resize', wrapper.vm.updateWindowWidth)
  })

  it('fuerza modo edición cuando windowWidth < 1230', async () => {
    window.innerWidth = 1000
    const taskWithTags = {
      ...baseTask,
      text: 'Test #tag',
    }

    mountComponent(taskWithTags)
    await nextTick()

    // Verificar que el texto se parsea como en modo edición
    expect(wrapper.find('.text-category').exists()).toBe(true)
  })

  it('confirma edición con texto válido', async () => {
    const updateSpy = vi.spyOn(store, 'updateTask')
    mountComponent()
    store.setEditingTask('1')
    await nextTick()

    wrapper.vm.editableText = 'Updated task'
    await wrapper.find('input').trigger('keydown.enter')

    expect(updateSpy).toHaveBeenCalled()
    expect(store.editingTaskId).toBeNull()
  })

  it('no confirma edición con texto vacío', async () => {
    mountComponent()
    store.setEditingTask('1')
    await nextTick()

    wrapper.vm.editableText = ''
    await wrapper.find('input').trigger('keydown.enter')

    expect(store.editingTaskId).toBeNull()
  })

  it('maneja blur cuando relatedTarget es acción', async () => {
    mountComponent()
    store.setEditingTask('1')
    await nextTick()

    const input = wrapper.find('input').element
    const mockEvent = {
      relatedTarget: document.createElement('div'),
    } as FocusEvent
    mockEvent.relatedTarget.classList.add('task-action-container')

    wrapper.vm.handleBlur(mockEvent)
    expect(store.editingTaskId).toBe('1') // No debería cancelar
  })

  it('muestra avatar en modo edición', async () => {
    const auth = useAuthStore()
    auth.user = { avatar: 'test.jpg', name: 'Test User' }

    mountComponent()
    store.setEditingTask('1')
    await nextTick()

    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).toBe('test.jpg')
  })

  it('muestra icono de check cuando está completado', async () => {
    const completedTask = { ...baseTask, completed: true }
    mountComponent(completedTask)

    expect(wrapper.findComponent(CheckIcon).exists()).toBe(true)
  })
})
