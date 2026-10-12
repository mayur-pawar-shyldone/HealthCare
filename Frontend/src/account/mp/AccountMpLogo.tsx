import { HeartPulse } from 'lucide-react'

export function AccountMpLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#e8322f] text-white">
        <HeartPulse className="h-6 w-6" aria-hidden />
      </span>
      <span className="text-[22px] font-bold tracking-tight text-navy">
        Health<span className="text-[#e8322f]">ID</span>Card
      </span>
    </div>
  )
}
