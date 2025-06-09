<template>
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-200 ease-in"
    enter-from-class="opacity-0 translate-y-2"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="isVisible"
      data-test="task-actions"
      class="flex justify-between shadow px-2 py-2 task-action-container"
    >
      <div class="flex gap-2">
        <button
          v-for="(btn, idx) in actionButtons"
          :key="idx"
          @click="btn.action"
          :class="[
            'px-4 py-1 rounded text-sm tracking-wider flex items-center gap-2 transition-colors duration-300',
            idx === 0 ? 'bg-[#f1f5f8] mr-6' : 'bg-white border border-gray-200',
            hasText ? 'text-gray-500' : 'text-gray-400',
            isSmallScreen ? 'px-2' : 'px-4',
          ]"
          :title="isSmallScreen ? btn.label : undefined"
        >
          <component
            :is="btn.icon"
            class="w-6 h-6"
            :class="hasText ? 'opacity-100' : 'opacity-70'"
          />
          <span v-if="!isSmallScreen">{{ btn.label }}</span>
        </button>
      </div>

      <div class="flex gap-1">
        <button
          v-if="!isSmallScreen"
          @click="cancel"
          data-test="cancel-btn"
          class="bg-[#ebf0f6] px-6 py-2.5 text-black-500 rounded text-base tracking-wider"
        >
          <span v-if="!isSmallScreen">Cancel</span>
          <CloseIcon v-else class="w-5 h-5" />
        </button>
        <button
          @click="confirm"
          data-test="confirm-btn"
          :disabled="!hasText"
          class="bg-blue-700 text-white px-6 py-2.5 rounded text-base transition-colors ml-1 tracking-wider hover:bg-blue-800"
          :class="isSmallScreen ? 'px-4' : 'px-6'"
        >
          <template v-if="!isSmallScreen">
            {{ actionText }}
          </template>
          <template v-else>
            <PlusIcon v-if="!taskStore.editingTaskId && hasText" class="w-5 h-5" />
            <CloseIcon v-else-if="!hasText" class="w-5 h-5" />
            <FloppyIcon v-else class="w-5 h-5" />
          </template>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { storeToRefs } from 'pinia'

// Importar los nuevos iconos
const CloseIcon = defineAsyncComponent(() => import('@/components/icons/Close.vue'))
const PlusIcon = defineAsyncComponent(() => import('@/components/icons/Plus.vue'))
const FloppyIcon = defineAsyncComponent(() => import('@/components/icons/Floppy.vue'))

const taskStore = useTaskStore()
const { rawText, editableText } = storeToRefs(taskStore)

const originalText = ref('')

// Detectar tamaño de pantalla
const windowWidth = ref(window.innerWidth)
const isSmallScreen = computed(() => windowWidth.value < 1230)

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)

  // Al montar el componente, si estamos editando, guardamos el texto original
  if (taskStore.editingTaskId) {
    originalText.value = editableText.value
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})

const isVisible = computed(() => taskStore.isInputFocused || taskStore.editingTaskId)
const hasText = computed(() => {
  if (taskStore.editingTaskId) {
    return editableText.value && editableText.value !== originalText.value
  }
  return rawText.value?.trim().length > 0
})

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
  originalText.value = ''
}

const confirm = () => {
  if (isSmallScreen.value && !hasText.value) {
    taskStore.clearEditing()
  }
  const textToUse = taskStore.editingTaskId ? editableText.value : rawText.value

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

watch(
  () => taskStore.editingTaskId,
  (newVal) => {
    if (newVal) {
      originalText.value = editableText.value
    } else {
      originalText.value = ''
    }
  },
)
</script>
