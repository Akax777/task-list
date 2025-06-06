<template>
  <div
    class="flex items-center gap-3 px-5 py-4 pt-5 h-13"
    :class="isEditing ? 'shadow' : null"
    @click="startEditing"
  >
    <button
      @click.stop="toggleComplete"
      class="w-6 h-6 border flex items-center justify-center transition-colors rounded-sm"
      :class="{
        'border-blue-500 bg-blue-500 text-white': task.completed,
        'border-gray-400': !task.completed,
      }"
    >
      <svg
        v-if="task.completed"
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </button>

    <span
      v-if="!isEditing"
      class="flex-1"
      :class="{
        'line-through text-gray-400': task.completed,
        'tracking-wide text-lg': !task.completed,
      }"
    >
      {{ task.text }}
    </span>

    <input
      v-else
      v-model="editableText"
      @blur="handleBlur"
      @keydown.enter="confirmEdit"
      class="flex-1 outline-none tracking-wide text-lg"
    />
    <div
      v-if="isEditing"
      class="transform w-8 h-8 rounded-full bg-gray-300 overflow-hidden transition-opacity duration-300"
    >
      <img
        v-if="auth.user?.avatar"
        :src="auth.user.avatar"
        :alt="auth.user.name"
        class="w-8 h-8 rounded-full object-cover"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'

const props = defineProps({
  task: {
    type: Object as () => {
      id: string
      text: string
      completed: boolean
      createdAt: Date
    },
    required: true,
  },
})

const taskStore = useTaskStore()
const auth = useAuthStore()

const isEditing = computed(() => taskStore.editingTaskId === props.task.id)
const { editableText } = storeToRefs(taskStore)

const inputRef = ref<HTMLInputElement | null>(null)

const toggleComplete = () => {
  taskStore.toggleComplete(props.task.id)
  taskStore.clearEditing()
}

const deleteTask = () => {
  taskStore.deleteTask(props.task.id)
}

const startEditing = () => {
  editableText.value = props.task.text
  taskStore.setEditingTask(props.task.id)
}

const handleBlur = (event: FocusEvent) => {
  const relatedTarget = event.relatedTarget as Node | null

  // Verifica si el nuevo foco está fuera del componente
  if (inputRef.value && !inputRef.value.contains(relatedTarget)) {
    cancelEdit()
  }
}

const cancelEdit = () => {
  editableText.value = props.task.text // Restaura el valor original
  taskStore.clearEditing()
}

const confirmEdit = () => {
  if (editableText.value.trim() && editableText.value !== props.task.text) {
    taskStore.updateTask(props.task.id, { text: editableText.value.trim() })
  }
  taskStore.clearEditing()
}
</script>
