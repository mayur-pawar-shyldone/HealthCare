import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pencil, Plus } from 'lucide-react'
import { useAccount } from '@/account/AccountContext'
import { navigateToPopularPlans } from '@/lib/landing-nav-scroll'
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel'
import { ageFromDob, memberInitials, memberShortName } from '@/account/dashboard/mp-utils'

type Props = {
  onManageFamily?: () => void
  onAddMember?: () => void
}

export function AccountDashboardFamilyPanel({ onManageFamily, onAddMember }: Props) {
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
    <div id="card-family" className="h-full min-h-0">
    <AccountDashboardPanel
      title="Family on this card"
      className="flex h-full flex-col"
      action={
        <button
          type="button"
          onClick={onManageFamily}
          className="inline-flex shrink-0 items-center gap-1.5 pt-0.5 text-[13px] font-semibold text-mp-teal-700 transition hover:text-mp-teal-800 hover:underline"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden />
          Manage family
        </button>
      }
    >

      <div role="tablist" aria-label="Family members" className="flex gap-3">
        {acc.family.map((f) => {
          const active = f.id === selectedId
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedId(f.id)}
              className="flex w-14 flex-col items-center gap-1.5 text-xs focus:outline-none"
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-full text-[13px] font-bold transition-colors duration-150 ${
                  active ? 'bg-navy text-white ring-2 ring-mp-teal-50' : 'bg-mp-teal-50 text-muted hover:bg-[#d3ecea]'
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
          onClick={onAddMember ?? onManageFamily}
          className="flex w-14 flex-col items-center gap-1.5 text-xs text-muted"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-dashed border-line transition-colors duration-150 hover:border-mp-teal hover:text-mp-teal-700">
            <Plus className="h-4 w-4" aria-hidden />
          </span>
          Add
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2">
        {facts.map((fact) => (
          <div key={fact.label} className="rounded-lg bg-mp-coral-50 px-3 py-2">
            <dt className="text-xs text-brick">{fact.label}</dt>
            <dd className="mt-0.5 truncate text-[13px] font-medium text-navy">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
        <button
          type="button"
          onClick={() => {
            acc.setDraftPartial({ memberId: selected.id })
            navigateToPopularPlans(navigate)
          }}
          className="rounded-full bg-navy py-2.5 text-center text-[13px] font-semibold text-white transition-colors hover:bg-navy-600"
        >
          Book for {memberShortName(selected.name)}
        </button>
        <Link
          to="/account/bookings"
          className="rounded-full border border-line py-2.5 text-center text-[13px] font-semibold text-navy transition-colors hover:bg-canvas"
        >
          View reports
        </Link>
      </div>
    </AccountDashboardPanel>
    </div>
  )
}
