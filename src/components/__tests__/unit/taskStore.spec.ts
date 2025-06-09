import { setActivePinia, createPinia } from 'pinia'
import { describe, expect, it, beforeEach } from 'vitest'
import { useTaskStore } from '../../../stores/taskStore'

describe('taskStore', () => {
  let store: ReturnType<typeof useTaskStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useTaskStore()
  })

  it('agrega una nueva tarea', () => {
    store.addTask('Nueva tarea')
    expect(store.tasks).toHaveLength(1)
    expect(store.tasks[0].text).toBe('Nueva tarea')
    expect(store.tasks[0].completed).toBe(false)
  })

  it('alterna el estado completado', () => {
    store.addTask('Test task')
    const taskId = store.tasks[0].id

    store.toggleComplete(taskId)
    expect(store.tasks[0].completed).toBe(true)

    store.toggleComplete(taskId)
    expect(store.tasks[0].completed).toBe(false)
  })

  it('actualiza una tarea', () => {
    store.addTask('Old task')
    const taskId = store.tasks[0].id

    store.updateTask(taskId, { text: 'Updated task' })
    expect(store.tasks[0].text).toBe('Updated task')
  })

  it('elimina tarea correctamente', () => {
    store.addTask('To delete')
    const taskId = store.tasks[0].id
    store.deleteTask(taskId)
    expect(store.tasks).toHaveLength(0)
  })

  it('extrae metadata correctamente al agregar tarea', () => {
    const text = 'Test #tag @user email@test.com https://site.com'
    store.addTask(text)
    const task = store.tasks[0]

    expect(task.metadata).toEqual({
      rawText: text,
      categories: ['#tag'],
      users: ['@user'],
      emails: ['email@test.com'],
      urls: ['https://site.com'],
    })
  })
  /*
  it('actualiza metadata correctamente al actualizar tarea', () => {
    const initialText = 'Initial text'
    store.addTask(initialText)
    const taskId = store.tasks[0].id

    const updatedText = 'Updated #newtag @newuser new@email.com https://newsite.com'
    store.updateTask(taskId, { text: updatedText })

    expect(store.tasks[0].metadata).toEqual({
      rawText: updatedText,
      categories: ['#newtag'],
      users: ['@newuser'],
      emails: ['new@email.com'],
      urls: ['https://newsite.com'],
    })
  })*/

  it('maneja correctamente el parseo de texto', () => {
    const text = 'Test #tag @user email@test.com https://site.com'
    const parsed = store.parseText(text)

    expect(parsed).toContain('<span class="text-category">#tag</span>')
    expect(parsed).toContain('<span class="text-user">@user</span>')
    expect(parsed).toContain('<span class="text-email">email@test.com</span>')
    expect(parsed).toContain('<span class="text-url">https://site.com</span>')
  })

  it('maneja correctamente el parseo de texto sin elementos especiales', () => {
    const text = 'Texto normal sin elementos especiales'
    const parsed = store.parseText(text)
    expect(parsed).toBe(text)
  })

  it('maneja correctamente el set y clear de editing', () => {
    store.setEditingTask('123')
    expect(store.editingTaskId).toBe('123')

    store.clearEditing()
    expect(store.editingTaskId).toBeNull()
    expect(store.rawText).toBe('')
    expect(store.displayHtml).toBe('')
  })

  it('maneja correctamente el input focus', () => {
    store.setInputFocus(true)
    expect(store.isInputFocused).toBe(true)

    store.setInputFocus(false)
    expect(store.isInputFocused).toBe(false)
  })

  it('actualiza el texto correctamente', () => {
    const text = 'Test #tag'
    store.updateText(text)
    expect(store.rawText).toBe(text)
    expect(store.displayHtml).toContain('<span class="text-category">#tag</span>')
  })

  it('los getters funcionan correctamente', () => {
    expect(store.hasTasks).toBe(false)
    expect(store.completedTasks).toHaveLength(0)
    expect(store.pendingTasks).toHaveLength(0)
    expect(store.hasText).toBe(false)

    store.addTask('Task 1')
    store.addTask('Task 2', {
      rawText: 'Task 2',
      categories: [],
      users: [],
      emails: [],
      urls: [],
    })

    expect(store.hasTasks).toBe(true)
    expect(store.completedTasks).toHaveLength(0)
    expect(store.pendingTasks).toHaveLength(2)

    store.toggleComplete(store.tasks[0].id)
    expect(store.completedTasks).toHaveLength(1)
    expect(store.pendingTasks).toHaveLength(1)
  })
})
