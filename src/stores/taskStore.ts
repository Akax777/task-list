// stores/taskStore.ts
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

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

  const taskText = ref('')
  const isInputFocused = ref(false)
  const editingTask = ref<{
    id: string
    text: string
    completed: boolean
    createdAt: Date
  } | null>(null)

  const editingTaskId = ref<string | null>(null)

  // Getters
  const hasTasks = computed(() => tasks.value.length > 0)
  const completedTasks = computed(() => tasks.value.filter((task) => task.completed))
  const pendingTasks = computed(() => tasks.value.filter((task) => !task.completed))
  const hasText = computed(() => !!editingTask.value?.text || false)
  const editableText = ref('')

  // Actions
  function addTask(text: string) {
    const newTask = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
    }
    tasks.value.unshift(newTask)
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

  function updateTask(
    id: string,
    updates: Partial<{
      text: string
      completed: boolean
    }>,
  ) {
    const task = tasks.value.find((t) => t.id === id)
    if (task) {
      Object.assign(task, updates)
    }
    clearEditing()
  }

  function setEditingTask(id: string) {
    editingTaskId.value = id
  }

  function clearEditing() {
    editingTaskId.value = null
  }

  function setInputFocus(focused: boolean) {
    isInputFocused.value = focused
    if (!focused && !editingTask.value) {
      clearEditing()
    }
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
      taskText.value = ''
    }
  })

  watch(
    tasks,
    (newTasks) => {
      console.log('[STORE] Tareas actualizadas:', newTasks)
    },
    { deep: true },
  )

  return {
    // State
    tasks,
    isInputFocused,
    editingTask,
    editingTaskId,
    taskText,
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
    setEditingTask,
    clearEditing,
    setInputFocus,
  }
})
