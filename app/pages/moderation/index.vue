<template>
  <div class="p-6">
    <div v-if="loggedIn">
      <p>ようこそ、<v-avatar :image="user?.avatar" size="32" /> {{ user?.name }} さん！</p>
      <button @click="logout">ログアウト</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
useDefCustomMeta({
  title: '管理ページ',
})

const { logout } = useAuthDialog()
const { user, loggedIn, clear } = useUserSession()
</script>

<style>

</style>