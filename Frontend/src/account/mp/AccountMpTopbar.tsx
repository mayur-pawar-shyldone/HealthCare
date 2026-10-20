import { useLocation } from 'react-router-dom'
import { Bell, Menu } from 'lucide-react'
import { useAccount } from '@/account/AccountContext'
import { accountMpTitle } from '@/account/mp/account-mp-nav'
import { memberInitials, memberShortName } from '@/account/dashboard/mp-utils'

type Props = { onMenu: () => void }

export function AccountMpTopbar({ onMenu }: Props) {
  const { pathname } = useLocation()
  const acc = useAccount()
  const title = accountMpTitle(pathname)
  const firstName = memberShortName(acc.name)

  return (
    <header className="flex h-14 items-center justify-between border-b border-line bg-white px-4 lg:px-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          className="grid h-10 w-10 place-items-center rounded-xl text-navy hover:bg-canvas lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-medium text-muted">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications, 2 unread"
          className="relative grid h-11 w-11 place-items-center rounded-full bg-mp-teal-50 text-mp-teal-700 transition-colors duration-150 hover:bg-[#d3ecea]"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-mp-coral text-[11px] font-bold text-white ring-2 ring-white">
            2
          </span>
        </button>
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-navy text-sm font-bold text-white">
            {memberInitials(acc.name)}
          </span>
          <div className="hidden leading-tight sm:block">
            <p className="text-[15px] font-semibold text-navy">Hi, {firstName}</p>
            <p className="text-sm text-brick">{acc.memberId()}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
