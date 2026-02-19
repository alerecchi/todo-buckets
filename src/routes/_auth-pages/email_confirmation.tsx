import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-pages/email_confirmation')({
  beforeLoad: ({ context }) => {
    // TODO if token is not present then redirect home
  },
  component: RouteComponent,
})

function RouteComponent() {
  // TODO implement email confirmation
  return <div>Hello "/_auth-pages/email_confirmation"!</div>
}