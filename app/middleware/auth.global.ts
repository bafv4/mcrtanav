export default defineNuxtRouteMiddleware((to) => {
    const { loggedIn } = useUserSession()

    if (!loggedIn.value && getFirstSegment(to.fullPath) == '/moderation') {
        const targetPath = to.fullPath
        sessionStorage.setItem('loginRedirectTo', targetPath)
        // グローバル状態で認証ダイアログを表示
        const { showAuthDialog } = useAuthDialog()
        showAuthDialog()
    }

    // ページの表示は継続させる（ダイアログで対応）
    return
})