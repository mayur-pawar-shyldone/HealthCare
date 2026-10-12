import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { ACCOUNT_PACKAGES } from '@/account/account-data'
import { useAccount } from '@/account/AccountContext'
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel'
import { ageFromDob, memberInitials, memberShortName } from '@/account/dashboard/mp-utils'

const MAX_FAMILY = 6

type Props = {
  onAddMember?: () => void
}

export function AccountDashboardFamilyPanel({ onAddMember }: Props) {
  const acc = useAccount()
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(acc.family[0]?.id ?? 'self')
  const selected = acc.family.find((f) => f.id === selectedId) ?? acc.family[0]

  const lastTestFor = useMemo(() => {
    const map = new Map<string, string>()
    for (const b of acc.bookings) {
      if (b.status !== 'Completed') continue
      const existing = map.get(b.memberId)
      const label = `${acc.pkg(b.packageId).name} · ${b.date}`
      if (!existing) map.set(b.memberId, label)
    }
    return (memberId: string) => map.get(memberId) ?? 'No tests yet'
  }, [acc.bookings, acc.pkg])

  if (!selected) return null

  const age = ageFromDob(selected.dob)
  const facts = [
    { label: 'Relation', value: selected.relation },
    { label: 'Age', value: age != null ? `${age} yrs` : '—' },
    { label: 'Card ID', value: acc.memberId() },
    { label: 'Last test', value: lastTestFor(selected.id) },
  ]

  return (
    <AccountDashboardPanel
      title="Family on this card"
      action={
        <span className="whitespace-nowrap pt-1.5 text-sm text-muted">
          {acc.family.length} of {MAX_FAMILY} added
        </span>
      }
      className="flex flex-col"
    >
      <div role="tablist" aria-label="Family members" className="flex gap-5">
        {acc.family.map((f) => {
          const active = f.id === selectedId
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedId(f.id)}
              className="flex w-16 flex-col items-center gap-2 text-sm focus:outline-none"
            >
              <span
                className={`grid h-[60px] w-[60px] place-items-center rounded-full text-[15px] font-bold transition-colors duration-150 ${
                  active ? 'bg-navy text-white ring-4 ring-mp-teal-50' : 'bg-mp-teal-50 text-muted hover:bg-[#d3ecea]'
                }`}
              >
                {memberInitials(f.name)}
              </span>
              <span className={active ? 'font-medium text-navy' : 'text-muted'}>{memberShortName(f.name)}</span>
            </button>
          )
        })}
        <button
          type="button"
          onClick={onAddMember}
          className="flex w-16 flex-col items-center gap-2 text-sm text-muted"
        >
          <span className="grid h-[60px] w-[60px] place-items-center rounded-full border-2 border-dashed border-line transition-colors duration-150 hover:border-mp-teal hover:text-mp-teal-700">
            <Plus className="h-5 w-5" aria-hidden />
          </span>
          Add
        </button>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3">
        {facts.map((fact) => (
          <div key={fact.label} className="rounded-xl bg-mp-coral-50 px-4 py-3">
            <dt className="text-sm text-brick">{fact.label}</dt>
            <dd className="mt-0.5 truncate text-[15px] font-medium text-navy">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
        <button
          type="button"
          onClick={() => {
            acc.choosePackage(ACCOUNT_PACKAGES[0].id)
            acc.setDraftPartial({ memberId: selected.id })
            navigate('/account/book/member')
          }}
          className="rounded-full bg-navy py-3.5 text-center text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-navy-600"
        >
          Book for {memberShortName(selected.name)}
        </button>
        <Link
          to="/account/bookings"
          className="rounded-full border border-line py-3.5 text-center text-[15px] font-semibold text-navy transition-colors duration-150 hover:bg-canvas"
        >
          View reports
        </Link>
      </div>
    </AccountDashboardPanel>
  )
}
