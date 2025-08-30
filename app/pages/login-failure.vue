<template>
  <v-container class="d-flex justify-center align-center h-screen">
    <v-card max-width="600" class="pa-6">
      <v-card-title class="text-center text-error mb-4">
        <v-icon icon="mdi-alert-circle-outline" size="64" class="mb-4" />
        <div class="th-1">ログインに失敗しました</div>
      </v-card-title>

      <v-card-text class="text-center">
        <div v-if="errorType === 'access_denied'" class="mb-6">
          <p class="text-h6 mb-3">アクセス権限がありません</p>
          <p class="text-body-1 mb-2">このサイトにアクセスするには、指定されたDiscordサーバーに参加し、適切なロールが付与されている必要があります。</p>
          <p class="text-body-2 text-medium-emphasis">
            サーバー管理者にお問い合わせいただくか、必要な条件を満たしているかご確認ください。
          </p>
        </div>

        <div v-else-if="errorType === 'cancelled'" class="mb-6">
          <p class="text-h6 mb-3">ログインがキャンセルされました</p>
          <p class="text-body-1 mb-2">Discordでの認証処理がキャンセルされました。</p>
          <p class="text-body-2 text-medium-emphasis">
            再度ログインをお試しください。
          </p>
        </div>

        <div v-else-if="errorType === 'server_error'" class="mb-6">
          <p class="text-h6 mb-3">サーバーエラーが発生しました</p>
          <p class="text-body-1 mb-2">認証処理中にサーバー側でエラーが発生しました。</p>
          <p class="text-body-2 text-medium-emphasis">
            時間をおいて再度お試しいただくか、問題が続く場合は管理者にお問い合わせください。
          </p>
        </div>

        <div v-else class="mb-6">
          <p class="text-h6 mb-3">予期しないエラーが発生しました</p>
          <p class="text-body-1 mb-2">ログイン処理中に予期しないエラーが発生しました。</p>
          <p class="text-body-2 text-medium-emphasis">
            時間をおいて再度お試しください。
          </p>
        </div>
      </v-card-text>

      <v-card-actions class="justify-center ga-3">
        <v-btn color="primary" prepend-icon="mdi-refresh" @click="retryLogin" size="large" variant="elevated">
          再度ログインを試す
        </v-btn>

        <v-btn variant="outlined" prepend-icon="mdi-home" @click="goHome" size="large">
          ホームに戻る
        </v-btn>
      </v-card-actions>

      <!-- 追加情報カード -->
      <v-card v-if="errorType === 'access_denied'" variant="outlined" class="mt-6 pa-4" color="info">
        <v-card-title class="text-subtitle-1 d-flex align-center">
          <v-icon icon="mdi-information" class="mr-2" />
          必要な条件
        </v-card-title>
        <v-card-text class="text-body-2">
          <ul class="ml-4">
            <li>指定されたDiscordサーバーのメンバーであること</li>
            <li>サーバー内で必要なロールが付与されていること</li>
            <li>Discordアカウントが正常に認証されること</li>
          </ul>
        </v-card-text>
      </v-card>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const errorType = computed(() => route.query.error as string || 'unknown')

useDefCustomMeta({
  title: 'ログインに失敗しました',
  layout: 'default'
})

const retryLogin = () => {
  // セッションストレージに現在のページ情報を保存
  sessionStorage.setItem('loginRedirectFrom', '')
  sessionStorage.setItem('loginRedirectTo', '/')

  window.location.href = '/api/auth/discord'
}

const goHome = () => {
  // セッションストレージをクリア
  sessionStorage.removeItem('loginRedirectFrom')
  sessionStorage.removeItem('loginRedirectTo')

  router.push('/')
}
</script>