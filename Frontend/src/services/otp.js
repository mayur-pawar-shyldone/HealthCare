import { firebaseAuthMessage, firebaseConfirmOtp, firebaseSendSms, isFirebasePhoneEnabled } from '@/lib/firebase-phone';
import api, { unwrap } from '@/services/api';
export async function sendOtp(payload) {
    const prepared = unwrap((await api.post('/auth/otp/send', payload)).data);
    if (!isFirebasePhoneEnabled())
        return prepared;
    try {
        await firebaseSendSms(payload.mobile);
        return { ...prepared, delivered: true, channel: 'sms', devCode: undefined };
    }
    catch (error) {
        throw { response: { data: { message: firebaseAuthMessage(error) } } };
    }
}
export async function verifyOtp(payload) {
    if (!isFirebasePhoneEnabled()) {
        return unwrap((await api.post('/auth/otp/verify', payload)).data);
    }
    try {
        const idToken = await firebaseConfirmOtp(payload.otp);
        return unwrap((await api.post('/auth/otp/firebase', {
            idToken,
            mobile: payload.mobile,
            purpose: payload.purpose,
            fullName: payload.fullName,
        })).data);
    }
    catch (error) {
        if (error && typeof error === 'object' && 'response' in error)
            throw error;
        throw { response: { data: { message: firebaseAuthMessage(error) } } };
    }
}
export async function sendMobileOtp(mobile) {
    return unwrap((await api.post('/auth/send-otp', { mobile, purpose: 'login' })).data);
}
export async function verifyMobileOtp(mobile, otp) {
    return unwrap((await api.post('/auth/verify-otp', { mobile, otp, purpose: 'login' })).data);
}
export function authErrorMessage(e) {
    const err = e;
    if (!err.response) {
        return 'Cannot reach the server. Start the backend on port 5000 and try again.';
    }
    return err.response.data?.message ?? 'Something went wrong. Please try again.';
}
export function channelNotice(channel, delivered = true, devCode) {
    if (devCode) {
        return `SMS is not connected yet. Your OTP is ${devCode}. It expires in 5 minutes.`;
    }
    if (!delivered || channel === 'dev') {
        return 'OTP was created, but WhatsApp/SMS is not connected yet. Check the backend terminal for the 6-digit code.';
    }
    return channel === 'whatsapp'
        ? 'OTP sent on WhatsApp. It expires in 5 minutes.'
        : 'OTP sent by SMS. Enter it quickly — it expires in about 1 minute.';
}
