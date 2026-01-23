import { useMutation } from '@tanstack/react-query'
import { Button } from '../shared/components/ui/button'
import { Input } from '../shared/components/ui/input'
import { authClient } from '../shared/auth/client'
import { useRouter } from '@tanstack/react-router'

type RegistrationInput = {
  email: string
  password: string
  name: string
}

export function SignUp() {
  const router = useRouter()

  const register = useMutation({
    mutationFn: async (data: RegistrationInput) => {
      const result = await authClient.signUp.email(data)

      if (result.error) {
        throw result.error
      }
      return result
    },
    onSuccess: () => {
      router.navigate({ to: '/' })
    },
    onError: (error: Error) => {
      console.log(error)
    },
  })

  const buttonClick = () => {
    register.mutate({
      email: 'test@test.com',
      name: 'test',
      password: 'test1test1',
    })
  }

  //TODO form
  return (
    <div>
      <Input type="text" defaultValue="email" />
      <Input type="text" defaultValue="password" />
      <Button onClick={buttonClick}>Register</Button>
    </div>
  )
}
