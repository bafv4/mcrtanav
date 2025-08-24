<template>
  <div class="p-6">
    <h1>保護されたページ</h1>

    <div v-if="loggedIn">
      <p>ようこそ {{ user?.name }} さん！</p>
      <p v-if="user?.roles?.length">あなたのロール: {{ user.roles.join(', ') }}</p>
      <button @click="clear">ログアウト</button>
    </div>

    <div v-else>
      <NuxtLink to="/login">ログインしてください</NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import auth from '~/middleware/auth'

useDefCustomMeta({
  title: '管理ページ',
  requiresAuth: true,
})

definePageMeta({ middleware: [auth] })
const { user, loggedIn, clear } = useUserSession()
</script>

<style>

</style>