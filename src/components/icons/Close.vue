<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="close-icon"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
</template>

<script setup lang="ts">
// No necesita lógica especial
</script>

<style scoped>
.close-icon {
  display: inline-block;
  vertical-align: middle;
}

/* Opcional: puedes añadir animaciones o efectos hover */
.close-icon:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}
</style>
