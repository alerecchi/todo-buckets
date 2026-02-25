export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  } else if (typeof error === 'object' && error != null && 'message' in error && typeof error.message === 'string') {
    return error.message
  } else {
    return 'Unknown error occured'
  }
}
