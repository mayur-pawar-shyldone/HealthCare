import { Sparkles } from 'lucide-react'
import { useMemo } from 'react'
import { PLATFORM } from '@/data/platform-content'
import { useAccount } from '@/account/AccountContext'
import { CardMarketingFront, type HealthIdCardData } from '@/components/brand/HealthIdCard'
import { cn } from '@/lib/utils'

type AccountMemberCardProps = {
  className?: string
  showCaption?: boolean
}

function accountToCardData(name: string, mobile: string, memberId: string): HealthIdCardData {
  const validFrom = new Date()
  const validUntil = new Date(validFrom)
  validUntil.setFullYear(validUntil.getFullYear() + 1)

  return {
    memberName: name,
    dateOfBirth: null,
    membershipId: memberId,
    validFrom: validFrom.toISOString(),
    validUntil: validUntil.toISOString(),
    plan: PLATFORM.membership.name,
    flatDiscountPercent: PLATFORM.membership.flatDiscount,
    familyMembers: [],
    qrPayload: `healthidcard:member:${memberId}:${mobile}`,
  }
}

/** Hero / compact preview — same branded face as flip card front. */
export function AccountMemberCard({ className, showCaption = true }: AccountMemberCardProps) {
  const acc = useAccount()
  const data = useMemo(
    () => accountToCardData(acc.name, acc.mobile, acc.memberId()),
    [acc.name, acc.mobile, acc.memberId],
  )

  return (
    <div className={cn('mx-auto w-full max-w-[420px]', className)}>
      <div className="relative aspect-[1.586/1] w-full">
        <CardMarketingFront data={data} />
      </div>
      {showCaption ? (
        <div className="mt-4 space-y-2 text-center">
          <p className="text-xs text-ink-soft">QR verified at partner labs · {PLATFORM.brand}</p>
          <p className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Member pricing active
          </p>
        </div>
      ) : null}
    </div>
  )
}
