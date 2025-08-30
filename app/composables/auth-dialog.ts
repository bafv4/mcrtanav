export const useAuthDialog = () => {
  const authDialog = useState<boolean>('auth.showDialog', () => false)
  const failureReason = useState<string>('auth.failureReason', () => '')
  const failureDialog = useState<boolean>('auth.showFailureDialog', () => false)
  const userDialog = useState<boolean>('auth.showUserDialog', () => false)
  const { loggedIn, clear } = useUserSession()
  const router = useRouter()

  const requestAuth = () => {
    const from = document.referrer && new URL(document.referrer).origin === window.location.origin
      ? document.referrer
      : null
    sessionStorage.setItem('loginRedirectFrom', from || '')
    window.location.href = `/api/auth/discord`
  }

  const showAuthDialog = () => {
    authDialog.value = true
  }

  const cancelAuth = () => {}

  const hideAuthDialog = () => {
    authDialog.value = false
  }

  const showAuthFailure = (reason: string) => {
    failureReason.value = reason
    failureDialog.value = true
  }

  const hideFailureDialog = () => {
    failureDialog.value = false
    failureReason.value = ''
  }

  const showUserDialog = () => {
    if (loggedIn) {
      userDialog.value = true
    }
  }

  const hideUserDialog = () => {
    userDialog.value = false
  }

  const logout = () => {
    clear()
    router.push('/')
    hideUserDialog()
  }

  return {
    authDialog,
    failureReason,
    failureDialog,
    userDialog,
    showAuthDialog,
    requestAuth,
    cancelAuth,
    hideAuthDialog,
    showAuthFailure,
    hideFailureDialog,
    showUserDialog,
    hideUserDialog,
    logout,
  }
}