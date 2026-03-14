import { createFileRoute } from '@tanstack/react-router'

import { redirectIfNotAuthenticated } from '@/features/authentication/utils/redirects'
import { Board } from '@/features/board/components/board'

export const Route = createFileRoute('/_authenticated/board')({
  beforeLoad: ({ context, location }) => {
    redirectIfNotAuthenticated(context.user, location.href)
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Board />
}
