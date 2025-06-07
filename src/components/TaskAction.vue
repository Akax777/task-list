<template>
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-200 ease-in"
    enter-from-class="opacity-0 translate-y-2"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div v-if="isVisible" class="flex justify-between shadow px-2 py-2 task-action-container">
      <div class="flex gap-2">
        <button
          v-for="(btn, idx) in actionButtons"
          :key="idx"
          @click="btn.action"
          :class="[
            'px-4 py-1 rounded text-sm tracking-wider flex items-center gap-2 transition-colors duration-300',
            idx === 0 ? 'bg-[#f1f5f8] mr-6' : 'bg-white border border-gray-200',
            hasText ? 'text-gray-500' : 'text-gray-400',
          ]"
        >
          <component
            :is="btn.icon"
            class="w-6 h-6"
            :class="hasText ? 'opacity-100' : 'opacity-70'"
          />
          {{ btn.label }}
        </button>
      </div>

      <div class="flex gap-1">
        <button
          @click="cancel"
          class="bg-[#ebf0f6] px-6 py-2.5 text-black-500 rounded text-base tracking-wider"
        >
          Cancel
        </button>
        <button
          @click="confirm"
          :disabled="!hasText"
          class="bg-blue-700 text-white px-6 py-2.5 rounded text-base transition-colors ml-1 tracking-wider hover:bg-blue-800"
        >
          {{ actionText }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { storeToRefs } from 'pinia'

const taskStore = useTaskStore()
const { rawText, editableText } = storeToRefs(taskStore)

const isVisible = computed(() => taskStore.isInputFocused || taskStore.editingTaskId)
const hasText = computed(() => taskStore.rawText || taskStore.editingTaskId)
const actionText = computed(() => (taskStore.editingTaskId ? 'Update' : 'Add'))

const actionButtons = [
  {
    label: 'Open',
    action: () => console.log('Priority clicked'),
    icon: defineAsyncComponent(() => import('@/components/icons/ArrowExpand.vue')),
  },
  {
    label: 'Today',
    action: () => console.log('Due Date clicked'),
    icon: defineAsyncComponent(() => import('@/components/icons/CalendarBlankOutline.vue')),
  },
  {
    label: 'Public',
    action: () => console.log('Labels clicked'),
    icon: defineAsyncComponent(() => import('@/components/icons/LockOpenVariantOutline.vue')),
  },
  {
    label: 'Higlight',
    action: () => console.log('Attachments clicked'),
    icon: defineAsyncComponent(() => import('@/components/icons/WhiteBalanceSunny.vue')),
  },
  {
    label: 'Estimation',
    action: () => console.log('Comments clicked'),
    icon: defineAsyncComponent(() => import('@/components/icons/Numeric0CirlceOutline.vue')),
  },
]

const cancel = () => {
  taskStore.clearEditing()
}

const confirm = () => {
  const textToUse = taskStore.editingTaskId ? editableText.value : rawText.value

  console.log('Text to use:', textToUse) // Verificar el valor real

  if (!textToUse?.trim()) return

  if (taskStore.editingTaskId) {
    const metadata = {
      rawText: textToUse,
      categories: [...new Set(textToUse.match(/#(\w+)/g) || [])],
      users: [...new Set(textToUse.match(/@(\w+)/g) || [])],
      emails: [...new Set(textToUse.match(/(\S+@\S+\.\S+)/g) || [])],
      urls: [...new Set(textToUse.match(/(https?:\/\/[^\s]+)/g) || [])],
    }

    taskStore.updateTask(taskStore.editingTaskId, {
      text: textToUse.trim(),
      metadata,
    })
  } else {
    taskStore.addTask(textToUse)
  }
}
</script>
