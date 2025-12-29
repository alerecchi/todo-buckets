import { z } from 'zod';

export const todoSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1),
  completed: z.boolean(),
  bucketId: z.uuid(),
});

export type Todo = z.infer<typeof todoSchema>;