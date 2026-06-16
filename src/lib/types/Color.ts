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
    backgroundColorClass: '[--todo-marker-bg:var(--color-amber-500)]',
    textColorClass: '[--todo-marker-fg:var(--color-amber-700)]',
  },
  blue: {
    backgroundColorClass: '[--todo-marker-bg:var(--color-blue-500)]',
    textColorClass: '[--todo-marker-fg:var(--color-blue-700)]',
  },
  green: {
    backgroundColorClass: '[--todo-marker-bg:var(--color-green-500)]',
    textColorClass: '[--todo-marker-fg:var(--color-green-700)]',
  },
  lime: {
    backgroundColorClass: '[--todo-marker-bg:var(--color-lime-500)]',
    textColorClass: '[--todo-marker-fg:var(--color-lime-700)]',
  },
  orange: {
    backgroundColorClass: '[--todo-marker-bg:var(--color-orange-500)]',
    textColorClass: '[--todo-marker-fg:var(--color-orange-700)]',
  },
  red: {
    backgroundColorClass: '[--todo-marker-bg:var(--color-red-500)]',
    textColorClass: '[--todo-marker-fg:var(--color-red-700)]',
  },
  rose: {
    backgroundColorClass: '[--todo-marker-bg:var(--color-rose-500)]',
    textColorClass: '[--todo-marker-fg:var(--color-rose-700)]',
  },
  teal: {
    backgroundColorClass: '[--todo-marker-bg:var(--color-teal-500)]',
    textColorClass: '[--todo-marker-fg:var(--color-teal-700)]',
  },
  violet: {
    backgroundColorClass: '[--todo-marker-bg:var(--color-violet-500)]',
    textColorClass: '[--todo-marker-fg:var(--color-violet-700)]',
  },
  yellow: {
    backgroundColorClass: '[--todo-marker-bg:var(--color-yellow-500)]',
    textColorClass: '[--todo-marker-fg:var(--color-yellow-700)]',
  },
} satisfies Record<ColorKey, ColorPreset>

export function getColorPreset(colorKey: string): ColorPreset {
  return COLOR_PRESETS[getParsedColorKey(colorKey)]
}

function getParsedColorKey(colorKey: string): ColorKey {
  const parsedColorKey = ColorKeySchema.safeParse(colorKey)
  return parsedColorKey.success ? parsedColorKey.data : DEFAULT_COLOR_KEY
}
