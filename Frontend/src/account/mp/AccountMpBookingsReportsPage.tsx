import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarX, Download, FileText } from 'lucide-react'
import { useAccount } from '@/account/AccountContext'
import { memberShortName } from '@/account/dashboard/mp-utils'
import { formatMoney } from '@/lib/utils'

const bookingTabs = ['Upcoming', 'Completed', 'Cancelled'] as const
type BookingTab = (typeof bookingTabs)[number]

const statusStyle: Record<string, string> = {
  Upcoming: 'bg-mp-teal-50 text-mp-teal-700',
  Completed: 'bg-navy-50 text-navy',
  Cancelled: 'bg-mp-coral-50 text-brick',
}

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
    <div className="grid items-start gap-7 lg:grid-cols-[1.5fr_1fr]">
      <section className="rounded-[28px] bg-white p-6 sm:p-8">
        <h2 className="text-[30px] font-extrabold tracking-tight text-navy">My bookings</h2>
        <p className="mt-1 text-[15px] text-muted">Current and past home collections.</p>

        <div role="tablist" className="mt-6 flex flex-wrap gap-2">
          {bookingTabs.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2.5 text-[17px] font-medium transition-colors duration-150 ${
                tab === t ? 'bg-navy text-white' : 'bg-mp-teal-50 text-muted hover:text-navy'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <ul className="mt-4 divide-y divide-line">
          {visibleBookings.map((b) => {
            const pkg = acc.pkg(b.packageId)
            const member = acc.member(b.memberId)
            return (
              <li key={b.id} className="flex flex-col gap-4 py-6 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold text-navy">{pkg.name}</p>
                  <p className="mt-1 text-[15px] text-muted">
                    {member?.name} · {b.date} · {b.slot}
                  </p>
                  <p className="text-sm text-mp-teal-700">{b.id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-navy">{formatMoney(b.amount)}</span>
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusStyle[b.status] ?? ''}`}>{b.status}</span>
                  {b.status === 'Upcoming' ? (
                    <button
                      type="button"
                      onClick={() => {
                        acc.rescheduleBooking(b.id)
                        navigate('/account/bookings')
                      }}
                      className="rounded-full border border-line px-5 py-2.5 text-[15px] font-semibold text-navy transition-colors duration-150 hover:bg-canvas"
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
                      className="rounded-full border border-line px-5 py-2.5 text-[15px] font-semibold text-navy transition-colors duration-150 hover:bg-canvas"
                    >
                      Book again
                    </button>
                  ) : null}
                </div>
              </li>
            )
          })}
          {visibleBookings.length === 0 ? (
            <li className="flex flex-col items-center py-12 text-center">
              <CalendarX className="h-8 w-8 text-muted" aria-hidden />
              <p className="mt-3 font-semibold text-navy">No {tab.toLowerCase()} bookings</p>
              <p className="text-sm text-muted">They&apos;ll show up here when you have any.</p>
            </li>
          ) : null}
        </ul>
      </section>

      <section className="rounded-[28px] bg-white p-6 sm:p-8">
        <h2 className="text-[30px] font-extrabold tracking-tight text-navy">Reports</h2>
        <p className="mt-1 text-[15px] text-muted">Lab reports for people on this card.</p>

        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by person">
          {people.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={person === p}
              onClick={() => setPerson(p)}
              className={`rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-150 ${
                person === p ? 'bg-mp-coral text-white' : 'bg-mp-teal-50 text-muted hover:text-navy'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <ul className="mt-6 space-y-3">
          {reportRows.map((b) => {
            const pkg = acc.pkg(b.packageId)
            const member = acc.member(b.memberId)
            return (
              <li key={b.id} className="flex items-center gap-4 rounded-2xl bg-canvas p-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-mp-teal-700">
                  <FileText className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-navy">{pkg.name}</p>
                  <p className="text-sm text-muted">
                    {memberShortName(member?.name ?? '')} · {b.date}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Download ${pkg.name} PDF`}
                  onClick={() => acc.showToast('Report download is locked until the lab file is linked.')}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors duration-150 hover:bg-mp-teal-50"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  PDF
                </button>
              </li>
            )
          })}
          {reportRows.length === 0 ? (
            <li className="rounded-2xl bg-canvas p-6 text-center text-sm text-muted">No reports for {person} yet.</li>
          ) : null}
        </ul>
      </section>
    </div>
  )
}
