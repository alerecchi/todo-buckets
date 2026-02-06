import { auth } from '@/server/auth'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

export const getUserSession = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()

  if (!request?.headers) {
    return null
  }

  const userSession = await auth.api.getSession({ headers: request.headers })
  return userSession
})
