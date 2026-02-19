import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-pages/email_confirmation')({
  beforeLoad: ({ context }) => {
    // TODO extract the various redirects into common functions
    if (!context.user) {
      throw redirect({ to: '/login' }) //TODO verify, maybe I can confirm email even if I'm not logged in
    } else if (context.user.emailVerified) {
      throw redirect({ to: '/board', replace: true })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  // TODO implement email confirmation
  return <div>Hello "/_auth-pages/email_confirmation"!</div>
}
