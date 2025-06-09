import { useTaskInput } from '../../../composables/useTaskInput'
import { useTaskStore } from '../../../stores/taskStore'
import { useAuthStore } from '../../../stores/authStore'
import { setActivePinia, createPinia } from 'pinia'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'

describe('useTaskInput', () => {
  let taskStore: ReturnType<typeof useTaskStore>
  let authStore: ReturnType<typeof useAuthStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    taskStore = useTaskStore()
    authStore = useAuthStore()
  })

  it('maneja confirmación con texto válido', () => {
    const { handleConfirm } = useTaskInput(taskStore, authStore)
    taskStore.rawText = 'New task'

    handleConfirm()

    expect(taskStore.tasks.length).toBe(1)
    expect(taskStore.tasks[0].text).toBe('New task')
  })

  it('no hace nada con texto vacío', () => {
    const { handleConfirm } = useTaskInput(taskStore, authStore)
    taskStore.rawText = ''

    handleConfirm()

    expect(taskStore.tasks.length).toBe(0)
  })
  it('maneja el focus del input correctamente', () => {
    const { inputRef, focusInput, isFocused } = useTaskInput(taskStore, authStore)

    // Mock del inputRef
    const focusMock = vi.fn()
    inputRef.value = { focus: focusMock } as unknown as HTMLInputElement

    focusInput()

    expect(focusMock).toHaveBeenCalled()
    expect(isFocused.value).toBe(true)
  })

  it('maneja handleFocus y handleBlur correctamente', () => {
    const { handleFocus, handleBlur, isFocused } = useTaskInput(taskStore, authStore)

    handleFocus()
    expect(isFocused.value).toBe(true)

    // Con texto no debería cambiar el estado
    taskStore.rawText = 'Some text'
    handleBlur()
    expect(isFocused.value).toBe(true)

    // Sin texto debería cambiar el estado
    taskStore.rawText = ''
    handleBlur()
    expect(isFocused.value).toBe(false)
  })

  it('maneja la edición de tareas correctamente', () => {
    const { handleConfirm } = useTaskInput(taskStore, authStore)

    // Añadir una tarea primero
    taskStore.rawText = 'Original task'
    handleConfirm()

    // Editar la tarea
    const taskToEdit = taskStore.tasks[0]
    taskStore.editingTask = taskToEdit
    taskStore.rawText = 'Updated task'
    handleConfirm()

    expect(taskStore.tasks.length).toBe(1)
    expect(taskStore.tasks[0].text).toBe('Updated task')
    expect(taskStore.editingTask).toBeNull()
  })

  it('reacciona a cambios en editingTask', async () => {
    const { inputRef } = useTaskInput(taskStore, authStore)
    const focusMock = vi.fn()
    inputRef.value = { focus: focusMock } as unknown as HTMLInputElement

    // Crear una tarea
    const task = { id: '1', text: 'Test task', metadata: {} }

    // Establecer editingTask y esperar a que se complete el watcher
    taskStore.editingTask = task
    await new Promise((resolve) => setTimeout(resolve, 0)) // Alternativa a nextTick

    expect(taskStore.rawText).toBe('Test task')
    expect(focusMock).toHaveBeenCalled()
  })

  it('extrae metadata correctamente al confirmar', () => {
    const { handleConfirm } = useTaskInput(taskStore, authStore)
    // Cambiar el texto para que no incluya @example como usuario
    taskStore.rawText = 'Task with #tag @user email@example.com https://example.com'

    handleConfirm()

    const createdTask = taskStore.tasks[0]
    expect(createdTask.metadata.categories).toEqual(['#tag'])
    expect(createdTask.metadata.users).toEqual(['@user']) // Ahora debería pasar
    expect(createdTask.metadata.emails).toEqual(['email@example.com'])
    expect(createdTask.metadata.urls).toEqual(['https://example.com'])
  })
})
