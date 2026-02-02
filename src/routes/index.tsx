import { createFileRoute } from '@tanstack/react-router'
import { BucketList } from '@/components/todos/board'
import { getBucketsQueryOptions } from '@/server/queries/todo-queries'

export const Route = createFileRoute('/')({
  loader: ({ context }) =>
    // Preloading buckets if SSR is enabled
    context.queryClient.ensureQueryData(getBucketsQueryOptions),
  component: App,
})

function App() {
  return (
    <div>
      <BucketList />
    </div>
  )
}
