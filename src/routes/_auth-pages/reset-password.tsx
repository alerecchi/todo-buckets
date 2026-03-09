import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

import ResetPasswordContainer from '@/components/authentication/reset-password-container'

const passwordResetSchema = z.object({
  token: z.string().optional(),
  error: z.string().optional(),
})

export const Route = createFileRoute('/_auth-pages/reset-password')({
  validateSearch: passwordResetSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const context = Route.useRouteContext()
  const search = Route.useSearch()
  return (
    <ResetPasswordContainer
      userEmail={context.user?.email}
      emailVerified={context.user?.emailVerified}
      token={search.token}
      tokenError={search.error !== undefined}
    />
  )
}
