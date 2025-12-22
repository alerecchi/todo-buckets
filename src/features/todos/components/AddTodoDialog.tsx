import { Button } from '@/features/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from '@/features/shared/components/ui/dialog'
import { Input } from '@/features/shared/components/ui/input'
import { FormEvent, useState } from 'react'

interface AddTodoDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  addTodo: (text: string) => void
}

export default function AddTodoDialog({
  open,
  setOpen,
  addTodo,
}: AddTodoDialogProps) {
  let [text, setText] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      addTodo(text)
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add a new Todo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 my-4">
            <div className="grid gap-2">
              <Input
                onChange={(e) => {
                  setText(e.target.value)
                }}
                id="todo-text"
                name="todo"
                value={text}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!text.trim()}>
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
