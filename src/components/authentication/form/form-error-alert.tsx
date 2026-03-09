import { useFormContext } from '@/components/authentication/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useStore } from '@tanstack/react-form'
import { TriangleAlert } from 'lucide-react'

export default function FormErrorAlert() {
  const form = useFormContext()
  const errorMap = useStore(form.store, (state) => state.errorMap)

  return (
    <>
      {errorMap.onSubmit && (
        <Alert variant='destructive' className='border-destructive'>
          <TriangleAlert />
          <AlertDescription className='font-medium'>{errorMap.onSubmit.form}</AlertDescription>
        </Alert>
      )}
    </>
  )
}
