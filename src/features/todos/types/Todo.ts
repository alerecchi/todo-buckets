import { z } from 'zod'

export const todoSchema = z.object({
  id: z.int(),
  title: z.string().min(1),
  completed: z.boolean(),
  createdAt: z.iso.datetime(),
  bucketId: z.int(),
})

export type Todo = z.infer<typeof todoSchema>
