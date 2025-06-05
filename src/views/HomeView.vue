<template>
  <div class="p-6 w-full">
    <TaskInput @add-task="addTask" />
    <TaskList :tasks="tasks" @toggle-complete="toggleComplete" @delete-task="deleteTask" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TaskInput from '@/components/TaskInput.vue'
import TaskList from '@/components/TaskList.vue'

const tasks = ref<Array<{ text: string; completed: boolean }>>([])

const addTask = (text: string) => {
  tasks.value.unshift({
    text,
    completed: false,
  })
}

const toggleComplete = (index: number) => {
  tasks.value[index].completed = !tasks.value[index].completed
}

const deleteTask = (index: number) => {
  tasks.value.splice(index, 1)
}
</script>
