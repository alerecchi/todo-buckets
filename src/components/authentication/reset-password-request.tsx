import { Mail } from 'lucide-react'
import z from 'zod'

import { useAppForm } from '@/components/authentication/form'
import { FieldSet, FieldGroup } from '@/components/ui/field'
import { authClient } from '@/lib/auth-client'

type ResetPasswordRequestProps = {
  userEmail?: string
  emailVerified?: boolean
  setFormSubmitted: React.Dispatch<React.SetStateAction<boolean>>
  tokenError: boolean
}

export default function ResetPasswordRequest({
  userEmail = '',
  emailVerified = false,
  setFormSubmitted,
  tokenError,
}: ResetPasswordRequestProps) {
  const form = useAppForm({
    defaultValues: {
      email: emailVerified ? userEmail : '',
    },
    validators: {
      onSubmitAsync: async ({ value: data }) => {
        const response = await authClient.requestPasswordReset({
          email: data.email,
          redirectTo: '/reset-password',
        })
        if (response.error) {
          return { form: 'There was a problem with generating your link, please refresh the page and try again' }
        }
        return undefined
      },
    },
    onSubmit: () => {
      setFormSubmitted(true)
    },
  })

  const formId = 'reset-password-request'
  const emailValidator = z.email('Please enter a valid email address').trim()

  if (tokenError) {
    form.setErrorMap({ onSubmit: { form: 'Your token is expired, please try again' } })
  }
  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <FieldSet>
        <FieldGroup className='gap-4'>
          <form.AppField
            name='email'
            validators={{
              onBlur: emailValidator,
              onSubmit: emailValidator,
            }}
            children={(field) => (
              <field.TextInput label='Email Address' placeholder='email@example.com' type='email' icon={<Mail />} />
            )}
          />
          <form.AppForm>
            <form.FormErrorAlert />
          </form.AppForm>
          <form.AppForm>
            <form.SubmitButton text='Send password reset link' formId={formId} />
          </form.AppForm>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
