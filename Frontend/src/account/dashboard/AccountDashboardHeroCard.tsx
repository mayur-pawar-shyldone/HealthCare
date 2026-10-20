import { AccountMemberCard } from '@/account/AccountMemberCard'

type AccountDashboardHeroCardProps = {
  /** Hero layout: fixed width on desktop, inset from the banner edge. */
  flushRight?: boolean
}

/** Navy banner card — live HealthID artwork only (ID / validity on the card face, not duplicated below). */
export function AccountDashboardHeroCard({ flushRight = false }: AccountDashboardHeroCardProps) {
  return (
    <div className={flushRight ? 'w-[min(100%,272px)] sm:w-[280px] md:w-[272px]' : 'w-[min(100%,272px)]'}>
      <AccountMemberCard showCaption={false} className="max-w-none bg-transparent shadow-none" />
    </div>
  )
}
