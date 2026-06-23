import { z } from 'zod'

import { CategoryDisplaySchema } from '@/lib/types/Category'
import { TagDisplaySchema } from '@/lib/types/Tag'

export const TodoSchema = z.object({
  id: z.int(),
  title: z.string().min(1),
  description: z.string(),
  category: CategoryDisplaySchema.nullable(),
  categoryId: z.int().nullable(),
  completed: z.boolean(),
  position: z.int(),
  createdAt: z.date(),
  bucketId: z.int(),
  tags: z.array(TagDisplaySchema),
})

export type Todo = z.infer<typeof TodoSchema>
