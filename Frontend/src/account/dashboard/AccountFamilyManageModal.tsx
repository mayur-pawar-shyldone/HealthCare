import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, UserRound, X } from 'lucide-react'
import { MAX_FAMILY_MEMBERS, PRIMARY_MEMBER_ID } from '@/account/account-data'
import { useAccount } from '@/account/AccountContext'
import { readForm } from '@/account/form-utils'
import { ageFromDob, memberInitials } from '@/account/dashboard/mp-utils'
import { Input } from '@/components/ui/Input'

type Mode = 'list' | 'add' | 'edit'

type Props = {
  open: boolean
  initialMode?: 'list' | 'add'
  editMemberId?: string | null
  onClose: () => void
}

const RELATIONS = ['Spouse', 'Child', 'Parent', 'Other'] as const

export function AccountFamilyManageModal({ open, initialMode = 'list', editMemberId, onClose }: Props) {
  const acc = useAccount()
  const [mode, setMode] = useState<Mode>('list')
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    acc.setError('')
    if (initialMode === 'add') {
      setMode('add')
      setEditingId(null)
      acc.setFamilyDraft({ name: '', relation: 'Spouse', dob: '', phone: '' })
      return
    }
    if (editMemberId) {
      const m = acc.family.find((f) => f.id === editMemberId)
      if (m) {
        setMode('edit')
        setEditingId(m.id)
        acc.setFamilyDraft({ name: m.name, relation: m.relation, dob: m.dob, phone: m.phone })
        return
      }
    }
    setMode('list')
    setEditingId(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when dialog opens
  }, [open, initialMode, editMemberId])

  if (!open) return null

  const seatsLeft = MAX_FAMILY_MEMBERS - acc.family.length
  const editingMember = editingId ? acc.family.find((f) => f.id === editingId) : undefined
  const isPrimary = editingId === PRIMARY_MEMBER_ID

  function closeModal() {
    acc.setError('')
    acc.setFamilyDraft({ name: '', relation: 'Spouse', dob: '', phone: '' })
    onClose()
  }

  function startEdit(id: string) {
    const m = acc.family.find((f) => f.id === id)
    if (!m) return
    setEditingId(id)
    setMode('edit')
    acc.setFamilyDraft({ name: m.name, relation: m.relation, dob: m.dob, phone: m.phone })
    acc.setError('')
  }

  function startAdd() {
    if (seatsLeft <= 0) {
      acc.setError(`All ${MAX_FAMILY_MEMBERS} slots are in use. Remove a member to add another.`)
      return
    }
    setMode('add')
    setEditingId(null)
    acc.setFamilyDraft({ name: '', relation: 'Spouse', dob: '', phone: '' })
    acc.setError('')
  }

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = readForm(e.currentTarget) as { name: string; relation: string; dob: string; phone: string }
    const ok =
      mode === 'add'
        ? acc.saveFamilyMember(data)
        : editingId
          ? acc.updateFamilyMember(editingId, data)
          : false
    if (ok) {
      setMode('list')
      setEditingId(null)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="family-manage-title">
      <button type="button" className="absolute inset-0 bg-navy/55 backdrop-blur-[3px]" aria-label="Close" onClick={closeModal} />
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
        className="relative flex max-h-[min(90vh,640px)] w-full max-w-[440px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_24px_80px_-24px_rgba(16,52,74,0.45)]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-mp-teal-700">Card members</p>
            <h2 id="family-manage-title" className="mt-0.5 font-display text-xl font-extrabold text-navy">
              Manage family
            </h2>
            <p className="mt-1 text-[13px] text-muted">
              1 primary + up to 4 others · {acc.family.length}/{MAX_FAMILY_MEMBERS} used
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-muted transition hover:bg-canvas hover:text-navy"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {mode === 'list' ? (
            <>
              <ul className="space-y-2">
                {acc.family.map((m) => {
                  const age = ageFromDob(m.dob)
                  return (
                    <li key={m.id} className="flex items-center gap-3 rounded-xl border border-line bg-canvas/50 px-3 py-3">
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-[13px] font-bold ${
                          m.id === PRIMARY_MEMBER_ID ? 'bg-navy text-white' : 'bg-mp-teal-50 text-navy'
                        }`}
                      >
                        {memberInitials(m.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-navy">
                          {m.name}
                          {m.id === PRIMARY_MEMBER_ID ? (
                            <span className="ml-2 text-[10px] font-bold uppercase text-mp-teal-700">Primary</span>
                          ) : null}
                        </p>
                        <p className="truncate text-[13px] text-muted">
                          {m.relation}
                          {age != null ? ` · ${age} yrs` : ''}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => startEdit(m.id)}
                        className="shrink-0 text-[13px] font-semibold text-mp-teal-700 hover:underline"
                      >
                        Edit
                      </button>
                    </li>
                  )
                })}
              </ul>
              {seatsLeft > 0 ? (
                <button
                  type="button"
                  onClick={startAdd}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-line py-2.5 text-[13px] font-semibold text-navy transition hover:border-mp-teal hover:bg-mp-teal-50/50"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                  Add family member
                </button>
              ) : (
                <p className="mt-3 text-center text-[13px] text-muted">All family slots are full.</p>
              )}
            </>
          ) : (
            <form onSubmit={submitForm} className="space-y-3">
              <div className="flex items-center gap-2 text-[13px] text-muted">
                <UserRound className="h-4 w-4 text-mp-teal-700" aria-hidden />
                {mode === 'add' ? 'New member' : `Editing ${editingMember?.name ?? 'member'}`}
              </div>
              <Input name="name" label="Full name" defaultValue={acc.familyDraft.name} required placeholder="As per ID" key={`name-${mode}-${editingId}`} />
              {!isPrimary ? (
                <label className="block space-y-2 text-sm">
                  <span className="font-semibold text-ink/80">Relationship</span>
                  <select
                    name="relation"
                    defaultValue={acc.familyDraft.relation}
                    key={`rel-${editingId}`}
                    className="h-[50px] w-full rounded-2xl border border-line/80 bg-white px-4 outline-none focus:border-teal focus:ring-2 focus:ring-teal/10"
                  >
                    {RELATIONS.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </label>
              ) : (
                <input type="hidden" name="relation" value="Self" />
              )}
              <Input
                name="dob"
                label="Date of birth"
                defaultValue={acc.familyDraft.dob}
                required
                placeholder="dd-mm-yyyy"
                key={`dob-${mode}-${editingId}`}
              />
              <Input
                name="phone"
                label="Mobile (optional)"
                defaultValue={acc.familyDraft.phone}
                inputMode="numeric"
                maxLength={10}
                key={`phone-${mode}-${editingId}`}
              />
              {acc.error ? <p className="text-sm font-semibold text-brick">{acc.error}</p> : null}
              <div className="flex flex-wrap gap-2 pt-1">
                <button type="submit" className="rounded-full bg-navy px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-navy-600">
                  {mode === 'add' ? 'Save member' : 'Save changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('list')
                    setEditingId(null)
                    acc.setError('')
                  }}
                  className="rounded-full border border-line px-5 py-2.5 text-[13px] font-semibold text-navy hover:bg-canvas"
                >
                  Back
                </button>
                {mode === 'edit' && editingId && editingId !== PRIMARY_MEMBER_ID ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Remove ${editingMember?.name} from this card?`)) {
                        if (acc.removeMember(editingId)) {
                          setMode('list')
                          setEditingId(null)
                        }
                      }
                    }}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-2.5 text-[13px] font-semibold text-brick hover:bg-mp-coral-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    Remove
                  </button>
                ) : null}
              </div>
            </form>
          )}
          {mode === 'list' && acc.error ? <p className="mt-3 text-sm font-semibold text-brick">{acc.error}</p> : null}
        </div>

        {mode === 'list' ? (
          <div className="border-t border-line px-5 py-3">
            <button
              type="button"
              onClick={closeModal}
              className="h-11 w-full rounded-full border border-line text-[13px] font-semibold text-navy hover:bg-canvas"
            >
              Done
            </button>
          </div>
        ) : null}
      </motion.div>
    </div>
  )
}
