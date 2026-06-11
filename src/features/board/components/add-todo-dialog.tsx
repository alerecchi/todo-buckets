import { useAppForm } from '@shared/components/form'
import { Button } from '@shared/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@shared/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@shared/components/ui/field'
import { Input } from '@shared/components/ui/input'
import { Textarea } from '@shared/components/ui/textarea'
import { useEffect } from 'react'
import z from 'zod'

import useCreateTodo from '@/features/board/hooks/use-create-todo'
import { getErrorMessage as getFieldErrorMessage } from '@/features/shared/utils/form'
import { cn } from '@/features/shared/utils/tailwind'
import type { Bucket } from '@/lib/types/Bucket'

type BucketOption = Pick<Bucket, 'id' | 'period' | 'type'>

interface TodoDialogProps {
  buckets: ReadonlyArray<BucketOption>
  defaultBucketId: number
  isOpen: boolean
  setOpen: (open: boolean) => void
}

type TodoFormValues = {
  bucketId: string
  description: string
  title: string
}

const titleValidator = z.string().trim().min(1, 'Title is required.')
const bucketValidator = z.string().min(1, 'Bucket is required.')
const bucketTypeLabels = {
  daily: 'Daily',
  inbox: 'Inbox',
  monthly: 'Monthly',
  weekly: 'Weekly',
  yearly: 'Yearly',
} satisfies Record<BucketOption['type'], string>

export default function TodoDialog({ buckets, defaultBucketId, isOpen, setOpen }: TodoDialogProps) {
  const createTodoMutation = useCreateTodo()

  const form = useAppForm({
    defaultValues: getDefaultFormValues(defaultBucketId),
    validators: {
      onSubmitAsync: async ({ value }) => {
        try {
          await createTodoMutation.mutateAsync({
            data: {
              bucketId: Number(value.bucketId),
              description: value.description,
              title: value.title.trim(),
            },
          })
          return undefined
        } catch (error) {
          return { form: await getOperationErrorMessage(error) }
        }
      },
    },
    onSubmit: () => {
      setOpen(false)
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset(getDefaultFormValues(defaultBucketId))
    }
  }, [defaultBucketId, form, isOpen])

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
  }

  const formId = 'todo-dialog-form'

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className='my-4 grid gap-4'>
            <form.AppField
              name='title'
              validators={{
                onBlur: titleValidator,
                onChange: titleValidator,
                onSubmit: titleValidator,
              }}
              children={(field) => (
                <Field className='gap-2' data-invalid={field.state.meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                  <Input
                    aria-invalid={field.state.meta.errors.length > 0}
                    autoComplete='off'
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                    }}
                    value={field.state.value}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <FieldError className='text-xs font-medium'>
                      {getFieldErrorMessage(field.state.meta.errors[0])}
                    </FieldError>
                  )}
                </Field>
              )}
            />
            <form.AppField
              name='description'
              children={(field) => (
                <Field className='gap-2'>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                    }}
                    value={field.state.value}
                  />
                </Field>
              )}
            />
            <form.AppField
              name='bucketId'
              validators={{
                onBlur: bucketValidator,
                onChange: bucketValidator,
                onSubmit: bucketValidator,
              }}
              children={(field) => (
                <Field className='gap-2' data-invalid={field.state.meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.name}>Bucket</FieldLabel>
                  <select
                    aria-invalid={field.state.meta.errors.length > 0}
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                    }}
                    value={field.state.value}
                    className={cn(
                      'h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm',
                      field.state.meta.errors.length > 0 && 'border-destructive ring-[3px] ring-destructive/20',
                    )}
                  >
                    <option value=''>Select bucket</option>
                    {buckets.map((bucket) => (
                      <option key={bucket.id} value={bucket.id}>
                        {formatBucketName(bucket)}
                      </option>
                    ))}
                  </select>
                  {field.state.meta.errors.length > 0 && (
                    <FieldError className='text-xs font-medium'>
                      {getFieldErrorMessage(field.state.meta.errors[0])}
                    </FieldError>
                  )}
                </Field>
              )}
            />
            <form.AppForm>
              <form.FormErrorAlert />
            </form.AppForm>
          </div>
          <DialogFooter>
            <Button type='submit' form={formId} disabled={createTodoMutation.isPending}>
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function formatBucketName(bucket: BucketOption) {
  return `${bucketTypeLabels[bucket.type]} - ${bucket.period}`
}

function getDefaultFormValues(defaultBucketId: number): TodoFormValues {
  return {
    bucketId: String(defaultBucketId),
    description: '',
    title: '',
  }
}

async function getOperationErrorMessage(error: unknown) {
  if (error instanceof Response) {
    const body = (await error.json().catch(() => undefined)) as { message?: string } | undefined
    return body?.message ?? 'Could not save the todo.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Could not save the todo.'
}
