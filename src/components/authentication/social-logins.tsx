import { Button } from '@/components/ui/button'

export default function SocialLogins() {
  // TODO add social login function
  return (
    <Button size='lg' variant='outline' className='gap-2 font-medium'>
      <GoogleIcon />
      Google
    </Button>
  )
}

function GoogleIcon() {
  return (
    <svg className='size-5' viewBox='0 0 24 24' fill='none'>
      <path
        d='M23.766 12.276c0-.816-.066-1.636-.207-2.438H12.24v4.621h6.482a5.554 5.554 0 0 1-2.399 3.647v2.998h3.867c2.271-2.09 3.576-5.177 3.576-8.828Z'
        fill='#4285F4'
      />
      <path
        d='M12.24 24.001c3.237 0 5.966-1.063 7.955-2.897l-3.867-2.998c-1.076.732-2.465 1.146-4.084 1.146-3.13 0-5.785-2.112-6.738-4.952H1.517v3.091a12.002 12.002 0 0 0 10.723 6.61Z'
        fill='#34A853'
      />
      <path d='M5.502 14.3a7.189 7.189 0 0 1 0-4.6V6.608H1.516a12.01 12.01 0 0 0 0 10.783L5.502 14.3Z' fill='#FBBC05' />
      <path
        d='M12.24 4.75a6.52 6.52 0 0 1 4.603 1.799l3.427-3.426A11.533 11.533 0 0 0 12.24.001 12.002 12.002 0 0 0 1.517 6.609L5.503 9.7C6.45 6.862 9.11 4.75 12.24 4.75Z'
        fill='#EA4335'
      />
    </svg>
  )
}
