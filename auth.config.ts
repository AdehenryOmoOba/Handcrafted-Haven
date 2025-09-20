import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import type { User } from '@/lib/definitions';

const sql = postgres(process.env.POSTGRES_URL!, { 
  ssl: 'require',
  max: 1, // Limit connections in serverless environment
});

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

// Validate required environment variables
if (!process.env.AUTH_SECRET) {
  throw new Error('AUTH_SECRET is required but not defined');
}

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is required but not defined');
}

export const authConfig = {
  pages: {
    signIn: '/login',
    signUp: '/register',
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true, // Trust all hosts in development
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAccount = nextUrl.pathname.startsWith('/account');
      const isOnCheckout = nextUrl.pathname.startsWith('/checkout');
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      const isOnRegister = nextUrl.pathname.startsWith('/register');

      // Protect dashboard routes (artisan only)
      if (isOnDashboard) {
        if (isLoggedIn && auth.user.role === 'artisan') return true;
        return false; // Redirect to login
      }
      
      // Protect account and checkout routes (any authenticated user)
      if (isOnAccount || isOnCheckout) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }

      // Redirect authenticated users away from login/register
      if ((isOnLogin || isOnRegister) && isLoggedIn) {
        if (auth.user.role === 'artisan') {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
        return Response.redirect(new URL('/account', nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        // Include user role and additional info in the token
        token.role = user.role;
        token.email_verified = user.email_verified;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        // Include user role and additional info in the session
        session.user.role = token.role;
        session.user.email_verified = token.email_verified;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ 
            email: z.string().email(), 
            password: z.string().min(6) 
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          
          if (!user) return null;
          
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            // Return user without password
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;