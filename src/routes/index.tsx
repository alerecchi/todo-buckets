import { createFileRoute } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    // redirectIfAuthenticated(context.user) TODO re-enable before merging
  },
  /* loader: ({ context }) =>
    // Preloading buckets if SSR is enabled
    context.queryClient.ensureQueryData(getBucketsQueryOptions), */
  // TODO Check why this crashes the app
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
