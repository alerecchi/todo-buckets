import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function EmailConfirmation() {
  return (
    <Card className='p-6 shadow-xl sm:p-8'>
      <CardHeader className='text-center'>
        <CardTitle className='mb-2 text-2xl font-bold'>Check your email</CardTitle>
        <CardDescription className='text-sm text-muted-foreground'>
          We've sent a confirmation link to your email address. Click the link to verify your account and finish signing
          up.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
