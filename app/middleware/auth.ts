export default defineNuxtRouteMiddleware((to) => {
    const { loggedIn } = useUserSession()
    console.log('auth: ' + to)
    if (!loggedIn.value) {
        sessionStorage.setItem('redirectAfterLogin', to.fullPath)
        return navigateTo(`/login`)
    }
})