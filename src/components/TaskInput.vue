<template>
  <div class="sticky top-0 z-10 pt-1 bg-white">
    <div class="bg-white flex gap-2 pt-3 px-4 pb-6" :class="isFocused ? 'shadow' : null">
      <button
        class="text-blue-600 rounded-full w-8 h-8 flex items-center justify-center shrink-0"
        @click="focusInput"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
          <path
            fill="#0891b2"
            d="M19 19V5H5v14zm0-16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-8 4h2v4h4v2h-4v4h-2v-4H7v-2h4z"
          />
        </svg>
      </button>

      <div class="relative flex-1">
        <input
          ref="inputRef"
          v-model="taskText"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown.enter="handleConfirm"
          placeholder="Type to add new task"
          class="w-full h-full focus:outline-none focus:border-blue-500 transition-colors caret-blue-500 tracking-wide text-lg"
        />
        <div
          v-if="isFocused"
          class="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-gray-300 overflow-hidden transition-opacity duration-300"
          :class="{ 'opacity-50': !taskText, 'opacity-100': taskText }"
        >
          <img
            v-if="auth.user?.avatar"
            :src="auth.user.avatar"
            :alt="auth.user.name"
            class="w-8 h-8 rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useTaskStore } from '@/stores/taskStore'
import { storeToRefs } from 'pinia'

const auth = useAuthStore()
console.log(auth.user)
const taskStore = useTaskStore()
const inputRef = ref<HTMLInputElement | null>(null)
const { taskText } = storeToRefs(taskStore)

const isFocused = computed(() => taskStore.isInputFocused)

watch(
  () => taskStore.editingTask,
  (task) => {
    if (task) {
      taskText.value = task.text
      focusInput()
    } else {
      taskText.value = ''
    }
  },
)

const focusInput = () => {
  inputRef.value?.focus()
  taskStore.isInputFocused = true
}

const handleFocus = () => {
  taskStore.isInputFocused = true
}

const handleBlur = () => {
  if (!taskText.value) {
    taskStore.isInputFocused = false
  }
}

const handleConfirm = () => {
  if (!taskText.value.trim()) return

  if (taskStore.editingTask) {
    taskStore.updateTask(taskStore.editingTask.id, { text: taskText.value })
  } else {
    taskStore.addTask(taskText.value)
  }
  taskText.value = ''

  inputRef.value?.blur() // Esto deseleccionará el input
  taskStore.isInputFocused = false
  taskStore.editingTask = null
}
</script>
