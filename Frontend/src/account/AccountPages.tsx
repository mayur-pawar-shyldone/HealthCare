import { useMemo, type FormEvent } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { upcomingCollectionDates } from '@/lib/booking-dates'
import api, { unwrap } from '@/services/api'
import { AccountDashboardPageContent } from '@/account/AccountDashboardHub'
import { AccountMpBookingsReportsPage } from '@/account/mp/AccountMpBookingsReportsPage'
import { AccountMpHelpSupportPage } from '@/account/mp/AccountMpHelpSupportPage'
import { AccountMpMyAccountPage } from '@/account/mp/AccountMpMyAccountPage'
import { rupee, useAccount } from '@/account/AccountContext'
import { BookSteps, PageHead } from '@/account/account-ui'
import { readForm } from '@/account/form-utils'

export function AccountDashboardPage() {
  return <AccountDashboardPageContent />
}

export function AccountBookingsPage() {
  return <AccountMpBookingsReportsPage />
}

export function AccountBookingDetailPage() {
  const acc = useAccount()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const b = acc.bookings.find((x) => x.id === id)
  if (!b) {
    return (
      <>
        <PageHead title="Booking" text="We couldn’t find that booking." />
        <button type="button" className="hid-btn hid-btn-ghost" onClick={() => navigate('/account/bookings')}>
          Back to bookings
        </button>
      </>
    )
  }
  const steps = ['Confirmed', 'Collection scheduled', 'Sample collected', 'Processing', 'Report ready']
  const at = b.status === 'Completed' ? 4 : b.status === 'Cancelled' ? -1 : 1

  return (
    <>
      <PageHead title={`Booking ${b.code || b.id}`} text={`${acc.pkg(b.packageId).name} for ${acc.member(b.memberId)?.name || ''}`} />
      <div className="grid-2">
        <article className="card">
          <span className={`badge ${b.status === 'Completed' ? 'ok' : ''}`}>{b.status}</span>
          <div className="kvs" style={{ marginTop: 14 }}>
            <div>
              <span>Patient</span>
              <strong>{acc.member(b.memberId)?.name}</strong>
            </div>
            <div>
              <span>When</span>
              <strong>
                {b.date} · {b.slot}
              </strong>
            </div>
            <div>
              <span>Where</span>
              <strong style={{ textAlign: 'right' }}>{acc.address(b.addressId)?.line}</strong>
            </div>
            <div>
              <span>Amount</span>
              <strong>{rupee(b.amount)}</strong>
            </div>
          </div>
          <h3>Timeline</h3>
          <div className="list">
            {steps.map((s, i) => (
              <div className="item" key={s}>
                <strong>{s}</strong>
                <span className={`badge ${at >= i ? 'ok' : 'muted'}`}>{at >= i ? 'Done' : 'Pending'}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="card">
          <h3 style={{ marginTop: 0 }}>Manage</h3>
          {b.status === 'Upcoming' ? (
            <>
              <button type="button" className="hid-btn hid-btn-primary hid-btn-block" onClick={() => { acc.rescheduleBooking(b.id); navigate('/account/book/slot') }}>
                Reschedule
              </button>
              <button
                type="button"
                className="hid-btn hid-btn-ghost hid-btn-block"
                style={{ marginTop: 8 }}
                onClick={() => {
                  if (confirm('Cancel this collection?')) {
                    acc.cancelBooking(b.id)
                    navigate('/account/bookings')
                  }
                }}
              >
                Cancel booking
              </button>
            </>
          ) : null}
          {b.report ? (
            <button type="button" className="hid-btn hid-btn-primary hid-btn-block" onClick={() => navigate('/account/reports')}>
              View report
            </button>
          ) : (
            <div className="empty">Report isn’t ready yet.</div>
          )}
          <button type="button" className="hid-btn hid-btn-ghost hid-btn-block" style={{ marginTop: 8 }} onClick={() => navigate('/account/support')}>
            Contact support
          </button>
        </article>
      </div>
    </>
  )
}

export function AccountReportsPage() {
  return <Navigate to="/account/bookings" replace />
}

export function AccountProfilePage() {
  return <AccountMpMyAccountPage />
}

export function AccountSupportPage() {
  return <AccountMpHelpSupportPage />
}

export function AccountCataloguePage() {
  const acc = useAccount()
  const navigate = useNavigate()
  const q = acc.search.trim().toLowerCase()
  const filtered = acc.packages.filter((p) => !q || (p.name + p.summary).toLowerCase().includes(q))

  return (
    <>
      <PageHead title="Book a test" text="Same packages as the public site, at your member price." />
      <div className="grid-2">
        {filtered.length ? (
          filtered.map((p) => (
            <article className="card" key={p.id}>
              <span className="badge">
                {p.tests} tests · Report in {p.time}
              </span>
              <h3>{p.name}</h3>
              <p className="muted">{p.summary}</p>
              <div className="price">
                {rupee(p.price)} <s>{rupee(p.mrp)}</s>
              </div>
              <button
                type="button"
                className="hid-btn hid-btn-primary"
                onClick={() => {
                  acc.choosePackage(p.id)
                  navigate('/account/book/member')
                }}
              >
                Choose package
              </button>
            </article>
          ))
        ) : (
          <div className="card empty">No package matches that search.</div>
        )}
      </div>
    </>
  )
}

export function AccountBookMemberPage() {
  const acc = useAccount()
  const navigate = useNavigate()
  const p = acc.pkg(acc.draft.packageId)

  return (
    <>
      <BookSteps n={0} />
      <PageHead title="Who is this test for?" text={`${p.name} · ${rupee(p.price)}`} />
      <form
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          const data = readForm(e.currentTarget) as { member: string; address: string }
          if (acc.submitMemberStep(data.member, data.address)) navigate('/account/book/slot')
        }}
      >
        <div className="split">
          <div>
            <h3>Family member</h3>
            <div className="choice">
              {acc.family.map((m) => (
                <label key={m.id}>
                  <input type="radio" name="member" value={m.id} defaultChecked={acc.draft.memberId === m.id} />
                  <span>
                    <strong>{m.name}</strong>
                    <br />
                    <small className="muted">{m.relation}</small>
                  </span>
                </label>
              ))}
            </div>
            <h3>Collection address</h3>
            <div className="choice">
              {acc.addresses.map((a) => (
                <label key={a.id}>
                  <input type="radio" name="address" value={a.id} defaultChecked={acc.draft.addressId === a.id} />
                  <span>
                    <strong>{a.label}</strong>
                    <br />
                    <small className="muted">{a.line}</small>
                  </span>
                </label>
              ))}
            </div>
            {acc.error ? <p className="error">{acc.error}</p> : null}
            <button className="hid-btn hid-btn-primary" type="submit" style={{ marginTop: 12 }}>
              Continue
            </button>
          </div>
          <aside className="card">
            <strong>{p.name}</strong>
            <p className="muted">{p.prep}</p>
            <div className="price">{rupee(p.price)}</div>
          </aside>
        </div>
      </form>
    </>
  )
}

export function AccountBookSlotPage() {
  const acc = useAccount()
  const navigate = useNavigate()
  const dates = useMemo(() => upcomingCollectionDates(7), [])
  const slotsQuery = useQuery({
    queryKey: ['slots', acc.draft.date],
    enabled: Boolean(acc.draft.date),
    queryFn: async () => unwrap<{ slots: string[] }>((await api.get('/appointments/slots', { params: { date: acc.draft.date } })).data),
  })
  const slots = slotsQuery.data?.slots ?? []

  return (
    <>
      <BookSteps n={1} />
      <PageHead title="Choose a collection slot" text={acc.address(acc.draft.addressId)?.line || ''} />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (acc.submitSlotStep()) navigate('/account/book/review')
        }}
      >
        <h3>Date</h3>
        <div className="days">
          {dates.map((d) => (
            <button
              key={d.id}
              type="button"
              className={`day ${acc.draft.date === d.id ? 'on' : ''}`}
              onClick={() => acc.pickDate(d.id)}
            >
              {d.label}
            </button>
          ))}
        </div>
        <h3>Time</h3>
        <div className="slots">
          {slotsQuery.isLoading ? (
            <p className="muted">Loading slots…</p>
          ) : slots.length ? (
            slots.map((s) => (
              <button key={s} type="button" className={`slot ${acc.draft.slot === s ? 'on' : ''}`} onClick={() => acc.pickSlot(s)}>
                {s}
              </button>
            ))
          ) : (
            <p className="muted">Pick a date with open slots.</p>
          )}
        </div>
        {acc.error ? <p className="error">{acc.error}</p> : null}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button type="button" className="hid-btn hid-btn-ghost" onClick={() => navigate('/account/book/member')}>
            Back
          </button>
          <button type="submit" className="hid-btn hid-btn-primary">
            Continue
          </button>
        </div>
      </form>
    </>
  )
}

