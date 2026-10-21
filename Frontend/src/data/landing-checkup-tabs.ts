export type CheckupPackage = {
  id: string
  name: string
  testCount: number
  includes: string[]
  fasting: string
  recommendedFor: string
  reportTime: string
  price: number
  mrp: number
}

export type CheckupTab = {
  id: string
  label: string
  packages: CheckupPackage[]
}

export const CHECKUP_TAB_DATA: CheckupTab[] = []

export const CHECKUP_SUBTITLE = 'Member special rates · Free home collection · NABL partner labs'

export const CHECKUP_TONE_CLASSES = {
  peach: 'bg-tint-peach',
  mint: 'bg-tint-mint',
  lilac: 'bg-tint-lilac',
} as const

export const CHECKUP_TONES = ['peach', 'mint', 'lilac'] as const

export type CheckupTone = (typeof CHECKUP_TONES)[number]

export const CHECKUP_VISIBLE_TAGS = 4
