import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { ArrowRight, Calendar, X } from 'lucide-react'
import api, { unwrap } from '@/services/api'
import { authErrorMessage } from '@/services/otp'
import { subscribeHealthCard } from '@/lib/health-card-bus'

type FormState = {
  name: string
  mobile: string
  aadhaar: string
  dob: string
  gender: string
  email: string
  address: string
  pin: string
  consent: boolean
}

type FormErrors = Partial<Record<keyof FormState, string>>

function blankForm(): FormState {
  return {
    name: '',
    mobile: '',
    aadhaar: '',
    dob: '',
    gender: '',
    email: '',
    address: '',
    pin: '',
    consent: false,
  }
}

function mapGender(value: string): 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' {
  if (value === 'Male') return 'MALE'
  if (value === 'Female') return 'FEMALE'
  if (value === 'Other') return 'OTHER'
  return 'PREFER_NOT_TO_SAY'
}

export function CardSignupModal() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(blankForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [serverError, setServerError] = useState('')
  const [cardNumber, setCardNumber] = useState('')

  useEffect(() => subscribeHealthCard(() => {
    setForm(blankForm())
    setErrors({})
    setDone(false)
    setServerError('')
    setCardNumber('')
    setOpen(true)
  }), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  function setField(key: keyof FormState) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
      setForm((prev) => ({ ...prev, [key]: value }))
    }
  }

  function validate(): FormErrors {
    const next: FormErrors = {}
    if (!form.name.trim()) next.name = 'Enter your full name as on Aadhaar'
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) next.mobile = 'Enter a 10-digit mobile number'
    if (!/^\d{12}$/.test(form.aadhaar.trim())) next.aadhaar = 'Enter a 12-digit Aadhaar number'
    if (!/^\d{2}-\d{2}-\d{4}$/.test(form.dob.trim())) next.dob = 'Use dd-mm-yyyy'
    if (!form.gender) next.gender = 'Select gender'
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email'
    if (form.address.trim().length < 8) next.address = 'Enter your full address as on Aadhaar'
    if (!/^\d{6}$/.test(form.pin.trim())) next.pin = 'Enter a 6-digit PIN code'
    if (!form.consent) next.consent = 'Consent is required to create your HealthID Card'
    return next
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    setServerError('')
    if (Object.keys(next).length) return
    setBusy(true)
    try {
      const result = unwrap<{ cardNumber: string }>(
        (
          await api.post('/membership/free-card', {
            fullName: form.name.trim(),
            mobile: form.mobile.trim(),
            aadhaar: form.aadhaar.trim(),
            dateOfBirth: form.dob.trim(),
            gender: mapGender(form.gender),
            email: form.email.trim() || undefined,
            address: form.address.trim(),
            pincode: form.pin.trim(),
            city: 'Nashik',
            state: 'Maharashtra',
          })
        ).data,
      )
      setCardNumber(result.cardNumber)
      setDone(true)
    } catch (error) {
      setServerError(authErrorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  function field(
    label: string,
    required: boolean,
    control: ReactNode,
    error?: string,
    span?: boolean,
  ) {
    return (
      <label className={`hid-field${span ? ' hid-span' : ''}`}>
        <span className="hid-label">
          {label}
          {required ? <span className="hid-req"> *</span> : null}
        </span>
        {control}
        {error ? <span className="hid-error">{error}</span> : null}
      </label>
    )
  }

  return (
    <div className="hid-overlay" role="presentation" onClick={() => setOpen(false)}>
      <div
        className="hid-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hid-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="hid-head">
          <p className="hid-badge">
            <span className="hid-dot" aria-hidden />
            Free HealthID Card · Nashik
          </p>
          <h2 id="hid-title" className="hid-title">
            Get your free HealthID Card
          </h2>
          <p className="hid-sub">
            Create your ABHA in 2 minutes — details as per Aadhaar, secure &amp; NABL verified.
          </p>
          <button type="button" className="hid-x" aria-label="Close" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {done ? (
          <div className="hid-body hid-done">
            <h3>HealthID Card saved</h3>
            <p>
              Card <strong>{cardNumber}</strong> is saved for {form.mobile}. When you book a test, choose{' '}
              <strong>I have a HealthIDCard</strong> and enter this mobile. We will send an OTP to verify it.
            </p>
            <button type="button" className="hid-create mt-[18px] w-full" onClick={() => setOpen(false)}>
              Done
            </button>
          </div>
        ) : (
          <form className="hid-body" onSubmit={submit}>
            <div className="hid-grid">
              {field(
                'Full Name',
                true,
                <input
                  className="hid-input"
                  name="name"
                  autoComplete="name"
                  placeholder="As per Aadhaar"
                  value={form.name}
                  onChange={setField('name')}
                />,
                errors.name,
              )}
              {field(
                'Mobile Number',
                true,
                <input
                  className="hid-input"
                  name="mobile"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  placeholder="10-digit mobile"
                  value={form.mobile}
                  onChange={setField('mobile')}
                />,
                errors.mobile,
              )}
              {field(
                'Aadhaar Number',
                true,
                <input
                  className="hid-input"
                  name="aadhaar"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={12}
                  placeholder="12-digit Aadhaar"
                  value={form.aadhaar}
                  onChange={setField('aadhaar')}
                />,
                errors.aadhaar,
              )}
              {field(
                'Date of Birth',
                true,
                <span className="hid-date">
                  <input
                    className="hid-input"
                    name="dob"
                    placeholder="dd-mm-yyyy"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.dob}
                    onChange={setField('dob')}
                  />
                  <span className="hid-cal" aria-hidden>
                    <Calendar className="h-[18px] w-[18px]" />
                  </span>
                </span>,
                errors.dob,
              )}
              {field(
                'Gender',
                true,
                <select className="hid-select" name="gender" value={form.gender} onChange={setField('gender')}>
                  <option value="">Select</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>,
                errors.gender,
              )}
              {field(
                'Email',
                false,
                <input
                  className="hid-input"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="For reports (optional)"
                  value={form.email}
                  onChange={setField('email')}
                />,
                errors.email,
              )}
              {field(
                'Address',
                true,
                <input
                  className="hid-input"
                  name="address"
                  autoComplete="street-address"
                  placeholder="House, street, area — as per Aadhaar"
                  value={form.address}
                  onChange={setField('address')}
                />,
                errors.address,
                true,
              )}
              {field(
                'PIN Code',
                true,
                <input
                  className="hid-input"
                  name="pin"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={6}
                  placeholder="6-digit PIN"
                  value={form.pin}
                  onChange={setField('pin')}
                />,
                errors.pin,
              )}
              {field('City', false, <input className="hid-input" value="Nashik" readOnly aria-readonly />)}
              {field('State', false, <input className="hid-input" value="Maharashtra" readOnly aria-readonly />)}
            </div>

            <label className="hid-consent hid-span mt-2.5">
              <input type="checkbox" checked={form.consent} onChange={setField('consent')} />
              <p>
                I consent to create my ABHA (HealthID) and allow HealthIDCard to use my Aadhaar details for verification
                as per NDHM guidelines. <strong>Data is encrypted &amp; never shared.</strong>
              </p>
            </label>
            {errors.consent ? <p className="hid-error mt-2">{errors.consent}</p> : null}
            {serverError ? <p className="hid-error mt-2">{serverError}</p> : null}

            <div className="hid-actions">
              <button type="submit" className="hid-create" disabled={busy}>
                {busy ? 'Saving card…' : 'Create HealthID Card'}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
              <button type="button" className="hid-cancel" onClick={() => setOpen(false)}>
                Cancel
              </button>
            </div>
            <p className="hid-note">No fees. Your card is saved now and verified by OTP when you book.</p>
          </form>
        )}
      </div>
    </div>
  )
}
