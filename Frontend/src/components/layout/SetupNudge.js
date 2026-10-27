import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
export function SetupNudge({ hasMembership, hasAddress }) {
    const [dismissed, setDismissed] = useState(false);
    if (dismissed || (hasMembership && hasAddress))
        return null;
    const steps = [
        !hasMembership && {
            title: 'Get your free HealthID Card',
            body: 'Unlock special rates on 63+ tests',
            cta: 'Activate',
            to: '/home#healthid-card-section',
        },
        !hasAddress && {
            title: 'Add home collection address',
            body: 'Required for phlebotomist visit',
            cta: 'Add address',
            to: '/profile',
        },
    ].filter(Boolean);
    const progress = ((hasMembership ? 1 : 0) + (hasAddress ? 1 : 0)) / 2 * 100;
    return (_jsxs("div", { className: "glass-panel relative rounded-3xl p-5 md:p-6", children: [_jsx("button", { type: "button", "aria-label": "Dismiss", onClick: () => setDismissed(true), className: "absolute right-4 top-4 rounded-xl p-1.5 text-ink-soft transition hover:bg-white/80", children: _jsx(X, { className: "h-4 w-4" }) }), _jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-teal", children: "Complete setup" }), _jsx("p", { className: "mt-1 font-display text-lg", children: "Finish your profile for smooth booking" }), _jsx("div", { className: "mt-3 h-1.5 overflow-hidden rounded-full bg-line/80", children: _jsx("div", { className: "h-full rounded-full bg-teal transition-all duration-500", style: { width: `${progress}%` } }) }), _jsx("div", { className: "mt-4 grid gap-3 sm:grid-cols-2", children: steps.map((s) => (_jsxs("div", { className: "rounded-2xl border border-line/60 bg-white/60 p-4", children: [_jsx("p", { className: "font-semibold text-ink", children: s.title }), _jsx("p", { className: "mt-0.5 text-xs text-ink-soft", children: s.body }), _jsx(Link, { to: s.to, className: "mt-3 inline-block", children: _jsx(Button, { size: "sm", className: "rounded-xl", children: s.cta }) })] }, s.title))) })] }));
}
