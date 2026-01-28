import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useState } from 'react'

export default function LoginForm() {
  //TODO enum / "restricted" type for passwordType?
  const [passwordInputType, setPasswordInputType] = useState('password')
  // TODO login function
  return (
    <form>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor='email'>Email Address</FieldLabel>
            <InputGroup>
              <InputGroupInput id='email' placeholder='name@example.com' />
              <InputGroupAddon>
                <Mail />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor='password'>Password</FieldLabel>
            <InputGroup>
              <InputGroupInput id='password' type={passwordInputType} placeholder='Enter your password' />
              <InputGroupAddon>
                <Lock />
              </InputGroupAddon>
              {passwordInputType == 'password' ? (
                <InputGroupButton
                  //TODO pointer hand
                  aria-label='Show'
                  title='Show'
                  onClick={() => {
                    setPasswordInputType('text')
                  }}
                >
                  <EyeOff />
                </InputGroupButton>
              ) : (
                <InputGroupButton
                  aria-label='Hide'
                  title='Hide'
                  onClick={() => {
                    setPasswordInputType('password')
                  }}
                >
                  <Eye />
                </InputGroupButton>
                // TODO Forgot password
              )}
            </InputGroup>
          </Field>
          <Field>
            <Button>Login</Button>
          </Field>
        </FieldGroup>
      </FieldSet>
      {/* TODO CSS adjustments (icon color, margins and paddings) */}
      {/* TODO add "Don't have an account? Sign Up div" */}
    </form>
  )
}