export function AccountBookReviewPage() {
  const acc = useAccount()
  const navigate = useNavigate()
  const p = acc.pkg(acc.draft.packageId)
  const dates = useMemo(() => upcomingCollectionDates(7), [])
  const d = dates.find((x) => x.id === acc.draft.date)
  const save = p.mrp - p.price

  return (
    <>
      <BookSteps n={2} />
      <PageHead title="Review and confirm" text="Price is the member rate. Collection is free." />
      <form
        className="split"
        onSubmit={(e) => {
          e.preventDefault()
          void acc.confirmBooking().then((ok) => {
            if (ok) navigate('/account/book/done')
          })
        }}
      >
        <article className="card">
          <div className="kvs">
            <div>
              <span>Package</span>
              <strong>{p.name}</strong>
            </div>
            <div>
              <span>Patient</span>
              <strong>{acc.member(acc.draft.memberId)?.name}</strong>
            </div>
            <div>
              <span>When</span>
              <strong>
                {d?.label} · {acc.draft.slot}
              </strong>
            </div>
            <div>
              <span>Where</span>
              <strong style={{ textAlign: 'right' }}>{acc.address(acc.draft.addressId)?.line}</strong>
            </div>
          </div>
          <p className="rounded-xl bg-mint/50 px-4 py-3 text-[14px] leading-relaxed text-ink-soft">
            <strong className="text-ink">Pay at sample collection</strong> — cash or UPI to the phlebotomist when they
            visit. No online payment is taken during booking.
          </p>
        </article>
        <aside className="card">
          <div className="kvs">
            <div>
              <span>List price</span>
              <span>{rupee(p.mrp)}</span>
            </div>
            <div>
              <span>Member saving</span>
              <span>− {rupee(save)}</span>
            </div>
            <div>
              <span>Home collection</span>
              <span>₹0</span>
            </div>
            <div className="total">
              <span>Payable</span>
              <span>{rupee(p.price)}</span>
            </div>
          </div>
          {acc.error ? <p className="error">{acc.error}</p> : null}
          <button className="hid-btn hid-btn-primary hid-btn-block" style={{ marginTop: 14 }} type="submit" disabled={acc.busy}>
            {acc.busy ? 'Saving…' : 'Confirm booking'}
          </button>
        </aside>
      </form>
    </>
  )
}

export function AccountBookDonePage() {
  const acc = useAccount()
  const navigate = useNavigate()
  const b = acc.bookings[0]
  if (!b) return null

  return (
    <>
      <BookSteps n={3} />
      <PageHead title="Booking confirmed" text="We’ve saved this visit on your account." />
      <article className="card">
        <span className="badge ok">Confirmed</span>
        <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{b.code || b.id}</h2>
        <p>
          {acc.pkg(b.packageId).name} for {acc.member(b.memberId)?.name} · {b.date} · {b.slot}
        </p>
        <button type="button" className="hid-btn hid-btn-primary" onClick={() => navigate(`/account/bookings/${b.id}`)}>
          View booking
        </button>
        <button type="button" className="hid-btn hid-btn-ghost" onClick={() => navigate('/account/bookings')}>
          All bookings
        </button>
      </article>
    </>
  )
}

