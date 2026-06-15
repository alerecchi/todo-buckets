import { useMutation, useQueryClient } from '@tanstack/react-query'

import { TAGS_QUERY_KEY } from '@/features/board/queries/query-keys'
import type { TagDisplay } from '@/lib/types/Tag'
import { createTag } from '@/server/functions/tags'

export default function useCreateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTag,
    onSuccess: (tag: TagDisplay) => {
      queryClient.setQueryData<Array<TagDisplay>>([TAGS_QUERY_KEY], (old = []) => {
        const existingIndex = old.findIndex((cachedTag) => cachedTag.id === tag.id)

        if (existingIndex >= 0) {
          return old.map((cachedTag) => (cachedTag.id === tag.id ? tag : cachedTag))
        }

        return [...old, tag].toSorted((a, b) => a.name.localeCompare(b.name))
      })
    },
  })
}
