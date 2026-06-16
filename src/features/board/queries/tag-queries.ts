import { queryOptions } from '@tanstack/react-query'

import { TAGS_QUERY_KEY } from '@/features/board/queries/query-keys'
import { listTags } from '@/server/functions/tags'

export const getTagsQueryOptions = queryOptions({
  queryKey: [TAGS_QUERY_KEY],
  queryFn: () => listTags(),
})
