import AuthContainer, { AuthTab } from '@/components/authentication/auth-container'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AuthContainer initialTab={AuthTab.LOGIN} />
}
