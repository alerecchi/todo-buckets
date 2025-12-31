import { z } from 'zod'

export const TodoSchema = z.object({
  id: z.int(),
  title: z.string().min(1),
  completed: z.boolean(),
  createdAt: z.date(),
  bucketId: z.int(),
})

export type Todo = z.infer<typeof TodoSchema>
