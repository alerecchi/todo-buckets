import { Bucket } from '@/types/Bucket'
import { BucketColumn } from './BucketColumn'

interface BucketListProps {
  bucketList: Bucket[]
}

export function BucketList({ bucketList }: BucketListProps) {
  return (
    <div className="container mx-auto grid grid-cols-5 gap-4">
      {bucketList.map((bucketItem) => (
        <BucketColumn bucket={bucketItem} />
      ))}
    </div>
  )
}
