import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
})

// Validate server environment
export const serverEnv = envSchema.parse(process.env)
