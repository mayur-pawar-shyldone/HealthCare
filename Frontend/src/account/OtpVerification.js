import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccount, validMobile } from '@/account/AccountContext';
import { AuthSplitLayout, authSplitInputClass, authSplitPrimaryBtnClass } from '@/components/auth/AuthSplitLayout';
import { loginReturnFromLocation } from '@/lib/auth-return';
import { authErrorMessage, channelNotice, sendOtp, verifyOtp } from '@/services/otp';
/** Mobile OTP login. The 6-digit code is generated and stored only on the backend. */
export function OtpVerification() {
    const acc = useAccount();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    async function handleSendOtp(e) {
        e.preventDefault();
        if (busy)
            return;
        if (!validMobile(mobile.trim())) {
            setError('Enter a valid 10-digit mobile number.');
            return;
        }
        setBusy(true);
        setError('');
        setMessage('');
        try {
            const result = await sendOtp({ mobile: mobile.trim(), purpose: 'login' });
            setMessage(channelNotice(result.channel, result.delivered, result.devCode));
            setStep(2);
        }
        catch (err) {
            setError(authErrorMessage(err));
        }
        finally {
            setBusy(false);
        }
    }
    async function handleVerifyOtp(e) {
        e.preventDefault();
        if (busy)
            return;
        if (!/^\d{6}$/.test(otp.trim())) {
            setError('Enter the 6-digit OTP.');
            return;
        }
        setBusy(true);
        setError('');
        try {
            const result = await verifyOtp({ mobile: mobile.trim(), otp: otp.trim(), purpose: 'login' });
            if (!acc.finishOtpLogin(result)) {
                setError('Could not verify OTP. Please try again.');
                return;
            }
            loginReturnFromLocation(location);
        }
        catch (err) {
            setError(authErrorMessage(err));
        }
        finally {
            setBusy(false);
        }
    }
    return (_jsxs(AuthSplitLayout, { title: "Secure OTP Verification", subtitle: step === 1 ? 'Enter your 10-digit mobile number.' : 'Enter the 6-digit code sent to your mobile.', footer: _jsxs("p", { className: "text-center text-[14px] text-[#6b7280]", children: ["New to HealthIDCard?", ' ', _jsx("button", { type: "button", className: "font-semibold text-[#5e5df0] hover:underline", onClick: () => navigate('/login'), children: "Create an account" })] }), children: [message ? (_jsx("div", { className: "rounded-xl bg-emerald-50 px-3 py-2.5 text-[13px] font-medium text-emerald-800", children: message })) : null, step === 1 ? (_jsxs("form", { onSubmit: handleSendOtp, className: "space-y-4", children: [_jsxs("label", { className: "block", children: [_jsx("span", { className: "sr-only", children: "Mobile number" }), _jsx("input", { type: "tel", inputMode: "numeric", maxLength: 10, placeholder: "Enter mobile number", value: mobile, onChange: (e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10)), required: true, className: authSplitInputClass })] }), error ? _jsx("p", { className: "text-[13px] font-semibold text-[#dc2626]", children: error }) : null, _jsx("button", { className: authSplitPrimaryBtnClass, type: "submit", disabled: busy, children: busy ? 'Please wait…' : 'Send OTP' })] })) : (_jsxs("form", { onSubmit: handleVerifyOtp, className: "space-y-4", children: [_jsxs("p", { className: "text-[13px] text-[#6b7280]", children: ["Sent to: ", _jsx("strong", { className: "text-[#111827]", children: mobile })] }), _jsxs("label", { className: "block", children: [_jsx("span", { className: "sr-only", children: "OTP" }), _jsx("input", { type: "text", inputMode: "numeric", maxLength: 6, placeholder: "Enter 6-digit OTP", value: otp, onChange: (e) => setOtp(e.target.value.replace(/\D/g, '')), required: true, className: `${authSplitInputClass} tracking-[0.4em] text-center` })] }), error ? _jsx("p", { className: "text-[13px] font-semibold text-[#dc2626]", children: error }) : null, _jsx("button", { className: authSplitPrimaryBtnClass, type: "submit", disabled: busy, children: busy ? 'Please wait…' : 'Verify OTP' }), _jsx("button", { type: "button", className: "w-full text-[13px] font-semibold text-[#6b7280] hover:text-[#5e5df0]", onClick: () => {
                            setStep(1);
                            setOtp('');
                            setError('');
                            setMessage('');
                        }, children: "Back" })] }))] }));
}
