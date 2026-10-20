import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, CreditCard, Sparkles, UserPlus, Users } from 'lucide-react'
import { PLATFORM } from '@/data/platform-content'
import { useAccount } from '@/account/AccountContext'
import { readForm } from '@/account/form-utils'
import { AccountWalletPanel } from '@/account/AccountWalletPanel'
import { HealthIdCard, type HealthIdCardData } from '@/components/brand/HealthIdCard'
import { HomeCardActions } from '@/components/home/HomeCardActions'
import { hubSectionClassName } from '@/components/home/CardFamilyHubPanels'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

const MAX_FAMILY = 6

function accountCardData(name: string, mobile: string, memberId: string, family: ReturnType<typeof useAccount>['family']): HealthIdCardData {
  const self = family.find((m) => m.id === 'self')
  const validFrom = new Date()
  const validUntil = new Date(validFrom)
  validUntil.setFullYear(validUntil.getFullYear() + 1)

  return {
    memberName: name,
    dateOfBirth: self?.dob ?? null,
    membershipId: memberId,
    validFrom: validFrom.toISOString(),
    validUntil: validUntil.toISOString(),
    plan: PLATFORM.membership.name,
    flatDiscountPercent: PLATFORM.membership.flatDiscount,
    familyMembers: family.map((m) => ({
      name: m.name,
      relation: m.relation,
      isPrimary: m.id === 'self',
    })),
    qrPayload: `healthidcard:member:${memberId}:${mobile}`,
  }
}

function memberInitials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

type AccountCardWalletSectionProps = {
  onAddMember?: () => void
}

export function AccountCardWalletSection({ onAddMember }: AccountCardWalletSectionProps) {
  const acc = useAccount()
  const navigate = useNavigate()
  const [flipped, setFlipped] = useState(false)
  const cardData = useMemo(
    () => accountCardData(acc.name, acc.mobile, acc.memberId(), acc.family),
    [acc.name, acc.mobile, acc.memberId, acc.family],
  )
  const hasAddress = acc.addresses.length > 0
  const seatsLeft = MAX_FAMILY - acc.family.length

  function openAddForm() {
    if (!acc.showAdd) acc.toggleShowAdd()
    onAddMember?.()
  }

  return (
    <section id="card-wallet" className={hubSectionClassName()} aria-labelledby="account-card-wallet-heading">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/60 bg-gradient-to-r from-teal-light/40 via-white to-[#fff8e6]/80 px-5 py-4 md:px-8 md:py-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-teal text-white shadow-sm">
            <CreditCard className="h-5 w-5" />
          </span>
          <div>
            <p className="dash-section-eyebrow">Member hub</p>
            <h2 id="account-card-wallet-heading" className="dash-h2">
              HealthID Card &amp; Wallet
            </h2>
            <p className="dash-muted">Show your card at collection · Spend wallet credits at checkout</p>
          </div>
        </div>
        <div className="ml-auto shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 dash-badge text-emerald-700">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            Active member
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 lg:items-stretch">
        <div className="flex flex-col border-b border-line/60 bg-gradient-to-b from-[#f4f8fb] to-white p-5 md:p-8 lg:border-b-0 lg:border-r">
          <div className="mb-5 flex min-h-[28px] items-center justify-between gap-3">
            <p className="dash-section-eyebrow dash-muted-label">Digital card</p>
            <span className="rounded-full bg-teal/10 px-2.5 py-1 dash-badge uppercase text-teal">
              {PLATFORM.membership.flatDiscount}% member discount
            </span>
          </div>

          <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col gap-5">
            <HealthIdCard
              data={cardData}
              flipped={flipped}
              onFlipChange={setFlipped}
              disableTapFlip
              hideBuiltInFlipHint
              className="mx-auto w-full max-w-[420px]"
            />
            <HomeCardActions
              cardData={cardData}
              flipped={flipped}
              onFlip={() => setFlipped((f) => !f)}
              onEdit={() => navigate('/account/profile')}
              hasAddress={hasAddress}
              profilePath="/account/profile"
            />
          </div>
        </div>

        <div className="flex flex-col p-5 md:p-8">
          <div className="mb-5 flex min-h-[28px] items-center justify-between gap-3">
            <p className="dash-section-eyebrow dash-muted-label">Wallet credits</p>
            <Link to="/login/password" className="dash-link flex shrink-0 items-center gap-0.5">
              Manage wallet
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <AccountWalletPanel />
        </div>
      </div>

      <div id="card-family" className="border-t border-line/60 bg-[#f8fbfd] px-5 py-5 md:px-8 md:py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-teal" />
            <div>
              <p className="dash-body">
                <strong>Family on this card</strong>
              </p>
              <p className="dash-muted">
                {acc.family.length} of {MAX_FAMILY} seats used
                {seatsLeft > 0 ? ` · ${seatsLeft} available` : ''}
              </p>
            </div>
          </div>
          <Button type="button" size="sm" className="rounded-xl" onClick={openAddForm}>
            <UserPlus className="h-4 w-4" />
            Add member
          </Button>
        </div>

        {acc.showAdd ? (
          <form
            className="mt-4 rounded-2xl border border-teal/20 bg-white p-4"
            onSubmit={(e) => {
              e.preventDefault()
              acc.saveFamilyMember(readForm(e.currentTarget) as { name: string; relation: string; dob: string; phone: string })
            }}
          >
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

        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {acc.family.map((m) => (
            <li
              key={m.id}
              className="flex min-h-[72px] items-center gap-3 rounded-2xl border border-line/60 bg-white px-3.5 py-3"
            >
              <span
                className={cn(
                  'grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold',
                  m.id === 'self' ? 'bg-teal text-white' : 'bg-teal-light text-teal-dark',
                )}
                aria-hidden
              >
                {memberInitials(m.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{m.name}</p>
                <p className="truncate text-xs text-ink-soft">{m.relation}{m.dob ? ` · ${m.dob}` : ''}</p>
              </div>
              {m.id === 'self' ? (
                <span className="shrink-0 text-[10px] font-bold uppercase text-teal">Primary</span>
              ) : (
                <div className="flex shrink-0 items-center gap-2">
                  <Badge tone="success">{m.status || 'Active'}</Badge>
                  <button
                    type="button"
                    className="text-[11px] font-semibold text-ink-soft hover:text-red-600"
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
    </section>
  )
}
