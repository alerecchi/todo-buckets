import { Button } from '@shared/components/ui/button'
import { Checkbox } from '@shared/components/ui/checkbox'
import { FieldError } from '@shared/components/ui/field'
import { Input } from '@shared/components/ui/input'
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from '@shared/components/ui/popover'
import { Check, ChevronLeft, Search, Trash2, X } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'

import { Badge } from '@/features/shared/components/ui/badge'
import { cn } from '@/features/shared/utils/tailwind'
import { CATEGORY_COLOR_KEYS } from '@/lib/types/Category'
import type { CategoryColorKey } from '@/lib/types/Category'
import { getColorPreset } from '@/lib/types/Color'
import { TAG_COLOR_KEYS } from '@/lib/types/Tag'
import type { TagColorKey, TagDisplay } from '@/lib/types/Tag'

export function ResourcePopover({
  children,
  onOpenChange,
  open,
  trigger,
}: {
  children: ReactNode
  onOpenChange: (open: boolean) => void
  open: boolean
  trigger: ReactElement
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger render={trigger} />
      <PopoverContent
        initialFocus={false}
        side='bottom'
        align='start'
        sideOffset={6}
        className='grid w-[min(300px,calc(100vw-2rem))] gap-3 rounded-xl'
      >
        {children}
      </PopoverContent>
    </Popover>
  )
}

export function ResourceListPanel({
  children,
  createButton,
  onClose,
  search,
  title,
}: {
  children: ReactNode
  createButton: ReactNode
  onClose: () => void
  search: ReactNode
  title: string
}) {
  return (
    <>
      <div className='flex items-center justify-between gap-2'>
        <PopoverTitle className='text-sm font-semibold'>{title}</PopoverTitle>
        <Button type='button' variant='ghost' size='icon-sm' className='cursor-pointer' onClick={onClose}>
          <X />
          <span className='sr-only'>Close</span>
        </Button>
      </div>
      {search}
      {children}
      {createButton}
    </>
  )
}

