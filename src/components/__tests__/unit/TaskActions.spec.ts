import { mount } from '@vue/test-utils'
import TaskAction from '../../../components/TaskAction.vue'
import { createTestingPinia } from '@pinia/testing'
import { useTaskStore } from '../../../stores/taskStore'
import { describe, expect, vi, it, beforeEach, beforeAll, afterEach } from 'vitest'
import { nextTick } from 'vue'

describe('TaskActions.vue', () => {
  let wrapper: ReturnType<typeof mount>
  let store: ReturnType<typeof useTaskStore>
  let pinia: ReturnType<typeof createTestingPinia>

  beforeAll(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1290,
    })
  })

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
      initialState: {
        tasks: {
          rawText: '',
          editingTaskId: null,
          isInputFocused: false,
          editableText: '',
          tasks: [],
        },
      },
    })

    store = useTaskStore(pinia)
  })

  afterEach(() => {
    wrapper?.unmount()
    vi.clearAllMocks()
  })

  const mountComponent = () => {
    wrapper = mount(TaskAction, {
      global: {
        plugins: [pinia],
      },
    })
    return wrapper
  }

  it('no se muestra si no hay tarea activa ni input enfocado', () => {
    store.editingTaskId = null
    store.rawText = ''
    store.isInputFocused = false
    mountComponent()

    expect(wrapper.find('[data-test="task-actions"]').exists()).toBe(false)
  })

  it('se muestra cuando el input está enfocado', async () => {
    store.rawText = 'Tarea temporal'
    store.isInputFocused = true
    mountComponent()
    await nextTick()

    expect(wrapper.find('[data-test="task-actions"]').exists()).toBe(true)
  })

  it('se muestra cuando hay una tarea en edición', async () => {
    store.editingTaskId = '1'
    store.editableText = 'Tarea editada'
    mountComponent()
    await nextTick()

    expect(wrapper.find('[data-test="task-actions"]').exists()).toBe(true)
  })
  /*
  it('el botón confirmar llama a updateTask si está editando', async () => {
    const taskId = '1'
    const updatedText = 'Updated text'

    // 1. Configuración inicial del store
    pinia = createTestingPinia({
      createSpy: vi.fn, // Añade esta línea
      initialState: {
        tasks: {
          editingTaskId: taskId,
          editableText: updatedText,
          isInputFocused: true,
          rawText: '',
          tasks: [
            {
              id: taskId,
              text: 'Original text',
              completed: false,
              createdAt: new Date(),
              metadata: {
                rawText: 'Original text',
                categories: [],
                users: [],
                emails: [],
                urls: [],
              },
            },
          ],
        },
      },
      stubActions: false,
    })

    store = useTaskStore(pinia)

    // 2. Mock solo de la acción que queremos espiar
    const updateTaskSpy = vi.spyOn(store, 'updateTask')

    // 3. Montar el componente después de configurar el store
    wrapper = mount(TaskAction, {
      global: {
        plugins: [pinia],
      },
    })

    await nextTick()

    // 4. Verificar que el botón existe y está habilitado
    const confirmBtn = wrapper.find('[data-test="confirm-btn"]')
    expect(confirmBtn.exists()).toBe(true)
    expect(confirmBtn.attributes('disabled')).toBe('')

    // 5. Disparar el evento click
    await confirmBtn.trigger('click')
    await nextTick()

    // 6. Verificaciones
    expect(updateTaskSpy).toHaveBeenCalledTimes(1)
    expect(updateTaskSpy).toHaveBeenCalledWith(
      taskId,
      expect.objectContaining({
        text: updatedText,
        metadata: expect.objectContaining({
          rawText: updatedText,
        }),
      }),
    )
  })*/

  it('el botón confirmar llama a addTask si no está editando', async () => {
    store.rawText = 'New task'
    store.isInputFocused = true
    const addSpy = vi.spyOn(store, 'addTask')
    mountComponent()
    await nextTick()

    await wrapper.find('[data-test="confirm-btn"]').trigger('click')
    expect(addSpy).toHaveBeenCalledWith('New task')
  })

  it('el botón confirmar no hace nada si no hay texto', async () => {
    store.rawText = ''
    store.isInputFocused = true
    const addSpy = vi.spyOn(store, 'addTask')
    mountComponent()
    await nextTick()

    await wrapper.find('[data-test="confirm-btn"]').trigger('click')
    expect(addSpy).not.toHaveBeenCalled()
  })

  it('el botón cancelar limpia la edición', async () => {
    store.editableText = 'Cancelar'
    store.editingTaskId = '2'
    store.isInputFocused = true
    mountComponent()

    const clearEditingSpy = vi.spyOn(store, 'clearEditing')
    await nextTick()

    await wrapper.find('[data-test="cancel-btn"]').trigger('click')
    expect(clearEditingSpy).toHaveBeenCalled()
  })

  it('botones de acción ejecutan sus funciones', async () => {
    store.isInputFocused = true
    store.rawText = 'Test text'
    mountComponent()
    await nextTick()

    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(0)

    // Probar cada botón de acción
    for (let i = 0; i < Math.min(5, buttons.length - 2); i++) {
      await buttons[i].trigger('click')
      expect(console.log).toHaveBeenCalled()
    }
  })

  it('comportamiento en pantallas pequeñas', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 800 })
    window.dispatchEvent(new Event('resize'))

    store.isInputFocused = true
    store.rawText = 'Test mobile'
    mountComponent()
    await nextTick()

    const buttons = wrapper.findAll('button')
    expect(buttons[0].classes()).toContain('px-2') // Verificar clase para pantalla pequeña
  })

  it('maneja el texto original al editar', async () => {
    const taskId = '1'
    store.$patch({
      editingTaskId: taskId,
      editableText: 'Edited text',
      tasks: [
        {
          id: taskId,
          text: 'Original text',
          completed: false,
          createdAt: new Date(),
          metadata: { rawText: 'Original text', categories: [], users: [], emails: [], urls: [] },
        },
      ],
    })

    mountComponent()
    await nextTick()

    // Cambiar el texto editable
    store.editableText = 'Modified text'
    await nextTick()

    // Verificar que hasText refleja el cambio
    const confirmBtn = wrapper.find('[data-test="confirm-btn"]')
    expect(confirmBtn.attributes('disabled')).toBeUndefined()
  })
})
