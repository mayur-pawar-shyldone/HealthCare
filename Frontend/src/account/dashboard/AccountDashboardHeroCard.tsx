import { useAccount } from '@/account/AccountContext'
import { formatValidTill } from '@/account/dashboard/mp-utils'

/**
 * Hero card — marketing artwork on top, member strip directly below (reference layout).
 * Bottom of PNG is clipped so only one ID / validity block shows.
 */
type AccountDashboardHeroCardProps = {
  /** Hero layout: fixed width on desktop, inset from the banner edge. */
  flushRight?: boolean
}

export function AccountDashboardHeroCard({ flushRight = false }: AccountDashboardHeroCardProps) {
  const acc = useAccount()

  return (
    <div
      className={[
        'w-[min(100%,336px)] shrink-0 overflow-hidden bg-white shadow-[0_20px_40px_-14px_rgba(0,0,0,0.5)]',
        flushRight ? 'rounded-2xl md:w-[336px]' : 'rounded-2xl',
      ].join(' ')}
    >
      <div className="h-[162px] overflow-hidden bg-[#eef6fb] sm:h-[168px]">
        <img
          src="/brand/health-id-card-marketing.png"
          alt=""
          className="block w-full h-auto max-w-none"
          draggable={false}
        />
      </div>

      <div className="grid grid-cols-2 bg-navy px-4 py-3.5 text-white sm:py-4">
        <div className="border-r border-white/25 pr-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/65">Member ID</p>
          <p className="mt-1 text-xl font-bold leading-tight tracking-tight">{acc.memberId()}</p>
        </div>
        <div className="pl-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/65">Valid till</p>
          <p className="mt-1 text-xl font-bold leading-tight tracking-tight">{formatValidTill()}</p>
        </div>
      </div>
    </div>
  )
}
