import AuthTextInput from '@shared/components/form/auth-text-input'
import FormErrorAlert from '@shared/components/form/form-error-alert'
import PasswordInput from '@shared/components/form/password-input'
import { SubmitButton } from '@shared/components/form/submit-button'
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { AuthTextInput, PasswordInput },
  formComponents: { SubmitButton, FormErrorAlert },
})
