import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Input } from '@/components/ui/Input'
import api, { unwrap } from '@/services/api'
import { setSession } from '@/store/authSlice'
import type { AuthUser } from '@/types'
import { type ReactNode } from 'react'
import { Logo } from '@/components/brand/Logo'

const schema = z.object({
  identifier: z.string().min(3, 'Enter email or mobile'),
  password: z.string().min(1, 'Password is required'),
})

const BRAND_POINTS = [
  'Book tests for up to six family members',
  'Free home collection in partner cities',
  'Reports and history in one timeline',
]

export function LoginPage() {
  const dispatch = useDispatch()
  const qc = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()
  const registered = Boolean((location.state as { registered?: boolean } | null)?.registered)
  const prefill = (location.state as { email?: string } | null)?.email ?? ''
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { identifier: prefill, password: '' },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      const res = unwrap<{ accessToken: string; refreshToken: string; user: AuthUser }>(
        (await api.post('/auth/login', values)).data,
      )
      dispatch(setSession(res))
      await qc.invalidateQueries({ queryKey: ['tests'] })
      const from = (location.state as { from?: string } | null)?.from
      const next = from && from !== '/login' && from !== '/signup' ? from : '/home'
      navigate(res.user.role === 'ADMIN' || res.user.role === 'SUPER_ADMIN' ? '/admin' : next, { replace: true })
    } catch (e: unknown) {
      const err = e as {
        message?: string
        code?: string
        response?: { data?: { message?: string }; status?: number }
      }
      if (!err.response) {
        form.setError('root', {
          message: 'Cannot reach the server. Start the backend: cd Backend && npm run start:dev (port 5000).',
        })
        return
      }
      form.setError('root', { message: err.response.data?.message ?? 'Unable to sign in' })
    }
  }

  const rootError = form.formState.errors.root?.message

  return (
    <AuthFrame title="Welcome back" subtitle="Log in to manage bookings and health records.">
      {registered ? <div className="ok">Account created. Please log in to enter HealthIDCard.</div> : null}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Input label="Email or mobile" {...form.register('identifier')} error={form.formState.errors.identifier?.message} />
        <Input label="Password" type="password" {...form.register('password')} error={form.formState.errors.password?.message} />
        {rootError ? <p className="error">{rootError}</p> : null}
        <button className="hid-btn hid-btn-primary hid-btn-block" type="submit">
          Log in securely
        </button>
      </form>
      <div className="row-between fine" style={{ marginTop: 8 }}>
        <Link to="/forgot-password" className="linkish">
          Forgot password?
        </Link>
        <Link to="/signup" className="linkish">
          Create an account
        </Link>
      </div>
      <p className="fine">
        <Link to="/login" className="linkish">
          Log in with mobile OTP
        </Link>
      </p>
      <p className="fine" style={{ fontSize: 12 }}>
        Demo: mayur@healthcart.com / Demo@1234
      </p>
    </AuthFrame>
  )
}

export function AuthFrame({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="login">
      <section className="login-brand">
        <div>
          <Logo variant="compact" onDark />
          <h1>Your family&apos;s health, all in one place</h1>
          <p className="lead">Member pricing, home collection and reports for everyone on your HealthID Card.</p>
          <ul className="brand-points">
            {BRAND_POINTS.map((point) => (
              <li key={point}>
                <span className="dot" />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 13 }}>Sehat bhi, bachat bhi.</p>
      </section>
      <section className="login-panel">
        <div className="login-card">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Logo variant="compact" />
            <Link to="/" className="linkish">
              ← Home
            </Link>
          </div>
          <p className="eyebrow">HealthIDCard</p>
          <h2>{title}</h2>
          <p className="sub">{subtitle}</p>
          {children}
        </div>
      </section>
    </div>
  )
}
