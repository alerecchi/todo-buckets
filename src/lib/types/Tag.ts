import { z } from 'zod'

import { ColorKeySchema } from '@/lib/types/Color'

export {
  COLOR_KEYS as TAG_COLOR_KEYS,
  DEFAULT_COLOR_KEY as DEFAULT_TAG_COLOR_KEY,
  ColorKeySchema as TagColorKeySchema,
} from '@/lib/types/Color'
export type { ColorKey as TagColorKey } from '@/lib/types/Color'

export const TagDisplaySchema = z.object({
  colorKey: ColorKeySchema,
  id: z.int(),
  name: z.string(),
})

export type TagDisplay = z.infer<typeof TagDisplaySchema>
