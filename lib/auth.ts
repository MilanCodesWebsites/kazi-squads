import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { SupabaseAdapter } from '@next-auth/supabase-adapter'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env var: ${name}`)
  }
  return value
}

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: requireEnv('SUPABASE_URL'),
    secret: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  }),
  providers: [
    GoogleProvider({
      clientId: requireEnv('GOOGLE_CLIENT_ID'),
      clientSecret: requireEnv('GOOGLE_CLIENT_SECRET'),
      // Optional, but recommended when using Google auth.
      // You can also set this in the Google Cloud Console.
      allowDangerousEmailAccountLinking: false,
    }),
  ],
  session: {
    strategy: 'database',
  },
  pages: {
    signIn: '/auth',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        ;(session.user as any).id = (user as any).id
      }
      return session
    },
  },
}
