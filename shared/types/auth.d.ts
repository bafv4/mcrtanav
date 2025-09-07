export interface User {
  id: string
  name: string
  avatar: string
  authorities: string[]
}

declare module '#auth-utils' {
  interface User {
    id: string
    name: string  
    avatar: string
    authorities: string[]
  }

  interface UserSession {
    user: User
    loggedInAt: string
  }
}