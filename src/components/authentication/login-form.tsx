import { FieldGroup, FieldSet } from '@/components/ui/field'
import { authClient } from '@/lib/auth-client'
import { userSessionQuery } from '@/lib/queries/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Mail } from 'lucide-react'
import z from 'zod'
import { useAppForm } from './form'

export default function Login() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutateAsync: signInMutation } = useMutation({
    mutationKey: userSessionQuery.key,
    mutationFn: async (data: { email: string; password: string }) =>
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
      }),
    onSuccess: () => {
      //TODO see if I need this considering that I'm already saying that the auth cache changes (maybe that already triggers enough refreshes)
      queryClient.resetQueries()
    },
  })

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    /* A weird behavior from Tanstack Form on how to manage errors from the server (e.g. user already exist) is 
    to check them in a validator instead of in the onSubmit function. The onSubmit then becames just the happy 
    path https://github.com/TanStack/form/discussions/623  */
    validators: {
      onSubmitAsync: async ({ value: data }) => {
        const result = await signInMutation(data)
        if (result.error) {
          console.log(result.error)
          if (result.error.code == 'INVALID_EMAIL_OR_PASSWORD') {
            return { form: 'Invalid Email or Password' }
          }
          return { form: 'There was a problem with your login, please refresh the page and try again' }
        }
        return undefined //Everything went well and the user is logged in
      },
    },
    onSubmit: async () => {
      navigate({ to: '/board' })
      //TODO navigate based on redirect param
    },
    canSubmitWhenInvalid: true,
  })

  const formId = 'login-form'

  const emailValidator = z.email('Please enter a valid email address').trim()
  const passwordValidator = z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters')

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
          <form.AppField
            name='password'
            validators={{
              onBlur: passwordValidator,
              onSubmit: passwordValidator,
            }}
            children={(field) => <field.PasswordInput label='Password' forgotLink />}
          />
          <form.AppForm>
            <form.FormErrorAlert />
          </form.AppForm>
          <form.AppForm>
            <form.SubmitButton text='Login' formId={formId} />
          </form.AppForm>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
