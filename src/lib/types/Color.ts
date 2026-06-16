import { z } from 'zod'

export const COLOR_KEYS = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'teal',
  'blue',
  'violet',
  'rose',
] as const
export const DEFAULT_COLOR_KEY = 'blue'

export const ColorKeySchema = z.enum(COLOR_KEYS)

export type ColorKey = z.infer<typeof ColorKeySchema>

export type ColorPreset = {
  backgroundColorClass: string
  textColorClass: string
}

export const COLOR_PRESETS = {
  amber: {
    backgroundColorClass: '[--todo-category-color:var(--color-amber-500)]',
    textColorClass: '[--todo-category-text:var(--color-amber-700)]',
  },
  blue: {
    backgroundColorClass: '[--todo-category-color:var(--color-blue-500)]',
    textColorClass: '[--todo-category-text:var(--color-blue-700)]',
  },
  green: {
    backgroundColorClass: '[--todo-category-color:var(--color-green-500)]',
    textColorClass: '[--todo-category-text:var(--color-green-700)]',
  },
  lime: {
    backgroundColorClass: '[--todo-category-color:var(--color-lime-500)]',
    textColorClass: '[--todo-category-text:var(--color-lime-700)]',
  },
  orange: {
    backgroundColorClass: '[--todo-category-color:var(--color-orange-500)]',
    textColorClass: '[--todo-category-text:var(--color-orange-700)]',
  },
  red: {
    backgroundColorClass: '[--todo-category-color:var(--color-red-500)]',
    textColorClass: '[--todo-category-text:var(--color-red-700)]',
  },
  rose: {
    backgroundColorClass: '[--todo-category-color:var(--color-rose-500)]',
    textColorClass: '[--todo-category-text:var(--color-rose-700)]',
  },
  teal: {
    backgroundColorClass: '[--todo-category-color:var(--color-teal-500)]',
    textColorClass: '[--todo-category-text:var(--color-teal-700)]',
  },
  violet: {
    backgroundColorClass: '[--todo-category-color:var(--color-violet-500)]',
    textColorClass: '[--todo-category-text:var(--color-violet-700)]',
  },
  yellow: {
    backgroundColorClass: '[--todo-category-color:var(--color-yellow-500)]',
    textColorClass: '[--todo-category-text:var(--color-yellow-700)]',
  },
} satisfies Record<ColorKey, ColorPreset>

export function getColorPreset(colorKey: string): ColorPreset {
  const parsedColorKey = ColorKeySchema.safeParse(colorKey)
  return COLOR_PRESETS[parsedColorKey.success ? parsedColorKey.data : DEFAULT_COLOR_KEY]
}
