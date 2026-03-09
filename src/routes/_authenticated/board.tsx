import { createFileRoute } from '@tanstack/react-router'

import { redirectIfNotAuthenticated } from '@/lib/utils/auth'

export const Route = createFileRoute('/_authenticated/board')({
  beforeLoad: ({ context, location }) => {
    redirectIfNotAuthenticated(context.user, location.href)
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/board"!</div>
}
