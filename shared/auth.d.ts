// shared/auth.d.ts
declare module '#auth-utils' {
    interface User {
        id: string
        name: string
        avatar: string
        authority: string[]
    }

    interface UserSession {
        loggedInAt?: string
    }
}

export { }