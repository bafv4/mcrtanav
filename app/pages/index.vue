<template>
  <v-card class="h-100 d-flex flex-column justify-center ga-4 pa-8" color="background" loading>
    <div>
      <v-card-title class="text-h4 text-center">WIP</v-card-title>
      <v-card-subtitle class="text-subtitle-1 text-center text-pre-wrap">このページは準備中です。（トップページになる予定ですが。）</v-card-subtitle>
    </div>

    <v-divider />

    <v-btn append-icon="mdi-arrow-right" variant="tonal" color="secondary" to="/tools">ツールページ始めました</v-btn>
  </v-card>
</template>

<script lang="ts" setup>
import { rootInfo } from './root-info'
definePageMeta({
  pages: rootInfo.pages
})
useSeoMeta({
  title: 'リダイレクト中...'
})

// ツールページにリダイレクト
onMounted(() => useRouter().push('/tools'))
</script>ww