import AuthContainer, { AuthTab } from '@features/authentication/components/auth-container'
import { createFileRoute } from '@tanstack/react-router'

import { redirectIfAuthenticated } from '@/features/authentication/utils/redirects'

export const Route = createFileRoute('/_auth-pages/signup')({
  beforeLoad: ({ context }) => {
    redirectIfAuthenticated(context.user)
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <AuthContainer activeTab={AuthTab.SIGNUP} />
}
