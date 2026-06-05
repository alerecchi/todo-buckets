import FormErrorAlert from '@shared/components/form/form-error-alert'
import PasswordInput from '@shared/components/form/password-input'
import { SubmitButton } from '@shared/components/form/submit-button'
import TextInput from '@shared/components/form/text-input'
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { PasswordInput, TextInput },
  formComponents: { SubmitButton, FormErrorAlert },
})
