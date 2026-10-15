import { useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { AccountMpNotifications } from '@/account/mp/AccountMpNotifications'
import { AccountMpLogo } from '@/account/mp/AccountMpLogo'
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
    <header className="flex h-[60px] items-center justify-between border-b border-line bg-white px-4 lg:h-[64px] lg:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-navy hover:bg-canvas lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="lg:hidden">
          <AccountMpLogo />
        </div>
        <h1 className="hidden text-sm font-medium text-muted lg:block">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <AccountMpNotifications />
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
