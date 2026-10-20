import { Download, UserPlus, Users } from 'lucide-react'
import { PLATFORM } from '@/data/platform-content'
import { useAccount } from '@/account/AccountContext'
import { readForm } from '@/account/form-utils'
import { AccountMemberCard } from '@/account/AccountMemberCard'
import { hubSectionClassName } from '@/components/home/CardFamilyHubPanels'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

import { MAX_FAMILY_MEMBERS } from '@/account/account-data'

function BenefitRow({ title, desc, badge }: { title: string; desc: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-line/60 bg-white px-4 py-3.5 shadow-[0_1px_0_rgba(16,52,74,0.04)]">
      <div className="min-w-0">
        <p className="text-[15px] font-semibold leading-snug text-ink">{title}</p>
        <p className="mt-0.5 text-sm leading-snug text-ink-soft">{desc}</p>
      </div>
      {badge ? <Badge tone="success">{badge}</Badge> : null}
    </div>
  )
}

function memberInitials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function AccountCardFamilySection({ onAddMember }: { onAddMember?: () => void }) {
  const acc = useAccount()
  const pct = PLATFORM.membership.flatDiscount
  const seatsLeft = MAX_FAMILY_MEMBERS - acc.family.length

  function openAddForm() {
    if (!acc.showAdd) acc.toggleShowAdd()
    onAddMember?.()
  }

  return (
    <section id="card-family" className={cn(hubSectionClassName(), 'overflow-hidden')}>
      <header className="flex flex-col gap-4 border-b border-line/60 bg-gradient-to-r from-teal-light/30 via-white to-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal text-white shadow-sm">
            <Users className="h-5 w-5" strokeWidth={2} />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-ink md:text-[1.35rem]">HealthID Card &amp; family</h2>
            <p className="mt-0.5 text-sm text-ink-soft">Show your card at collection · manage who you book for</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-line/80 bg-white px-4 text-sm font-bold text-ink-soft transition hover:border-teal/40 hover:text-teal"
            onClick={() => acc.showToast('Card download will be available when the account is connected.')}
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          <Button type="button" className="h-10 rounded-xl px-4" onClick={openAddForm}>
            <UserPlus className="h-4 w-4" />
            Add member
          </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 lg:items-stretch">
        <div className="flex flex-col items-center justify-center border-b border-line/60 bg-gradient-to-b from-[#eef6fa] via-[#f4f8fb] to-white px-5 py-8 lg:border-b-0 lg:border-r md:px-8">
          <AccountMemberCard />
        </div>

        <div className="flex flex-col gap-5 p-5 md:p-6">
          <div className="space-y-2">
            <BenefitRow title="Status" desc="Active membership · free to keep" badge="Active" />
            <BenefitRow title="Member pricing" desc={`Flat ${pct}% off on eligible tests and packages at checkout.`} />
            <BenefitRow title="Home collection" desc="Free home sample collection on eligible panels in partner cities." />
            <BenefitRow title="Family on this card" desc={`${acc.family.length} of ${MAX_FAMILY_MEMBERS} seats used${seatsLeft > 0 ? ` · ${seatsLeft} available` : ''}.`} />
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="mb-3 flex items-baseline justify-between gap-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                Family ({acc.family.length}/{MAX_FAMILY_MEMBERS})
              </p>
              {seatsLeft > 0 && !acc.showAdd ? (
                <button type="button" className="text-xs font-semibold text-teal hover:underline" onClick={openAddForm}>
                  Add someone
                </button>
              ) : null}
            </div>

            {acc.showAdd ? (
              <form
                className="mb-4 rounded-2xl border border-teal/20 bg-teal-light/20 p-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  acc.saveFamilyMember(readForm(e.currentTarget) as { name: string; relation: string; dob: string; phone: string })
                }}
              >
                <p className="mb-3 text-sm font-semibold text-ink">New family member</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input name="name" label="Full name" defaultValue={acc.familyDraft.name} required placeholder="As per ID" />
                  <label className="block space-y-2 text-sm">
                    <span className="font-semibold text-ink/80">Relationship</span>
                    <select
                      name="relation"
                      defaultValue={acc.familyDraft.relation}
                      className="h-[50px] w-full rounded-2xl border border-line/80 bg-white px-4 outline-none focus:border-teal focus:ring-2 focus:ring-teal/10"
                    >
                      {['Spouse', 'Child', 'Parent', 'Other'].map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </label>
                  <Input name="dob" label="Date of birth" defaultValue={acc.familyDraft.dob} required placeholder="dd-mm-yyyy" />
                  <Input name="phone" label="Mobile (optional)" defaultValue={acc.familyDraft.phone} inputMode="numeric" maxLength={10} />
                </div>
                {acc.error ? <p className="mt-2 text-sm font-semibold text-[#c22f1b]">{acc.error}</p> : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button type="submit" className="rounded-xl">
                    Save member
                  </Button>
                  <Button type="button" variant="secondary" className="rounded-xl" onClick={() => acc.toggleShowAdd()}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : null}

            <ul className="max-h-[min(320px,42vh)] space-y-2 overflow-y-auto pr-0.5 [scrollbar-gutter:stable]">
              {acc.family.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center gap-3 rounded-2xl border border-line/60 bg-white px-3.5 py-3 transition hover:border-teal/25"
                >
                  <span
                    className={cn(
                      'grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold',
                      m.id === 'self' ? 'bg-teal text-white' : 'bg-teal-light text-teal-dark',
                    )}
                    aria-hidden
                  >
                    {memberInitials(m.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">{m.name}</p>
                    <p className="truncate text-xs text-ink-soft">
                      {m.relation}
                      {m.dob ? ` · ${m.dob}` : ''}
                      {m.phone ? ` · ${m.phone}` : m.id !== 'self' ? '' : ` · ${acc.mobile}`}
                    </p>
                  </div>
                  {m.id === 'self' ? (
                    <span className="shrink-0 rounded-md bg-teal-light px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-teal-dark">
                      Primary
                    </span>
                  ) : (
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge tone="success">{m.status || 'Active'}</Badge>
                      <button
                        type="button"
                        className="text-xs font-semibold text-ink-soft underline-offset-2 hover:text-red-600 hover:underline"
                        onClick={() => {
                          if (confirm(`Remove ${m.name} from this card?`)) acc.removeMember(m.id)
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <footer className="border-t border-line/60 bg-[#f8fbfd] px-5 py-4 md:px-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-soft">Included with your card</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {PLATFORM.membership.benefits.slice(0, 4).map((b) => (
            <li
              key={b}
              className="rounded-full border border-line/50 bg-white px-3 py-1.5 text-[11px] font-medium leading-snug text-ink-soft"
            >
              {b}
            </li>
          ))}
        </ul>
      </footer>
    </section>
  )
}
