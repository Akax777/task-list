<template>
  <div class="space-y-2">
    <TaskItem v-for="task in tasks" :key="task.id" :task="task" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TaskItem from './TaskItem.vue'
import { useTaskStore } from '@/stores/taskStore'

const taskStore = useTaskStore()
const tasks = computed(() => taskStore.tasks)
</script>
