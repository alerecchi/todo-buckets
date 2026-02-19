import AuthContainer, { AuthTab } from '@/components/authentication/auth-container'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-pages/login')({
  beforeLoad: ({ context }) => {
    if (context.user) {
      if (context.user.emailVerified) {
        throw redirect({ to: '/board' })
      } else {
        throw redirect({ to: '/email_confirmation' })
      }
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <AuthContainer initialTab={AuthTab.LOGIN} />
}
