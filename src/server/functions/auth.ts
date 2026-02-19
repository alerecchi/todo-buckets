import { auth } from '@/server/auth'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

export const getUserSession = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()

  if (!request?.headers) {
    return null
  }

  try {
    return await auth.api.getSession({ headers: request.headers })
  } catch(error) {
    console.log(error) // TODO add some logging / tracing mechanism
    return null
  }
})
