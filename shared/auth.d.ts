// shared/auth.d.ts
declare module '#auth-utils' {
    interface User {
        id: string
        name: string
        roles: string[]     // ← ここを使いたいフィールドに合わせて拡張
    }

    interface UserSession {
        loggedInAt?: string
    }
}

export { }