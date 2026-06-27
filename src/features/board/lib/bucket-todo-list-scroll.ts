export function scrollBucketTodoListToEnd(bucketId: number) {
  if (typeof document === 'undefined' || typeof requestAnimationFrame === 'undefined') {
    return
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const bucketList = document.querySelector<HTMLElement>(`[data-bucket-todo-list][data-bucket-id="${bucketId}"]`)

      if (!bucketList || typeof bucketList.scrollTo !== 'function') {
        return
      }

      bucketList.scrollTo({ behavior: 'smooth', top: bucketList.scrollHeight })
    })
  })
}
