import { useMutation, useQueryClient } from '@tanstack/react-query'

import { CATEGORIES_QUERY_KEY, TODOS_QUERY_KEY } from '@/features/board/queries/query-keys'
import type { CategoryDisplay } from '@/lib/types/Category'
import type { Todo } from '@/lib/types/Todo'
import { updateCategory } from '@/server/functions/categories'

type CategoryWithUser = CategoryDisplay & {
  userId?: string
}

export default function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (category: CategoryWithUser) => {
      queryClient.setQueryData<Array<CategoryWithUser>>([CATEGORIES_QUERY_KEY], (old = []) =>
        old
          .map((cachedCategory) => (cachedCategory.id === category.id ? category : cachedCategory))
          .toSorted((a, b) => a.name.localeCompare(b.name)),
      )
      queryClient.setQueriesData<Array<Todo>>({ queryKey: [TODOS_QUERY_KEY] }, (old = []) =>
        old.map((todo) =>
          todo.category?.id === category.id
            ? {
                ...todo,
                category: {
                  colorKey: category.colorKey,
                  id: category.id,
                  name: category.name,
                },
              }
            : todo,
        ),
      )
    },
  })
}
