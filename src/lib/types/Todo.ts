import { z } from 'zod'

export const TodoSchema = z.object({
  id: z.int(),
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(), // TODO make it a type / enum (maybe shared between client & server)
  completed: z.boolean(),
  createdAt: z.date(),
  bucketId: z.int(),
})

export type Todo = z.infer<typeof TodoSchema>
