import { CheckCircle2, Home, MapPin, Plus } from 'lucide-react'
import { useAccount } from '@/account/AccountContext'
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel'
import { ageFromDob, memberInitials } from '@/account/dashboard/mp-utils'
import { AccountMpPersonalDetails } from '@/account/mp/AccountMpPersonalDetails'
import { AccountMpProfileCard } from '@/account/mp/AccountMpProfileCard'

export function AccountMpMyAccountPage() {
  const acc = useAccount()

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[min(360px,100%)_1fr]">
      <div className="lg:sticky lg:top-6">
        <AccountMpProfileCard />
      </div>

      <div className="space-y-5">
        <AccountMpPersonalDetails />

        <AccountDashboardPanel
          title="Family members"
          subtitle="Everyone here gets member pricing."
          action={
            <button
              type="button"
              onClick={() => {
                if (!acc.showAdd) acc.toggleShowAdd()
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-mp-coral px-5 py-2.5 text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-mp-coral-600"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add
            </button>
          }
        >
          <ul className="divide-y divide-line">
            {acc.family.map((f) => (
              <li key={f.id} className="flex items-center gap-4 py-4">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-mp-teal-50 text-[15px] font-bold text-navy">
                  {memberInitials(f.name)}
                </span>
                <div className="flex-1">
                  <p className="text-[17px] font-medium text-navy">{f.name}</p>
                  <p className="text-sm text-muted">
                    {f.relation} · {ageFromDob(f.dob) != null ? `${ageFromDob(f.dob)} yrs` : '—'}
                  </p>
                </div>
                <button type="button" className="text-[15px] font-medium text-mp-teal-700 hover:underline">
                  Edit
                </button>
              </li>
            ))}
          </ul>
        </AccountDashboardPanel>

        <AccountDashboardPanel
          title="Collection addresses"
          action={
            <button type="button" className="pt-1 text-[15px] font-medium text-mp-teal-700 hover:underline">
              Add new
            </button>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            {acc.addresses.map((a, i) => {
              const isDefault = a.id === 'home' || i === 0
              const Icon = isDefault ? Home : MapPin
              return (
                <div
                  key={a.id}
                  className={`flex flex-col rounded-2xl border p-5 ${isDefault ? 'border-mp-teal bg-mp-teal-50/60' : 'border-line'}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-2 text-lg font-semibold text-navy">
                      <Icon className="h-5 w-5 text-mp-teal-700" aria-hidden />
                      {a.label}
                    </p>
                    {isDefault ? (
                      <span className="flex items-center gap-1 text-sm font-medium text-mp-teal-700">
                        <CheckCircle2 className="h-4 w-4" aria-hidden />
                        Default
                      </span>
                    ) : (
                      <button type="button" className="text-sm font-medium text-muted hover:text-mp-teal-700">
                        Set default
                      </button>
                    )}
                  </div>
                  <p className="mt-3 text-[15px] text-navy">{a.line}</p>
                  <p className="mt-auto pt-2 text-sm text-muted">{a.note}</p>
                </div>
              )
            })}
          </div>
        </AccountDashboardPanel>
      </div>
    </div>
  )
}
