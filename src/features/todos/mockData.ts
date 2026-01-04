import type { Todo } from '@/features/todos/types/Todo'
import type { Bucket } from '@/features/todos/types/Bucket'

export const todoItem: Todo = {
  id: 1,
  title: 'Sample Todo Item',
  completed: false,
  createdAt: '2020-01-01T06:15:00.123Z',
  bucketId: 0,
}

function getMockTodoList(startIndex: number, bucketId: number): Array<Todo> {
  return Array.from({ length: 5 }, (_, i) => ({
    ...todoItem,
    id: i + startIndex,
    title: `Sample Todo Item ${i + startIndex}`,
    completed: false,
    createdAt: '2020-01-01T06:15:00.123Z',
    bucketId: bucketId,
  }))
}

export const mockBuckets: Record<string, Bucket> = {
  '0': {
    id: 6,
    name: 'Bucket 0',
    period: 'test',
    type: 'inbox',
    todos: getMockTodoList(0, 0),
  },
  '1': {
    id: 7,
    name: 'Bucket 1',
    period: 'test',
    type: 'yearly',
    todos: getMockTodoList(5, 1),
  },
  '2': {
    id: 8,
    name: 'Bucket 2',
    period: 'test',
    type: 'monthly',
    todos: getMockTodoList(10, 2),
  },
  '3': {
    id: 9,
    name: 'Bucket 3',
    period: 'test',
    type: 'weekly',
    todos: getMockTodoList(15, 3),
  },
  '4': {
    id: 10,
    name: 'Bucket 4',
    period: 'test',
    type: 'daily',
    todos: getMockTodoList(20, 4),
  },
}
