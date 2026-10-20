import { useState } from 'react'
import { Check, Pencil } from 'lucide-react'
import { useAccount } from '@/account/AccountContext'
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel'

type Details = { fullName: string; mobile: string; email: string; city: string }

const fields: { key: keyof Details; label: string }[] = [
  { key: 'fullName', label: 'Full name' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'email', label: 'Email' },
  { key: 'city', label: 'City' },
]

function loadEmail() {
  return sessionStorage.getItem('hid_email') || 'rohit.menon@gmail.com'
}

function loadCity() {
  return sessionStorage.getItem('hid_city') || 'Mumbai'
}

export function AccountMpPersonalDetails() {
  const acc = useAccount()
  const mobileDisplay = acc.mobile.startsWith('+') ? acc.mobile : `+91 ${acc.mobile}`
  const initial: Details = {
    fullName: acc.name,
    mobile: mobileDisplay,
    email: loadEmail(),
    city: loadCity(),
  }
  const [details, setDetails] = useState<Details>(initial)
  const [draft, setDraft] = useState<Details>(initial)
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = () => {
    setDetails(draft)
    acc.saveProfile(draft.fullName)
    sessionStorage.setItem('hid_email', draft.email)
    sessionStorage.setItem('hid_city', draft.city)
    setEditing(false)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2000)
  }

  const action = editing ? (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => {
          setDraft(details)
          setEditing(false)
        }}
        className="rounded-full border border-line px-3.5 py-1.5 text-[13px] font-medium text-navy hover:bg-canvas"
      >
        Cancel
      </button>
      <button type="button" onClick={save} className="rounded-full bg-navy px-3.5 py-1.5 text-[13px] font-semibold text-white hover:bg-navy-600">
        Save
      </button>
    </div>
  ) : (
    <button
      type="button"
      onClick={() => {
        setDraft({ ...details, fullName: acc.name, mobile: mobileDisplay })
        setEditing(true)
      }}
      className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-[13px] font-medium text-navy transition-colors duration-150 hover:bg-canvas"
    >
      {saved ? <Check className="h-4 w-4 text-mp-teal-700" /> : <Pencil className="h-4 w-4" />}
      {saved ? 'Saved' : 'Edit'}
    </button>
  )

  return (
    <AccountDashboardPanel title="Personal details" action={action}>
      <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key}>
            <dt className="text-sm text-muted">
              <label htmlFor={`pd-${f.key}`}>{f.label}</label>
            </dt>
            <dd className="mt-1">
              {editing && f.key !== 'mobile' ? (
                <input
                  id={`pd-${f.key}`}
                  value={draft[f.key]}
                  onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                  className="w-full rounded-xl border border-line px-3 py-2 text-sm text-navy focus:border-mp-teal focus:outline-none focus:ring-2 focus:ring-mp-teal-50"
                />
              ) : (
                <span className="text-sm font-medium text-navy">{f.key === 'fullName' ? acc.name : details[f.key]}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </AccountDashboardPanel>
  )
}
