import { mount } from '@vue/test-utils'
import TaskList from '../../../components/TaskList.vue'
import TaskItem from '../../../components/TaskItem.vue' // Importar el componente
import { useTaskStore } from '../../../stores/taskStore'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, it, expect } from 'vitest'

describe('TaskList.vue', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('renders a list of tasks', async () => {
    const taskStore = useTaskStore()
    taskStore.tasks = [
      {
        id: '1',
        text: 'Task 1',
        completed: false,
        createdAt: new Date(),
        metadata: { rawText: 'Task 1', categories: [], users: [], emails: [], urls: [] },
      },
      {
        id: '2',
        text: 'Task 2',
        completed: true,
        createdAt: new Date(),
        metadata: { rawText: 'Task 2', categories: [], users: [], emails: [], urls: [] },
      },
    ]

    const wrapper = mount(TaskList, {
      global: {
        plugins: [pinia],
        components: {
          TaskItem, // Registrar el componente
        },
      },
    })

    // Esperar a que se actualice el DOM
    await wrapper.vm.$nextTick()

    const taskItems = wrapper.findAllComponents(TaskItem) // Buscar por componente
    expect(taskItems.length).toBe(2)
  })

  it('renders empty state when no tasks', async () => {
    const taskStore = useTaskStore()
    taskStore.tasks = []

    const wrapper = mount(TaskList, {
      global: {
        plugins: [pinia],
        components: {
          TaskItem,
        },
      },
    })

    await wrapper.vm.$nextTick()

    const taskItems = wrapper.findAllComponents(TaskItem)
    expect(taskItems.length).toBe(0)
  })
})
