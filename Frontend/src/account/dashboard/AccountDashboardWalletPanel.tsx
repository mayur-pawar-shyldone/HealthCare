import { useState } from 'react'
import { Check, Copy, Wallet } from 'lucide-react'
import { useAccount } from '@/account/AccountContext'
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel'
import { formatMoney } from '@/lib/utils'

export function AccountDashboardWalletPanel() {
  const acc = useAccount()
  const [copied, setCopied] = useState(false)

  const walletBalance = acc.wallet?.balance ?? 0
  const referralCredits = acc.wallet?.referralBalance ?? 0
  const referralCode = acc.wallet?.referralCode || ''

  function copy() {
    navigator.clipboard?.writeText(referralCode).catch(() => undefined)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <AccountDashboardPanel
      title="Wallet"
      action={<Wallet className="mt-0.5 h-5 w-5 text-mp-teal-700" aria-hidden />}
      className="flex flex-col"
    >
      <p className="text-[13px] text-muted">Available to spend</p>
      <p className="mt-0.5 text-[2rem] font-extrabold leading-none tracking-tight text-navy">
        {formatMoney(walletBalance + referralCredits)}
      </p>
      <p className="mt-1.5 text-[13px] text-muted">Applied automatically at checkout</p>

      <div className="mt-4 grid grid-cols-2 divide-x divide-line">
        <div className="px-4">
          <p className="text-sm text-muted">Balance</p>
          <p className="text-lg font-bold text-navy">{formatMoney(walletBalance)}</p>
        </div>
        <div className="px-4">
          <p className="text-sm text-muted">Referral credits</p>
          <p className="text-lg font-bold text-navy">{formatMoney(referralCredits)}</p>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <p className="text-sm text-muted">Refer a friend, earn ₹200 per test</p>
        <div className="mt-2 flex items-center justify-between rounded-xl border border-dashed border-mp-teal bg-mp-teal-50 px-5 py-3.5">
          <span className="font-mono text-[15px] font-bold tracking-[0.4em] text-mp-teal-700">{referralCode}</span>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? 'Copied' : 'Copy referral code'}
            className="flex items-center gap-1 text-sm font-medium text-mp-teal-700"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" /> Copied
              </>
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </AccountDashboardPanel>
  )
}
