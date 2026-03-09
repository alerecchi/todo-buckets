import { createFileRoute } from '@tanstack/react-router'

import AuthContainer, { AuthTab } from '@/components/authentication/auth-container'
import { redirectIfAuthenticated } from '@/lib/utils/auth'

export const Route = createFileRoute('/_auth-pages/login')({
  beforeLoad: ({ context }) => {
    redirectIfAuthenticated(context.user)
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <AuthContainer activeTab={AuthTab.LOGIN} />
}
