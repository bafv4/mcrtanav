<template>
  <v-container class="d-flex justify-center align-center h-screen">
    <v-card max-width="500" class="pa-4">
      <v-card-title class="text-center">
        <v-icon icon="mdi-lock" size="large" class="mb-2" />
        <div class="th-2">ログインが必要です</div>
      </v-card-title>

      <v-card-text class="text-center">
        <p>このページを閲覧するにはDiscordアカウントでのログインが必要です。</p>
      </v-card-text>

      <v-card-actions class="justify-center ga-2">
        <v-btn color="primary" prepend-icon="mdi-discord" @click="loginWithDiscord" size="large">
          Discordでログイン
        </v-btn>

        <v-btn variant="outlined" @click="goBack" size="large">
          戻る
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- ログイン失敗ダイアログ -->
    <v-dialog v-model="showFailureDialog" max-width="400">
      <v-card>
        <v-card-title class="text-center text-error">
          <v-icon icon="mdi-alert-circle" class="mr-2" />
          ログインに失敗しました
        </v-card-title>

        <v-card-text class="text-center">
          <p v-if="failureReason === 'access_denied'">
            このページにアクセスする権限がありません。<br>
            必要なDiscordサーバーに参加し、適切なロールが付与されていることを確認してください。
          </p>
          <p v-else-if="failureReason === 'cancelled'">
            ログイン処理がキャンセルされました。
          </p>
          <p v-else>
            ログイン処理中にエラーが発生しました。<br>
            時間をおいて再度お試しください。
          </p>
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="handleFailureDialogClose">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const showFailureDialog = ref(false)
const failureReason = ref<string>('')

useDefCustomMeta({
  title: 'ログインが必要です',
  layout: 'default'
})

const loginWithDiscord = () => {
  window.location.href = '/api/auth/discord'
}

const goBack = () => {
  router.push('/')

  // セッションストレージをクリア
  sessionStorage.removeItem('loginRedirectFrom')
  sessionStorage.removeItem('loginRedirectTo')
}

const handleFailureDialogClose = () => {
  showFailureDialog.value = false
  goBack()
}

// ログイン失敗時の処理
onMounted(() => {
  // URLパラメータからエラー情報を取得
  const error = route.query.error as string
  const errorDescription = route.query.error_description as string

  if (error) {
    failureReason.value = error
    showFailureDialog.value = true
  }
})
</script>