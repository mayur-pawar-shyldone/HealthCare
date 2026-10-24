import type { FormEvent } from 'react'
import { useAccount } from '@/account/AccountContext'
import { readForm } from '@/account/form-utils'
import { AuthSplitLayout, authSplitInputClass, authSplitPrimaryBtnClass } from '@/components/auth/AuthSplitLayout'

export function AccountLoginPage({ onClose }: { onClose?: () => void }) {
  const acc = useAccount()
  const creating = acc.loginMode === 'create'

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = readForm(e.currentTarget) as { mobile: string; name?: string; otp?: string }
    await acc.submitLogin(data)
  }

  return (
    <>
      <AuthSplitLayout
        onClose={onClose}
        title={creating ? 'Create your account' : 'Welcome Back'}
        subtitle={
          creating
            ? 'Tell us who the card is for. We’ll verify your mobile next.'
            : 'Please login to your account'
        }
        footer={
          <>
            <p className="text-center text-[14px] text-[#6b7280]">
              {creating ? 'Already a member?' : 'New to HealthIDCard?'}{' '}
              <button type="button" className="font-semibold text-[#5e5df0] hover:underline" onClick={() => acc.toggleAuthMode()}>
                {creating ? 'Log in' : 'Create an account'}
              </button>
            </p>
            <p className="mt-3 text-center text-[13px]">
              <button type="button" className="font-semibold text-[#9ca3af] hover:text-[#5e5df0]" onClick={() => acc.loginHelp()}>
                Help / support
              </button>
            </p>
          </>
        }
      >
        <form onSubmit={onSubmit} className="space-y-4">
          {acc.notice ? (
            <div className="rounded-xl bg-emerald-50 px-3 py-2.5 text-[13px] font-medium text-emerald-800">{acc.notice}</div>
          ) : null}
          {creating ? (
            <label className="block">
              <span className="sr-only">Full name</span>
              <input
                name="name"
                className={authSplitInputClass}
                placeholder="Full name (as on card)"
                defaultValue={acc.nameInput}
              />
            </label>
          ) : null}
          <label className="block">
            <span className="sr-only">Mobile number</span>
            <input
              name="mobile"
              className={authSplitInputClass}
              inputMode="numeric"
              maxLength={10}
              placeholder="Mobile number"
              defaultValue={acc.mobileInput}
              required
            />
          </label>
          {acc.otpSent ? (
            <>
              <label className="block">
                <span className="sr-only">OTP</span>
                <input
                  key={acc.mobileInput}
                  name="otp"
                  className={authSplitInputClass}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="One-time password (OTP)"
                  defaultValue={acc.otp}
                />
              </label>
              <div className="flex items-center justify-between gap-2 text-[13px]">
                <span className="text-[#9ca3af]">OTP sent to your mobile</span>
                <button
                  type="button"
                  className="font-semibold text-[#5e5df0] hover:underline disabled:text-[#9ca3af]"
                  onClick={() => void acc.resendOtp()}
                  disabled={acc.cooldown > 0 || acc.busy}
                >
                  {acc.cooldown ? `Resend in ${acc.cooldown}s` : 'Resend OTP'}
                </button>
              </div>
            </>
          ) : null}
          {acc.error ? <p className="text-[13px] font-semibold text-[#dc2626]">{acc.error}</p> : null}
          <button className={authSplitPrimaryBtnClass} type="submit" disabled={acc.busy}>
            {acc.busy ? 'Please wait…' : acc.otpSent ? 'Continue securely' : 'Send OTP'}
          </button>
        </form>
      </AuthSplitLayout>
      {acc.toast ? (
        <div className="fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-full bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white shadow-lg">
          {acc.toast}
        </div>
      ) : null}
    </>
  )
}
