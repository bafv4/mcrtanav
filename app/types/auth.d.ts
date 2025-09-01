export interface User {
  id: string
  name: string
  avatar: string
  authority: string[]
}

declare module '#auth-utils' {
  interface User {
    id: string
    name: string  
    avatar: string
    authority: string[]
  }

  interface UserSession {
    user: User
    loggedInAt: string
  }
}