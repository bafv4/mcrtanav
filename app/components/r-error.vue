<template>
  <p class="th-1">(> <;) Oops!</p>
  <p>{{ error?.message }}</p>
  <dev-only>
    <p class="ts-085 mt-2">{{ error?.stack }}</p>
  </dev-only>
</template>

<script lang="ts" setup>
defineProps({
  error: Error
})

const route = useRoute()

useDefCustomMeta({
  title: '404'
})
</script>