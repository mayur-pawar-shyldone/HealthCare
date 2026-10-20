import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useState, type ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import api, { unwrap } from '@/services/api'
import { setSession } from '@/store/authSlice'
import type { AuthUser } from '@/types'
import { AuthSplitLayout, authSplitInputClass, authSplitPrimaryBtnClass } from '@/components/auth/AuthSplitLayout'

const schema = z.object({
  identifier: z.string().min(3, 'Enter email or mobile'),
  password: z.string().min(1, 'Password is required'),
})

export function LoginPage() {
  const dispatch = useDispatch()
  const qc = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
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
  const idError = form.formState.errors.identifier?.message
  const passError = form.formState.errors.password?.message

  return (
    <AuthSplitLayout
      title="Welcome Back"
      subtitle="Please login to your account"
      footer={
        <>
          <div className="flex items-center justify-between text-[13px]">
            <Link to="/forgot-password" className="font-medium text-[#9ca3af] hover:text-[#5e5df0]">
              Forgot password?
            </Link>
            <Link to="/signup" className="font-semibold text-[#5e5df0] hover:underline">
              Create an account
            </Link>
          </div>
          <p className="mt-4 text-center text-[13px]">
            <Link to="/login" className="font-semibold text-[#5e5df0] hover:underline">
              Log in with mobile OTP
            </Link>
          </p>
          <p className="mt-2 text-center text-[12px] text-[#9ca3af]">Demo: mayur@healthcart.com / Demo@1234</p>
        </>
      }
    >
      {registered ? (
        <div className="mb-4 rounded-xl bg-emerald-50 px-3 py-2.5 text-[13px] font-medium text-emerald-800">
          Account created. Please log in to enter HealthIDCard.
        </div>
      ) : null}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block">
            <span className="sr-only">Email or mobile</span>
            <input
              className={authSplitInputClass}
              placeholder="Email or mobile"
              {...form.register('identifier')}
            />
          </label>
          {idError ? <p className="mt-1.5 text-[12px] font-semibold text-[#dc2626]">{idError}</p> : null}
        </div>
        <div>
          <label className="relative block">
            <span className="sr-only">Password</span>
            <input
              className={cnInputWithIcon}
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              {...form.register('password')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </label>
          {passError ? <p className="mt-1.5 text-[12px] font-semibold text-[#dc2626]">{passError}</p> : null}
        </div>
        {rootError ? <p className="text-[13px] font-semibold text-[#dc2626]">{rootError}</p> : null}
        <button className={authSplitPrimaryBtnClass} type="submit">
          Login
        </button>
      </form>
    </AuthSplitLayout>
  )
}

const cnInputWithIcon = `${authSplitInputClass} pr-12`

/** @deprecated Use AuthSplitLayout directly */
export function AuthFrame({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <AuthSplitLayout title={title} subtitle={subtitle}>
      {children}
    </AuthSplitLayout>
  )
}
