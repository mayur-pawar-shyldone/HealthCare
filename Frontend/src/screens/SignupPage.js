import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthFrame } from './LoginPage';
import { Input } from '@/components/ui/Input';
import api from '@/services/api';
import { useEffect, useState } from 'react';
const schema = z
    .object({
    fullName: z.string().min(2),
    email: z.string().email(),
    mobile: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit mobile'),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, '8+ chars with upper, lower, number'),
    confirmPassword: z.string(),
    dateOfBirth: z.string().min(1),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),
    referralCode: z.string().optional(),
})
    .refine((v) => v.password === v.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });
export function SignupPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState('');
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            fullName: '',
            email: '',
            mobile: '',
            password: '',
            confirmPassword: '',
            dateOfBirth: '',
            gender: 'PREFER_NOT_TO_SAY',
            referralCode: '',
        },
    });
    useEffect(() => {
        const state = location.state;
        if (!state)
            return;
        if (state.fullName)
            form.setValue('fullName', state.fullName);
        if (state.mobile)
            form.setValue('mobile', state.mobile);
        if (state.email)
            form.setValue('email', state.email);
        if (state.dateOfBirth)
            form.setValue('dateOfBirth', state.dateOfBirth);
        if (state.gender)
            form.setValue('gender', state.gender);
    }, [location.state]);
    async function onSubmit(values) {
        setError('');
        try {
            await api.post('/auth/signup', values);
            localStorage.removeItem('hc_user');
            localStorage.removeItem('hc_access');
            localStorage.removeItem('hc_refresh');
            navigate('/login/password', { replace: true, state: { registered: true, email: values.email } });
        }
        catch (e) {
            const err = e;
            setError(err.response?.data?.message ?? 'Unable to create account');
        }
    }
    return (_jsxs(AuthFrame, { title: "Create your account", subtitle: "After signup you will be asked to log in before entering HealthID Card.", children: [_jsxs("form", { className: "space-y-3", onSubmit: form.handleSubmit(onSubmit), children: [_jsx(Input, { label: "Full name", ...form.register('fullName'), error: form.formState.errors.fullName?.message }), _jsx(Input, { label: "Email", type: "email", ...form.register('email'), error: form.formState.errors.email?.message }), _jsx(Input, { label: "Mobile", ...form.register('mobile'), error: form.formState.errors.mobile?.message }), _jsx(Input, { label: "Date of birth", type: "date", ...form.register('dateOfBirth'), error: form.formState.errors.dateOfBirth?.message }), _jsxs("label", { className: "block space-y-1.5", children: [_jsx("span", { className: "text-sm font-medium text-ink-soft", children: "Gender" }), _jsxs("select", { className: "w-full rounded-2xl border border-line bg-white px-4 py-3", ...form.register('gender'), children: [_jsx("option", { value: "MALE", children: "Male" }), _jsx("option", { value: "FEMALE", children: "Female" }), _jsx("option", { value: "OTHER", children: "Other" }), _jsx("option", { value: "PREFER_NOT_TO_SAY", children: "Prefer not to say" })] })] }), _jsx(Input, { label: "Password", type: "password", ...form.register('password'), error: form.formState.errors.password?.message }), _jsx(Input, { label: "Confirm password", type: "password", ...form.register('confirmPassword'), error: form.formState.errors.confirmPassword?.message }), _jsx(Input, { label: "Referral code (optional)", placeholder: "Friend's HealthID code", ...form.register('referralCode') }), error ? _jsx("p", { className: "text-sm text-danger", children: error }) : null, _jsx("button", { className: "hid-btn hid-btn-primary hid-btn-block", type: "submit", children: "Create account" })] }), _jsxs("p", { className: "mt-4 text-sm text-ink-soft", children: ["Already have an account? ", _jsx(Link, { to: "/login", className: "text-teal", children: "Log in" })] })] }));
}
