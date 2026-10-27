import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { LandingPage } from '@/screens/LandingPage';
import { cn } from '@/lib/utils';
const LEFT_HEADLINE = 'Simplify health care for your whole family';
const LEFT_SUB = 'Member pricing, free home collection, and reports for your whole family — in one simple dashboard.';
export function AuthSplitLayout({ title, subtitle, children, footer, className, onClose }) {
    const navigate = useNavigate();
    function closeLogin() {
        if (onClose) {
            onClose();
            return;
        }
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }
        navigate('/');
    }
    return (_jsxs("div", { className: cn('relative min-h-dvh overflow-x-hidden', className), children: [_jsxs("div", { className: "fixed inset-0 z-0 overflow-hidden", "aria-hidden": true, children: [_jsx("div", { className: "absolute inset-0 origin-top scale-[1.03] opacity-[0.38] saturate-[0.85] blur-[1px]", children: _jsx(LandingPage, { backdrop: true }) }), _jsx("div", { className: "absolute inset-0 bg-white/78 backdrop-blur-[4px]" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-white/40 via-white/55 to-white/70" })] }), _jsx("div", { className: "relative z-10 flex min-h-dvh items-center justify-center overflow-y-auto px-4 py-8 sm:px-6", children: _jsx("div", { className: "w-full max-w-[940px]", children: _jsxs("div", { className: "relative overflow-hidden rounded-[28px] bg-white shadow-[0_24px_64px_-28px_rgba(30,27,75,0.35)] md:grid md:min-h-[580px] md:grid-cols-2", children: [_jsx("button", { type: "button", onClick: closeLogin, className: "absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-[#e5e7eb] bg-white text-[#6b7280] shadow-sm transition hover:bg-[#f3f4f6] hover:text-[#111827]", "aria-label": "Close login", children: _jsx(X, { className: "h-4 w-4", "aria-hidden": true }) }), _jsxs("aside", { className: "relative flex flex-col justify-between bg-[#5e5df0] px-8 py-10 text-white sm:px-10 sm:py-12", children: [_jsxs("div", { children: [_jsx("h1", { className: "font-display text-[clamp(1.65rem,3.2vw,2.15rem)] font-extrabold leading-tight tracking-tight", children: LEFT_HEADLINE }), _jsx("p", { className: "mt-4 max-w-md text-[15px] leading-relaxed text-white/85", children: LEFT_SUB })] }), _jsx("div", { className: "mt-8 flex justify-center md:mt-6 md:justify-start", children: _jsx("img", { src: "/landing/yk.webp", alt: "", className: "h-auto w-full max-w-[280px] rounded-2xl object-cover shadow-lg ring-4 ring-white/15 sm:max-w-[320px]" }) })] }), _jsx("div", { className: "flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 md:px-12", children: _jsxs("div", { className: "mx-auto w-full max-w-[360px]", children: [_jsxs("div", { className: "mb-8 flex flex-col items-center gap-5 text-center", children: [_jsx(Link, { to: "/", className: "inline-flex", "aria-label": "Go to home", children: _jsx(Logo, { variant: "compact", className: "h-[52px] w-auto max-w-[240px] sm:h-[60px] sm:max-w-[280px]" }) }), _jsxs("div", { children: [_jsx("h2", { className: "font-display text-[1.75rem] font-extrabold tracking-tight text-[#111827]", children: title }), _jsx("p", { className: "mt-1.5 text-[15px] text-[#6b7280]", children: subtitle })] })] }), _jsx("div", { className: "auth-split-form", children: children }), _jsx("div", { id: "recaptcha-container", className: "mt-3 flex justify-center" }), footer ? _jsx("div", { className: "mt-6", children: footer }) : null] }) })] }) }) })] }));
}
/** Shared field styling for auth split forms (OTP + legacy password login). */
export const authSplitInputClass = 'h-12 w-full rounded-xl border-0 bg-[#f3f4f6] px-4 text-[15px] font-medium text-[#111827] outline-none placeholder:text-[#9ca3af] focus:ring-2 focus:ring-[#5e5df0]/35';
export const authSplitPrimaryBtnClass = 'mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-[#5e5df0] text-[15px] font-bold text-white transition hover:bg-[#4f4ed8] disabled:opacity-60';
