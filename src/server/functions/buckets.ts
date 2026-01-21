import { createServerFn } from '@tanstack/react-start'
import { db } from '@/server/db/client'
import { buckets } from '@/server/db/schema/schema'

export const getBuckets = createServerFn().handler(async () => {
  return db.select().from(buckets) // TODO where userId
})

//TODO think if the parent folder should be called functions / fn / api / apis