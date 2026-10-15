import type { BookingCartItem } from '@/booking/booking-session'

export function bookStartUrl(item: Pick<BookingCartItem, 'id' | 'name' | 'memberPrice' | 'mrp' | 'testCount' | 'prep'>) {
  const params = new URLSearchParams({
    id: item.id,
    name: item.name,
    price: String(item.memberPrice),
    mrp: String(item.mrp),
    tests: String(item.testCount ?? 1),
  })
  if (item.prep) params.set('prep', item.prep)
  return `/book/start?${params.toString()}`
}
