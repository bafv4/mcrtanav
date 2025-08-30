<template>
  <v-container class="d-flex justify-center align-center h-screen">
    <v-card max-width="400" class="pa-4 text-center">
      <v-progress-circular indeterminate color="primary" size="48" class="mb-4" />
      <p class="text-body-1">ログイン処理中...</p>
      <p class="text-caption text-medium-emphasis">自動的にリダイレクトします</p>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
const router = useRouter()

useDefCustomMeta({
  title: 'ログイン処理中',
  layout: 'default'
})

onMounted(() => {
  // セッションストレージからリダイレクト先を取得
  const redirectTo = sessionStorage.getItem('loginRedirectTo')

  // セッションストレージをクリア
  sessionStorage.removeItem('loginRedirectFrom')
  sessionStorage.removeItem('loginRedirectTo')

  // 少し遅延を入れてユーザーに処理中であることを示す
  setTimeout(() => {
    if (redirectTo && redirectTo !== '/') {
      // 目的のページにリダイレクト
      router.replace(redirectTo)
    } else {
      // リダイレクト先が不明な場合はホームに
      router.replace('/')
    }
  }, 1000)
})
</script>