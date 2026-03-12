import { neon } from '@neondatabase/serverless'
import * as schema from '@server/db/schema'
import { drizzle } from 'drizzle-orm/neon-http'

import { serverEnv } from '@/config/env'

const sql = neon(serverEnv.DATABASE_URL)
export const db = drizzle(sql, { schema }) // TODO why do I have to add schema? would it work if I have a folder `schema` with an index.ts and remove this?
// TODO review what this sentence from better auth means "Additionally, you're required to pass each relation through the drizzle adapter schema object." Code rabbit suggests to add  schema: schema,  // ← Add this (import from '@server/db/schema') to betterauth configuration
