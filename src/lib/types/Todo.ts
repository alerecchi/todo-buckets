import { z } from 'zod'

import { CategoryDisplaySchema } from '@/lib/types/Category'

export const TodoSchema = z.object({
  id: z.int(),
  title: z.string().min(1),
  description: z.string(),
  category: CategoryDisplaySchema.nullable(),
  categoryId: z.int().nullable(),
  completed: z.boolean(),
  createdAt: z.date(),
  bucketId: z.int(),
})

export type Todo = z.infer<typeof TodoSchema>
