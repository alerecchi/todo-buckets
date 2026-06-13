import { useMutation, useQueryClient } from '@tanstack/react-query'

import { CATEGORIES_QUERY_KEY } from '@/features/board/queries/query-keys'
import type { CategoryDisplay } from '@/lib/types/Category'
import { createCategory } from '@/server/functions/categories'

type CategoryWithUser = CategoryDisplay & {
  userId?: string
}

export default function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (category: CategoryWithUser) => {
      queryClient.setQueryData<Array<CategoryWithUser>>([CATEGORIES_QUERY_KEY], (old = []) => {
        const existingIndex = old.findIndex((cachedCategory) => cachedCategory.id === category.id)

        if (existingIndex >= 0) {
          return old.map((cachedCategory) => (cachedCategory.id === category.id ? category : cachedCategory))
        }

        return [...old, category].toSorted((a, b) => a.name.localeCompare(b.name))
      })
    },
  })
}
