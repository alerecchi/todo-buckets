import { Inbox } from "lucide-react"
import TodoCard from './TodoCard'
import { Bucket } from '@/types/Bucket'

interface BucketProps {
  bucket: Bucket
}

export function BucketColumn({ bucket }: BucketProps) {
  return (
    <div className="flex flex-col gap-4 min-h-[100px] p-2 rounded-lg border-2 border-dashed border-border bg-muted/20">
      <div className="flex flex-row gap-2 items-center p-2">
        <Inbox />
        <h2 className="text-lg font-semibold">{bucket.name}</h2>
        </div>
      <div className="flex flex-col gap-2">
        {bucket.todos.map((todoItem) => (
        <TodoCard todo={todoItem} />
      ))}
      </div>
      
    </div>
  )
}
