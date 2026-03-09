import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

import { auth } from '@/server/auth'

export const getUserSession = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  return await auth.api.getSession({ headers: request.headers })
})
