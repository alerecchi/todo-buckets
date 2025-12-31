import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
})

// Validate server environment
export const serverEnv = envSchema.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly DATABASE_URL: string
    }
  }
}
