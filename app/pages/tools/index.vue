<template>
  <h4>ツール一覧</h4>
</template>

<script lang="ts" setup>
import { toolsInfo } from './tools-info';

definePageMeta({
  category: toolsInfo.category,
  pages: toolsInfo.pages
})
useSeoMeta({
  title: 'ツール一覧'
})
</script>

<style>

</style>