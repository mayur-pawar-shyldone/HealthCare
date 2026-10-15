import { Link, useNavigate } from 'react-router-dom'
import { CalendarClock, Home, MapPin } from 'lucide-react'
import { useAccount } from '@/account/AccountContext'
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel'
import { navigateToPopularPlans } from '@/lib/landing-nav-scroll'

const rowIcon =
  'grid h-10 w-10 shrink-0 place-items-center rounded-full text-white'

export function AccountDashboardNextVisitPanel() {
  const acc = useAccount()
  const navigate = useNavigate()
  const next = acc.bookings.find((b) => b.status === 'Upcoming')
  const member = next ? acc.member(next.memberId) : undefined
  const address = next ? acc.address(next.addressId) : undefined
  const pkg = next ? acc.pkg(next.packageId) : undefined

  if (!next || !pkg) {
    return (
      <AccountDashboardPanel title="Next home visit" className="flex min-h-full flex-col">
        <p className="text-[13px] leading-relaxed text-muted">No visit scheduled yet.</p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">Pick a package from popular tests and book collection.</p>
        <button
          type="button"
          onClick={() => navigateToPopularPlans(navigate)}
          className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-mp-teal px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-mp-teal-700"
        >
          Browse popular tests
        </button>
      </AccountDashboardPanel>
    )
  }

  return (
    <AccountDashboardPanel title="Next home visit" className="flex min-h-full flex-col overflow-hidden">
      <ul className="space-y-4">
        <li className="flex items-start gap-3">
          <span className={`${rowIcon} bg-mp-coral`}>
            <CalendarClock className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 pt-0.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Date & time</p>
            <p className="mt-0.5 text-[15px] font-semibold text-navy">{next.date}</p>
            <p className="mt-0.5 text-[13px] text-muted">{next.slot}</p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className={`${rowIcon} bg-mp-teal`}>
            <MapPin className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 pt-0.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Collection address</p>
            <p className="mt-0.5 text-[15px] font-semibold text-navy">{address?.label ?? 'Home'}</p>
              <p className="mt-0.5 text-[13px] leading-snug text-muted">{next.addressLine ?? address?.line ?? '—'}</p>
          </div>
        </li>
      </ul>
      <div className="-mx-3.5 -mb-3.5 mt-4 bg-mp-teal px-3.5 py-4 sm:-mx-4 sm:-mb-4 sm:px-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-white/75">Scheduled test</p>
        <p className="mt-1 text-lg font-bold leading-tight text-white">{pkg.name}</p>
        <p className="mt-1 text-[13px] text-white/90">for {member?.name ?? 'Member'}</p>
        <Link
          to={`/account/bookings/${next.id}`}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors duration-150 hover:bg-mp-teal-50"
        >
          <Home className="h-4 w-4" aria-hidden />
          Manage visit
        </Link>
      </div>
    </AccountDashboardPanel>
  )
}
