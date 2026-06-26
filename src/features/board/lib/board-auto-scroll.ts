type PointerPosition = {
  x: number
  y: number
}

type ScrollTodoBoardInput = {
  board?: HTMLElement | null
  bucketLists: Array<HTMLElement>
  currentBucketId?: number
  pointer?: PointerPosition | null
}

const EDGE_SCROLL_THRESHOLD_PX = 48
const EDGE_SCROLL_STEP_PX = 24

export function scrollTodoBoard({ board, bucketLists, currentBucketId, pointer }: ScrollTodoBoardInput) {
  if (!pointer) {
    return
  }

  if (board) {
    scrollNearHorizontalEdges(board, pointer)
  }

  const currentBucketList = bucketLists.find((bucketList) => bucketList.dataset.bucketId === String(currentBucketId))

  if (currentBucketList) {
    scrollNearVerticalEdges(currentBucketList, pointer)
  }
}

function scrollNearHorizontalEdges(element: HTMLElement, pointer: PointerPosition) {
  const rect = element.getBoundingClientRect()

  if (pointer.y < rect.top || pointer.y > rect.bottom) {
    return
  }

  if (pointer.x - rect.left < EDGE_SCROLL_THRESHOLD_PX) {
    scrollElementBy(element, { left: -EDGE_SCROLL_STEP_PX })
    return
  }

  if (rect.right - pointer.x < EDGE_SCROLL_THRESHOLD_PX) {
    scrollElementBy(element, { left: EDGE_SCROLL_STEP_PX })
  }
}

function scrollNearVerticalEdges(element: HTMLElement, pointer: PointerPosition) {
  const rect = element.getBoundingClientRect()

  if (pointer.x < rect.left || pointer.x > rect.right) {
    return
  }

  if (pointer.y - rect.top < EDGE_SCROLL_THRESHOLD_PX) {
    scrollElementBy(element, { top: -EDGE_SCROLL_STEP_PX })
    return
  }

  if (rect.bottom - pointer.y < EDGE_SCROLL_THRESHOLD_PX) {
    scrollElementBy(element, { top: EDGE_SCROLL_STEP_PX })
  }
}

function scrollElementBy(element: HTMLElement, delta: { left?: number; top?: number }) {
  if (typeof element.scrollBy === 'function') {
    element.scrollBy(delta)
    return
  }

  element.scrollLeft += delta.left ?? 0
  element.scrollTop += delta.top ?? 0
}
