import { BucketColumn } from './BucketColumn'
import { useState } from 'react'
import { mockTodoList } from '@/lib/mockData'
import { Todo } from '@/types/Todo'
import { Button } from '@/features/shared/components/ui/button'
import { Bucket } from '@/types/Bucket'

export function BucketList() {
  let [todoList, setTodoList] = useState(mockTodoList)

  const addTodo = (todo: string) => {
    const newTodo: Todo = {
      id: (Math.random() * 100).toString(),
      title: todo,
      description: '',
      completed: false,
      bucketId: '0',
    }
    setTodoList([...todoList, newTodo])
  }

  const removeTodo = (todoId: string) => {
    const newTodoList = todoList.filter((value) => value.id != todoId)
    setTodoList(newTodoList)
  }

  const toggleTodo = (todoId: string) => {
    const newTodoList = todoList.map((value) => {
      if (value.id === todoId) {
        return (value = {
          ...value,
          completed: !value.completed,
        })
      } else {
        return value
      }
    })
    setTodoList(newTodoList)
  }

  const moveTodo = (todoId: String) => {
    const newTodoList = todoList.map((value) => {
      if (value.id === todoId) {
        return (value = {
          ...value,
          bucketId: (Number(value.bucketId) + 1).toString(),
        })
      } else {
        return value
      }
    })
    setTodoList(newTodoList)
  }

  const todoMap = new Map<string, Todo[]>()
  for (const todo of todoList) {
    const arr = todoMap.get(todo.bucketId)
    if (arr) arr.push(todo)
    else todoMap.set(todo.bucketId, [todo])
  }

  const bucketList: Bucket[] = []
  todoMap.forEach((todos, bucketId) => {
    const bucket: Bucket = {
      id: bucketId,
      todos: todos,
      name: `Bucket ${bucketId}`,
    }
    bucketList.push(bucket)
  })
  bucketList.sort((a, b) => Number(a.id) - Number(b.id))

  return (
    <div className="container mx-auto grid grid-cols-5 gap-4">
      {bucketList.map((bucket) => (
        <BucketColumn key={bucket.id} bucket={bucket} addTodo={addTodo} removeTodo={removeTodo} toggleTodo={toggleTodo} />
      ))}
      <div>
        <Button onClick={() => moveTodo(todoList[0].id)}>move todo</Button>
      </div>
    </div>
  )
}
