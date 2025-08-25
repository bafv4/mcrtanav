<template>
  <div class="p-6">
    <p class="th-1">ログインページ</p>
    <v-btn @click="loginWithDiscord">Discordでログイン</v-btn>
  </div>
</template>

<script setup lang="ts">
const loginWithDiscord = () => {
  window.location.href = `/api/auth/discord`
}
</script>