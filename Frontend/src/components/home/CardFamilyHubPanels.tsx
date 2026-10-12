import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ShieldCheck, Trash2, UserPlus, Users } from 'lucide-react'
import api, { unwrap } from '@/services/api'
import type { FamilyMember, FamilyRelation, Membership } from '@/types'
import { PLATFORM } from '@/data/platform-content'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

const RELATIONS: { value: FamilyRelation; label: string }[] = [
  { value: 'SPOUSE', label: 'Spouse' },
  { value: 'PARENT', label: 'Parent' },
  { value: 'CHILD', label: 'Child' },
  { value: 'SIBLING', label: 'Sibling' },
  { value: 'OTHER', label: 'Other' },
]

function formatRelation(relation: string) {
  if (!relation) return ''
  const lower = relation.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

export function CardBenefitsList({
  active,
  familyCount,
  maxFamily,
  memberDiscount,
}: {
  active: boolean
  familyCount: number
  maxFamily: number
  memberDiscount?: number
}) {
  const pct = memberDiscount ?? PLATFORM.membership.flatDiscount
  const rows = active
    ? [
        { title: 'Status', desc: 'Active membership · free to keep', badge: 'Active' as const },
        { title: 'Member pricing', desc: `Flat ${pct}% off on eligible tests and packages at checkout.` },
        { title: 'Home collection', desc: 'Free home sample collection on eligible panels in partner cities.' },
        { title: 'Family on this card', desc: `${familyCount} of ${maxFamily} seats used.` },
      ]
    : [
        { title: 'Activate once', desc: 'Free 1-year card · member rates on every test.' },
        { title: 'Family coverage', desc: `Add up to ${maxFamily} people and book for anyone on the card.` },
        { title: 'Wallet bonus', desc: 'Credits unlock when you activate — use at checkout.' },
      ]

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div
          key={row.title}
          className="flex items-start justify-between gap-3 rounded-2xl border border-line/60 bg-white/80 px-4 py-3.5"
        >
          <div className="min-w-0">
            <p className="font-semibold text-ink">{row.title}</p>
            <p className="mt-0.5 text-sm text-ink-soft">{row.desc}</p>
          </div>
          {'badge' in row && row.badge ? (
            <Badge tone="success">{row.badge}</Badge>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export function FamilyOnCardPanel({ hasMembership, maxFamily }: { hasMembership: boolean; maxFamily: number }) {
  const qc = useQueryClient()
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [relation, setRelation] = useState<FamilyRelation>('SPOUSE')
  const [age, setAge] = useState('')
  const [mobile, setMobile] = useState('')
  const [error, setError] = useState('')

  const family = useQuery({
    queryKey: ['family'],
    queryFn: async () => unwrap<FamilyMember[]>((await api.get('/family')).data),
    enabled: hasMembership,
  })

  const membership = useQuery({
    queryKey: ['membership'],
    queryFn: async () => unwrap<Membership | null>((await api.get('/membership')).data),
    enabled: hasMembership,
  })

  const addFamily = useMutation({
    mutationFn: async (payload: { name: string; relation: string; age?: number; mobile?: string }) =>
      api.post('/family', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['family'] })
      qc.invalidateQueries({ queryKey: ['membership'] })
      qc.invalidateQueries({ queryKey: ['card'] })
      setName('')
      setAge('')
      setMobile('')
      setShowAdd(false)
      setError('')
    },
    onError: () => setError('Could not add member. Check details and try again.'),
  })

  const removeFamily = useMutation({
    mutationFn: async (id: string) => api.delete(`/family/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['family'] })
      qc.invalidateQueries({ queryKey: ['membership'] })
      qc.invalidateQueries({ queryKey: ['card'] })
    },
  })

  if (!hasMembership) {
    return (
      <div className="rounded-2xl border border-dashed border-teal/25 bg-teal-light/20 px-4 py-8 text-center">
        <Users className="mx-auto h-8 w-8 text-teal" />
        <p className="mt-3 font-display text-lg text-ink">Family members live on your card</p>
        <p className="mt-1 text-sm text-ink-soft">Activate your HealthID Card to add spouse, parents, or children.</p>
      </div>
    )
  }

  const members = family.data ?? []
  const atLimit = members.length >= maxFamily

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">Family members</p>
          <p className="text-sm text-ink-soft">People you can book tests for on this card.</p>
        </div>
        <Button
          type="button"
          size="sm"
          variant={showAdd ? 'secondary' : 'primary'}
          className="rounded-xl"
          disabled={atLimit && !showAdd}
          onClick={() => {
            setShowAdd((v) => !v)
            setError('')
          }}
        >
          <UserPlus className="h-4 w-4" />
          {showAdd ? 'Close' : 'Add member'}
        </Button>
      </div>
      <p className="text-xs font-semibold text-teal">
        {members.length} of {maxFamily} members
      </p>

      {showAdd ? (
        <div className="rounded-2xl border border-line/70 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} placeholder="As per ID" />
            <label className="block space-y-2 text-sm">
              <span className="font-semibold text-ink/80">Relationship</span>
              <select
                className="w-full rounded-2xl border border-line/80 bg-white px-4 py-3.5 outline-none focus:border-teal"
                value={relation}
                onChange={(e) => setRelation(e.target.value as FamilyRelation)}
              >
                {RELATIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
            <Input label="Age (optional)" value={age} onChange={(e) => setAge(e.target.value)} inputMode="numeric" />
            <Input
              label="Mobile (optional)"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              inputMode="numeric"
              maxLength={10}
            />
          </div>
          {error ? <p className="mt-2 text-sm font-semibold text-[#c22f1b]">{error}</p> : null}
          <Button
            className="mt-4 rounded-xl"
            disabled={!name.trim() || addFamily.isPending}
            onClick={() =>
              addFamily.mutate({
                name: name.trim(),
                relation,
                age: age ? Number(age) : undefined,
                mobile: mobile.trim() || undefined,
              })
            }
          >
            Save member
          </Button>
        </div>
      ) : null}

      <ul className="space-y-2">
        {members.map((m) => {
          const onCard = membership.data?.members?.some((cm) => cm.familyMember?.id === m.id || cm.name === m.name)
          return (
            <li
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line/60 bg-white px-4 py-3"
            >
              <div>
                <p className="font-semibold text-ink">{m.name}</p>
                <p className="text-sm text-ink-soft">
                  {formatRelation(m.relation)}
                  {m.age != null ? ` · ${m.age} yrs` : ''}
                  {m.mobile ? ` · ${m.mobile}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {onCard ? (
                  <Badge tone="success">On card</Badge>
                ) : (
                  <Badge tone="ink">Saved</Badge>
                )}
                <button
                  type="button"
                  className="rounded-xl border border-line/70 p-2 text-ink-soft transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  aria-label={`Remove ${m.name}`}
                  disabled={removeFamily.isPending}
                  onClick={() => {
                    if (confirm(`Remove ${m.name} from your family list?`)) removeFamily.mutate(m.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          )
        })}
        {!members.length && !family.isLoading ? (
          <li className="rounded-2xl border border-dashed border-line/80 px-4 py-6 text-center text-sm text-ink-soft">
            No family members yet. Add someone to book tests for them.
          </li>
        ) : null}
      </ul>
      <Link to="/profile" className="inline-flex items-center gap-1 text-xs font-semibold text-teal hover:underline">
        <ShieldCheck className="h-3.5 w-3.5" />
        Help with family on your card
      </Link>
    </div>
  )
}

export function hubSectionClassName() {
  return cn(
    'overflow-hidden rounded-[28px] border border-line/80 bg-white shadow-[0_16px_48px_rgba(12,25,41,0.08)]',
  )
}
