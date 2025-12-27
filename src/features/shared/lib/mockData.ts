import { Todo } from '@/features/todos/types/Todo'
import { Bucket } from '@/features/todos/types/Bucket'

export const todoItem: Todo = {
  id: '1',
  title: 'Sample Todo Item',
  description: 'This is a sample description for the todo item.',
  completed: false,
  bucketId: '0',
}

function getMockTodoList(startIndex: number, bucketId: string): Todo[] {
  return Array.from({ length: 5 }, (_, i) => ({
    ...todoItem,
    id: `${i + startIndex}`,
    title: `Sample Todo Item ${i + startIndex}`,
    bucketId: bucketId,
  }))
}

export const mockBuckets: Record<string, Bucket> = {
  '0': { id: '0', name: 'Bucket 0', todos: getMockTodoList(0, '0') },
  '1': { id: '1', name: 'Bucket 1', todos: getMockTodoList(5, '1') },
  '2': { id: '2', name: 'Bucket 2', todos: getMockTodoList(10, '2') },
  '3': { id: '3', name: 'Bucket 3', todos: getMockTodoList(15, '3') },
  '4': { id: '4', name: 'Bucket 4', todos: getMockTodoList(20, '4') },
}
