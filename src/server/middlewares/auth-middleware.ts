import { createMiddleware } from '@tanstack/react-start'

import { getUserSession } from '@/server/functions/auth'

export const authRequiredMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getUserSession()
  if (!session?.user) {
    throw new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return next({ context: { session } })
})
