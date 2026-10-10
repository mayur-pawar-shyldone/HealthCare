export type AccountPackage = {
  id: string
  name: string
  summary: string
  tests: number
  price: number
  mrp: number
  time: string
  prep: string
  includes: string[]
}

export type FamilyMember = {
  id: string
  name: string
  relation: string
  dob: string
  phone: string
  status: string
}

export type Address = {
  id: string
  label: string
  line: string
  note: string
}

export type Booking = {
  id: string
  packageId: string
  memberId: string
  addressId: string
  date: string
  slot: string
  status: 'Upcoming' | 'Completed' | 'Cancelled' | 'Rescheduled'
  amount: number
  report?: boolean
}

export type Ticket = {
  id: string
  issue: string
  status: string
}

export type BookDraft = {
  packageId: string
  memberId: string
  addressId: string
  date: string
  slot: string
  newAddress: boolean
}

export const ACCOUNT_PACKAGES: AccountPackage[] = [
  {
    id: 'full-body',
    name: 'Full Body Advanced',
    summary: '84 parameters across organ systems, with a physician review.',
    tests: 84,
    price: 1799,
    mrp: 5600,
    time: '6 hours',
    prep: '8–12 hours fasting',
    includes: ['CBC, liver and kidney profile', 'Thyroid, diabetes and lipid panels', 'Vitamin D and B12'],
  },
  {
    id: 'heart',
    name: 'Heart Health',
    summary: 'Lipid profile, homocysteine and cardiac risk markers.',
    tests: 32,
    price: 899,
    mrp: 2999,
    time: '6 hours',
    prep: '10–12 hours fasting',
    includes: ['Lipid profile with ratios', 'Homocysteine and hs-CRP', 'Apolipoprotein A1 and B'],
  },
  {
    id: 'diabetes',
    name: 'Diabetes Care',
    summary: 'HbA1c with fasting glucose and kidney screening.',
    tests: 18,
    price: 649,
    mrp: 1450,
    time: '6 hours',
    prep: 'Fasting required',
    includes: ['HbA1c', 'Fasting and post-meal glucose', 'Kidney screening'],
  },
  {
    id: 'women',
    name: "Women's Wellness",
    summary: 'Hormones, iron studies, thyroid and vitamin levels.',
    tests: 46,
    price: 1299,
    mrp: 3800,
    time: '6 hours',
    prep: 'No fasting for most markers',
    includes: ['LH, FSH, prolactin', 'Iron studies and ferritin', 'Thyroid, vitamin D and B12'],
  },
]

export const BOOKING_DATES = [
  { id: 'd1', label: 'Sat 11 Oct', slots: ['6:30–7:30 AM', '7:00–8:00 AM', '8:00–9:00 AM'] },
  { id: 'd2', label: 'Sun 12 Oct', slots: [] as string[] },
  { id: 'd3', label: 'Mon 13 Oct', slots: ['7:00–8:00 AM', '9:00–10:00 AM'] },
  { id: 'd4', label: 'Tue 14 Oct', slots: ['6:30–7:30 AM', '8:00–9:00 AM'] },
]

export function createInitialFamily(name: string, mobile: string): FamilyMember[] {
  return [
    { id: 'self', name, relation: 'Self', dob: '14 Aug 1991', phone: mobile, status: 'Active' },
    { id: 'spouse', name: 'Meera Menon', relation: 'Spouse', dob: '02 Jan 1993', phone: '9876501122', status: 'Active' },
    { id: 'father', name: 'Suresh Menon', relation: 'Father', dob: '19 May 1962', phone: '9820012345', status: 'Active' },
  ]
}

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'HID-20418',
    packageId: 'full-body',
    memberId: 'father',
    addressId: 'parents',
    date: 'Tue, 14 Oct',
    slot: '7:00–8:00 AM',
    status: 'Upcoming',
    amount: 1799,
  },
  {
    id: 'HID-19802',
    packageId: 'diabetes',
    memberId: 'self',
    addressId: 'home',
    date: 'Sat, 20 Sep',
    slot: '8:00–9:00 AM',
    status: 'Completed',
    amount: 649,
    report: true,
  },
  {
    id: 'HID-18770',
    packageId: 'heart',
    memberId: 'spouse',
    addressId: 'home',
    date: 'Mon, 4 Aug',
    slot: '6:30–7:30 AM',
    status: 'Cancelled',
    amount: 899,
  },
]

export const INITIAL_ADDRESSES: Address[] = [
  { id: 'home', label: 'Home', line: '14, Palm Court, Andheri East, Mumbai 400069', note: 'Gate 2, call on arrival' },
  { id: 'parents', label: 'Parents', line: '8, Shanti Nagar, Dadar West, Mumbai 400028', note: 'Third floor, no lift' },
]
