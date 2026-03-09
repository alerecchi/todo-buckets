import { createFileRoute, redirect } from '@tanstack/react-router'

import EmailConfirmation from '@/components/authentication/email-confirmation'

export const Route = createFileRoute('/_auth-pages/email-confirmation')({
  beforeLoad: ({ context }) => {
    if (context?.user?.emailVerified) {
      throw redirect({ to: '/board' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <EmailConfirmation />
}
