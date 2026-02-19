import LoginForm from '@/components/authentication/login-form'
import { SignUpForm } from '@/components/authentication/sign-up-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'

export enum AuthTab {
  LOGIN = 'login',
  SIGNUP = 'signup',
}

export type AuthContainerProps = {
  initialTab: AuthTab
}

export default function AuthContainer({ initialTab }: AuthContainerProps) {
  const [activeTab, setActiveTab] = useState(initialTab)

  const title = activeTab == AuthTab.SIGNUP ? 'Create Account' : 'Welcome Back'
  const subtitle =
    activeTab == AuthTab.SIGNUP ? 'Start managing your TODOs effectively' : 'Manage your TODOs effectively'

  return (
    // TODO min-h-screen probably doesn't go here but in the body and here like h-full?
    // TODO animation height when changing tabs?
    <div className='min-h-screen flex items-center justify-center'>
      <Card className='w-full max-w-md shadow-xl'>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value)
            }}
          >
            <TabsList>
              <TabsTrigger value={AuthTab.LOGIN}>Login</TabsTrigger>
              <TabsTrigger value={AuthTab.SIGNUP}>Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value={AuthTab.LOGIN}>
              <LoginForm />
            </TabsContent>
            <TabsContent value={AuthTab.SIGNUP}>
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
