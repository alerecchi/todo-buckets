import { getUserSession } from '@/server/functions/auth'
import { createMiddleware } from '@tanstack/react-start'

export const authRequiredMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getUserSession()
  if (!session?.user) {
    throw new Error('Unauthorized') //TODO try: json({message: "Unauthorized"}, {status: 401}) to see if I actually get a 401
  } //TODO try +    throw new Response(JSON.stringify({ message: 'Unauthorized' }), {      status: 401, headers: { 'Content-Type': 'application/json' },  })
  return next({ context: { session } })
})
