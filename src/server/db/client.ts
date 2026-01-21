import { neon } from '@neondatabase/serverless'
import { serverEnv } from '@/config/env'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '@server/db/schema'

const sql = neon(serverEnv.DATABASE_URL)
export const db = drizzle(sql, { schema }) //TODO why do I have to add schema? would it work if I have a folder `schema` with an index.ts and remove this?
