import LoginForm from '@/components/authentication/login-form'
import { SignUpForm } from '@/components/authentication/sign-up-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'

export default function AuthContainer() {
  //TODO enum or restrictive type for tab id
  const [activeTab, setActiveTab] = useState('login')

  return (
    // TODO min-h-screen probably doesn't go here but in the body and here like h-full?
    // TODO animation height when changing tabs?
    <div className='min-h-screen flex items-center justify-center'>
      <Card className='w-full max-w-md shadow-xl'>
        {/* TODO make this dynamic */}
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Start managing your TODOs effectively</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value)
            }}
          >
            <TabsList>
              <TabsTrigger value='login'>Login</TabsTrigger>
              <TabsTrigger value='signup'>Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value='login'>
              <LoginForm />
            </TabsContent>
            <TabsContent value='signup'>
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
