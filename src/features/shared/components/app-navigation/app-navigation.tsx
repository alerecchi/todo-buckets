import { Button } from '@shared/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@shared/components/ui/popover'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useRouteContext, useRouter } from '@tanstack/react-router'
import { CheckSquare, LogOut, User } from 'lucide-react'

import { authClient } from '@/features/authentication/auth-client'
import { userSessionQuery } from '@/features/authentication/queries/user-session'
import { ButtonLink } from '@/features/shared/components/button-link'

export function AppNavigation() {
  const { user } = useRouteContext({ from: '__root__' })

  return (
    <header className='sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80'>
      <nav className='flex h-14 items-center gap-6 px-4 sm:px-6' aria-label='Main navigation'>
        <Link
          to='/'
          className='flex min-w-fit items-center gap-2 rounded-md text-sm font-semibold transition-colors outline-none hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/50'
        >
          <span className='flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground'>
            <CheckSquare className='size-4' aria-hidden='true' />
          </span>
          <span>ProductivityUp</span>
        </Link>

        <div className='flex flex-1 items-center gap-1'>
          {user ? (
            <Link
              to='/board'
              className='rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&.active]:bg-muted [&.active]:text-foreground'
              activeOptions={{ exact: true }}
            >
              Board
            </Link>
          ) : null}
        </div>

        <div className='ml-auto flex items-center'>
          {user ? <UserMenu user={user} /> : <ButtonLink to='/login'>Sign in</ButtonLink>}
        </div>
      </nav>
    </header>
  )
}

function UserMenu({
  user,
}: {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const navigate = useNavigate()
  const displayName = user.name || user.email || 'Signed in'
  const signOutMutation = useMutation({
    mutationKey: userSessionQuery.key,
    mutationFn: async () => {
      const result = await authClient.signOut()

      if (result.error) {
        throw new Error('Failed to sign out. Please try again.')
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userSessionQuery.key })
      await router.invalidate()
      await navigate({ to: '/' })
    },
  })

  return (
    <Popover>
      <PopoverTrigger
        className='flex size-9 items-center justify-center overflow-hidden rounded-full border border-border bg-background text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50'
        aria-label='Open user menu'
      >
        {user.image ? (
          <img src={user.image} alt='' className='size-full object-cover' referrerPolicy='no-referrer' />
        ) : (
          <User className='size-4' aria-hidden='true' />
        )}
      </PopoverTrigger>
      <PopoverContent align='end' sideOffset={8} className='w-64 gap-3 p-2'>
        <div className='px-2 py-1.5'>
          <p className='truncate text-sm font-medium'>{displayName}</p>
          {user.email ? <p className='truncate text-xs text-muted-foreground'>{user.email}</p> : null}
        </div>
        <div className='h-px bg-border' />
        {signOutMutation.error ? (
          <p className='px-2 text-xs text-destructive'>{signOutMutation.error.message}</p>
        ) : null}
        <Button
          type='button'
          variant='ghost'
          className='w-full justify-start text-destructive hover:text-destructive'
          onClick={() => signOutMutation.mutate()}
          disabled={signOutMutation.isPending}
        >
          <LogOut aria-hidden='true' />
          Logout
        </Button>
      </PopoverContent>
    </Popover>
  )
}
