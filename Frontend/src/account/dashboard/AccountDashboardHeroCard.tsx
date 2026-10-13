import { AccountMemberCard } from '@/account/AccountMemberCard'

type AccountDashboardHeroCardProps = {
  /** Hero layout: fixed width on desktop, inset from the banner edge. */
  flushRight?: boolean
}

/** Navy banner card — live HealthID artwork only (ID / validity on the card face, not duplicated below). */
export function AccountDashboardHeroCard({ flushRight = false }: AccountDashboardHeroCardProps) {
  return (
    <div className={flushRight ? 'w-[min(100%,336px)] md:w-[336px]' : 'w-[min(100%,336px)]'}>
      <AccountMemberCard showCaption={false} className="max-w-none shadow-[0_20px_40px_-14px_rgba(0,0,0,0.5)]" />
    </div>
  )
}
