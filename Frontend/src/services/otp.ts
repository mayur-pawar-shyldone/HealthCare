import { firebaseAuthMessage, firebaseConfirmOtp, firebaseSendSms, isFirebasePhoneEnabled } from '@/lib/firebase-phone'
import api, { unwrap } from '@/services/api'
import type { AuthUser } from '@/types'

export type OtpPurpose = 'login' | 'signup' | 'guest' | 'lookup'
export type OtpChannel = 'whatsapp' | 'sms' | 'dev'

export type SendOtpResult = {
  sent: boolean
  delivered?: boolean
  channel: OtpChannel
  maskedMobile: string
  /** Present only in local/dev when SMS/WhatsApp is not configured. */
  devCode?: string
}

export type VerifyOtpResult = {
  verified: boolean
  mobile?: string
  accessToken?: string
  refreshToken?: string
  user?: AuthUser
}

export async function sendOtp(payload: { mobile: string; purpose: OtpPurpose; fullName?: string }) {
  const prepared = unwrap<SendOtpResult>((await api.post('/auth/otp/send', payload)).data)
  if (!isFirebasePhoneEnabled()) return prepared
  try {
    await firebaseSendSms(payload.mobile)
    return { ...prepared, delivered: true, channel: 'sms' as const, devCode: undefined }
  } catch (error) {
    throw { response: { data: { message: firebaseAuthMessage(error) } } }
  }
}

export async function verifyOtp(payload: {
  mobile: string
  otp: string
  purpose: OtpPurpose
  fullName?: string
}) {
  if (!isFirebasePhoneEnabled()) {
    return unwrap<VerifyOtpResult>((await api.post('/auth/otp/verify', payload)).data)
  }
  try {
    const idToken = await firebaseConfirmOtp(payload.otp)
    return unwrap<VerifyOtpResult>(
      (
        await api.post('/auth/otp/firebase', {
          idToken,
          mobile: payload.mobile,
          purpose: payload.purpose,
          fullName: payload.fullName,
        })
      ).data,
    )
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) throw error
    throw { response: { data: { message: firebaseAuthMessage(error) } } }
  }
}

export async function sendMobileOtp(mobile: string) {
  return unwrap<SendOtpResult>((await api.post('/auth/send-otp', { mobile, purpose: 'login' })).data)
}

export async function verifyMobileOtp(mobile: string, otp: string) {
  return unwrap<VerifyOtpResult>((await api.post('/auth/verify-otp', { mobile, otp, purpose: 'login' })).data)
}

export function authErrorMessage(e: unknown) {
  const err = e as {
    message?: string
    response?: { data?: { message?: string }; status?: number }
  }
  if (!err.response) {
    return 'Cannot reach the server. Start the backend on port 5000 and try again.'
  }
  return err.response.data?.message ?? 'Something went wrong. Please try again.'
}

export function channelNotice(channel: OtpChannel, delivered = true, devCode?: string) {
  if (devCode) {
    return `SMS is not connected yet. Your OTP is ${devCode}. It expires in 5 minutes.`
  }
  if (!delivered || channel === 'dev') {
    return 'OTP was created, but WhatsApp/SMS is not connected yet. Check the backend terminal for the 6-digit code.'
  }
  return channel === 'whatsapp'
    ? 'OTP sent on WhatsApp. It expires in 5 minutes.'
    : 'OTP sent by SMS. Enter it quickly — it expires in about 1 minute.'
}
