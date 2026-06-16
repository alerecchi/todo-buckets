import { useAppForm } from '@shared/components/form'
import { Button } from '@shared/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@shared/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@shared/components/ui/field'
import { Input } from '@shared/components/ui/input'
import { Textarea } from '@shared/components/ui/textarea'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import z from 'zod'

import useCreateCategory from '@/features/board/hooks/use-create-category'
import useCreateTag from '@/features/board/hooks/use-create-tag'
import useCreateTodo from '@/features/board/hooks/use-create-todo'
import useDeleteCategory from '@/features/board/hooks/use-delete-category'
import useDeleteTag from '@/features/board/hooks/use-delete-tag'
import useUpdateCategory from '@/features/board/hooks/use-update-category'
import useUpdateTag from '@/features/board/hooks/use-update-tag'
import { getCategoriesQueryOptions } from '@/features/board/queries/category-queries'
import { getTagsQueryOptions } from '@/features/board/queries/tag-queries'
import { getErrorMessage as getFieldErrorMessage } from '@/features/shared/utils/form'
import { cn } from '@/features/shared/utils/tailwind'
import type { Bucket } from '@/lib/types/Bucket'
import { CATEGORY_COLOR_KEYS, DEFAULT_CATEGORY_COLOR_KEY } from '@/lib/types/Category'
import type { CategoryColorKey } from '@/lib/types/Category'
import { DEFAULT_TAG_COLOR_KEY, TAG_COLOR_KEYS } from '@/lib/types/Tag'
import type { TagColorKey } from '@/lib/types/Tag'

type BucketOption = Pick<Bucket, 'id' | 'period' | 'type'>

interface TodoDialogProps {
  buckets: ReadonlyArray<BucketOption>
  defaultBucketId: number
  isOpen: boolean
  setOpen: (open: boolean) => void
}

type TodoFormValues = {
  bucketId: string
  categoryEditColorKey: CategoryColorKey
  categoryEditName: string
  categoryId: string
  description: string
  newCategoryColorKey: CategoryColorKey
  newCategoryName: string
  newTagColorKey: TagColorKey
  newTagName: string
  tagEditColorKeys: Record<string, TagColorKey>
  tagEditNames: Record<string, string>
  tagIds: Array<string>
  title: string
}

const titleValidator = z.string().trim().min(1, 'Title is required.')
const bucketValidator = z.string().min(1, 'Bucket is required.')
const operationErrorBodySchema = z.object({ message: z.string() }).partial()
const bucketTypeLabels = {
  daily: 'Daily',
  inbox: 'Inbox',
  monthly: 'Monthly',
  weekly: 'Weekly',
  yearly: 'Yearly',
} satisfies Record<BucketOption['type'], string>

