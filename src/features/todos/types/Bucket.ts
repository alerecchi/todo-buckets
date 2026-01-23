import { z } from 'zod'

// TODO right now there is no difference with the db type, see if it's worth keeping this
export const BucketSchema = z.object({
  id: z.int(),
  period: z.string().min(1),
  type: z.enum(['inbox', 'yearly', 'monthly', 'weekly', 'daily']),
  userId: z.string(),
})

export type Bucket = z.infer<typeof BucketSchema>
