import useCreateTodo from '@/features/board/hooks/use-create-todo'
import { useAppForm } from '@/features/shared/components/form'
import { Button } from '@shared/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@shared/components/ui/dialog'
import { Input } from '@shared/components/ui/input'
import { useState } from 'react'
import type { FormEvent } from 'react'

interface AddTodoDialogProps {
  isOpen: boolean
  setOpen: (open: boolean) => void
  bucketId: number
   //TODO add a function for the "confirm button" that can be adding or updating, or if !todo then add else update
}
//TODO convert this to tanstack form, and add all the functionalities
export default function AddTodoDialog({ isOpen, setOpen, bucketId }: AddTodoDialogProps) {
  const form = useAppForm({
    defaultValues: {
      title: '',
      description: '',
      bucket: '', //TODO get the bucket input
      tags: '', // TODO figure out how to do array of elements
    }
  })

  const [text, setText] = useState('')

  const {mutate: createTodoMutation} = useCreateTodo()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      createTodoMutation({data: {title: text, bucketId: bucketId}})
      setText('')
      setOpen(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setText('')
    }
    setOpen(open)
  }
  // autoComplete="off" for form fields (is it the suggestions?)
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add a new Todo</DialogTitle>
          </DialogHeader>
          <div className='my-4 grid gap-4'>
            <div className='grid gap-2'>
              <Input
                onChange={(e) => {
                  setText(e.target.value)
                }}
                id='todo-text'
                name='todo'
                value={text}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={!text.trim()}>
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
