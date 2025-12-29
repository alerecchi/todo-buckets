import { Todo } from '@/features/todos/types/Todo'
import { Bucket } from '@/features/todos/types/Bucket'

export const todoItem: Todo = {
  id: 1,
  title: 'Sample Todo Item',
  completed: false,
  createdAt: '2020-01-01T06:15:00.123Z',
  bucketId: 0,
}

function getMockTodoList(startIndex: number, bucketId: number): Todo[] {
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
    id: 0,
    name: 'Bucket 0',
    period: 'test',
    type: 'inbox',
    todos: getMockTodoList(0, 0),
  },
  '1': {
    id: 1,
    name: 'Bucket 1',
    period: 'test',
    type: 'inbox',
    todos: getMockTodoList(5, 1),
  },
  '2': {
    id: 2,
    name: 'Bucket 2',
    period: 'test',
    type: 'inbox',
    todos: getMockTodoList(10, 2),
  },
  '3': {
    id: 3,
    name: 'Bucket 3',
    period: 'test',
    type: 'inbox',
    todos: getMockTodoList(15, 3),
  },
  '4': {
    id: 4,
    name: 'Bucket 4',
    period: 'test',
    type: 'inbox',
    todos: getMockTodoList(20, 4),
  },
}
