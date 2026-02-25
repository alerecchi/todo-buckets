import { useFieldContext } from '@/components/authentication/form'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { getErrorMessage } from '@/lib/utils/form'
import { Link } from '@tanstack/react-router'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { useState } from 'react'

enum PasswordInputType {
  PASSWORD = 'password',
  TEXT = 'text',
}

type PasswordInputProps = {
  label: string
  forgotLink?: boolean
}
export default function PasswordInput({ label, forgotLink = false }: PasswordInputProps) {
  const [passwordInputType, setPasswordInputType] = useState(PasswordInputType.PASSWORD)
  const field = useFieldContext<string>()

  return (
    <Field className='gap-1'>
      <div className='flex items-center justify-between'>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {forgotLink && (
          <Link to='.' className='inline-block text-sm font-medium underline-offset-4 hover:underline text-primary'>
            Forgot your password?
          </Link>
        )}

        {/* TODO forgot password flow */}
      </div>
      <InputGroup className='h-10 bg-muted/30'>
        <InputGroupInput
          id={field.name}
          type={passwordInputType}
          placeholder='••••••••'
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
        />
        <InputGroupAddon>
          <Lock />
        </InputGroupAddon>
        <InputGroupAddon align='inline-end'>
          {passwordInputType === PasswordInputType.PASSWORD ? (
            <InputGroupButton
              aria-label='Show'
              title='Show'
              className='cursor-pointer'
              onClick={() => {
                setPasswordInputType(PasswordInputType.TEXT)
              }}
            >
              <EyeOff />
            </InputGroupButton>
          ) : (
            <InputGroupButton
              aria-label='Hide'
              title='Hide'
              className='cursor-pointer'
              onClick={() => {
                setPasswordInputType(PasswordInputType.PASSWORD)
              }}
            >
              <Eye />
            </InputGroupButton>
          )}
        </InputGroupAddon>
      </InputGroup>
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
        <FieldError className='text-xs font-medium'>{getErrorMessage(field.state.meta.errors[0])}</FieldError>
      )}
    </Field>
  )
}
