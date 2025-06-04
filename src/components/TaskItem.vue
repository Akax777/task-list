<template>
  <div class="p-2 border-b flex justify-between items-center">
    <div v-html="formattedContent" class="text-sm"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '@/stores/taskStore'

const props = defineProps<{ task: Task }>()

const formattedContent = computed(() => {
  let content = props.task.content

  content = content
    .replace(/#(\w+)/g, `<span class="bg-green-200 px-1 rounded">#$1</span>`)
    .replace(/@(\w+)/g, `<span class="bg-blue-200 px-1 rounded">@$1</span>`)
    .replace(
      /\b[\w.-]+@[\w.-]+\.\w{2,4}\b/g,
      `<a href="mailto:$&" class="text-red-500 underline">$&</a>`,
    )
    .replace(
      /https?:\/\/\S+/g,
      `<a href="$&" target="_blank" class="text-blue-500 underline">$&</a>`,
    )

  return content
})
</script>
