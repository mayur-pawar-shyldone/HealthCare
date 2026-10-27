import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Activity, FlaskConical, HeartPulse, Microscope, Pill, Stethoscope, } from 'lucide-react';
import { cn } from '@/lib/utils';
const CATEGORY_STYLES = [
    { bg: 'from-teal-light to-white', icon: 'bg-teal text-white', iconComp: FlaskConical },
    { bg: 'from-red-50 to-white', icon: 'bg-[#e03a28] text-white', iconComp: HeartPulse },
    { bg: 'from-indigo-50 to-white', icon: 'bg-indigo-500 text-white', iconComp: Microscope },
    { bg: 'from-emerald-50 to-white', icon: 'bg-emerald-500 text-white', iconComp: Activity },
    { bg: 'from-amber-50 to-white', icon: 'bg-amber-500 text-white', iconComp: Pill },
    { bg: 'from-sky-50 to-white', icon: 'bg-sky-500 text-white', iconComp: Stethoscope },
];
export function TestsCategoryGrid({ categories, activeSlug, onSelect }) {
    if (!categories.length)
        return null;
    return (_jsxs("section", { "aria-label": "Browse by category", children: [_jsxs("div", { className: "mb-4", children: [_jsx("h2", { className: "font-display text-xl text-ink md:text-2xl", children: "Browse by category" }), _jsx("p", { className: "mt-1 text-sm text-ink-soft", children: "Tap a category to filter the catalog" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6", children: [_jsxs("button", { type: "button", onClick: () => onSelect(''), className: cn('flex flex-col rounded-2xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md', !activeSlug
                            ? 'border-teal/40 bg-gradient-to-br from-teal-light to-white ring-2 ring-teal/20'
                            : 'border-line/60 bg-gradient-to-br from-slate-50 to-white hover:border-teal/30'), children: [_jsx("span", { className: "mb-3 grid h-10 w-10 place-items-center rounded-xl bg-slate-600 text-white shadow-sm", children: _jsx(FlaskConical, { className: "h-5 w-5" }) }), _jsx("span", { className: "text-sm font-semibold text-ink", children: "All tests" }), _jsx("span", { className: "mt-1 text-[11px] text-ink-soft", children: "Full catalog" })] }), categories.map((c, i) => {
                        const style = CATEGORY_STYLES[i % CATEGORY_STYLES.length];
                        const Icon = style.iconComp;
                        const active = activeSlug === c.slug;
                        return (_jsxs("button", { type: "button", onClick: () => onSelect(c.slug), className: cn('group flex flex-col rounded-2xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md', active
                                ? 'border-teal/40 ring-2 ring-teal/20'
                                : 'border-line/60 hover:border-teal/30', `bg-gradient-to-br ${style.bg}`), children: [_jsx("span", { className: cn('mb-3 grid h-10 w-10 place-items-center rounded-xl shadow-sm transition group-hover:scale-105', style.icon), children: _jsx(Icon, { className: "h-5 w-5" }) }), _jsx("span", { className: "text-sm font-semibold leading-snug text-ink", children: c.name }), c.description ? (_jsx("span", { className: "mt-1 line-clamp-2 text-[11px] text-ink-soft", children: c.description })) : null] }, c.id));
                    })] })] }));
}
