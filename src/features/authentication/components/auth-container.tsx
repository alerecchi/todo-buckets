import AuthSelector from '@features/authentication/components/auth-selector'
import Divider from '@features/authentication/components/divider'
import LoginForm from '@features/authentication/components/login-form'
import { SignUpForm } from '@features/authentication/components/sign-up-form'
import SocialLogins from '@features/authentication/components/social-logins'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@shared/components/ui/card'

export enum AuthTab {
  LOGIN = 'login',
  SIGNUP = 'signup',
}

export type AuthContainerProps = {
  activeTab: AuthTab
}

export default function AuthContainer({ activeTab }: AuthContainerProps) {
  const title = activeTab === AuthTab.SIGNUP ? 'Create Account' : 'Welcome Back'
  const subtitle =
    activeTab === AuthTab.SIGNUP ? 'Start managing your TODOs effectively' : 'Manage your TODOs effectively'

  return (
    <Card className='p-6 shadow-xl sm:p-8'>
      <CardHeader className='text-center'>
        <CardTitle className='mb-2 text-2xl font-bold'>{title}</CardTitle>
        <CardDescription className='text-sm text-muted-foreground'>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthSelector authTab={activeTab} />
        {activeTab === AuthTab.LOGIN ? <LoginForm /> : <SignUpForm />}
      </CardContent>
      <CardFooter className='flex-col items-stretch gap-6'>
        <Divider>Or continue with</Divider>
        <SocialLogins />
      </CardFooter>
    </Card>
  )
}
