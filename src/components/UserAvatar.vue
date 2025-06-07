<template>
  <div
    class="transform w-8 h-8 rounded-full bg-gray-300 overflow-hidden transition-opacity duration-300"
    :class="{ 'opacity-40': !hasText }"
  >
    <img
      v-if="user?.avatar"
      :src="user.avatar"
      :alt="user.name || 'User'"
      class="w-8 h-8l object-cover"
    />
    <span v-else>
      {{ initials }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

interface User {
  id?: string
  name?: string
  avatar?: string
}

export default defineComponent({
  name: 'UserAvatar',
  props: {
    user: {
      type: Object as () => User | null, // Acepta null
      required: false,
      default: null,
    },
    hasText: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const initials = computed(() => {
      if (!props.user?.name) return '?'
      return props.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    })

    return { initials }
  },
})
</script>