export default function TodoDialog({ buckets, defaultBucketId, isOpen, setOpen }: TodoDialogProps) {
  const [categoryCreateError, setCategoryCreateError] = useState('')
  const [categoryDeleteError, setCategoryDeleteError] = useState('')
  const [categoryEditError, setCategoryEditError] = useState('')
  const [tagCreateError, setTagCreateError] = useState('')
  const [tagDeleteErrors, setTagDeleteErrors] = useState<Record<number, string>>({})
  const [tagEditErrors, setTagEditErrors] = useState<Record<number, string>>({})
  const createCategoryMutation = useCreateCategory()
  const createTagMutation = useCreateTag()
  const createTodoMutation = useCreateTodo()
  const deleteCategoryMutation = useDeleteCategory()
  const deleteTagMutation = useDeleteTag()
  const updateCategoryMutation = useUpdateCategory()
  const updateTagMutation = useUpdateTag()
  const { data: categories = [] } = useQuery(getCategoriesQueryOptions)
  const { data: tags = [] } = useQuery(getTagsQueryOptions)

  const form = useAppForm({
    defaultValues: getDefaultFormValues(defaultBucketId),
    validators: {
      onSubmitAsync: async ({ value }) => {
        try {
          await createTodoMutation.mutateAsync({
            data: {
              bucketId: Number(value.bucketId),
              categoryId: value.categoryId ? Number(value.categoryId) : null,
              description: value.description,
              tagIds: value.tagIds.map(Number),
              title: value.title.trim(),
            },
          })
          return undefined
        } catch (error) {
          return { form: await getOperationErrorMessage(error, 'Could not save the todo.') }
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
      setCategoryCreateError('')
      setCategoryDeleteError('')
      setCategoryEditError('')
      setTagCreateError('')
      setTagDeleteErrors({})
      setTagEditErrors({})
    }
  }, [defaultBucketId, form, isOpen])

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
  }

  const handleCreateCategory = async (values: Pick<TodoFormValues, 'newCategoryColorKey' | 'newCategoryName'>) => {
    const name = values.newCategoryName.trim()

    if (!name) {
      return
    }

    setCategoryCreateError('')

    try {
      const category = await createCategoryMutation.mutateAsync({
        data: {
          colorKey: values.newCategoryColorKey,
          name,
        },
      })
      form.setFieldValue('categoryId', String(category.id))
      form.setFieldValue('categoryEditColorKey', category.colorKey)
      form.setFieldValue('categoryEditName', category.name)
      form.setFieldValue('newCategoryName', '')
    } catch (error) {
      setCategoryCreateError(await getOperationErrorMessage(error, 'Could not create the category.'))
    }
  }

  const handleTagSelectionChange = (tagId: string, selected: boolean, selectedTagIds: Array<string>) => {
    const nextTagIds = selected
      ? [...selectedTagIds, tagId]
      : selectedTagIds.filter((selectedTagId) => selectedTagId !== tagId)

    form.setFieldValue('tagIds', [...new Set(nextTagIds)])
  }

  const handleCreateTag = async (values: Pick<TodoFormValues, 'newTagColorKey' | 'newTagName' | 'tagIds'>) => {
    const name = values.newTagName.trim()

    if (!name) {
      return
    }

    setTagCreateError('')

    try {
      const tag = await createTagMutation.mutateAsync({
        data: {
          colorKey: values.newTagColorKey,
          name,
        },
      })
      form.setFieldValue('tagIds', [...new Set([...values.tagIds, String(tag.id)])])
      form.setFieldValue('newTagName', '')
    } catch (error) {
      setTagCreateError(await getOperationErrorMessage(error, 'Could not create the tag.'))
    }
  }

  const handleUpdateTag = async (
    tagId: number,
    values: {
      colorKey: TagColorKey
      name: string
    },
  ) => {
    const name = values.name.trim()

    if (!name) {
      return
    }

    setTagEditErrors((errors) => {
      const { [tagId]: _removed, ...remainingErrors } = errors
      return remainingErrors
    })

    try {
      const tag = await updateTagMutation.mutateAsync({
        data: {
          colorKey: values.colorKey,
          id: tagId,
          name,
        },
      })
      const tagFormId = String(tag.id)
      form.setFieldValue('tagEditColorKeys', {
        ...form.state.values.tagEditColorKeys,
        [tagFormId]: tag.colorKey,
      })
      form.setFieldValue('tagEditNames', {
        ...form.state.values.tagEditNames,
        [tagFormId]: tag.name,
      })
    } catch (error) {
      const errorMessage = await getOperationErrorMessage(error, 'Could not save the tag.')
      setTagEditErrors((errors) => ({ ...errors, [tagId]: errorMessage }))
    }
  }

  const handleDeleteTag = async (tagId: number, selectedTagIds: Array<string>) => {
    const confirmed = window.confirm('Delete this tag? Todos using it will keep existing without this tag.')

    if (!confirmed) {
      return
    }

    setTagDeleteErrors((errors) => {
      const { [tagId]: _removed, ...remainingErrors } = errors
      return remainingErrors
    })

    try {
      await deleteTagMutation.mutateAsync({
        data: {
          id: tagId,
        },
      })

      const tagFormId = String(tagId)
      form.setFieldValue(
        'tagIds',
        selectedTagIds.filter((selectedTagId) => selectedTagId !== tagFormId),
      )
      form.setFieldValue('tagEditColorKeys', removeRecordKey(form.state.values.tagEditColorKeys, tagFormId))
      form.setFieldValue('tagEditNames', removeRecordKey(form.state.values.tagEditNames, tagFormId))
    } catch (error) {
      const errorMessage = await getOperationErrorMessage(error, 'Could not delete the tag.')
      setTagDeleteErrors((errors) => ({ ...errors, [tagId]: errorMessage }))
    }
  }

  const handleUpdateCategory = async (
    categoryId: number,
    values: Pick<TodoFormValues, 'categoryEditColorKey' | 'categoryEditName'>,
  ) => {
    const name = values.categoryEditName.trim()

    if (!name) {
      return
    }

    setCategoryEditError('')

    try {
      const category = await updateCategoryMutation.mutateAsync({
        data: {
          colorKey: values.categoryEditColorKey,
          id: categoryId,
          name,
        },
      })
      form.setFieldValue('categoryEditColorKey', category.colorKey)
      form.setFieldValue('categoryEditName', category.name)
    } catch (error) {
      setCategoryEditError(await getOperationErrorMessage(error, 'Could not save the category.'))
    }
  }

  const handleDeleteCategory = async (categoryId: number, selectedCategoryId: string) => {
    const confirmed = window.confirm('Delete this category? Todos using it will keep existing without a category.')

    if (!confirmed) {
      return
    }

    setCategoryDeleteError('')

    try {
      await deleteCategoryMutation.mutateAsync({
        data: {
          id: categoryId,
        },
      })

      if (selectedCategoryId === String(categoryId)) {
        form.setFieldValue('categoryId', '')
        form.setFieldValue('categoryEditColorKey', DEFAULT_CATEGORY_COLOR_KEY)
        form.setFieldValue('categoryEditName', '')
      }
    } catch (error) {
      setCategoryDeleteError(await getOperationErrorMessage(error, 'Could not delete the category.'))
    }
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
            <form.AppField
              name='categoryId'
              children={(field) => (
                <Field className='gap-2'>
                  <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                  <select
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const category = categories.find((categoryOption) => String(categoryOption.id) === e.target.value)

                      field.handleChange(e.target.value)
                      if (category) {
                        form.setFieldValue('categoryEditColorKey', category.colorKey)
                        form.setFieldValue('categoryEditName', category.name)
                        setCategoryDeleteError('')
                        setCategoryEditError('')
                      }
                    }}
                    value={field.state.value}
                    className={cn(
                      'h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm',
                    )}
                  >
                    <option value=''>No category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
            />
            <form.Subscribe
              selector={(state) => ({
                categoryEditColorKey: state.values.categoryEditColorKey,
                categoryEditName: state.values.categoryEditName,
                categoryId: state.values.categoryId,
              })}
              children={({ categoryEditColorKey, categoryEditName, categoryId }) => {
                const selectedCategory = categories.find((category) => String(category.id) === categoryId)

                if (!selectedCategory) {
                  return null
                }

                return (
                  <Field className='gap-2'>
                    <form.AppField
                      name='categoryEditName'
                      children={(field) => (
                        <>
                          <FieldLabel htmlFor={field.name}>Edit category name</FieldLabel>
                          <Input
                            autoComplete='off'
                            id={field.name}
                            name={field.name}
                            onBlur={field.handleBlur}
                            onChange={(event) => {
                              field.handleChange(event.target.value)
                            }}
                            value={field.state.value}
                          />
                        </>
                      )}
                    />
                    <form.AppField
                      name='categoryEditColorKey'
                      children={(field) => (
                        <>
                          <FieldLabel htmlFor={field.name}>Edit category color</FieldLabel>
                          <select
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) => {
                              field.handleChange(event.target.value as CategoryColorKey)
                            }}
                            className={cn(
                              'h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm',
                            )}
                          >
                            {CATEGORY_COLOR_KEYS.map((colorKey) => (
                              <option key={colorKey} value={colorKey}>
                                {colorKey}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                    />
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={() =>
                        void handleUpdateCategory(selectedCategory.id, {
                          categoryEditColorKey,
                          categoryEditName,
                        })
                      }
                      disabled={updateCategoryMutation.isPending || !categoryEditName.trim()}
                    >
                      Save category
                    </Button>
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={() => void handleDeleteCategory(selectedCategory.id, categoryId)}
                      disabled={deleteCategoryMutation.isPending}
                    >
                      Delete category
                    </Button>
                    {categoryDeleteError && (
                      <FieldError className='text-xs font-medium'>{categoryDeleteError}</FieldError>
                    )}
                    {categoryEditError && <FieldError className='text-xs font-medium'>{categoryEditError}</FieldError>}
                  </Field>
                )
              }}
            />
            <Field className='gap-2'>
              <FieldLabel htmlFor='new-category'>New category</FieldLabel>
              <div className='grid grid-cols-[1fr_auto] gap-2'>
                <form.AppField
                  name='newCategoryName'
                  children={(field) => (
                    <Input
                      autoComplete='off'
                      id='new-category'
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        field.handleChange(event.target.value)
                      }}
                      value={field.state.value}
                    />
                  )}
                />
                <form.Subscribe
                  selector={(state) => ({
                    newCategoryColorKey: state.values.newCategoryColorKey,
                    newCategoryName: state.values.newCategoryName,
                  })}
                  children={({ newCategoryColorKey, newCategoryName }) => (
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={() =>
                        void handleCreateCategory({
                          newCategoryColorKey,
                          newCategoryName,
                        })
                      }
                      disabled={createCategoryMutation.isPending || !newCategoryName.trim()}
                    >
                      Create category
                    </Button>
                  )}
                />
              </div>
              <form.AppField
                name='newCategoryColorKey'
                children={(field) => (
                  <>
                    <FieldLabel htmlFor='new-category-color'>Category color</FieldLabel>
                    <select
                      id='new-category-color'
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        field.handleChange(event.target.value as CategoryColorKey)
                      }}
                      className={cn(
                        'h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm',
                      )}
                    >
                      {CATEGORY_COLOR_KEYS.map((colorKey) => (
                        <option key={colorKey} value={colorKey}>
                          {colorKey}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              />
              {categoryCreateError && <FieldError className='text-xs font-medium'>{categoryCreateError}</FieldError>}
            </Field>
            <form.AppField
              name='tagIds'
              children={(field) => (
                <Field className='gap-2'>
                  <FieldLabel>Tags</FieldLabel>
                  <form.Subscribe
                    selector={(state) => ({
                      tagEditColorKeys: state.values.tagEditColorKeys,
                      tagEditNames: state.values.tagEditNames,
                    })}
                    children={({ tagEditColorKeys, tagEditNames }) => (
                      <div className='grid gap-3'>
                        {tags.length === 0 && <span className='text-sm text-muted-foreground'>No tags</span>}
                        {tags.map((tag) => {
                          const tagId = String(tag.id)
                          const selected = field.state.value.includes(tagId)
                          const editName = tagEditNames[tagId] ?? tag.name
                          const editColorKey = tagEditColorKeys[tagId] ?? tag.colorKey

                          return (
                            <div key={tag.id} className='grid gap-2 rounded-md border p-2'>
                              <label
                                className={cn(
                                  'inline-flex h-8 items-center gap-2 rounded-md border px-2 text-sm',
                                  selected && 'border-primary bg-primary/10',
                                )}
                              >
                                <input
                                  type='checkbox'
                                  checked={selected}
                                  onBlur={field.handleBlur}
                                  onChange={(event) => {
                                    handleTagSelectionChange(tagId, event.target.checked, field.state.value)
                                  }}
                                />
                                {tag.name}
                              </label>
                              <div className='grid grid-cols-[1fr_auto_auto] gap-2'>
                                <Input
                                  aria-label='Edit tag name'
                                  autoComplete='off'
                                  value={editName}
                                  onChange={(event) => {
                                    form.setFieldValue('tagEditNames', {
                                      ...tagEditNames,
                                      [tagId]: event.target.value,
                                    })
                                  }}
                                />
                                <select
                                  aria-label='Edit tag color'
                                  value={editColorKey}
                                  onChange={(event) => {
                                    form.setFieldValue('tagEditColorKeys', {
                                      ...tagEditColorKeys,
                                      [tagId]: event.target.value as TagColorKey,
                                    })
                                  }}
                                  className={cn(
                                    'h-9 rounded-md border border-input bg-transparent px-2.5 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm',
                                  )}
                                >
                                  {TAG_COLOR_KEYS.map((colorKey) => (
                                    <option key={colorKey} value={colorKey}>
                                      {colorKey}
                                    </option>
                                  ))}
                                </select>
                                <Button
                                  type='button'
                                  variant='secondary'
                                  onClick={() =>
                                    void handleUpdateTag(tag.id, {
                                      colorKey: editColorKey,
                                      name: editName,
                                    })
                                  }
                                  disabled={updateTagMutation.isPending || !editName.trim()}
                                >
                                  Save tag
                                </Button>
                              </div>
                              <Button
                                type='button'
                                variant='secondary'
                                onClick={() => void handleDeleteTag(tag.id, field.state.value)}
                                disabled={deleteTagMutation.isPending}
                              >
                                Delete tag
                              </Button>
                              {tagDeleteErrors[tag.id] && (
                                <FieldError className='text-xs font-medium'>{tagDeleteErrors[tag.id]}</FieldError>
                              )}
                              {tagEditErrors[tag.id] && (
                                <FieldError className='text-xs font-medium'>{tagEditErrors[tag.id]}</FieldError>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  />
                </Field>
              )}
            />
            <Field className='gap-2'>
              <FieldLabel htmlFor='new-tag'>New tag</FieldLabel>
              <div className='grid grid-cols-[1fr_auto] gap-2'>
                <form.AppField
                  name='newTagName'
                  children={(field) => (
                    <Input
                      autoComplete='off'
                      id='new-tag'
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        field.handleChange(event.target.value)
                      }}
                      value={field.state.value}
                    />
                  )}
                />
                <form.Subscribe
                  selector={(state) => ({
                    newTagColorKey: state.values.newTagColorKey,
                    newTagName: state.values.newTagName,
                    tagIds: state.values.tagIds,
                  })}
                  children={({ newTagColorKey, newTagName, tagIds }) => (
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={() =>
                        void handleCreateTag({
                          newTagColorKey,
                          newTagName,
                          tagIds,
                        })
                      }
                      disabled={createTagMutation.isPending || !newTagName.trim()}
                    >
                      Create tag
                    </Button>
                  )}
                />
              </div>
              <form.AppField
                name='newTagColorKey'
                children={(field) => (
                  <>
                    <FieldLabel htmlFor='new-tag-color'>Tag color</FieldLabel>
                    <select
                      id='new-tag-color'
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        field.handleChange(event.target.value as TagColorKey)
                      }}
                      className={cn(
                        'h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm',
                      )}
                    >
                      {TAG_COLOR_KEYS.map((colorKey) => (
                        <option key={colorKey} value={colorKey}>
                          {colorKey}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              />
              {tagCreateError && <FieldError className='text-xs font-medium'>{tagCreateError}</FieldError>}
            </Field>
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
    categoryEditColorKey: DEFAULT_CATEGORY_COLOR_KEY,
    categoryEditName: '',
    categoryId: '',
    description: '',
    newCategoryColorKey: DEFAULT_CATEGORY_COLOR_KEY,
    newCategoryName: '',
    newTagColorKey: DEFAULT_TAG_COLOR_KEY,
    newTagName: '',
    tagEditColorKeys: {},
    tagEditNames: {},
    tagIds: [],
    title: '',
  }
}

function removeRecordKey<T>(record: Record<string, T>, key: string) {
  const { [key]: _removed, ...remaining } = record
  return remaining
}

async function getOperationErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Response) {
    const json = await error.json().catch(() => undefined)
    const body = operationErrorBodySchema.safeParse(json)
    return body.success ? (body.data.message ?? fallbackMessage) : fallbackMessage
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}
