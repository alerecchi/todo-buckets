import { Plus } from 'lucide-react'
import { useState } from 'react'

import TodoDialog from '@/features/board/components/add-todo-dialog'
import { Button } from '@/features/shared/components/ui/button'
import type { Bucket } from '@/lib/types/Bucket'

type CreateTodoButtonProps = {
  buckets: ReadonlyArray<Bucket>
  bucketId: number
}

// TODO the bucket re-renders when I write things in the form, why?
export default function CreateTodoButton({ bucketId, buckets }: CreateTodoButtonProps) {
  const [isDialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Button aria-label='Add todo' onClick={() => setDialogOpen(true)}>
        <Plus className='size-4' />
      </Button>
      <TodoDialog buckets={buckets} defaultBucketId={bucketId} isOpen={isDialogOpen} setOpen={setDialogOpen} />
    </>
  )
}
