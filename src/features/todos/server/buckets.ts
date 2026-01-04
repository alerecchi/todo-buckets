import { createServerFn } from '@tanstack/react-start'
import { db } from '@/features/shared/db/client'
import { buckets } from '@/features/shared/db/schema'

export const getBuckets = createServerFn().handler(async () => {
  return db.select().from(buckets) // TODO where userId
})
