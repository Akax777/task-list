// src/composables/useTaskInput.ts
import { ref, computed, watch, nextTick } from 'vue'
import { useTextParser } from './useTextParser'

export const useTaskInput = (taskStore: any, authStore: any) => {
  const inputRef = ref<HTMLInputElement | null>(null)

  // Usa computed para sincronizar con el store
  const rawText = computed({
    get: () => taskStore.rawText,
    set: (value) => taskStore.updateText(value),
  })

  const displayHtml = computed(() => taskStore.displayHtml)
  const isFocused = computed(() => taskStore.isInputFocused)

  // Elimina updateDisplay ya que ahora se maneja en el store
  const focusInput = () => {
    inputRef.value?.focus()
    taskStore.isInputFocused = true
  }

  const handleFocus = () => {
    taskStore.isInputFocused = true
  }

  const handleBlur = () => {
    if (!rawText.value) {
      taskStore.isInputFocused = false
    }
  }

  const handleConfirm = () => {
    if (!rawText.value.trim()) return

    const metadata = {
      rawText: rawText.value,
      categories: [...new Set(rawText.value.match(/#(\w+)/g))],
      // Nueva regex mejorada para usuarios
      users: [...new Set(rawText.value.match(/(?:^|\s)@(\w+)/g))].map((m) => m.trim()),
      emails: [...new Set(rawText.value.match(/(\S+@\S+\.\S+)/g))],
      urls: [...new Set(rawText.value.match(/(https?:\/\/[^\s]+)/g))],
    }

    if (taskStore.editingTask) {
      taskStore.updateTask(taskStore.editingTask.id, {
        text: rawText.value,
        metadata,
      })
    } else {
      taskStore.addTask(rawText.value, metadata)
    }
    inputRef.value?.blur()
  }

  watch(
    () => taskStore.editingTask,
    (task) => {
      if (task) {
        taskStore.updateText(task.text)
        nextTick().then(focusInput)
      }
    },
  )

  return {
    inputRef,
    rawText,
    displayHtml,
    isFocused,
    focusInput,
    handleFocus,
    handleBlur,
    handleConfirm,
  }
}
