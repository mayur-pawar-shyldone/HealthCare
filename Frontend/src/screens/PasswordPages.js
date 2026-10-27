import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { AuthFrame } from './LoginPage';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api, { unwrap } from '@/services/api';
import { Link } from 'react-router-dom';
export function ForgotPasswordPage() {
    const [identifier, setIdentifier] = useState('');
    const [message, setMessage] = useState('');
    const [token, setToken] = useState('');
    async function submit() {
        const res = unwrap((await api.post('/auth/forgot-password', { identifier })).data);
        setMessage(res.message);
        setToken(res.resetToken ?? '');
    }
    return (_jsx(AuthFrame, { title: "Forgot password", subtitle: "We will issue a reset token for your account.", children: _jsxs("div", { className: "space-y-4", children: [_jsx(Input, { label: "Email or mobile", value: identifier, onChange: (e) => setIdentifier(e.target.value) }), _jsx(Button, { className: "w-full", onClick: submit, children: "Send reset link" }), message ? _jsx("p", { className: "text-sm text-success", children: message }) : null, token ? (_jsxs("p", { className: "break-all rounded-2xl bg-teal-light p-3 text-xs", children: ["Dev reset token: ", token, ". Use it on the ", _jsx(Link, { className: "text-teal", to: "/reset-password", children: "reset page" }), "."] })) : null] }) }));
}
export function ResetPasswordPage() {
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    async function submit() {
        setError('');
        try {
            const res = unwrap((await api.post('/auth/reset-password', { token, password })).data);
            setMessage(res.message);
        }
        catch (e) {
            const err = e;
            setError(err.response?.data?.message ?? 'Reset failed');
        }
    }
    return (_jsx(AuthFrame, { title: "Reset password", subtitle: "Paste your token and choose a new password.", children: _jsxs("div", { className: "space-y-4", children: [_jsx(Input, { label: "Token", value: token, onChange: (e) => setToken(e.target.value) }), _jsx(Input, { label: "New password", type: "password", value: password, onChange: (e) => setPassword(e.target.value) }), error ? _jsx("p", { className: "text-sm text-danger", children: error }) : null, message ? _jsx("p", { className: "text-sm text-success", children: message }) : null, _jsx(Button, { className: "w-full", onClick: submit, children: "Update password" }), _jsx(Link, { to: "/login", className: "block text-center text-sm text-teal", children: "Back to login" })] }) }));
}
