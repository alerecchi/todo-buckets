import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { authClient } from '@/lib/auth-client'
import { useForm } from '@tanstack/react-form-start'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useState } from 'react'

// TODO avoid duplication with signup form
enum PasswordInputType {
  PASSWORD = 'password',
  TEXT = 'text',
}

export default function LoginForm() {
  //TODO enum / "restricted" type for passwordType?
  const [passwordInputType, setPasswordInputType] = useState('password')
  // TODO login function

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
          callbackURL: '/', // TODO check this redirect based on the github decision
          rememberMe: false, //TODO for now for testing
        },
        {
          // TODO add callbacks for error and success (if the redirect is not enough)
        },
      )
    },
  })

  return (
    <form
      id='login-form'
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <FieldSet>
        <FieldGroup>
          <form.Field
            name='email'
            children={(field) => {
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      placeholder='name@example.com'
                      type='email'
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
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
                      type={passwordInputType}
                      placeholder='Enter your password'
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
                        // TODO Forgot password
                      )}
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              )
            }}
          />

          <Field>
            {/* TODO prevent multiple submissions */}
            <Button className='cursor-pointer' type='submit' form='login-form'>
              Login
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
      {/* TODO CSS adjustments (icon color, margins and paddings) */}
      {/* TODO add "Don't have an account? Sign Up div" */}
    </form>
  )
}
