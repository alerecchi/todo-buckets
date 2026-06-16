import { queryOptions } from '@tanstack/react-query'

import { CATEGORIES_QUERY_KEY } from '@/features/board/queries/query-keys'
import { listCategories } from '@/server/functions/categories'

export const getCategoriesQueryOptions = queryOptions({
  queryKey: [CATEGORIES_QUERY_KEY],
  queryFn: () => listCategories(),
})
