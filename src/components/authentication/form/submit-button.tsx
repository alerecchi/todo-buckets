import { useStore } from '@tanstack/react-form'

import { useFormContext } from '@/components/authentication/form'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'

type SubmitButtonProps = {
  text: string
  formId: string
}

export function SubmitButton({ text, formId }: SubmitButtonProps) {
  const form = useFormContext()
  const canSubmit = useStore(form.store, (state) => state.canSubmit)
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

  return (
    <Field>
      <Button size='lg' className='cursor-pointer' type='submit' form={formId} disabled={!canSubmit || isSubmitting}>
        {text}
        {isSubmitting && <Spinner data-icon='inline-end' />}
      </Button>
    </Field>
  )
}
