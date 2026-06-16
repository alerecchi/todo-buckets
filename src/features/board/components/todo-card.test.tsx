import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import TodoCard from '@/features/board/components/todo-card'
import type { Todo } from '@/lib/types/Todo'
import { render } from '@/test'

vi.mock('@/features/board/hooks/use-update-todo', () => ({
  useToggleTodo: () => ({
    mutate: vi.fn(),
  }),
}))

const todoWithCategory = {
  bucketId: 1,
  category: {
    colorKey: 'blue',
    id: 4,
    name: 'home admin',
  },
  categoryId: 4,
  completed: false,
  createdAt: new Date('2026-06-11T10:00:00.000Z'),
  description: '',
  id: 10,
  title: 'Pay rent',
} satisfies Todo

describe('TodoCard', () => {
  it('renders a Category name and color as the left border', () => {
    render(<TodoCard todo={todoWithCategory} />)

    const card = screen.getByText('Pay rent').closest('[data-slot="card"]')

    expect(screen.getByText('home admin')).toBeInTheDocument()
    expect(card).toHaveClass('border-l-4')
    expect(card).toHaveClass('[--todo-category-color:var(--color-blue-500)]')
    expect(card).toHaveClass('border-l-(--todo-category-color)')
  })

  it('mutes Category color styling when the Todo is completed', () => {
    render(<TodoCard todo={{ ...todoWithCategory, completed: true }} />)

    const card = screen.getByText('Pay rent').closest('[data-slot="card"]')

    expect(card).toHaveClass('border-l-4')
    expect(card).toHaveClass(
      'data-[completed=true]:border-l-[color-mix(in_oklab,var(--todo-category-color)_70%,transparent)]',
    )
  })

  it('uses the fallback color preset for unknown Category color keys', () => {
    render(
      <TodoCard
        todo={
          {
            ...todoWithCategory,
            category: {
              ...todoWithCategory.category,
              colorKey: 'legacy-color',
            },
          } as unknown as Todo
        }
      />,
    )

    const card = screen.getByText('Pay rent').closest('[data-slot="card"]')

    expect(card).toHaveClass('border-l-4')
    expect(card).toHaveClass('[--todo-category-color:var(--color-blue-500)]')
  })
})
