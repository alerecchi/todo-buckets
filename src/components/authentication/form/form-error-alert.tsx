import { useStore } from '@tanstack/react-form'
import { TriangleAlert } from 'lucide-react'

import { useFormContext } from '@/components/authentication/form'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function FormErrorAlert() {
  const form = useFormContext()
  const error = useStore(form.store, (state) => state.errorMap.onSubmit?.form)

  return (
    <>
      {error && (
        <Alert variant='destructive' className='border-destructive'>
          <TriangleAlert />
          <AlertDescription className='font-medium'>{error}</AlertDescription>
        </Alert>
      )}
    </>
  )
}
