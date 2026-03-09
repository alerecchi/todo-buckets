import { Separator } from '@/components/ui/separator'

export default function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative'>
      <Separator />
      <div className='absolute inset-0 flex items-center justify-center'>
        <span className='bg-card px-2 text-muted-foreground text-xs uppercase tracking-wide'>{children}</span>
      </div>
    </div>
  )
}
