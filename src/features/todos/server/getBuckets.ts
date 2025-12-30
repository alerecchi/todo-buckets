import { db } from '@/features/shared/db/client'
import { bucketsTable } from '@/features/shared/db/schema'
import { createServerFn } from '@tanstack/react-start'

export const getBuckets = createServerFn().handler(async () => {
  return db.select().from(bucketsTable) //TODO where userId
})
