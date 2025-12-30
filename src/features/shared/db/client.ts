import { serverEnv } from "@/config/env"
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

const sql = neon(serverEnv.DATABASE_URL)
export const db = drizzle(sql, { casing: 'snake_case' })