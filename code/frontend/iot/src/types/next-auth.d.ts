// types/next-auth.d.ts
import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as
   * a prop on the `SessionProvider` React Context
   */
  interface Session {
    refreshTokenExpires?: number
    accessTokenExpires?: string
    refreshToken?: string
    token?: string
    error?: string
    user?: User
    jwt?: string
    id?: string
  }

  interface User {
    firstName?: string
    lastName?: string
    email?: string | null
    id?: string
    token?: string
    contactAddress?: {
      id?: string
    }
  }
}
