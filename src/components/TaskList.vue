<template>
  <div class="space-y-2 mt-4">
    <TaskItem
      v-for="(task, index) in tasks"
      :key="index"
      :task="task"
      @toggle-complete="toggleComplete(index)"
      @delete-task="deleteTask(index)"
    />
  </div>
</template>

<script setup lang="ts">
import TaskItem from './TaskItem.vue'

defineProps({
  tasks: {
    type: Array as () => Array<{
      text: string
      completed: boolean
    }>,
    required: true,
  },
})

const emit = defineEmits(['toggle-complete', 'delete-task'])

const toggleComplete = (index: number) => {
  emit('toggle-complete', index)
}

const deleteTask = (index: number) => {
  emit('delete-task', index)
}
</script>
