import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import api, { unwrap } from '@/services/api';
import { setSession } from '@/store/authSlice';
import { AuthSplitLayout, authSplitInputClass, authSplitPrimaryBtnClass } from '@/components/auth/AuthSplitLayout';
const schema = z.object({
    identifier: z.string().min(3, 'Enter email or mobile'),
    password: z.string().min(1, 'Password is required'),
});
export function LoginPage() {
    const dispatch = useDispatch();
    const qc = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const registered = Boolean(location.state?.registered);
    const prefill = location.state?.email ?? '';
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: { identifier: prefill, password: '' },
    });
    async function onSubmit(values) {
        try {
            const res = unwrap((await api.post('/auth/login', values)).data);
            dispatch(setSession(res));
            await qc.invalidateQueries({ queryKey: ['tests'] });
            const from = location.state?.from;
            const next = from && from !== '/login' && from !== '/signup' ? from : '/home';
            navigate(res.user.role === 'ADMIN' || res.user.role === 'SUPER_ADMIN' ? '/admin' : next, { replace: true });
        }
        catch (e) {
            const err = e;
            if (!err.response) {
                form.setError('root', {
                    message: 'Cannot reach the server. Start the backend: cd Backend && npm run start:dev (port 5000).',
                });
                return;
            }
            form.setError('root', { message: err.response.data?.message ?? 'Unable to sign in' });
        }
    }
    const rootError = form.formState.errors.root?.message;
    const idError = form.formState.errors.identifier?.message;
    const passError = form.formState.errors.password?.message;
    return (_jsxs(AuthSplitLayout, { title: "Welcome Back", subtitle: "Please login to your account", footer: _jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center justify-between text-[13px]", children: [_jsx(Link, { to: "/forgot-password", className: "font-medium text-[#9ca3af] hover:text-[#5e5df0]", children: "Forgot password?" }), _jsx(Link, { to: "/signup", className: "font-semibold text-[#5e5df0] hover:underline", children: "Create an account" })] }), _jsx("p", { className: "mt-4 text-center text-[13px]", children: _jsx(Link, { to: "/login", className: "font-semibold text-[#5e5df0] hover:underline", children: "Log in with mobile OTP" }) }), _jsx("p", { className: "mt-2 text-center text-[12px] text-[#9ca3af]", children: "Demo: mayur@healthcart.com / Demo@1234" })] }), children: [registered ? (_jsx("div", { className: "mb-4 rounded-xl bg-emerald-50 px-3 py-2.5 text-[13px] font-medium text-emerald-800", children: "Account created. Please log in to enter HealthIDCard." })) : null, _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block", children: [_jsx("span", { className: "sr-only", children: "Email or mobile" }), _jsx("input", { className: authSplitInputClass, placeholder: "Email or mobile", ...form.register('identifier') })] }), idError ? _jsx("p", { className: "mt-1.5 text-[12px] font-semibold text-[#dc2626]", children: idError }) : null] }), _jsxs("div", { children: [_jsxs("label", { className: "relative block", children: [_jsx("span", { className: "sr-only", children: "Password" }), _jsx("input", { className: cnInputWithIcon, placeholder: "Password", type: showPassword ? 'text' : 'password', ...form.register('password') }), _jsx("button", { type: "button", className: "absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]", onClick: () => setShowPassword((v) => !v), "aria-label": showPassword ? 'Hide password' : 'Show password', children: showPassword ? _jsx(EyeOff, { className: "h-5 w-5" }) : _jsx(Eye, { className: "h-5 w-5" }) })] }), passError ? _jsx("p", { className: "mt-1.5 text-[12px] font-semibold text-[#dc2626]", children: passError }) : null] }), rootError ? _jsx("p", { className: "text-[13px] font-semibold text-[#dc2626]", children: rootError }) : null, _jsx("button", { className: authSplitPrimaryBtnClass, type: "submit", children: "Login" })] })] }));
}
const cnInputWithIcon = `${authSplitInputClass} pr-12`;
/** @deprecated Use AuthSplitLayout directly */
export function AuthFrame({ title, subtitle, children }) {
    return (_jsx(AuthSplitLayout, { title: title, subtitle: subtitle, children: children }));
}
