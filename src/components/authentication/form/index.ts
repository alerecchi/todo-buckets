import FormErrorAlert from '@/components/authentication/form/form-error-alert'
import PasswordInput from '@/components/authentication/form/password-input'
import { SubmitButton } from '@/components/authentication/form/submit-button'
import TextInput from '@/components/authentication/form/text-input'
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { PasswordInput, TextInput },
  formComponents: { SubmitButton, FormErrorAlert },
})
