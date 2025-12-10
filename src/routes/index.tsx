import { createFileRoute } from '@tanstack/react-router'
import { Todo } from '@/types/Todo'
import { Bucket } from '@/types/Bucket'
import { BucketList } from '@/components/features/BucketList'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const todoItem: Todo = {
    id: 1,
    title: 'Sample Todo',
    description: 'This is a sample todo item',
    completed: false,
  }
  const bucketItem: Bucket = {
    id: 1,
    name: 'Sample Bucket',
    todos: [todoItem, todoItem],
  }
  return (
    <div>
      <BucketList bucketList={[bucketItem, bucketItem, bucketItem, bucketItem, bucketItem]} />
    </div>
  )
}
