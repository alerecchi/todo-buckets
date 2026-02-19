import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/board')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/login' })
    } else if (!context.user.emailVerified) {
      throw redirect({ to: '/email_confirmation' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/board"!</div>
}
