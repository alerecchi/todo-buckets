import { z } from 'zod'
import { todoSchema } from './Todo'

export const bucketSchema = z.object({
  id: z.uuid(),
  period: z.string().min(1),
  type: z.enum(['inbox', 'yearly', 'monthly', 'weekly', 'daily']),
  todos: z.array(todoSchema),
})

export type Bucket = z.infer<typeof bucketSchema>
