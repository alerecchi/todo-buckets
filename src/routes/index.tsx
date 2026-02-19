import { BucketList } from '@/components/todos/board'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { getBucketsQueryOptions } from '@/server/queries/todo-queries'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  loader: ({ context }) =>
    // Preloading buckets if SSR is enabled
    context.queryClient.ensureQueryData(getBucketsQueryOptions),
  component: App,
})

function App() {
  // TODO think about what github does, home page is either landing or "dashboard" based on user existing or not (no spefic dashboard link/route)
  return (
    <div>
      <BucketList />
      <Button
        onClick={() => {
          authClient.signOut()
        }}
      >
        Sign out
      </Button>
    </div>
  )
}
