import { z } from 'zod'

const EnvSchema = z.object({
  DATABASE_URL: z.string(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
})

const clientEnvSchema = z.object({
  VITE_APP_NAME: z.string(),
  VITE_SERVER_URL: z.url(),
})

// Validate server environment
export const serverEnv = EnvSchema.parse(process.env)

// Validate client environment
export const clientEnv = clientEnvSchema.parse(import.meta.env)
