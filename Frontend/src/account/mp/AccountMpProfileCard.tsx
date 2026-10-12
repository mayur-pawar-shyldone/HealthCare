import { ShieldCheck } from 'lucide-react'
import { PLATFORM } from '@/data/platform-content'
import { useAccount } from '@/account/AccountContext'
import { formatValidTill, memberInitials } from '@/account/dashboard/mp-utils'

const MAX_FAMILY = 6

export function AccountMpProfileCard() {
  const acc = useAccount()
  const rows = [
    { label: 'Member ID', value: acc.memberId(), accent: false },
    { label: 'Valid till', value: formatValidTill(), accent: false },
    { label: 'Plan', value: `Family · ${PLATFORM.membership.flatDiscount}% off`, accent: true },
  ]
  const pct = (acc.family.length / MAX_FAMILY) * 100
  const mobileDisplay = acc.mobile.startsWith('+') ? acc.mobile : `+91 ${acc.mobile}`

  return (
    <section className="overflow-hidden rounded-[20px] bg-white">
      <div className="bg-navy px-4 pb-12 pt-5 text-white sm:px-5">
        <p className="text-[13px] text-white/75">My Account</p>
        <p className="mt-1 text-2xl font-extrabold tracking-tight">{acc.name}</p>
        <p className="mt-0.5 text-[13px] text-white/75">Member since Oct 2026</p>
      </div>
      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <span className="-mt-9 grid h-[72px] w-[72px] place-items-center rounded-xl bg-mp-coral text-xl font-bold text-white ring-4 ring-white">
          {memberInitials(acc.name)}
        </span>
        <dl className="mt-5 space-y-3 text-sm">
          {rows.map((r) => (
            <div key={r.label} className="flex justify-between gap-4">
              <dt className="text-[13px] text-muted">{r.label}</dt>
              <dd className={`text-sm font-bold ${r.accent ? 'text-mp-teal-700' : 'text-navy'}`}>{r.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 border-t border-line pt-5">
          <div className="flex justify-between">
            <span className="font-semibold text-navy">Family slots</span>
            <span className="text-muted">
              {acc.family.length} of {MAX_FAMILY}
            </span>
          </div>
          <div
            className="mt-3 h-2 rounded-full bg-mp-teal-50"
            role="progressbar"
            aria-valuenow={acc.family.length}
            aria-valuemin={0}
            aria-valuemax={MAX_FAMILY}
          >
            <div className="h-2 rounded-full bg-mp-teal" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <p className="mt-5 flex items-center gap-2 rounded-lg bg-mp-teal-50 px-3 py-2.5 text-[13px] text-mp-teal-700">
          <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden />
          {mobileDisplay} is verified for OTP login
        </p>
      </div>
    </section>
  )
}
