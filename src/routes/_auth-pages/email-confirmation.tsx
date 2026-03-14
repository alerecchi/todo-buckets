import EmailConfirmation from '@features/authentication/components/email-confirmation'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-pages/email-confirmation')({
  beforeLoad: ({ context }) => {
    if (context.user?.emailVerified) {
      throw redirect({ to: '/board' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <EmailConfirmation />
}
