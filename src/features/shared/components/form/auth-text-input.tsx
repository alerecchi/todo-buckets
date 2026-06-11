import { useFieldContext } from '@shared/components/form'
import { Field, FieldError, FieldLabel } from '@shared/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@shared/components/ui/input-group'
import type { ReactNode } from 'react'

import { getErrorMessage } from '@/features/shared/utils/form'

type AuthTextInputProps = {
  label: string
  placeholder: string
  type: 'email' | 'text'
  icon: ReactNode
}

export default function AuthTextInput({ label, placeholder, type, icon }: AuthTextInputProps) {
  const field = useFieldContext<string>()
  return (
    <Field className='gap-1'>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <InputGroup className='h-10 bg-muted/30'>
        <InputGroupInput
          id={field.name}
          placeholder={placeholder}
          type={type}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
        />
        {icon && <InputGroupAddon>{icon}</InputGroupAddon>}
      </InputGroup>
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
        <FieldError className='text-xs font-medium'>{getErrorMessage(field.state.meta.errors[0])}</FieldError>
      )}
    </Field>
  )
}
