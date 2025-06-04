<template>
  <div class="flex gap-2 items-center w-full">
    <input
      v-model="input"
      class="flex-1 p-2 border rounded"
      placeholder="Type to add new task"
      @keydown.enter="handleAdd"
    />
    <button class="bg-blue-500 text-white px-3 py-1 rounded" @click="handleAdd">OK</button>
    <button class="bg-gray-400 text-white px-3 py-1 rounded" @click="reset">Cancel</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const input = ref('')
const store = useTaskStore()

function handleAdd() {
  const trimmed = input.value.trim()
  if (trimmed) {
    store.addTask(trimmed)
    input.value = ''
  }
}

function reset() {
  input.value = ''
}
</script>
