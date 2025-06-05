<template>
  <div class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
    <!-- Checkbox de completado -->
    <button
      @click="$emit('toggle-complete')"
      class="w-5 h-5 rounded-full border flex items-center justify-center transition-colors"
      :class="{
        'border-blue-500 bg-blue-500 text-white': task.completed,
        'border-gray-300': !task.completed,
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

    <!-- Texto de la tarea -->
    <span
      class="flex-1"
      :class="{
        'line-through text-gray-400': task.completed,
        'text-gray-800': !task.completed,
      }"
    >
      {{ task.text }}
    </span>

    <!-- Botón de eliminar -->
    <button
      @click="$emit('delete-task')"
      class="text-gray-400 hover:text-red-500 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  task: {
    type: Object as () => {
      text: string
      completed: boolean
    },
    required: true,
  },
})

defineEmits(['toggle-complete', 'delete-task'])
</script>
