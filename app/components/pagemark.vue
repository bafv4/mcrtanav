<template>
  <div class="d-flex align-center cursor-pointer h-100 justify-center justify-sm-start" @click="to ? $router.push(to) : $emit('click')">
    <v-avatar class="d-inline-block align-center mr-2" image="/img/icon.png" size="24" />
    <span class="text-body-1 text-weight-bold">マイクラRTAナビ</span>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    to?: string
  }>(), {
  })
</script>

<style>

</style>