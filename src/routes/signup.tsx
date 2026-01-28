import AuthContainer from '@/components/authentication/auth-container'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AuthContainer />
}
