import { memberShortName } from '@/account/dashboard/mp-utils'

type Acc = {
  bookings: { status: string; memberId: string; date: string; slot: string }[]
  member: (id: string) => { name: string } | undefined
}

export function accountMpReminder(acc: Acc): string | null {
  const next = acc.bookings.find((b) => b.status === 'Upcoming')
  if (!next) return null
  const person = acc.member(next.memberId)
  const name = person ? memberShortName(person.name) : 'Member'
  const slotStart = next.slot.split('–')[0]?.trim() ?? next.slot
  return `Reminder: ${name}'s home collection is ${next.date} at ${slotStart}. Please fast for 10–12 hours before.`
}
