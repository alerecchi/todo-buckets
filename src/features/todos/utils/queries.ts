import { queryOptions } from '@tanstack/react-query'
import { getBuckets } from '../server/buckets'
import { getTodos } from '../server/todos'

export const BUCKETS_QUERY_KEY = 'buckets'
export const TODOS_QUERY_KEY = 'todos'

export const getBucketsQueryOptions = queryOptions({
  queryKey: [BUCKETS_QUERY_KEY],
  queryFn: () => getBuckets(),
})

export const getTodosQueryOptions = (bucketId: number) =>
  queryOptions({
    queryKey: [TODOS_QUERY_KEY, bucketId],
    queryFn: () => getTodos({ data: { bucketId: bucketId } }),
  })
