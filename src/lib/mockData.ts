import { Bucket } from '@/types/Bucket'
import { Todo } from '@/types/Todo'

export const todoItem: Todo = {
  id: '1',
  title: 'Sample Todo Item',
  description: 'This is a sample description for the todo item.',
  completed: false,
}

export const bucketItem: Bucket = {
  id: '1',
  name: 'Sample Bucket',
  todos: Array.from({ length: 3 }, (_, i) => ({
    ...todoItem,
    id: `${i + 1}`,
  })),
}

export const bucketList: Bucket[] = Array.from({ length: 5 }, (_, i) => ({
  ...bucketItem,
  id: `${i}`,
}))
