import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HealthVerticalPanel } from '@/components/landing/HealthVerticalPanel';
export function LandingLabVerticalSection() {
    return (_jsxs("section", { id: "lab-vertical", className: "mx-auto max-w-7xl overflow-hidden px-6 py-10", "aria-labelledby": "lab-vertical-heading", children: [_jsxs("div", { className: "mb-6", children: [_jsx("p", { className: "text-[11.5px] font-semibold uppercase tracking-[0.1em] text-brand-600", children: "Lab tests by concern" }), _jsx("h2", { className: "mt-2 font-display text-[26px] font-extrabold leading-snug text-ink", children: "Find the right test, faster" }), _jsx("p", { className: "mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-muted", children: "Pick a health need on the left \u2014 lab tests on the right update instantly." })] }), _jsx(HealthVerticalPanel, {})] }));
}
