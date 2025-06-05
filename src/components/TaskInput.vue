<template>
  <div class="sticky top-0 pb-6 z-10">
    <div class="bg-white flex gap-2 shadow pt-2 px-4 pb-7">
      <!-- Botón de añadir  -->
      <button
        class="text-blue-600 rounded-full w-8 h-8 flex items-center justify-center shrink-0"
        @click="focusInput"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
          <path
            fill="#0891b2"
            d="M19 19V5H5v14zm0-16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-8 4h2v4h4v2h-4v4h-2v-4H7v-2h4z"
          />
        </svg>
      </button>

      <!-- Campo de entrada -->
      <div class="relative flex-1">
        <input
          ref="inputRef"
          v-model="taskText"
          @focus="isFocused = true"
          @blur="handleBlur"
          @keydown.enter="addTask"
          placeholder="Type to add new task"
          class="w-full h-full focus:outline-none focus:border-blue-500 transition-colors caret-blue-500 tracking-wide text-lg"
        />
        <!-- Avatar de usuario -->
        <div
          v-if="isFocused"
          class="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-gray-300 overflow-hidden transition-opacity duration-300"
          :class="{ 'opacity-50': !taskText, 'opacity-100': taskText }"
        >
          <img
            v-if="auth.user?.avatar"
            :src="auth.user.avatar"
            :alt="auth.user.name"
            class="w-8 h-8 rounded-full object-cover"
          />
        </div>
      </div>
    </div>

    <!-- Botones funcionales (solo cuando está enfocado) -->
    <div v-if="isFocused" class="flex justify-between shadow px-2 py-2">
      <div class="flex gap-2">
        <!-- Botones funcionales (parte modificada) -->
        <button
          v-for="(btn, idx) in actionButtons"
          :key="idx"
          @click="btn.action"
          :class="[
            'px-4 py-1 rounded text-sm tracking-wider flex items-center gap-2 transition-colors duration-300',
            idx === 0 ? 'bg-[#f1f5f8] mr-6' : 'bg-white border border-gray-200',
            taskText ? 'text-gray-500' : 'text-gray-400',
          ]"
        >
          <component
            :is="btn.icon"
            class="w-6 h-6"
            :class="taskText ? 'opacity-100' : 'opacity-70'"
          />
          {{ btn.label }}
        </button>
      </div>

      <div class="flex gap-1">
        <button
          @click="clearInput"
          class="bg-[#ebf0f6] px-6 py-2.5 text-black-500 rounded text-base tracking-wider"
        >
          Cancel
        </button>
        <button
          @click="addTask"
          :disabled="!taskText.trim()"
          class="bg-blue-700 text-white px-6 py-2.5 rounded text-base transition-colors ml-1 tracking-wider hover:bg-blue-800"
        >
          {{ taskText ? 'Add' : 'Ok' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { ref } from 'vue'

const emit = defineEmits(['add-task'])
const auth = useAuthStore()

const isFocused = ref(false)
const taskText = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  auth.initialize()
})

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

const focusInput = () => {
  inputRef.value?.focus()
}

const clearInput = () => {
  taskText.value = ''
  isFocused.value = false
}

const handleBlur = () => {
  if (!taskText.value) {
    isFocused.value = false
  }
}

const addTask = () => {
  if (!taskText.value.trim()) return

  emit('add-task', taskText.value)
  taskText.value = ''
  isFocused.value = false
  inputRef.value?.blur()
}
</script>
