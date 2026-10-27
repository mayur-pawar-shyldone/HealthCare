import { initializeApp, getApps } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, } from 'firebase/auth';
function firebaseWebConfig() {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    const appId = import.meta.env.VITE_FIREBASE_APP_ID;
    if (!apiKey || !authDomain || !projectId || !appId)
        return null;
    return { apiKey, authDomain, projectId, appId };
}
export function isFirebasePhoneEnabled() {
    return Boolean(firebaseWebConfig());
}
export function toE164In(mobile) {
    const ten = mobile.replace(/\D/g, '').slice(-10);
    return `+91${ten}`;
}
let app;
let auth;
let verifier;
let confirmation;
function getFirebaseAuth() {
    const cfg = firebaseWebConfig();
    if (!cfg)
        throw new Error('Firebase Phone Auth is not configured.');
    if (!app) {
        app = getApps()[0] ?? initializeApp(cfg);
        auth = getAuth(app);
        auth.languageCode = 'en';
    }
    return auth;
}
function ensureRecaptchaHost() {
    let el = document.getElementById('recaptcha-container');
    if (!el) {
        el = document.createElement('div');
        el.id = 'recaptcha-container';
        el.className = 'mt-3 flex justify-center';
        document.body.appendChild(el);
    }
    return el;
}
function resetVerifier() {
    try {
        verifier?.clear();
    }
    catch {
        /* already cleared */
    }
    verifier = undefined;
    const host = document.getElementById('recaptcha-container');
    if (host)
        host.innerHTML = '';
}
function getVerifier() {
    const a = getFirebaseAuth();
    ensureRecaptchaHost();
    if (verifier)
        return verifier;
    verifier = new RecaptchaVerifier(a, 'recaptcha-container', {
        size: 'normal',
        callback: () => undefined,
        'expired-callback': () => undefined,
    });
    return verifier;
}
export async function firebaseSendSms(mobile) {
    const phoneNumber = toE164In(mobile);
    const appVerifier = getVerifier();
    try {
        confirmation = await signInWithPhoneNumber(getFirebaseAuth(), phoneNumber, appVerifier);
    }
    catch (error) {
        resetVerifier();
        throw error;
    }
}
export async function firebaseConfirmOtp(otp) {
    if (!confirmation) {
        throw new Error('Request a new OTP first.');
    }
    const cred = await confirmation.confirm(otp);
    confirmation = undefined;
    return cred.user.getIdToken();
}
export function firebaseAuthMessage(error) {
    const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
    if (code === 'auth/configuration-not-found' || /CONFIGURATION_NOT_FOUND/i.test(String(error.message || ''))) {
        return 'Firebase Authentication is not enabled. In Firebase Console open Authentication → Get started, then enable Phone sign-in.';
    }
    if (code === 'auth/invalid-phone-number')
        return 'Enter a valid 10-digit mobile number.';
    if (code === 'auth/too-many-requests')
        return 'Too many OTP requests. Try again later.';
    if (code === 'auth/quota-exceeded')
        return 'Firebase SMS quota is used up. Try again later.';
    if (code === 'auth/operation-not-allowed')
        return 'Enable Phone sign-in in the Firebase console.';
    if (code === 'auth/invalid-app-credential')
        return 'Firebase reCAPTCHA failed. Add localhost to Authorized domains and allow India in SMS region policy.';
    if (code === 'auth/captcha-check-failed')
        return 'reCAPTCHA failed. Refresh the page and try again.';
    if (code === 'auth/invalid-verification-code')
        return 'Incorrect OTP. Please try again.';
    if (code === 'auth/code-expired')
        return 'OTP expired. Request a new one.';
    if (code === 'auth/billing-not-enabled')
        return 'Upgrade the Firebase project to the Blaze plan to send real SMS.';
    if (code === 'auth/missing-phone-number')
        return 'Enter a mobile number first.';
    if (typeof error === 'object' && error && 'message' in error) {
        return String(error.message);
    }
    return 'Could not send OTP. Please try again.';
}
