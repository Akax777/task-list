<template>
  <div class="sticky top-0 z-10 pt-1 bg-white">
    <div class="bg-white flex gap-2 pt-3 px-4 pb-5 mb-3" :class="isFocused ? 'shadow' : null">
      <button
        class="text-blue-500 rounded-full w-8 h-8 flex items-center justify-center shrink-0"
        @click="focusInput"
      >
        <PlusIcon />
      </button>

      <div class="relative flex-1 flex items-center">
        <div class="relative h-[40px] flex-grow">
          <input
            ref="inputRef"
            v-model="rawText"
            @focus="handleFocus"
            @blur="handleBlur"
            @keydown.enter="handleConfirm"
            maxlength="200"
            class="w-full bg-transparent text-transparent caret-blue-500 outline-none text-lg absolute top-0 left-0"
          />
          <div
            class="absolute top-0 left-0 w-full pointer-events-none text-lg"
            v-html="displayHtml"
            @click="focusInput"
          ></div>
          <div
            v-if="!rawText"
            class="absolute top-0 left-0 w-full pointer-events-none text-gray-400 text-lg"
            @click="focusInput"
          >
            Type to add new task
          </div>
        </div>

        <div class="ml-2">
          <UserAvatar v-if="isFocused" :user="auth.user" :has-text="!!rawText" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useTaskStore } from '@/stores/taskStore'
import { useTaskInput } from '@/composables/useTaskInput'
import PlusIcon from './icons/PlusIcon.vue'
import UserAvatar from './UserAvatar.vue'

const auth = useAuthStore()
const taskStore = useTaskStore()

const {
  inputRef,
  rawText,
  displayHtml,
  isFocused,
  focusInput,
  handleFocus,
  handleBlur,
  handleConfirm,
} = useTaskInput(taskStore, auth)
</script>

<style>
.text-category,
.text-user,
.text-email,
.text-url {
  display: inline;
  position: relative;
}

.text-category {
  color: #724db6;
}

.text-user {
  color: #3e8e73;
}

.text-email {
  color: #e7a958;
}

.text-url {
  color: #7cbaf6;
}

.relative > div {
  line-height: 1.5;
  padding: 0.25rem 0;
}
</style>
