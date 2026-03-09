import { redirectIfNotAuthenticated } from '@/lib/utils/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/board')({
  beforeLoad: ({ context, location }) => {
    redirectIfNotAuthenticated(context.user, location.href)
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/board"!</div>
}
