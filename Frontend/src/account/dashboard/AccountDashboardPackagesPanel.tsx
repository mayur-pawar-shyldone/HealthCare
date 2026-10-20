import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { ACCOUNT_PACKAGES } from '@/account/account-data'
import { useAccount } from '@/account/AccountContext'
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel'
import { PLATFORM } from '@/data/platform-content'
import { formatMoney } from '@/lib/utils'

export function AccountDashboardPackagesPanel() {
  const acc = useAccount()
  const navigate = useNavigate()
  const [added, setAdded] = useState<string | null>(null)

  return (
    <div id="packages" className="scroll-mt-6">
      <AccountDashboardPanel
        title="Book at member price"
        subtitle={`Free home collection · Reports in ${PLATFORM.reportHours} hours`}
      >
        <ul className="grid gap-x-10 md:grid-cols-2">
          {ACCOUNT_PACKAGES.map((p) => (
            <li key={p.id} className="flex items-center gap-4 border-t border-line py-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-mp-teal-700">{p.tests} tests</p>
                <p className="text-[15px] font-semibold text-navy">{p.name}</p>
                <p className="mt-0.5 truncate text-[13px] text-muted">{p.summary}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-extrabold text-navy">{formatMoney(p.price)}</p>
                <p className="text-[13px] text-muted line-through">{formatMoney(p.mrp)}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAdded(p.id)
                  acc.choosePackage(p.id)
                  navigate('/account/book/member')
                }}
                className={`w-[84px] rounded-full py-2 text-[13px] font-semibold transition-colors duration-150 ${
                  added === p.id ? 'bg-mp-teal-50 text-mp-teal-700' : 'bg-mp-coral text-white hover:bg-mp-coral-600'
                }`}
              >
                {added === p.id ? (
                  <span className="inline-flex items-center gap-1">
                    <Check className="h-4 w-4" />
                    Added
                  </span>
                ) : (
                  'Book'
                )}
              </button>
            </li>
          ))}
        </ul>
      </AccountDashboardPanel>
    </div>
  )
}
