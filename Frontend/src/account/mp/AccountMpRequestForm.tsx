import { useState, type FormEvent } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useAccount } from '@/account/AccountContext'
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel'

const issues = ['Reschedule a visit', 'Report not received', 'Payment or refund', 'Wallet credits', 'Something else']

export function AccountMpRequestForm() {
  const acc = useAccount()
  const [about, setAbout] = useState('General')
  const [issue, setIssue] = useState(issues[0])
  const [details, setDetails] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')

  const fieldClass =
    'mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-navy focus:border-mp-teal focus:outline-none focus:ring-2 focus:ring-mp-teal-50'

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (details.trim().length < 5) {
      setError('Tell us a little more so we can help.')
      return
    }
    setError('')
    setStatus('sending')
    acc.submitTicket(`${issue}: ${details.trim()}`)
    window.setTimeout(() => setStatus('sent'), 700)
  }

  if (status === 'sent') {
    return (
      <AccountDashboardPanel title="Raise a request">
        <div className="flex flex-col items-center py-5 text-center">
          <CheckCircle2 className="h-9 w-9 text-mp-teal" aria-hidden />
          <p className="mt-2 text-base font-bold text-navy">Request received</p>
          <p className="mt-1 text-[13px] text-muted">We&apos;ll reply on WhatsApp within a few hours.</p>
          <button
            type="button"
            onClick={() => {
              setStatus('idle')
              setDetails('')
            }}
            className="mt-4 rounded-full border border-line px-4 py-2 text-[13px] font-semibold text-navy hover:bg-canvas"
          >
            Raise another
          </button>
        </div>
      </AccountDashboardPanel>
    )
  }

  return (
    <AccountDashboardPanel title="Raise a request">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="rq-about" className="text-sm font-medium text-navy">
            About
          </label>
          <select id="rq-about" value={about} onChange={(e) => setAbout(e.target.value)} className={fieldClass}>
            <option>General</option>
            {acc.bookings.map((b) => (
              <option key={b.id}>
                {acc.pkg(b.packageId).name} · {b.date}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="rq-issue" className="text-sm font-medium text-navy">
            Issue
          </label>
          <select id="rq-issue" value={issue} onChange={(e) => setIssue(e.target.value)} className={fieldClass}>
            {issues.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="rq-details" className="text-sm font-medium text-navy">
            What happened?
          </label>
          <textarea
            id="rq-details"
            rows={3}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="A short description"
            aria-invalid={!!error}
            className={`${fieldClass} resize-none`}
          />
          {error ? <p className="mt-1.5 text-sm text-brick">{error}</p> : null}
        </div>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full rounded-full bg-navy py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-navy-600 disabled:opacity-70"
        >
          {status === 'sending' ? 'Sending…' : 'Submit request'}
        </button>
      </form>
    </AccountDashboardPanel>
  )
}
