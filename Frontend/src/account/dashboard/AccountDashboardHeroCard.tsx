import { HeartPulse } from 'lucide-react'
import { useAccount } from '@/account/AccountContext'
import { formatValidTill } from '@/account/dashboard/mp-utils'

/** Magic Patterns hero card preview — member ID from account context. */
export function AccountDashboardHeroCard() {
  const acc = useAccount()

  return (
    <div className="w-full max-w-[350px] overflow-hidden rounded-2xl bg-white shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)]">
      <div className="relative h-[200px] bg-[#d9ecf8]">
        <img
          src="/brand/health-id-card-marketing.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-right"
        />
        <div className="relative z-10 p-5">
          <p className="flex items-center gap-1.5 text-[17px] font-bold text-navy">
            <HeartPulse className="h-4 w-4 text-[#e8322f]" aria-hidden />
            Health<span className="-mx-1.5 text-[#e8322f]">ID</span>Card
          </p>
          <p className="mt-12 text-[17px] font-bold leading-snug text-navy">
            Healthy Families
            <br />
            <span className="text-[#e8322f]">Brighter</span>
            <br />
            <span className="text-[#e8322f]">Tomorrows</span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 bg-navy px-5 py-4 text-white">
        <div className="border-r border-white/20 pr-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">Member ID</p>
          <p className="mt-1 text-xl font-bold">{acc.memberId()}</p>
        </div>
        <div className="pl-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">Valid till</p>
          <p className="mt-1 text-xl font-bold">{formatValidTill()}</p>
        </div>
      </div>
    </div>
  )
}
