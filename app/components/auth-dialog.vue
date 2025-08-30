<template>
  <!-- ログイン要求ダイアログ -->
  <v-dialog v-model="authDialog" max-width="500" persistent>
    <v-card>
      <v-card-title class="text-center pa-6">
        <v-icon icon="mdi-lock" size="large" color="primary" class="mb-2" />
        <div class="th-2">ログインが必要です</div>
      </v-card-title>

      <v-card-text class="text-center px-6">
        <p>このページを閲覧するにはDiscordアカウントでのログインが必要です。</p>
      </v-card-text>

      <v-card-actions class="justify-center ga-2 pa-6">
        <v-btn color="primary" prepend-icon="mdi-discord" @click="loginWithDiscord" size="large">
          Discordでログイン
        </v-btn>

        <v-btn variant="outlined" @click="handleLoginCancel" size="large">
          戻る
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- ユーザーメニューダイアログ -->
  <v-dialog v-model="userDialog" max-width="400">
    <v-card elevation="4" class="pa-2">
      <v-card-title>
        <div class="d-flex align-center ga-2">
          <v-avatar :image="user?.avatar" size="32" />
          <div>
            <div class="text-subtitle-1">{{ user?.name }}</div>
            <div class="text-caption text-medium-emphasis">Discordアカウント</div>
          </div>
        </div>
      </v-card-title>

      <template v-slot:actions>
        <v-btn prepend-icon="mdi-logout" color="error" variant="outlined" @click="logout">
          ログアウト
        </v-btn>
      </template>
    </v-card>
  </v-dialog>

  <!-- ログイン失敗ダイアログ -->
  <v-dialog v-model="failureDialog" max-width="500">
    <v-card>
      <v-card-title class="text-center text-error pa-6">
        <v-icon icon="mdi-alert-circle" size="large" class="mb-2" />
        <div class="th-2">ログインに失敗しました</div>
      </v-card-title>

      <v-card-text class="text-center px-6">
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

      <v-card-actions class="justify-center pa-6">
        <v-btn color="primary" @click="handleLoginFailureClose">
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const { loggedIn, user, clear } = useUserSession()
const { authDialog, failureDialog, failureReason, userDialog, requestAuth, showUserDialog, hideAuthDialog, logout } = useAuthDialog()

// 認証が必要なページかどうかをチェック
watch(() => route.meta.requiresAuth, (requiresAuth) => {
  if (requiresAuth && !loggedIn.value) {
    authDialog.value = true
  }
}, { immediate: true })

// ログイン状態の変化を監視
watch(loggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    authDialog.value = false
  }
})

// URLパラメータからログイン失敗情報をチェック
watch(() => route.query, (query) => {
  if (query.loginFailure) {
    failureReason.value = query.error as string || 'unknown'
    failureDialog.value = true

    // URLからパラメータを削除
    router.replace({ query: { ...query, loginFailure: undefined, error: undefined } })
  }
}, { immediate: true })

const loginWithDiscord = () => {
  requestAuth()
}

const handleLoginCancel = () => {
  // セッションストレージをクリア
  sessionStorage.removeItem('loginRedirectFrom')
  sessionStorage.removeItem('loginRedirectTo')
  hideAuthDialog()
}

const handleLoginFailureClose = () => {
  const from = sessionStorage.getItem('loginRedirectFrom') as string

  failureDialog.value = false
  router.push(from)

  // セッションストレージをクリア
  sessionStorage.removeItem('loginRedirectFrom')
  sessionStorage.removeItem('loginRedirectTo')
}
</script>

<style>

</style>