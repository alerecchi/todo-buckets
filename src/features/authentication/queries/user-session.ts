import { queryOptions } from '@tanstack/react-query'

import { getUserSession } from '@/server/functions/auth'

// TODO: I don't like the name of this, esp if I use the key in other places like login
export const userSessionQuery = {
  key: ['auth', 'session'],
  options: () =>
    queryOptions({
      queryKey: userSessionQuery.key,
      queryFn: getUserSession,
      staleTime: 1000 * 60 * 15, // Cache for 15 minutes
      // TODO: find the right staleTime
    }),
}
