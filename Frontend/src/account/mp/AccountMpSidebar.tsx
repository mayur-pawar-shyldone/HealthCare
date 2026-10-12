import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAccount } from '@/account/AccountContext'
import { AccountMpLogo } from '@/account/mp/AccountMpLogo'
import { ACCOUNT_MP_NAV } from '@/account/mp/account-mp-nav'
import { formatValidTill } from '@/account/dashboard/mp-utils'

type Props = { onNavigate?: () => void }

export function AccountMpSidebar({ onNavigate }: Props) {
  const acc = useAccount()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="flex h-full flex-col bg-white px-2 pb-4 pt-5">
      <div className="px-2">
        <AccountMpLogo />
      </div>

      <nav aria-label="Main" className="mt-8 flex flex-col gap-1.5">
        {ACCOUNT_MP_NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) => {
              const active =
                isActive ||
                (to === '/account/bookings' && pathname.startsWith('/account/bookings')) ||
                (to === '/account/profile' && pathname.startsWith('/account/profile'))
              return `flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-mp-teal ${
                active ? 'bg-navy font-semibold text-white' : 'text-navy hover:bg-canvas'
              }`
            }}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            <span className="whitespace-nowrap">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="rounded-2xl bg-mp-teal-50 px-5 py-4">
          <p className="text-sm font-medium text-mp-teal-700">Card active</p>
          <p className="mt-0.5 text-lg font-bold text-navy">{acc.memberId()}</p>
          <p className="text-sm text-muted">Valid till {formatValidTill()}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            acc.logout()
            navigate('/login')
            onNavigate?.()
          }}
          className="mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[15px] font-medium text-brick transition-colors duration-150 hover:bg-mp-coral-50"
        >
          <LogOut className="h-5 w-5" aria-hidden />
          Log out
        </button>
      </div>
    </div>
  )
}
