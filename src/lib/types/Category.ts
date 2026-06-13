import { z } from 'zod'

import { ColorKeySchema } from '@/lib/types/Color'

export {
  COLOR_KEYS as CATEGORY_COLOR_KEYS,
  DEFAULT_COLOR_KEY as DEFAULT_CATEGORY_COLOR_KEY,
  ColorKeySchema as CategoryColorKeySchema,
} from '@/lib/types/Color'
export type { ColorKey as CategoryColorKey } from '@/lib/types/Color'

export const CategoryDisplaySchema = z.object({
  colorKey: ColorKeySchema,
  id: z.int(),
  name: z.string(),
})

export type CategoryDisplay = z.infer<typeof CategoryDisplaySchema>
