import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { betterAuth } from 'better-auth/minimal'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { db } from './db/client'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // cache for 5 minutes
    },
  },
  experimental: { joins: true },
  plugins: [tanstackStartCookies()],
})
