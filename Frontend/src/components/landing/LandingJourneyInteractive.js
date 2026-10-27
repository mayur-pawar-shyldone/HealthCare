import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ArrowRight, Barcode, MessageCircle, Smartphone, UserCheck } from 'lucide-react';
import { JOURNEY_STEP_TAGS, JOURNEY_STEPS } from '@/data/landing-healthid-content';
const ICONS = {
    smartphone: Smartphone,
    userCheck: UserCheck,
    barcode: Barcode,
    message: MessageCircle,
};
function stepIconClasses(on, done) {
    if (on) {
        return 'scale-105 bg-brand-500 text-white shadow-[0_10px_26px_-10px_rgba(29,108,140,0.85)]';
    }
    if (done) {
        return 'bg-brand-200 text-brand-700';
    }
    return 'border border-brand-200/80 bg-brand-100 text-brand-700 group-hover:bg-brand-200/60';
}
function stepBadgeClasses(on) {
    return on ? 'bg-coral text-white' : 'bg-ink text-white';
}
function stepTagClasses(on) {
    return on ? 'bg-coral-soft text-coral-dark' : 'bg-mint text-ink-muted';
}
/** HealthID `jk` */
export function LandingJourneyInteractive() {
    const [active, setActive] = useState(0);
    const progress = (active / (JOURNEY_STEPS.length - 1)) * 100;
    return (_jsx("section", { id: "journey", className: "bg-white py-20", "aria-labelledby": "journey-heading", children: _jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [_jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [_jsx("span", { className: "text-[12px] font-semibold uppercase tracking-[0.1em] text-brand-600", children: "How it works" }), _jsx("h2", { id: "journey-heading", className: "mt-3 font-display text-[32px] font-extrabold leading-tight tracking-tight text-ink sm:text-[38px]", children: "Your health checkup, in four steps" }), _jsx("p", { className: "mt-3 text-[16px] leading-relaxed text-ink-soft", children: "From booking to report, here is exactly what happens and who handles your sample. Tap a step to see where you are in the journey." })] }), _jsxs("ol", { className: "relative mt-16 hidden gap-6 lg:grid lg:grid-cols-4", children: [_jsx("span", { className: "absolute left-0 right-0 top-[34px] h-0.5 rounded-full bg-ink/10", "aria-hidden": true }), _jsx("span", { "aria-hidden": true, className: "absolute left-0 top-[34px] h-0.5 rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-coral transition-[width] duration-500 ease-out", style: { width: `${progress}%` } }), JOURNEY_STEPS.map((step, i) => {
                            const Icon = ICONS[step.icon];
                            const on = i === active;
                            const done = i < active;
                            return (_jsx("li", { className: "relative", children: _jsxs("button", { type: "button", onClick: () => setActive(i), "aria-current": on ? 'step' : undefined, className: "group flex w-full flex-col items-start text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2", children: [_jsxs("span", { className: `relative z-10 flex h-[68px] w-[68px] items-center justify-center rounded-full ring-8 ring-white transition-[background-color,color,box-shadow,transform,border-color] duration-300 ease-out ${stepIconClasses(on, done)}`, children: [_jsx(Icon, { className: "h-7 w-7", strokeWidth: on ? 2 : 1.75, "aria-hidden": true }), _jsx("span", { className: `absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full text-[11.5px] font-bold transition-colors duration-300 ${stepBadgeClasses(on)}`, children: i + 1 })] }), _jsx("span", { className: `mt-6 inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-bold transition-colors duration-300 ${stepTagClasses(on)}`, children: JOURNEY_STEP_TAGS[i] }), _jsx("h3", { className: "mt-3 font-display text-[17px] font-bold leading-snug text-ink", children: step.title }), _jsx("p", { className: "mt-2 max-w-[270px] text-[14px] leading-relaxed text-ink-soft", children: step.description })] }) }, step.id));
                        })] }), _jsx("ol", { className: "relative mt-12 space-y-8 lg:hidden", children: JOURNEY_STEPS.map((step, i) => {
                        const Icon = ICONS[step.icon];
                        const on = i === active;
                        const done = i < active;
                        return (_jsxs("li", { className: "relative", children: [i < JOURNEY_STEPS.length - 1 ? (_jsx("span", { className: "absolute left-[33px] top-[76px] h-[calc(100%-3.5rem)] w-0.5 rounded-full bg-ink/10", "aria-hidden": true })) : null, _jsxs("button", { type: "button", onClick: () => setActive(i), "aria-current": on ? 'step' : undefined, className: "flex w-full items-start gap-5 text-left", children: [_jsxs("span", { className: `relative z-10 flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full ring-8 ring-white transition-colors duration-300 ${stepIconClasses(on, done)}`, children: [_jsx(Icon, { className: "h-7 w-7", strokeWidth: on ? 2 : 1.75, "aria-hidden": true }), _jsx("span", { className: `absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full text-[11.5px] font-bold ${stepBadgeClasses(on)}`, children: i + 1 })] }), _jsxs("span", { className: "pt-2", children: [_jsx("span", { className: `inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-bold ${stepTagClasses(on)}`, children: JOURNEY_STEP_TAGS[i] }), _jsx("span", { className: "mt-2 block font-display text-[18px] font-bold leading-snug text-ink", children: step.title }), _jsx("span", { className: "mt-1.5 block max-w-md text-[14.5px] leading-relaxed text-ink-soft", children: step.description })] })] })] }, step.id));
                    }) }), _jsxs("div", { className: "mt-14 flex flex-col items-center justify-between gap-5 rounded-[26px] bg-mint px-8 py-7 sm:flex-row sm:items-center", children: [_jsxs("div", { className: "text-center sm:text-left", children: [_jsx("p", { className: "font-display text-[20px] font-extrabold text-ink", children: "Two minutes to book. Report within 6 hours." }), _jsx("p", { className: "mt-1 text-[14.5px] text-ink-soft", children: "Free home collection and a free doctor call on every package." })] }), _jsxs("a", { href: "#packages", className: "inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-coral px-7 text-[15px] font-bold text-white transition-[transform,background-color] duration-150 ease-out hover:bg-coral-dark active:scale-[0.98]", children: ["Book a test", _jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": true })] })] })] }) }));
}
