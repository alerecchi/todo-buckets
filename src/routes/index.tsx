import { createFileRoute } from '@tanstack/react-router'
import { BucketList } from '@/features/todos/components/BucketList'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div>
      <BucketList />
    </div>
  )
}
