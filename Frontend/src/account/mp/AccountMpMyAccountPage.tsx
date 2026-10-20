import { useState } from 'react'
import { CheckCircle2, Home, MapPin, Plus } from 'lucide-react'
import { useAccount } from '@/account/AccountContext'
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel'
import { AccountAddAddressModal } from '@/account/mp/AccountAddAddressModal'
import { AccountMpPersonalDetails } from '@/account/mp/AccountMpPersonalDetails'
import { AccountMpProfileCard } from '@/account/mp/AccountMpProfileCard'

export function AccountMpMyAccountPage() {
  const acc = useAccount()
  const [addressModalOpen, setAddressModalOpen] = useState(false)

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[min(320px,100%)_1fr]">
      <div className="lg:sticky lg:top-6">
        <AccountMpProfileCard />
      </div>

      <div className="space-y-4">
        <AccountMpPersonalDetails />

        <AccountDashboardPanel
          title="Collection addresses"
          action={
            <button
              type="button"
              onClick={() => {
                acc.setError('')
                setAddressModalOpen(true)
              }}
              className="inline-flex items-center gap-1 pt-1 text-[13px] font-medium text-mp-teal-700 hover:underline"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Add new
            </button>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            {acc.addresses.map((a) => {
              const isDefault = a.id === acc.defaultAddressId
              const Icon = isDefault ? Home : MapPin
              return (
                <div
                  key={a.id}
                  className={`flex flex-col rounded-xl border p-3.5 ${isDefault ? 'border-mp-teal bg-mp-teal-50/60' : 'border-line'}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-2 text-sm font-semibold text-navy">
                      <Icon className="h-4 w-4 text-mp-teal-700" aria-hidden />
                      {a.label}
                    </p>
                    {isDefault ? (
                      <span className="flex items-center gap-1 text-sm font-medium text-mp-teal-700">
                        <CheckCircle2 className="h-4 w-4" aria-hidden />
                        Default
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => acc.setDefaultAddress(a.id)}
                        className="text-sm font-medium text-muted hover:text-mp-teal-700"
                      >
                        Set default
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-[13px] text-navy">{a.line}</p>
                  <p className="mt-auto pt-1.5 text-[13px] text-muted">{a.note}</p>
                </div>
              )
            })}
          </div>
        </AccountDashboardPanel>
      </div>

      <AccountAddAddressModal open={addressModalOpen} onClose={() => setAddressModalOpen(false)} />
    </div>
  )
}
