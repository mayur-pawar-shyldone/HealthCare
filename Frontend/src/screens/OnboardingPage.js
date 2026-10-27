import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/brand/Logo';
const slides = [
    { title: 'Book lab tests at home', body: 'Choose a test, pick a time, and a phlebotomist visits your doorstep.' },
    { title: 'Get your free HealthID Card', body: '1-year family membership with flat 30% off every test and package.' },
    { title: 'Reports on WhatsApp', body: 'Digital reports in your account, plus reminders and updates on WhatsApp.' },
];
export function OnboardingPage() {
    const [i, setI] = useState(0);
    const navigate = useNavigate();
    const last = i === slides.length - 1;
    function finish() {
        localStorage.setItem('hc_onboarded', '1');
        navigate('/');
    }
    return (_jsxs("div", { className: "flex h-screen w-screen flex-col justify-between bg-cream px-8 py-10 lg:px-24", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Logo, { variant: "compact", className: "max-w-[200px]" }), _jsx("button", { className: "text-sm text-ink-soft", onClick: finish, children: "Skip" })] }), _jsxs("div", { children: [_jsx("div", { className: "mb-8 h-64 w-full rounded-[32px] bg-gradient-to-br from-teal to-brand-red" }), _jsx("h1", { className: "font-display text-4xl", children: slides[i].title }), _jsx("p", { className: "mt-4 text-ink-soft", children: slides[i].body })] }), _jsxs("div", { children: [_jsx("div", { className: "mb-6 flex gap-2", children: slides.map((_, idx) => (_jsx("span", { className: `h-1.5 flex-1 rounded-full ${idx <= i ? 'bg-brand-red' : 'bg-line'}` }, idx))) }), _jsx(Button, { className: "w-full", size: "lg", onClick: () => (last ? finish() : setI(i + 1)), children: last ? 'Get Started' : 'Next' })] })] }));
}
