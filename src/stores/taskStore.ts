// stores/taskStore.ts
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

interface TaskMetadata {
  rawText: string
  categories: string[]
  users: string[]
  emails: string[]
  urls: string[]
}

interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  metadata: TaskMetadata // Añadir este campo
}

export const useTaskStore = defineStore('tasks', () => {
  // Estado
  const tasks = ref<
    Array<{
      id: string
      text: string
      completed: boolean
      createdAt: Date
    }>
  >([])

  const rawText = ref('')
  const displayHtml = ref('')
  const isInputFocused = ref(false)
  const editingTask = ref<{
    id: string
    text: string
    completed: boolean
    createdAt: Date
  } | null>(null)

  const editingTaskId = ref<string | null>(null)
  const editableText = ref('')
  watch(editableText, (newVal) => {
    console.log('editableText changed in store:', newVal)
  })

  // Getters
  const hasTasks = computed(() => tasks.value.length > 0)
  const completedTasks = computed(() => tasks.value.filter((task) => task.completed))
  const pendingTasks = computed(() => tasks.value.filter((task) => !task.completed))
  const hasText = computed(() => !!editingTask.value?.text || false)

  // Actions
  function addTask(text: string, metadata?: TaskMetadata) {
    const newTask = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
      metadata: metadata || {
        rawText: text,
        categories: [],
        users: [],
        emails: [],
        urls: [],
      },
    }
    tasks.value.unshift(newTask)
    displayHtml.value = ''
    rawText.value = ''
    isInputFocused.value = false
    editingTask.value = null
  }

  function deleteTask(id: string) {
    tasks.value = tasks.value.filter((task) => task.id !== id)
    if (editingTaskId.value === id) {
      clearEditing()
    }
  }

  function toggleComplete(id: string) {
    const task = tasks.value.find((t) => t.id === id)
    if (task) {
      task.completed = !task.completed
    }
  }

  // En el TaskStore.ts, modifica la función updateTask
  function updateTask(
    id: string,
    updates: Partial<{
      text: string
      completed: boolean
      metadata: TaskMetadata
    }>,
  ) {
    const task = tasks.value.find((t) => t.id === id)
    if (task) {
      const metadata = updates.metadata || {
        rawText: updates.text || task.text,
        categories: [...new Set((updates.text || task.text).match(/#(\w+)/g) || [])],
        users: [...new Set((updates.text || task.text).match(/@(\w+)/g) || [])],
        emails: [...new Set((updates.text || task.text).match(/(\S+@\S+\.\S+)/g) || [])],
        urls: [...new Set((updates.text || task.text).match(/(https?:\/\/[^\s]+)/g) || [])],
      }

      Object.assign(task, {
        ...updates,
        metadata,
      })
    }
    clearEditing()
  }
  function setEditingTask(id: string) {
    editingTaskId.value = id
  }

  function clearEditing() {
    rawText.value = ''
    displayHtml.value = ''
    editingTask.value = null
    editingTaskId.value = null
    isInputFocused.value = false
  }

  function setInputFocus(focused: boolean) {
    isInputFocused.value = focused
    if (!focused && !editingTask.value) {
      clearEditing()
    }
  }

  function updateText(newText: string) {
    rawText.value = newText
    displayHtml.value = parseText(newText) // Necesitarás implementar parseText
  }

  function parseText(text: string): string {
    // Implementa tu lógica de parseo aquí (similar a la que tenías en el componente)
    const words = text.split(/(\s+)/)

    const processedWords = words.map((word) => {
      if (word.trim().length > 0) {
        if (/^#\w+/.test(word)) return `<span class="text-category">${word}</span>`
        if (/^@\w+/.test(word)) return `<span class="text-user">${word}</span>`
        if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(word))
          return `<span class="text-email">${word}</span>`
        if (/^(https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(word))
          return `<span class="text-url">${word}</span>`
      }
      return word
    })

    return processedWords.join('')
  }

  // Sincronizar cuando se enfoca el input (TaskInput)
  watch(isInputFocused, (newVal) => {
    if (newVal) {
      editingTaskId.value = null
    }
  })

  // Sincronizar cuando se edita un item (TaskItem)
  watch(editingTaskId, (newId) => {
    if (newId !== null) {
      isInputFocused.value = false
      rawText.value = ''
      displayHtml.value = ''
    }
  })

  return {
    // State
    tasks,
    isInputFocused,
    editingTask,
    editingTaskId,
    rawText,
    displayHtml,
    editableText,

    // Getters
    hasTasks,
    completedTasks,
    pendingTasks,
    hasText,

    // Actions
    addTask,
    deleteTask,
    toggleComplete,
    updateTask,
    updateText,
    setEditingTask,
    clearEditing,
    setInputFocus,
    parseText,
  }
})
