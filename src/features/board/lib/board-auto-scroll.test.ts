import { describe, expect, it, vi } from 'vitest'

import { scrollTodoBoard } from '@/features/board/lib/board-auto-scroll'

describe('Todo board auto-scroll', () => {
  it('scrolls only the current Bucket Todo list vertically near its edge', () => {
    const sourceList = createScrollableElement({
      bottom: 500,
      bucketId: '2',
      left: 0,
      right: 320,
      top: 100,
    })
    const currentList = createScrollableElement({
      bottom: 500,
      bucketId: '3',
      left: 344,
      right: 664,
      top: 100,
    })

    scrollTodoBoard({
      bucketLists: [sourceList, currentList],
      currentBucketId: 3,
      pointer: { x: 500, y: 488 },
    })

    expect(sourceList.scrollBy).not.toHaveBeenCalled()
    expect(currentList.scrollBy).toHaveBeenCalledWith({ top: 24 })
  })

  it('scrolls the board horizontally near its right edge', () => {
    const board = createScrollableElement({
      bottom: 600,
      left: 0,
      right: 800,
      top: 0,
    })

    scrollTodoBoard({
      board,
      bucketLists: [],
      pointer: { x: 790, y: 300 },
    })

    expect(board.scrollBy).toHaveBeenCalledWith({ left: 24 })
  })

  it('does not scroll a Bucket Todo list when the pointer is outside that list horizontally', () => {
    const currentList = createScrollableElement({
      bottom: 500,
      bucketId: '3',
      left: 344,
      right: 664,
      top: 100,
    })

    scrollTodoBoard({
      bucketLists: [currentList],
      currentBucketId: 3,
      pointer: { x: 700, y: 488 },
    })

    expect(currentList.scrollBy).not.toHaveBeenCalled()
  })
})

function createScrollableElement({
  bottom,
  bucketId,
  left,
  right,
  top,
}: {
  bottom: number
  bucketId?: string
  left: number
  right: number
  top: number
}) {
  const element = document.createElement('div')
  if (bucketId) {
    element.dataset.bucketId = bucketId
  }
  element.scrollBy = vi.fn()
  element.getBoundingClientRect = () =>
    ({
      bottom,
      height: bottom - top,
      left,
      right,
      top,
      width: right - left,
      x: left,
      y: top,
    }) as DOMRect

  return element
}