export function SearchInput({
  onChange,
  placeholder,
  value,
}: {
  onChange: (value: string) => void
  placeholder: string
  value: string
}) {
  return (
    <label className='relative block'>
      <Search className='pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground' />
      <Input
        aria-label={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className='h-8 pl-8'
      />
    </label>
  )
}

export function CategoryEditPanel({
  colorKey,
  deleteConfirmationMessage,
  deleteError,
  editError,
  isDeleteDisabled,
  isSaveDisabled,
  name,
  onBack,
  onColorChange,
  onDelete,
  onNameChange,
  onSave,
  title,
}: {
  colorKey: CategoryColorKey
  deleteConfirmationMessage: string
  deleteError: string
  editError: string
  isDeleteDisabled: boolean
  isSaveDisabled: boolean
  name: string
  onBack: () => void
  onColorChange: (colorKey: CategoryColorKey) => void
  onDelete?: () => void | Promise<void>
  onNameChange: (name: string) => void
  onSave: () => void | Promise<void>
  title: string
}) {
  return (
    <ResourceEditPanel
      colorKey={colorKey}
      colorKeys={CATEGORY_COLOR_KEYS}
      deleteConfirmationMessage={deleteConfirmationMessage}
      deleteError={deleteError}
      editError={editError}
      isDeleteDisabled={isDeleteDisabled}
      isSaveDisabled={isSaveDisabled}
      name={name}
      onBack={onBack}
      onColorChange={onColorChange}
      onDelete={onDelete}
      onNameChange={onNameChange}
      onSave={onSave}
      title={title}
    />
  )
}

export function TagEditPanel({
  colorKey,
  deleteConfirmationMessage,
  deleteError,
  editError,
  isDeleteDisabled,
  isSaveDisabled,
  name,
  onBack,
  onColorChange,
  onDelete,
  onNameChange,
  onSave,
  title,
}: {
  colorKey: TagColorKey
  deleteConfirmationMessage: string
  deleteError: string
  editError: string
  isDeleteDisabled: boolean
  isSaveDisabled: boolean
  name: string
  onBack: () => void
  onColorChange: (colorKey: TagColorKey) => void
  onDelete?: () => void | Promise<void>
  onNameChange: (name: string) => void
  onSave: () => void | Promise<void>
  title: string
}) {
  return (
    <ResourceEditPanel
      colorKey={colorKey}
      colorKeys={TAG_COLOR_KEYS}
      deleteConfirmationMessage={deleteConfirmationMessage}
      deleteError={deleteError}
      editError={editError}
      isDeleteDisabled={isDeleteDisabled}
      isSaveDisabled={isSaveDisabled}
      name={name}
      onBack={onBack}
      onColorChange={onColorChange}
      onDelete={onDelete}
      onNameChange={onNameChange}
      onSave={onSave}
      preview={<TagBadge tag={{ colorKey, id: 0, name: name || 'tag_name' }} />}
      title={title}
    />
  )
}

function ResourceEditPanel<TColorKey extends string>({
  colorKey,
  colorKeys,
  deleteConfirmationMessage,
  deleteError,
  editError,
  isDeleteDisabled,
  isSaveDisabled,
  name,
  onBack,
  onColorChange,
  onDelete,
  onNameChange,
  onSave,
  preview,
  title,
}: {
  colorKey: TColorKey
  colorKeys: ReadonlyArray<TColorKey>
  deleteConfirmationMessage: string
  deleteError: string
  editError: string
  isDeleteDisabled: boolean
  isSaveDisabled: boolean
  name: string
  onBack: () => void
  onColorChange: (colorKey: TColorKey) => void
  onDelete?: () => void | Promise<void>
  onNameChange: (name: string) => void
  onSave: () => void | Promise<void>
  preview?: ReactNode
  title: string
}) {
  return (
    <div className='grid gap-4'>
      <div className='flex items-center gap-2'>
        <Button type='button' variant='ghost' size='icon-sm' className='cursor-pointer' onClick={onBack}>
          <ChevronLeft />
          <span className='sr-only'>Back</span>
        </Button>
        <PopoverTitle className='text-sm font-semibold'>{title}</PopoverTitle>
      </div>
      {preview && <div className='rounded-md border p-3'>{preview}</div>}
      <label className='grid gap-2'>
        <span className='text-sm font-medium'>Name</span>
        <Input aria-label='Name' value={name} onChange={(event) => onNameChange(event.target.value)} autoFocus />
      </label>
      <div className='grid gap-2'>
        <span className='text-sm font-medium'>Color</span>
        <div className='flex flex-wrap gap-2'>
          {colorKeys.map((optionColorKey) => (
            <ColorButton
              key={optionColorKey}
              colorKey={optionColorKey}
              selected={colorKey === optionColorKey}
              onClick={() => onColorChange(optionColorKey)}
            />
          ))}
        </div>
      </div>
      {deleteConfirmationMessage && <p className='text-xs font-medium text-destructive'>{deleteConfirmationMessage}</p>}
      {editError && <FieldError className='text-xs font-medium'>{editError}</FieldError>}
      {deleteError && <FieldError className='text-xs font-medium'>{deleteError}</FieldError>}
      <div className='flex flex-wrap justify-end gap-2'>
        {onDelete && (
          <Button
            type='button'
            variant='destructive'
            className='cursor-pointer'
            onClick={() => void onDelete()}
            disabled={isDeleteDisabled}
          >
            <Trash2 />
            Delete
          </Button>
        )}
        <Button type='button' className='cursor-pointer' onClick={() => void onSave()} disabled={isSaveDisabled}>
          Save
        </Button>
      </div>
    </div>
  )
}

function ColorButton<TColorKey extends string>({
  colorKey,
  onClick,
  selected,
}: {
  colorKey: TColorKey
  onClick: () => void
  selected: boolean
}) {
  const color = getColorPreset(colorKey)

  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={colorKey}
      className={cn(
        'grid size-8 cursor-pointer place-items-center rounded-md bg-[color-mix(in_oklab,var(--todo-marker-bg)_22%,transparent)] text-(--todo-marker-fg) ring-1 ring-transparent hover:ring-foreground/20',
        color.backgroundColorClass,
        color.textColorClass,
        selected && 'ring-2 ring-ring ring-offset-2',
      )}
    >
      {selected && <Check className='size-4' />}
    </button>
  )
}

export function ColorDot({ colorKey }: { colorKey: CategoryColorKey }) {
  const color = getColorPreset(colorKey)

  return <span className={cn('size-2.5 rounded-full bg-(--todo-marker-bg)', color.backgroundColorClass)} />
}

export function TagBadge({
  onRemove,
  removeLabel,
  tag,
}: {
  onRemove?: () => void
  removeLabel?: string
  tag: TagDisplay
}) {
  const color = getColorPreset(tag.colorKey)

  return (
    <Badge
      className={cn(
        'rounded-sm px-2 py-0.5 text-xs uppercase',
        'bg-[color-mix(in_oklab,var(--todo-marker-bg)_12%,transparent)] text-(--todo-marker-fg)',
        onRemove && 'gap-1.5 pr-1',
        color.backgroundColorClass,
        color.textColorClass,
      )}
    >
      {tag.name}
      {onRemove && (
        <button
          type='button'
          aria-label={removeLabel ?? `Remove ${tag.name}`}
          onClick={onRemove}
          className='grid size-3.5 cursor-pointer place-items-center rounded-sm text-current opacity-70 hover:bg-[color-mix(in_oklab,var(--todo-marker-bg)_18%,transparent)] hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
        >
          <X className='size-3' />
        </button>
      )}
    </Badge>
  )
}

export function ResourceCheckbox({
  checked,
  label,
  onCheckedChange,
}: {
  checked: boolean
  label: string
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-label={label}
      className='cursor-pointer hover:border-primary/70 data-checked:hover:bg-primary/90'
    />
  )
}
