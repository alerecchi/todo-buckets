import AuthSelector from '@/components/authentication/auth-selector'
import Divider from '@/components/authentication/divider'
import LoginForm from '@/components/authentication/login-form'
import { SignUpForm } from '@/components/authentication/sign-up-form'
import SocialLogins from '@/components/authentication/social-logins'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

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
    <Card className='shadow-xl p-6 sm:p-8'>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl mb-2 font-bold'>{title}</CardTitle>
        <CardDescription className='text-sm text-muted-foreground'>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthSelector authTab={activeTab} />
        {activeTab === AuthTab.LOGIN ? <LoginForm /> : <SignUpForm />}
      </CardContent>
      <CardFooter className='flex-col gap-6 items-stretch'>
        <Divider>Or continue with</Divider>
        <SocialLogins />
      </CardFooter>
    </Card>
  )
}
