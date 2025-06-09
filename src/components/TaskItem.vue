<template>
  <div
    class="flex items-center gap-3 px-5 py-4 pt-5 h-13"
    :class="isEditing ? 'shadow' : null"
    @click="startEditing"
  >
    <button
      data-testid="complete-button"
      @click.stop="toggleComplete"
      class="w-6 h-6 border flex items-center justify-center transition-colors rounded-sm"
      :class="{
        'border-blue-500 bg-blue-500 text-white': task.completed,
        'border-gray-400': !task.completed,
      }"
    >
      <CheckIcon v-if="task.completed" />
    </button>

    <div v-if="!isEditing" class="flex-1">
      <div
        class="task-text"
        :class="{
          'line-through text-gray-400': task.completed,
          'tracking-wide text-lg': !task.completed,
        }"
        v-html="parsedDisplayText"
      ></div>
    </div>

    <div v-else class="relative flex-1 flex items-center">
      <div class="relative h-[40px] flex-grow">
        <input
          v-model="editableText"
          @blur="handleBlur"
          @keydown.enter="confirmEdit"
          class="w-full h-full bg-transparent text-transparent caret-blue-500 outline-none text-lg absolute left-0"
          ref="inputRef"
        />
        <div class="absolute w-full h-full pointer-events-none text-lg" v-html="editableHtml"></div>
      </div>
    </div>

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
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { useTextParser } from '@/composables/useTextParser'
import CheckIcon from '@/components/icons/CheckIcon.vue'

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

const { parseDisplayText, parseEditableText } = useTextParser()
const taskStore = useTaskStore()
const auth = useAuthStore()

const isEditing = computed(() => taskStore.editingTaskId === props.task.id)
const { editableText } = storeToRefs(taskStore)
const inputRef = ref<HTMLInputElement | null>(null)
const windowWidth = ref(window.innerWidth)

// Actualizar el ancho de la ventana cuando cambia
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})

// Texto parseado para visualización normal
const parsedDisplayText = computed(() => {
  const forceEditMode = windowWidth.value < 1230
  return parseDisplayText(props.task.text, forceEditMode)
})

// Texto parseado para modo edición
const editableHtml = computed(() => parseEditableText(editableText.value))

// Resto de los métodos permanecen igual
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
  const relatedTarget = event.relatedTarget as HTMLElement
  if (relatedTarget?.closest('.task-action-container')) {
    return
  }
  cancelEdit()
}

const cancelEdit = () => {
  editableText.value = props.task.text
  taskStore.clearEditing()
}

const confirmEdit = () => {
  if (editableText.value.trim() && editableText.value !== props.task.text) {
    const metadata = {
      rawText: editableText.value,
      categories: [...new Set(editableText.value.match(/#(\w+)/g) || [])],
      users: [...new Set(editableText.value.match(/@(\w+)/g) || [])],
      emails: [...new Set(editableText.value.match(/(\S+@\S+\.\S+)/g) || [])],
      urls: [...new Set(editableText.value.match(/(https?:\/\/[^\s]+)/g) || [])],
    }

    taskStore.updateTask(props.task.id, {
      text: editableText.value.trim(),
      metadata,
    })
  } else {
    taskStore.clearEditing()
  }
}
</script>
