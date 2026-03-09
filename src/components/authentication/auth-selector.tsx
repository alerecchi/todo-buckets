import { AuthTab } from '@/components/authentication/auth-container'
import { ButtonLink } from '@/components/button-link'

type AuthSelectorProps = {
  authTab: AuthTab
}

export default function AuthSelector({ authTab }: AuthSelectorProps) {
  return (
    <div className='grid grid-cols-2 gap-2 mb-8 bg-muted p-1 rounded-lg text-muted-foreground'>
      <ButtonLink to='/login' size='lg' variant={authTab === AuthTab.LOGIN ? 'outline' : 'ghost'}>
        Login
      </ButtonLink>
      <ButtonLink to='/signup' size='lg' variant={authTab === AuthTab.SIGNUP ? 'outline' : 'ghost'}>
        Signup
      </ButtonLink>
    </div>
  )
}
