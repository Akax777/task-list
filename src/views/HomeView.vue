<template>
  <div class="p-6 w-full">
    <TaskInput />
    <TaskList />
    <TaskActions />
  </div>
</template>

<script setup lang="ts">
import TaskInput from '@/components/TaskInput.vue'
import TaskList from '@/components/TaskList.vue'
import TaskActions from '@/components/TaskAction.vue'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()

onMounted(() => {
  auth.initialize()
})
</script>
