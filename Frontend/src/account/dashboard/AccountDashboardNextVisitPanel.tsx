import { Link } from 'react-router-dom'
import { CalendarClock, Home, MapPin } from 'lucide-react'
import { useAccount } from '@/account/AccountContext'

export function AccountDashboardNextVisitPanel() {
  const acc = useAccount()
  const next = acc.bookings.find((b) => b.status === 'Upcoming')
  const member = next ? acc.member(next.memberId) : undefined
  const address = next ? acc.address(next.addressId) : undefined
  const pkg = next ? acc.pkg(next.packageId) : undefined

  if (!next || !pkg) {
    return (
      <section className="flex flex-col overflow-hidden rounded-[28px] bg-white">
        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <h2 className="text-[22px] font-bold tracking-tight text-brick">Next home visit</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">No visit scheduled. Book at member price anytime.</p>
          <Link
            to="/account/catalogue"
            className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-mp-teal px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-mp-teal-700"
          >
            Browse tests
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="flex flex-col overflow-hidden rounded-[28px] bg-white">
      <div className="p-6 sm:p-8">
        <h2 className="text-[22px] font-bold tracking-tight text-brick">Next home visit</h2>
        <ul className="mt-5 space-y-5">
          <li className="flex items-center gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-mp-coral text-white">
              <CalendarClock className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-semibold text-navy">{next.date}</p>
              <p className="text-sm text-muted">{next.slot}</p>
            </div>
          </li>
          <li className="flex items-center gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-mp-teal text-white">
              <MapPin className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-semibold text-navy">{address?.label ?? 'Collection address'}</p>
              <p className="text-sm text-muted">{address?.line ?? '—'}</p>
            </div>
          </li>
        </ul>
      </div>
      <div className="mt-auto bg-mp-teal px-6 py-6 text-white sm:px-8">
        <p className="text-lg font-bold">{pkg.name}</p>
        <p className="text-sm text-white/85">for {member?.name ?? 'Member'}</p>
        <Link
          to={`/account/bookings/${next.id}`}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors duration-150 hover:bg-mp-teal-50"
        >
          <Home className="h-4 w-4" aria-hidden />
          Manage visit
        </Link>
      </div>
    </section>
  )
}
