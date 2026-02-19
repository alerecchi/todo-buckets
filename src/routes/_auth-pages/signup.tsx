import AuthContainer, { AuthTab } from '@/components/authentication/auth-container'
import { redirectIfAuthenticated } from '@/utils/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-pages/signup')({
  beforeLoad: ({ context }) => {
    redirectIfAuthenticated(context.user)
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <AuthContainer initialTab={AuthTab.SIGNUP} />
}
