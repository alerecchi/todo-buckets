import { createFileRoute } from '@tanstack/react-router'
import { BucketList } from '@/features/todos/components/Board'
import { getBuckets } from '@/features/todos/server/getBuckets'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

const postQuery = queryOptions({
  queryKey: ['post'],
  queryFn: () => getBuckets(),
})

export const Route = createFileRoute('/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(postQuery),
  component: App,
})

function App() {
  const { data } = useSuspenseQuery(postQuery)
  console.log(data)
  return (
    <div>
      <BucketList />
    </div>
  )
}
