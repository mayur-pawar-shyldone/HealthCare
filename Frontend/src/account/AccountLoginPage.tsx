import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAccount } from '@/account/AccountContext'
import { readForm } from '@/account/form-utils'

export function AccountLoginPage() {
  const acc = useAccount()
  const navigate = useNavigate()
  const location = useLocation()
  const creating = acc.loginMode === 'create'
  const from = (location.state as { from?: string } | null)?.from

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = readForm(e.currentTarget) as { mobile: string; name?: string; otp?: string }
    if (acc.submitLogin(data)) {
      const dest = from && from !== '/login' ? from : '/'
      navigate(dest, { replace: true })
    }
  }

  return (
    <div className="login">
      <section className="login-brand">
        <div>
          <img className="logo" src="/logo.webp" alt="HealthIDCard" style={{ height: 46, background: '#fff', borderRadius: 12, padding: 6 }} />
          <h1>Your family&apos;s health, all in one place</h1>
          <p className="lead">Member pricing, home collection and reports for everyone on your HealthID Card.</p>
          <ul className="brand-points">
            <li>
              <span className="dot" /> Book tests for up to six family members
            </li>
            <li>
              <span className="dot" /> Free home collection in Mumbai
            </li>
            <li>
              <span className="dot" /> Reports and trends in one timeline
            </li>
          </ul>
        </div>
        <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 13 }}>Sehat bhi, bachat bhi.</p>
      </section>
      <section className="login-panel">
        <form className="login-card" onSubmit={onSubmit}>
          <p className="eyebrow">HealthIDCard</p>
          <h2>{creating ? 'Create your account' : 'Welcome back'}</h2>
          <p className="sub">
            {creating
              ? 'Tell us who the card is for. We’ll verify the mobile number next.'
              : 'Log in to manage bookings and health records.'}
          </p>
          {acc.notice ? <div className="ok">{acc.notice}</div> : null}
          {creating ? (
            <label className="field">
              Full name
              <input name="name" placeholder="As you’d like it on the card" defaultValue={acc.nameInput} required />
            </label>
          ) : null}
          <label className="field">
            Mobile number
            <input name="mobile" inputMode="numeric" maxLength={10} placeholder="Enter registered mobile number" defaultValue={acc.mobileInput} required />
          </label>
          {acc.otpSent ? (
            <>
              <label className="field">
                OTP
                <input name="otp" inputMode="numeric" maxLength={6} placeholder="Enter one-time password" defaultValue={acc.otp} />
                <span className="hint">Preview: any 6-digit code continues.</span>
              </label>
              <div className="row-between" style={{ marginBottom: 12 }}>
                <span className="hint">OTP sent to your mobile</span>
                <button type="button" className="linkish" onClick={() => acc.resendOtp()} disabled={acc.cooldown > 0}>
                  {acc.cooldown ? `Resend OTP in ${acc.cooldown}s` : 'Resend OTP'}
                </button>
              </div>
            </>
          ) : null}
          {acc.error ? <p className="error">{acc.error}</p> : null}
          <button className="hid-btn hid-btn-primary hid-btn-block" type="submit">
            {acc.otpSent ? 'Continue securely' : 'Send OTP'}
          </button>
          <p className="fine">
            {creating ? 'Already a member?' : 'New to HealthIDCard?'}{' '}
            <button type="button" className="linkish" onClick={() => acc.toggleAuthMode()}>
              {creating ? 'Log in' : 'Create an account'}
            </button>
          </p>
          <p className="fine">
            <button type="button" className="linkish" onClick={() => acc.loginHelp()}>
              Help / support
            </button>
          </p>
        </form>
      </section>
      {acc.toast ? <div className="toast">{acc.toast}</div> : null}
    </div>
  )
}
