export default defineNuxtRouteMiddleware((to) => {
    const { loggedIn } = useUserSession()

    if (!loggedIn.value && to.meta.auth) {
        // FROM: ユーザーがどこから来たのか
        const from = document.referrer && new URL(document.referrer).origin === window.location.origin
            ? document.referrer
            : null

        // TO: ユーザーがどこへアクセスしようとしているか
        const targetPath = to.fullPath

        // セッションストレージに情報を保存
        sessionStorage.setItem('loginRedirectFrom', from || '')
        sessionStorage.setItem('loginRedirectTo', targetPath)

        // グローバル状態で認証ダイアログを表示
        const { showAuthDialog } = useAuthDialog()
        showAuthDialog()

        // ページの表示は継続させる（ダイアログで対応）
        return
    }
})