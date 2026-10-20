export type FvPackage = {
  id: string
  name: string
  summary: string
  tests: number
  price: number
  mrp: number
  reportTime: string
  badge?: string
  includes: string[]
}

export const FV_PACKAGES: FvPackage[] = [
  {
    id: 'full-body-advanced',
    name: 'Full Body Advanced',
    summary: 'Our most complete screening — 84 parameters across 12 organ systems, reviewed by a physician.',
    tests: 84,
    price: 1799,
    mrp: 5600,
    reportTime: '6 hours',
    badge: 'Most booked',
    includes: [
      'Complete blood count, liver & kidney profile',
      'Thyroid, diabetes and lipid panels',
      'Free doctor call to walk through results',
      'Vitamin D & B12 included at no extra cost',
    ],
  },
  {
    id: 'heart-health',
    name: 'Heart Health',
    summary: 'Lipid profile, homocysteine and cardiac risk markers.',
    tests: 32,
    price: 899,
    mrp: 2999,
    reportTime: '6 hours',
    badge: 'Up to 70% off',
    includes: ['Lipid profile with ratios', 'Homocysteine & hs-CRP', 'Apolipoprotein A1 & B'],
  },
  {
    id: 'diabetes-care',
    name: 'Diabetes Care',
    summary: 'HbA1c with fasting glucose and kidney screening.',
    tests: 18,
    price: 649,
    mrp: 1450,
    reportTime: '6 hours',
    includes: ['HbA1c (three-month average)', 'Fasting & post-meal glucose', 'Kidney screening with microalbumin'],
  },
  {
    id: 'women-wellness',
    name: 'Women’s Wellness',
    summary: 'Hormones, iron studies, thyroid and vitamin levels.',
    tests: 46,
    price: 1299,
    mrp: 3800,
    reportTime: '6 hours',
    badge: 'New',
    includes: ['Hormone panel — LH, FSH, prolactin', 'Iron studies & ferritin', 'Thyroid, vitamin D & B12'],
  },
]

export const PANEL_TINTS = ['bg-panel-mint', 'bg-panel-peach', 'bg-panel-lilac', 'bg-panel-sand'] as const

export const CARD_STATS = [
  { value: '30%', label: 'off every payment' },
  { value: '5', label: 'family members' },
  { value: '₹4,280', label: 'average yearly saving' },
]

export const CARD_BENEFITS = [
  {
    title: '30% off at every payment',
    description: 'Applied on the already discounted member price, not on MRP — on every booking, forever.',
  },
  {
    title: 'Covers your whole family',
    description: 'Add up to 5 members to one card and book for parents from your own account.',
  },
  {
    title: 'Free to get, free to keep',
    description: 'No joining fee, no annual fee. Issued digitally in minutes after a quick verification.',
  },
]

export const FAMILY_CARD_PERKS = [
  'Member rates on every test, for every member',
  'Up to 6 family members on one free card',
  'Free home collection in Mumbai, every time',
  'All reports and trends in one shared timeline',
  'Book for parents in another city from your account',
]

export type JourneyStepIconId = 'smartphone' | 'userCheck' | 'barcode' | 'message'

export const JOURNEY_STEP_TAGS = ['Takes 2 minutes', '30 minutes at home', 'Same day', 'Within 6 hours'] as const

export const JOURNEY_STEPS = [
  {
    id: 'book',
    title: 'Book with Ease',
    description:
      'Choose your test, pick a time slot and book instantly — no prescription needed for most panels.',
    icon: 'smartphone' as JourneyStepIconId,
    tag: 'Takes 2 minutes',
  },
  {
    id: 'collect',
    title: 'Hassle-Free Home Collection',
    description: 'Safe and timely sample collection at your door by a trained, certified phlebotomist.',
    icon: 'userCheck' as JourneyStepIconId,
    tag: '30 min average collection window',
  },
  {
    id: 'transfer',
    title: 'Secure Sample Transfer to Labs',
    description: 'Temperature-controlled, barcoded and tracked transport to our NABL-accredited partner labs.',
    icon: 'barcode' as JourneyStepIconId,
    tag: 'Same-day for most panels',
  },
  {
    id: 'report',
    title: 'Quick & Easy Report Access',
    description: 'Get your reports within 6 hours on WhatsApp, SMS and email — with a free doctor call.',
    icon: 'message' as JourneyStepIconId,
    tag: 'WhatsApp + app access',
  },
]

export const TESTIMONIALS = [
  {
    id: 't1',
    quote:
      'Booked a full body checkup for my parents at 9pm and the technician was at their door by 7am. Reports came the same evening.',
    name: 'Ananya Rao',
    meta: 'Mumbai · Full Body Advanced',
  },
  {
    id: 't2',
    quote:
      'The HealthID Card pricing is real — we saved on every thyroid and vitamin test for the whole family this quarter.',
    name: 'Rahul Mehta',
    meta: 'Bangalore · Family card',
  },
  {
    id: 't3',
    quote: 'Clear rates, no surprises at payment, and home collection that actually arrives on time.',
    name: 'Priya Nair',
    meta: 'Delhi NCR · Home collection',
  },
]

export const TRUST_STATS = [
  { value: '18,400+', label: 'Home collections completed' },
  { value: '4.8/5', label: 'Average member rating' },
  { value: '6h', label: 'Typical report turnaround' },
  { value: '6 cities', label: 'Live across India' },
]

export const CHECKUP_TABS = [
  { id: 'full-body', label: 'Full Body Checkup' },
  { id: 'vitamins', label: 'Vitamins' },
  { id: 'thyroid', label: 'Thyroid' },
  { id: 'heart', label: 'Heart' },
  { id: 'diabetes', label: 'Diabetes' },
] as const

export const SHOWCASE_TABS = ['Full body', 'Diabetes', 'Heart', 'Thyroid', 'Vitamins', 'Liver'] as const
