import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'

type RegistrationInput = {
  email: string
  password: string
  name: string
}

export function SignUpForm() {
  // TODO registration function
  
  // const router = useRouter()

  // const register = useMutation({
  //   mutationFn: async (data: RegistrationInput) => {
  //     const result = await authClient.signUp.email(data)

  //     if (result.error) {
  //       throw result.error
  //     }
  //     return result
  //   },
  //   onSuccess: () => {
  //     router.navigate({ to: '/' })
  //   },
  //   onError: (error: Error) => {
  //     console.log(error)
  //   },
  // })

  // const buttonClick = () => {
  //   register.mutate({
  //     email: 'test@test.com',
  //     name: 'test',
  //     password: 'test1test1',
  //   })
  // }

  //TODO enum / "restricted" type for passwordType?
  const [passwordInputType, setPasswordInputType] = useState('password')

  return (
    <form>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor='name'>Full Name</FieldLabel>
            <InputGroup>
              <InputGroupInput id='name' placeholder='John Doe' />
              <InputGroupAddon>
                <User />
              </InputGroupAddon>
            </InputGroup>
          </Field>
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
              <InputGroupInput id='password' type={passwordInputType} placeholder='Create a password' />
              <InputGroupAddon>
                <Lock />
              </InputGroupAddon>
              <InputGroupAddon align='inline-end'>
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
                )}
              </InputGroupAddon>
            </InputGroup>
            {/* TODO password requirements validation */}
            {/* TODO required fields */}
            {/* TODO CSS adjustments (icon color, margins and paddings) */}
            {/* TODO add "already have an account? Login" */}
          </Field>
          <Field>
            <Button>Create Account</Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
