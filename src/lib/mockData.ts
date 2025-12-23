import { Todo } from '@/types/Todo'

export const todoItem: Todo = {
  id: '1',
  title: 'Sample Todo Item',
  description: 'This is a sample description for the todo item.',
  completed: false,
  bucketId: '0',
}

export const mockTodoList: Todo[] = Array.from({ length: 15 }, (_, i) => ({
  ...todoItem,
  id: `${i}`,
  title: `Sample Todo Item ${i}`,
  bucketId: `${i % 5}`,
}))