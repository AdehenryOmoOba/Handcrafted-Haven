import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface User extends DefaultUser {
    role: 'customer' | 'artisan' | 'admin'
    email_verified: boolean
  }

  interface Session extends DefaultSession {
    user: {
      id: string
      role: 'customer' | 'artisan' | 'admin'
      email_verified: boolean
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: 'customer' | 'artisan' | 'admin'
    email_verified: boolean
  }
}