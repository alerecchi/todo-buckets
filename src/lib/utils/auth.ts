import { redirect } from '@tanstack/react-router'

export function redirectIfAuthenticated(user: { emailVerified: boolean } | undefined) {
  if (user) {
    if (user.emailVerified) {
      throw redirect({ to: '/board' })
    } else {
      throw redirect({ to: '/email_confirmation' })
    }
  }
}

export function redirectIfNotAuthenticated(user: { emailVerified: boolean } | undefined, redirectLink: string) {
  if (!user) {
    throw redirect({ to: '/login', search: {redirect: redirectLink} }) // TODO sanatize redirect link (e.g. verify it's an internal link)
  } else if (!user.emailVerified) {
    throw redirect({ to: '/email_confirmation' })
  }
}