import { CalendarCheck, LayoutGrid, LifeBuoy, User } from 'lucide-react'

export const ACCOUNT_MP_NAV = [
  { to: '/account/dashboard', label: 'Home', icon: LayoutGrid, end: true },
  { to: '/account/bookings', label: 'Bookings & Reports', icon: CalendarCheck, end: false },
  { to: '/account/profile', label: 'My Account', icon: User, end: false },
  { to: '/account/support', label: 'Help & Support', icon: LifeBuoy, end: false },
] as const

export function accountMpTitle(pathname: string): string {
  if (pathname.startsWith('/account/bookings')) return 'Bookings & Reports'
  if (pathname.startsWith('/account/profile')) return 'My Account'
  if (pathname.startsWith('/account/support')) return 'Help & Support'
  if (pathname.startsWith('/account/dashboard')) return 'Home'
  return 'Home'
}
