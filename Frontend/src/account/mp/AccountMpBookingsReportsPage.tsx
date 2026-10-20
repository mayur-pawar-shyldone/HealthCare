import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarX, Download, FileText } from 'lucide-react'
import { useAccount } from '@/account/AccountContext'
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel'
import { memberShortName } from '@/account/dashboard/mp-utils'
import { formatMoney } from '@/lib/utils'

const bookingTabs = ['Upcoming', 'Completed', 'Cancelled'] as const
type BookingTab = (typeof bookingTabs)[number]

const statusStyle: Record<string, string> = {
  Upcoming: 'bg-mp-teal-50 text-mp-teal-700',
  Completed: 'bg-navy-50 text-navy',
  Cancelled: 'bg-mp-coral-50 text-brick',
}

const tabClass = (active: boolean) =>
  `rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 ${
    active ? 'bg-navy text-white' : 'bg-mp-teal-50 text-muted hover:text-navy'
  }`

export function AccountMpBookingsReportsPage() {
  const acc = useAccount()
  const navigate = useNavigate()
  const [tab, setTab] = useState<BookingTab>('Upcoming')
  const [person, setPerson] = useState('All')

  const visibleBookings = acc.bookings.filter((b) => b.status === tab)
  const reportRows = acc.bookings.filter(
    (b) =>
      b.report &&
      (person === 'All' || memberShortName(acc.member(b.memberId)?.name ?? '') === person),
  )
  const people = ['All', ...acc.family.map((f) => memberShortName(f.name))]

  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-[1.5fr_1fr]">
      <AccountDashboardPanel title="My bookings" subtitle="Current and past home collections." className="flex h-full flex-col">
        <div role="tablist" className="flex flex-wrap gap-2">
          {bookingTabs.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={tabClass(tab === t)}
            >
              {t}
            </button>
          ))}
        </div>

        <ul className="mt-3 flex min-h-[280px] flex-1 flex-col divide-y divide-line">
          {visibleBookings.map((b) => {
            const pkg = acc.pkg(b.packageId)
            const member = acc.member(b.memberId)
            return (
              <li key={b.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold text-navy">{pkg.name}</p>
                  <p className="mt-0.5 text-[13px] text-muted">
                    {member?.name} · {b.date} · {b.slot}
                  </p>
                  <p className="text-xs text-mp-teal-700">{b.id}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[15px] font-bold text-navy">{formatMoney(b.amount)}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[b.status] ?? ''}`}>{b.status}</span>
                  {b.status === 'Upcoming' ? (
                    <button
                      type="button"
                      onClick={() => {
                        acc.rescheduleBooking(b.id)
                        navigate('/account/bookings')
                      }}
                      className="rounded-full border border-line px-4 py-2 text-[13px] font-semibold text-navy transition-colors duration-150 hover:bg-canvas"
                    >
                      Reschedule
                    </button>
                  ) : null}
                  {b.status === 'Completed' ? (
                    <button
                      type="button"
                      onClick={() => {
                        acc.choosePackage(b.packageId)
                        navigate('/account/book/member')
                      }}
                      className="rounded-full border border-line px-4 py-2 text-[13px] font-semibold text-navy transition-colors duration-150 hover:bg-canvas"
                    >
                      Book again
                    </button>
                  ) : null}
                </div>
              </li>
            )
          })}
          {visibleBookings.length === 0 ? (
            <li className="flex flex-col items-center py-8 text-center">
              <CalendarX className="h-7 w-7 text-muted" aria-hidden />
              <p className="mt-2 text-sm font-semibold text-navy">No {tab.toLowerCase()} bookings</p>
              <p className="text-[13px] text-muted">They&apos;ll show up here when you have any.</p>
            </li>
          ) : null}
        </ul>
      </AccountDashboardPanel>

      <AccountDashboardPanel title="Reports" subtitle="Lab reports for people on this card." className="flex h-full flex-col">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by person">
          {people.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={person === p}
              onClick={() => setPerson(p)}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150 ${
                person === p ? 'bg-mp-coral text-white' : 'bg-mp-teal-50 text-muted hover:text-navy'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <ul className="mt-3 flex min-h-[280px] flex-1 flex-col space-y-2">
          {reportRows.map((b) => {
            const pkg = acc.pkg(b.packageId)
            const member = acc.member(b.memberId)
            return (
              <li key={b.id} className="flex items-center gap-3 rounded-xl bg-canvas p-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-mp-teal-700">
                  <FileText className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-navy">{pkg.name}</p>
                  <p className="text-[13px] text-muted">
                    {memberShortName(member?.name ?? '')} · {b.date}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Download ${pkg.name} PDF`}
                  onClick={() => acc.showToast('Report download is locked until the lab file is linked.')}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold text-navy transition-colors duration-150 hover:bg-mp-teal-50"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden />
                  PDF
                </button>
              </li>
            )
          })}
          {reportRows.length === 0 ? (
            <li className="rounded-xl bg-canvas p-4 text-center text-[13px] text-muted">No reports for {person} yet.</li>
          ) : null}
        </ul>
      </AccountDashboardPanel>
    </div>
  )
}
