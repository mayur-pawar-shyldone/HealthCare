import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ACCOUNT_PACKAGES, BOOKING_DATES } from '@/account/account-data'
import { AccountDashboardPageContent } from '@/account/AccountDashboardHub'
import { rupee, useAccount } from '@/account/AccountContext'
import { BookSteps, PageHead } from '@/account/account-ui'
import { readForm } from '@/account/form-utils'

export function AccountDashboardPage() {
  return <AccountDashboardPageContent />
}

export function AccountBookingsPage() {
  const acc = useAccount()
  const navigate = useNavigate()
  const tabs = ['Upcoming', 'Completed', 'Cancelled', 'Rescheduled']
  const q = acc.search.trim().toLowerCase()
  const rows = acc.bookings.filter(
    (b) => b.status === acc.tab && (!q || (b.id + acc.pkg(b.packageId).name).toLowerCase().includes(q)),
  )

  return (
    <>
      <PageHead title="My Bookings" text="Current and past collections." />
      <div className="tabs">
        {tabs.map((t) => (
          <button key={t} type="button" className={acc.tab === t ? 'on' : ''} onClick={() => acc.setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      <div className="list">
        {rows.length ? (
          rows.map((b) => (
            <article className="item" key={b.id}>
              <div>
                <strong>{acc.pkg(b.packageId).name}</strong>
                <small>
                  {b.id} · {acc.member(b.memberId)?.name} · {b.date} · {b.slot}
                </small>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span>{rupee(b.amount)}</span>
                <span className={`badge ${b.status === 'Completed' ? 'ok' : b.status === 'Cancelled' ? 'muted' : b.status === 'Rescheduled' ? 'warn' : ''}`}>
                  {b.status}
                </span>
                <button type="button" className="hid-btn hid-btn-ghost hid-btn-sm" onClick={() => navigate(`/account/bookings/${b.id}`)}>
                  View
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="card empty">Nothing in {acc.tab.toLowerCase()} right now.</div>
        )}
      </div>
    </>
  )
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
      <PageHead title={`Booking ${b.id}`} text={`${acc.pkg(b.packageId).name} for ${acc.member(b.memberId)?.name || ''}`} />
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
              <button type="button" className="hid-btn hid-btn-primary hid-btn-block" onClick={() => { acc.rescheduleBooking(b.id); navigate('/account/bookings') }}>
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
  const acc = useAccount()
  const people = ['All', ...acc.family.map((m) => m.name)]
  const rows = acc.bookings.filter(
    (b) =>
      b.report &&
      (acc.reportMember === 'All' || acc.member(b.memberId)?.name === acc.reportMember) &&
      (!acc.search || (acc.pkg(b.packageId).name + b.id).toLowerCase().includes(acc.search.toLowerCase())),
  )

  return (
    <>
      <PageHead title="Reports & Records" text="Lab reports for people on this card." />
      <div className="tabs">
        {people.map((n) => (
          <button key={n} type="button" className={acc.reportMember === n ? 'on' : ''} onClick={() => acc.setReportMember(n)}>
            {n}
          </button>
        ))}
      </div>
      <div className="list">
        {rows.length ? (
          rows.map((b) => (
            <article className="item" key={b.id}>
              <div>
                <strong>{acc.pkg(b.packageId).name}</strong>
                <small>
                  {acc.member(b.memberId)?.name} · {b.date} · Partner lab · Ready
                </small>
              </div>
              <button type="button" className="hid-btn hid-btn-ghost hid-btn-sm" onClick={() => acc.showToast('Report download is locked until the lab file is linked.')}>
                Download PDF
              </button>
            </article>
          ))
        ) : (
          <div className="card empty">No report matches this filter. Completed visits appear here once the lab releases them.</div>
        )}
      </div>
    </>
  )
}

export function AccountProfilePage() {
  const acc = useAccount()
  return (
    <>
      <PageHead title="Profile & Settings" text="Account details, addresses and sign-in." />
      {acc.profileSaved ? <div className="ok">Saved on this device for the preview.</div> : null}
      <form
        className="card"
        onSubmit={(e) => {
          e.preventDefault()
          const name = new FormData(e.currentTarget).get('name')?.toString() || acc.name
          acc.saveProfile(name)
        }}
      >
        <div className="grid-2">
          <label className="field">
            Full name
            <input name="name" defaultValue={acc.name} />
          </label>
          <label className="field">
            Mobile
            <input value={acc.mobile} readOnly />
          </label>
          <label className="field">
            City
            <input value="Mumbai" readOnly />
          </label>
          <label className="field">
            Member ID
            <input value={acc.memberId()} readOnly />
          </label>
        </div>
        <button className="hid-btn hid-btn-primary" type="submit">
          Save profile
        </button>
      </form>
      <h3>Saved addresses</h3>
      <div className="list">
        {acc.addresses.map((a) => (
          <article className="item" key={a.id}>
            <div>
              <strong>{a.label}</strong>
              <small>
                {a.line} · {a.note}
              </small>
            </div>
          </article>
        ))}
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <strong>Security</strong>
        <p className="muted">This number is verified for OTP login. Communication is limited to booking and report updates.</p>
        <LinkishLogout />
      </div>
    </>
  )
}

function LinkishLogout() {
  const acc = useAccount()
  const navigate = useNavigate()
  return (
    <button
      type="button"
      className="hid-btn hid-btn-ghost"
      onClick={() => {
        acc.logout()
        navigate('/login')
      }}
    >
      Log out
    </button>
  )
}

export function AccountSupportPage() {
  const acc = useAccount()
  return (
    <>
      <PageHead title="Help & Support" text="Booking, reports and membership." />
      <div className="grid-3">
        <article className="card">
          <strong>Call</strong>
          <p className="muted">1800-123-4567 · 7am–9pm</p>
        </article>
        <article className="card">
          <strong>Email</strong>
          <p className="muted">care@healthidcard.com</p>
        </article>
        <article className="card">
          <strong>WhatsApp</strong>
          <p className="muted">Same hours as the call line</p>
        </article>
      </div>
      <div className="grid-2" style={{ marginTop: 14 }}>
        <form
          className="card"
          onSubmit={(e) => {
            e.preventDefault()
            const data = readForm(e.currentTarget)
            acc.submitTicket(String(data.issue || 'General'))
            e.currentTarget.reset()
          }}
        >
          <h3 style={{ marginTop: 0 }}>Create a request</h3>
          <label className="field">
            Booking
            <select name="booking">
              <option value="">General</option>
              {acc.bookings.map((b) => (
                <option key={b.id}>{b.id}</option>
              ))}
            </select>
          </label>
          <label className="field">
            Issue
            <select name="issue">
              <option>Reschedule a visit</option>
              <option>Report not visible</option>
              <option>Membership question</option>
              <option>Payment or refund</option>
            </select>
          </label>
          <label className="field">
            What happened?
            <textarea name="note" required placeholder="A short description" />
          </label>
          <button className="hid-btn hid-btn-primary" type="submit">
            Submit request
          </button>
        </form>
        <div>
          <article className="card">
            <h3 style={{ marginTop: 0 }}>Common questions</h3>
            <p>
              <strong>When is the report ready?</strong>
              <br />
              <span className="muted">Most panels are released within 6 hours of collection.</span>
            </p>
            <p>
              <strong>Can I add a parent?</strong>
              <br />
              <span className="muted">Yes, up to six people on one card.</span>
            </p>
          </article>
          <div className="list" style={{ marginTop: 12 }}>
            {acc.tickets.length ? (
              acc.tickets.map((t) => (
                <article className="item" key={t.id}>
                  <div>
                    <strong>{t.id}</strong>
                    <small>
                      {t.issue} · {t.status}
                    </small>
                  </div>
                </article>
              ))
            ) : (
              <div className="card empty">No open requests.</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export function AccountCataloguePage() {
  const acc = useAccount()
  const navigate = useNavigate()
  const q = acc.search.trim().toLowerCase()
  const filtered = ACCOUNT_PACKAGES.filter((p) => !q || (p.name + p.summary).toLowerCase().includes(q))

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
  const slots = BOOKING_DATES.find((d) => d.id === acc.draft.date)?.slots ?? []

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
          {BOOKING_DATES.map((d) => (
            <button
              key={d.id}
              type="button"
              className={`day ${acc.draft.date === d.id ? 'on' : ''}`}
              disabled={!d.slots.length}
              onClick={() => acc.pickDate(d.id)}
            >
              {d.label}
              {d.slots.length ? '' : ' · Full'}
            </button>
          ))}
        </div>
        <h3>Time</h3>
        <div className="slots">
          {slots.length ? (
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
  const d = BOOKING_DATES.find((x) => x.id === acc.draft.date)
  const save = p.mrp - p.price

  return (
    <>
      <BookSteps n={2} />
      <PageHead title="Review and confirm" text="Price is the member rate. Collection is free." />
      <form
        className="split"
        onSubmit={(e) => {
          e.preventDefault()
          acc.confirmBooking()
          navigate('/account/book/done')
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
          <h3>Payment</h3>
          <div className="choice">
            <label>
              <input type="radio" name="pay" value="cash" defaultChecked />
              <span>
                <strong>Cash at collection</strong>
                <br />
                <small className="muted">Pay the phlebotomist. No online charge in this preview.</small>
              </span>
            </label>
            <label>
              <input type="radio" disabled />
              <span>
                <strong>Online payment</strong>
                <br />
                <small className="muted">Not enabled yet.</small>
              </span>
            </label>
          </div>
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
          <button className="hid-btn hid-btn-primary hid-btn-block" style={{ marginTop: 14 }} type="submit">
            Confirm booking
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
        <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{b.id}</h2>
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

