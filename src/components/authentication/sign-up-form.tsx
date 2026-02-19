import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { authClient } from '@/lib/auth-client'
import { useForm } from '@tanstack/react-form-start'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'

type RegistrationInput = {
  name: string
  email: string
  password: string
}

enum PasswordInputType {
  PASSWORD = 'password',
  TEXT = 'text',
}
// TODO study react form
export function SignUpForm() {
  // TODO separate the signup and login into separate cards / pages
  const router = useRouter()
  const [passwordInputType, setPasswordInputType] = useState(PasswordInputType.PASSWORD)

  const register = useMutation({
    mutationFn: async (data: RegistrationInput) => {
      const result = await authClient.signUp.email(data)

      if (result.error) {
        throw result.error
      }
      return result
    },
    onSuccess: () => {
      router.navigate({ to: '/' }) //TODO I need a registration successful page (either full page or component) that says now verify the email
    },
    onError: (error: Error) => {
      //TODO proper error management
      console.log(error)
    },
  })

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }, //TODO add validators
    // TODO https://github.com/TanStack/form/discussions/623 for field errors from server
    onSubmit: async ({ value }) => {
      register.mutate(value)
    },
  })
  //TODO fields error management
  return (
    <form
      id='sign-up-form'
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldSet>
        <FieldGroup>
          <form.Field
            name='name'
            children={(field) => {
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      name={field.name}
                      placeholder='John Doe'
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <InputGroupAddon>
                      <User />
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              )
            }}
          />

          <form.Field
            name='email'
            children={(field) => {
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      name={field.name}
                      placeholder='name@example.com'
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type='email'
                    />
                    <InputGroupAddon>
                      <Mail />
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              )
            }}
          />

          <form.Field
            name='password'
            children={(field) => {
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      name={field.name}
                      type={passwordInputType}
                      placeholder='Create a password'
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <InputGroupAddon>
                      <Lock />
                    </InputGroupAddon>
                    <InputGroupAddon align='inline-end'>
                      {passwordInputType == PasswordInputType.PASSWORD ? (
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
                  {/* TODO password requirements validation */}
                  {/* TODO required fields */}
                  {/* TODO CSS adjustments (icon color, margins and paddings) */}
                  {/* TODO add "already have an account? Login" */}
                  {/* TODO confirm password */}
                </Field>
              )
            }}
          />

          <Field>
            {/* TODO isLoading state for button */}
            <Button className='cursor-pointer' type='submit' form='sign-up-form'>
              Create Account
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
