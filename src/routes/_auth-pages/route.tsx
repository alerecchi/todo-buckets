import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-pages')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    // TODO This first div is more a upper layer container, maybe body, probably something that is common to all of the components
    <div className='flex min-h-screen flex-col bg-background text-foreground antialiased'>
      {/* TODO Paddings maybe could be extracted in a design system if they are standard? or is this the tailwind way */}
      <main className='relative flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8'>
        {/* TODO PRobably remove this  */}
        {/* TODO if I keep this then move to a component */}
        <div className='pointer-events-none absolute inset-0 hidden overflow-hidden sm:block'>
          <div className='absolute -top-[20%] -left-[20%] h-[50vh] w-[50vw] rounded-full bg-primary/25 blur-3xl' />
          <div className='absolute top-[30%] -right-[20%] h-[50vh] w-[50vw] rounded-full bg-primary/25 blur-3xl' />
        </div>
        {/* TODO Remove z-10 if I remove the background blobs */}
        <div className='z-10 w-full max-w-md'>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
