import { Link, useNavigate } from 'react-router-dom'
import { CalendarDays, ChevronRight, CreditCard, FlaskConical, ShieldCheck, Sparkles } from 'lucide-react'
import { PLATFORM } from '@/data/platform-content'
import { ACCOUNT_PACKAGES } from '@/account/account-data'
import { rupee, useAccount } from '@/account/AccountContext'
import { AccountCardWalletSection } from '@/account/AccountCardWalletSection'
import { AccountMemberCard } from '@/account/AccountMemberCard'
import { AccountQuickActions } from '@/account/AccountQuickActions'
import { cn } from '@/lib/utils'

const MAX_FAMILY = 6

function StatTile({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="dash-stat-tile">
      <span className="dash-stat-label">{label}</span>
      <b className="dash-stat-value">{value}</b>
      {hint ? <span className="dash-stat-hint">{hint}</span> : null}
    </div>
  )
}

/** Account dashboard — card-first; typography matches account shell. */
export function AccountDashboardPageContent() {
  const acc = useAccount()
  const navigate = useNavigate()
  const firstName = acc.name.split(' ')[0]
  const upcoming = acc.bookings.filter((b) => b.status === 'Upcoming')
  const reports = acc.bookings.filter((b) => b.report).length
  const next = upcoming[0]
  const savedOnCompleted = acc.bookings
    .filter((b) => b.status === 'Completed')
    .reduce((sum, b) => sum + Math.max(0, acc.pkg(b.packageId).mrp - b.amount), 0)

  function scrollToCardHub(openAdd?: boolean) {
    if (openAdd && !acc.showAdd) acc.toggleShowAdd()
    document.getElementById(openAdd ? 'card-family' : 'card-wallet')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="account-dashboard flex w-full flex-col gap-6 pb-2">
      <header className="hero overflow-hidden rounded-[24px] border border-line/80 shadow-[0_20px_50px_rgba(16,52,74,0.25)] md:rounded-[28px]">
        <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="min-w-0 flex-1 lg:max-w-xl">
            <p className="dash-eyebrow dash-eyebrow-light">Member dashboard</p>
            <h1 className="dash-h1 dash-h1-light">{firstName}&apos;s HealthID Card</h1>
            <p className="dash-lead dash-lead-light">{PLATFORM.membership.description}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-400/20 px-3 py-1 dash-badge text-emerald-50">
              <Sparkles className="h-3.5 w-3.5" />
              Active · {PLATFORM.membership.flatDiscount}% member pricing
            </div>
            <div className="hero-actions mt-5">
              <button
                type="button"
                className="hid-btn hid-btn-primary"
                onClick={() => {
                  acc.choosePackage(ACCOUNT_PACKAGES[0].id)
                  navigate('/account/book/member')
                }}
              >
                <FlaskConical className="h-4 w-4" />
                Book with member price
              </button>
              <button type="button" className="hid-btn hid-btn-ghost" onClick={() => scrollToCardHub()}>
                <CreditCard className="h-4 w-4" />
                View card &amp; wallet
              </button>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[400px] shrink-0 lg:mx-0">
            <AccountMemberCard showCaption={false} className="max-w-none" />
          </div>
        </div>
      </header>

      <div className="dash-stat-grid">
        <StatTile label="Card ID" value={acc.memberId()} hint="Show at collection" />
        <StatTile label="Upcoming" value={upcoming.length} hint="Home visits scheduled" />
        <StatTile label="Reports" value={reports} hint={`Ready in ${PLATFORM.reportHours}h`} />
        <StatTile label="Family" value={`${acc.family.length}/${MAX_FAMILY}`} hint="Book for anyone listed" />
      </div>

      <AccountCardWalletSection onAddMember={() => scrollToCardHub(true)} />

      <div className="dash-split">
        <AccountQuickActions onAddFamily={() => scrollToCardHub(true)} />

        <div className="flex flex-col gap-3">
          <section className="dash-panel dash-panel-lg">
            <div className="flex items-center justify-between gap-2">
              <p className="dash-section-eyebrow">Up next</p>
              <Link to="/account/bookings" className="dash-link">
                All bookings
              </Link>
            </div>
            {next ? (
              <div className="mt-3 rounded-2xl border border-teal/20 bg-teal-light/25 p-4">
                <p className="dash-body">
                  <strong>{acc.pkg(next.packageId).name}</strong>
                </p>
                <p className="mt-1 flex items-center gap-1.5 dash-muted">
                  <CalendarDays className="h-4 w-4 shrink-0 text-teal" />
                  {acc.member(next.memberId)?.name} · {next.date} · {next.slot}
                </p>
                <p className="mt-2 dash-body">
                  <strong className="text-teal">{rupee(next.amount)} · member rate</strong>
                </p>
                <Link to={`/account/bookings/${next.id}`} className="mt-3 inline-flex items-center gap-1 dash-link">
                  View details
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <p className="mt-3 dash-muted">No visit scheduled. Member pricing applies when you book.</p>
            )}
          </section>

          <section className="dash-panel">
            <p className="dash-section-eyebrow">Recent on your card</p>
            <ul className="mt-3 space-y-2">
              {acc.bookings.slice(0, 3).map((b) => (
                <li key={b.id}>
                  <Link
                    to={`/account/bookings/${b.id}`}
                    className="flex items-center justify-between gap-2 rounded-xl border border-line/60 px-3 py-2.5 transition hover:border-teal/30 hover:bg-[#f8fbfd]"
                  >
                    <span className="min-w-0 truncate dash-body">
                      <strong>{acc.pkg(b.packageId).name}</strong>
                    </span>
                    <span
                      className={cn(
                        'badge shrink-0',
                        b.status === 'Completed' && 'ok',
                        b.status === 'Cancelled' && 'muted',
                        b.status === 'Rescheduled' && 'warn',
                      )}
                    >
                      {b.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="dash-panel empty !py-5 !text-left">
            <div className="flex gap-3">
              <ShieldCheck className="h-8 w-8 shrink-0 text-teal" />
              <div>
                <p className="dash-body">
                  <strong>{savedOnCompleted > 0 ? `${rupee(savedOnCompleted)} saved so far` : 'Member savings active'}</strong>
                </p>
                <p className="mt-1 dash-muted">
                  Up to {PLATFORM.maxSavingsPct}% off MRP on {PLATFORM.testCount}+ tests — flat {PLATFORM.membership.flatDiscount}% at checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="dash-panel dash-panel-lg">
        <div className="page-head !mb-0">
          <div>
            <p className="dash-section-eyebrow">Book again</p>
            <h2 className="dash-h2">Popular packages at card price</h2>
          </div>
          <Link to="/account/catalogue" className="dash-link">
            Full catalogue
          </Link>
        </div>
        <div className="shell grid-3 mt-4">
          {ACCOUNT_PACKAGES.slice(0, 3).map((p) => (
            <article key={p.id} className="hid-card !shadow-none">
              <p className="dash-package-meta">
                {p.tests} tests · {p.time}
              </p>
              <p className="dash-package-title">{p.name}</p>
              <p className="dash-price mt-3">
                {rupee(p.price)} <s>{rupee(p.mrp)}</s>
              </p>
              <button
                type="button"
                className="hid-btn hid-btn-ghost hid-btn-sm mt-3 !px-0"
                onClick={() => {
                  acc.choosePackage(p.id)
                  navigate('/account/book/member')
                }}
              >
                Book on card →
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
