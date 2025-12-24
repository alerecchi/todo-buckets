import { createFileRoute } from '@tanstack/react-router'
import { BucketList } from '@/features/todos/components/BucketList'
import { bucketList } from '@/lib/mockData'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div>
      <BucketList bucketList={bucketList} />
    </div>
  )
}
