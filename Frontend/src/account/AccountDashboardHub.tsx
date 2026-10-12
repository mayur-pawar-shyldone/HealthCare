import { Link, useNavigate } from 'react-router-dom'
import { FileText, FlaskConical, Sparkles } from 'lucide-react'
import { ACCOUNT_PACKAGES } from '@/account/account-data'
import { useAccount } from '@/account/AccountContext'
import { AccountDashboardFamilyPanel } from '@/account/dashboard/AccountDashboardFamilyPanel'
import { AccountDashboardHeroCard } from '@/account/dashboard/AccountDashboardHeroCard'
import { AccountDashboardNextVisitPanel } from '@/account/dashboard/AccountDashboardNextVisitPanel'
import { AccountDashboardPackagesPanel } from '@/account/dashboard/AccountDashboardPackagesPanel'
import { AccountDashboardWalletPanel } from '@/account/dashboard/AccountDashboardWalletPanel'
import { dashboardGreeting } from '@/account/dashboard/mp-utils'
import { PLATFORM } from '@/data/platform-content'

/** Account dashboard — Magic Patterns home layout wired to account context. */
export function AccountDashboardPageContent() {
  const acc = useAccount()
  const navigate = useNavigate()
  const firstName = acc.name.split(' ')[0]

  return (
    <div className="account-dashboard-mp space-y-7">
      <section className="flex flex-col gap-8 rounded-[28px] bg-navy p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[700px]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-[#8fe0d6]">
            <Sparkles className="h-4 w-4" aria-hidden />
            Active · {PLATFORM.membership.flatDiscount}% member pricing
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-[46px]">
            {dashboardGreeting()}, {firstName}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/80">
            Your family card covers {acc.family.length} people. Book any test at member price with free home collection.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                acc.choosePackage(ACCOUNT_PACKAGES[0].id)
                navigate('/account/book/member')
              }}
              className="inline-flex items-center gap-2 rounded-full bg-mp-coral px-6 py-3.5 text-[17px] font-semibold text-white transition-colors duration-150 hover:bg-mp-coral-600"
            >
              <FlaskConical className="h-5 w-5" aria-hidden />
              Book a test
            </button>
            <Link
              to="/account/bookings"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-[17px] font-semibold text-white transition-colors duration-150 hover:bg-white/10"
            >
              <FileText className="h-5 w-5" aria-hidden />
              My reports
            </Link>
          </div>
        </div>
        <AccountDashboardHeroCard />
      </section>

      <div className="grid gap-7 lg:grid-cols-[1.25fr_1fr_0.85fr]">
        <AccountDashboardFamilyPanel onAddMember={() => navigate('/account/profile')} />
        <AccountDashboardWalletPanel />
        <AccountDashboardNextVisitPanel />
      </div>

      <AccountDashboardPackagesPanel />
    </div>
  )
}
