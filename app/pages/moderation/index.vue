<template>
  <div class="p-6">
    <h1>保護されたページ</h1>

    <div v-if="loggedIn">
      <p>ようこそ {{ user?.name }} さん！</p>
      <v-avatar :image="user?.avatar" />
      <button @click="clear">ログアウト</button>
    </div>

    <div v-else>
      <NuxtLink to="/login">ログインしてください</NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
useDefCustomMeta({
  title: '管理ページ',
  auth: true
})

const { user, loggedIn, clear } = useUserSession()
</script>

<style>

</style>