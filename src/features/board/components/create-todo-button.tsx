import { Plus } from 'lucide-react'
import { useState } from 'react'

import AddTodoDialog from '@/features/board/components/add-todo-dialog'
import { Button } from '@/features/shared/components/ui/button'

type CreateTodoButtonProps = {
  bucketId: number
}

// TODO the bucket re-renders when I write things in the form, why?
export default function CreateTodoButton({ bucketId }: CreateTodoButtonProps) {
  const [isDialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setDialogOpen(true)}>
        <Plus className='size-4' />
      </Button>
      <AddTodoDialog isOpen={isDialogOpen} setOpen={setDialogOpen} bucketId={bucketId} />
    </>
  )
}
