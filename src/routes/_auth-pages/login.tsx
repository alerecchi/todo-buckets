import AuthContainer, { AuthTab } from '@/components/authentication/auth-container'
import { redirectIfAuthenticated } from '@/lib/utils/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-pages/login')({
  beforeLoad: ({ context }) => {
    redirectIfAuthenticated(context.user)
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    // TODO This first div is more a upper layer container, maybe body, probably something that is common to all of the components
    <div className='min-h-screen flex flex-col bg-background text-foreground antialiased'>
      {/* TODO Paddings maybe could be extracted in a design system if they are standard? or is this the tailwind way */}
      <main className='relative flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8'>
        {/* TODO PRobably remove this  */}
        <div className='pointer-events-none absolute inset-0 overflow-hidden hidden sm:block'>
          <div className='absolute -left-[20%] -top-[20%] h-[50vh] w-[50vw] rounded-full bg-primary/25 blur-3xl' />
          <div className='absolute -right-[20%] top-[30%] h-[50vh] w-[50vw] rounded-full bg-primary/25 blur-3xl' />
        </div>
        {/* TODO Remove z-10 if I remove the background blobs */}
        <div className='w-full max-w-md z-10'>
          <AuthContainer activeTab={AuthTab.LOGIN} />
        </div>
      </main>
    </div>
  )
}
