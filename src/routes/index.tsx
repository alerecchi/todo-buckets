import { Button } from '@shared/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

import { authClient } from '@/features/authentication/auth-client'
import { redirectIfAuthenticated } from '@/features/authentication/utils/redirects'
import { getBucketsQueryOptions } from '@/features/board/queries/todo-queries'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    redirectIfAuthenticated(context.user)
  },
  loader: ({ context }) =>
    // Preloading buckets if SSR is enabled
    context.queryClient.ensureQueryData(getBucketsQueryOptions),
  component: App,
})

function App() {
  return (
    <div>
      {/* <BucketList /> */}
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
