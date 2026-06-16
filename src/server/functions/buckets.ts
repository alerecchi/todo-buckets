import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'

import { db } from '@/server/db/client'
import { buckets } from '@/server/db/schema/schema'
import { authRequiredMiddleware } from '@/server/middlewares/auth-middleware'

export const getBuckets = createServerFn()
  .middleware([authRequiredMiddleware])
  .handler(async ({ context }) => {
    return db
      .select()
      .from(buckets)
      .where(and(eq(buckets.userId, context.session.user.id), eq(buckets.status, 'active')))
  })

// TODO: think if the parent folder should be called functions / fn / api / apis
