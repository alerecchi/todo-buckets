import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { FormEvent, useState } from 'react'

interface AddTodoDialogProps {
  isOpen: boolean
  setOpen: (open: boolean) => void
  onAddTodo: (text: string) => void
}

export default function AddTodoDialog({ isOpen, setOpen, onAddTodo }: AddTodoDialogProps) {
  const [text, setText] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onAddTodo(text)
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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add a new Todo</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 my-4'>
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
