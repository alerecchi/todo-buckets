import { db } from '@/features/shared/db/client'
import { buckets } from '@/features/shared/db/schema'
import { createServerFn } from '@tanstack/react-start'

export const getBuckets = createServerFn().handler(async () => {
  return db.select().from(buckets) //TODO where userId
})
