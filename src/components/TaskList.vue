<template>
  <div class="space-y-2">
    <TaskInput />
    <div v-if="!tasks.length" class="text-gray-500">No tasks yet</div>
    <TaskItem v-for="task in tasks" :key="task.id" :task="task" />
  </div>
</template>

<script setup lang="ts">
import TaskInput from './TaskInput.vue'
import TaskItem from './TaskItem.vue'
import { useTaskStore } from '@/stores/taskStore'

const store = useTaskStore()
const tasks = store.tasks

store.fetchTasks()
</script>
