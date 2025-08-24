<template>
  <div class="d-flex flex-column ga-4">
    <div class="head">
      <p class="th-1">リンク集</p>
      <p>マイクラRTAに関するコミュニティなどのリンクを掲載しています。</p>
    </div>

    <v-card>
      <v-card-title class="d-flex ga-1 align-bottom th-2">
        <v-icon icon="mdi-web-box" />Webサイト
      </v-card-title>

      <v-card class="ma-4" variant="outlined">
        <v-card-title class="th-4">マインクラフトRTA Wiki</v-card-title>
        <v-card-text class="ts-100">マインクラフトのRTAのための情報を整理したWikiです。</v-card-text>
      </v-card>

      <v-card class="ma-4" variant="outlined">
        <v-card-title class="th-4">マインクラフトRTA Wiki</v-card-title>
        <v-card-text class="ts-100">マインクラフトのRTAのための情報を整理したWikiです。</v-card-text>
      </v-card>
      
    </v-card>

    <v-card>
      <v-card-title class="d-flex ga-1 align-bottom th-2"><v-icon icon="mdi-youtube"></v-icon>YouTube</v-card-title>
    </v-card>

    <v-card>
      <v-card-title class="d-flex ga-1 align-bottom th-2">
        <font-awesome-icon icon="fab fa-discord" class="mt-1" />
        Discordサーバー
      </v-card-title>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useTheme } from 'vuetify/lib/composables/theme.mjs';
useDefCustomMeta({
  title: 'リンク集',
  category: 'root'
})

const theme = useTheme()
</script>

<style>

</style>