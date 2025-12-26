import { BucketColumn } from './BucketColumn'
import { useCallback, useState } from 'react'
import { Todo } from '@/types/Todo'
import { Button } from '@/features/shared/components/ui/button'
import { Bucket } from '@/types/Bucket'
import { mockBuckets } from '@/lib/mockData'

export function BucketList() {
  const [buckets, setBuckets] = useState<Record<string, Bucket>>(mockBuckets)

  const addTodo = useCallback((todo: string, bucketId: string) => {
    setBuckets((prev) => {
      const newTodo: Todo = {
        id: (Math.random() * 100).toString(),
        title: todo,
        description: '',
        completed: false,
        bucketId: bucketId,
      }
      const bucket = prev[bucketId]
      return {
        ...prev,
        [bucketId]: { ...bucket, todos: [...bucket.todos, newTodo] },
      }
    })
  }, [])

  const removeTodo = useCallback((todoId: string, bucketId: string) => {
    setBuckets((prev) => {
      const bucket = prev[bucketId]
      return {
        ...prev,
        [bucketId]: {
          ...bucket,
          todos: bucket.todos.filter((value) => value.id !== todoId),
        },
      }
    })
  }, [])

  const toggleTodo = useCallback((todoId: string, bucketId: string) => {
    setBuckets((prev) => {
      const bucket = prev[bucketId]
      return {
        ...prev,
        [bucketId]: {
          ...bucket,
          todos: bucket.todos.map((value) =>
            value.id === todoId
              ? { ...value, completed: !value.completed }
              : value,
          ),
        },
      }
    })
  }, [])

  //TODO: this is for demo purpose only
  const moveTodo = useCallback((todoId: string) => {
    setBuckets((prev) => {
      const bucket = prev['0']
      const nextBucket = prev['1']
      const todo: Todo = bucket.todos.find((t) => t.id === todoId)!!
      return {
        ...prev,
        ['0']: {
          ...bucket,
          todos: bucket.todos.filter((value) => value.id !== todoId),
        },
        ['1']: {
          ...nextBucket,
          todos: [...nextBucket.todos, { ...todo, bucketId: '1' }],
        },
      }
    })
  }, [])

  const bucketList = Object.values(buckets).sort(
    (a, b) => Number(a.id) - Number(b.id),
  )

  return (
    <div className="container mx-auto grid grid-cols-5 gap-4">
      {bucketList.map((bucket) => (
        <BucketColumn
          key={bucket.id}
          bucket={bucket}
          addTodo={addTodo}
          removeTodo={removeTodo}
          toggleTodo={toggleTodo}
        />
      ))}
      <div>
        <Button onClick={() => moveTodo(buckets['0'].todos[0].id)}>
          move todo
        </Button>
      </div>
    </div>
  )
}
