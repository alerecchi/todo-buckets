import { createFileRoute } from '@tanstack/react-router'
import { BucketList } from '@/components/features/BucketList'
import { bucketList } from '@/lib/mockData'
import { Button } from "@/components/ui/button"

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div>
      <BucketList bucketList={bucketList} />
      <input type="text" placeholder="Add a new todo item" />
      <Button>Add Todo</Button>
    </div>
  )
}
