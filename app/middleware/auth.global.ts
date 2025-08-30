export default defineNuxtRouteMiddleware((to, from) => {
    const { loggedIn } = useUserSession()

    if (!loggedIn.value && getFirstSegment(to.fullPath) == '/moderation') {
        const targetPath = to.fullPath
        sessionStorage.setItem('loginRedirectTo', targetPath)
        const fromPath = from.fullPath
        sessionStorage.setItem('loginRedirectFrom', fromPath)
        // グローバル状態で認証ダイアログを表示
        const { showAuthDialog } = useAuthDialog()
        showAuthDialog()
        return abortNavigation()
    }

    // ページの表示は継続させる（ダイアログで対応）
    return
})