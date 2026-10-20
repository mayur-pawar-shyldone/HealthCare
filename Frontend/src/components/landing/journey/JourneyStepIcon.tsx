import type { LucideIcon } from 'lucide-react'
import { Barcode, MessageCircle, Smartphone, UserCheck } from 'lucide-react'
import type { JourneyStepIconId } from '@/data/landing-healthid-content'

const ICONS: Record<JourneyStepIconId, LucideIcon> = {
  smartphone: Smartphone,
  userCheck: UserCheck,
  barcode: Barcode,
  message: MessageCircle,
}

/** HealthID `sg` */
export function JourneyStepIcon({ icon, index }: { icon: JourneyStepIconId; index: number }) {
  const Icon = ICONS[icon]
  return (
    <span className="relative flex h-[88px] w-[88px] items-center justify-center rounded-full bg-brand-100 ring-8 ring-white">
      <Icon className="h-8 w-8 text-brand-600" strokeWidth={1.75} aria-hidden />
      <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[12px] font-bold text-white">
        {index + 1}
      </span>
    </span>
  )
}
