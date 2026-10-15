import { Link, useNavigate } from 'react-router-dom'
import { FileText, FlaskConical, Sparkles } from 'lucide-react'
import { ACCOUNT_PACKAGES } from '@/account/account-data'
import { useAccount } from '@/account/AccountContext'
import { AccountCardWalletSection } from '@/account/AccountCardWalletSection'
import { AccountDashboardFamilyPanel } from '@/account/dashboard/AccountDashboardFamilyPanel'
import { AccountDashboardHeroCard } from '@/account/dashboard/AccountDashboardHeroCard'
import { AccountDashboardNextVisitPanel } from '@/account/dashboard/AccountDashboardNextVisitPanel'
import { AccountDashboardWalletPanel } from '@/account/dashboard/AccountDashboardWalletPanel'
import { dashboardGreeting } from '@/account/dashboard/mp-utils'
import { PLATFORM } from '@/data/platform-content'

/** Account dashboard — Magic Patterns home + card & wallet hub. */
export function AccountDashboardPageContent() {
  const acc = useAccount()
  const navigate = useNavigate()
  const firstName = acc.name.split(' ')[0]

  function scrollToCardHub(openAdd?: boolean) {
    if (openAdd && !acc.showAdd) acc.toggleShowAdd()
    document.getElementById(openAdd ? 'card-family' : 'card-wallet')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-[20px] bg-navy py-4 pl-5 pr-5 sm:py-5 sm:pl-6 sm:pr-6 md:py-4 md:pl-6 md:pr-6">
        <div className="relative z-[1] min-w-0 md:max-w-[calc(100%-304px)] md:pr-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-[#8fe0d6]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Active · {PLATFORM.membership.flatDiscount}% member pricing
          </span>
          <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-white sm:text-[28px]">
            {dashboardGreeting()}, {firstName}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">
            Your family card covers {acc.family.length} people. Book any test at member price with free home collection.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                acc.choosePackage(ACCOUNT_PACKAGES[0].id)
                navigate('/account/book/member')
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-mp-coral px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-mp-coral-600"
            >
              <FlaskConical className="h-4 w-4" aria-hidden />
              Book a test
            </button>
            <Link
              to="/account/bookings"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <FileText className="h-4 w-4" aria-hidden />
              My reports
            </Link>
          </div>
        </div>

        <div className="relative z-[2] mt-3 w-fit max-w-full md:absolute md:right-5 md:top-3 md:mt-0 md:translate-y-0">
          <AccountDashboardHeroCard flushRight />
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr_0.85fr]">
        <AccountDashboardFamilyPanel onAddMember={() => scrollToCardHub(true)} />
        <AccountDashboardWalletPanel />
        <AccountDashboardNextVisitPanel />
      </div>

      <AccountCardWalletSection onAddMember={() => scrollToCardHub(true)} />
    </div>
  )
}
