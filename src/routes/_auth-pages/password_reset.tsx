import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-pages/password_reset')({
  component: RouteComponent,
})

function RouteComponent() {
  // TODO implement password reset flow
  return <div>Hello "/_auth-pages/password_reset"!</div>
}
