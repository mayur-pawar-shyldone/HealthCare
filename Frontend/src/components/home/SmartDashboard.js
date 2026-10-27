import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { Activity, ChevronRight, FlaskConical, HeartPulse, Microscope, Pill, Stethoscope, } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OfferCard } from './OfferCard';
const CATEGORY_STYLES = [
    { bg: 'from-teal-light to-white', icon: 'bg-teal text-white', iconComp: FlaskConical },
    { bg: 'from-red-50 to-white', icon: 'bg-[#e03a28] text-white', iconComp: HeartPulse },
    { bg: 'from-indigo-50 to-white', icon: 'bg-indigo-500 text-white', iconComp: Microscope },
    { bg: 'from-emerald-50 to-white', icon: 'bg-emerald-500 text-white', iconComp: Activity },
    { bg: 'from-amber-50 to-white', icon: 'bg-amber-500 text-white', iconComp: Pill },
    { bg: 'from-sky-50 to-white', icon: 'bg-sky-500 text-white', iconComp: Stethoscope },
];
export function HomeExplore({ categories, popular }) {
    return (_jsxs("div", { className: "space-y-10", children: [categories.length > 0 ? (_jsxs("section", { children: [_jsxs("div", { className: "mb-5 flex items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-display text-xl text-ink md:text-2xl", children: "Browse by category" }), _jsx("p", { className: "mt-1 text-sm text-ink-soft", children: "Find the right test for your health needs" })] }), _jsxs(Link, { to: "/tests", className: "flex items-center gap-0.5 text-sm font-semibold text-teal hover:underline", children: ["All tests ", _jsx(ChevronRight, { className: "h-4 w-4" })] })] }), _jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6", children: categories.slice(0, 6).map((c, i) => {
                            const style = CATEGORY_STYLES[i % CATEGORY_STYLES.length];
                            const Icon = style.iconComp;
                            return (_jsxs(Link, { to: `/tests?category=${c.slug}`, className: cn('group flex flex-col rounded-2xl border border-line/60 bg-gradient-to-br p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-teal/30 hover:shadow-md', style.bg), children: [_jsx("span", { className: cn('mb-3 grid h-10 w-10 place-items-center rounded-xl shadow-sm transition group-hover:scale-105', style.icon), children: _jsx(Icon, { className: "h-5 w-5" }) }), _jsx("span", { className: "text-sm font-semibold leading-snug text-ink", children: c.name }), c.description ? (_jsx("span", { className: "mt-1 line-clamp-2 text-[11px] text-ink-soft", children: c.description })) : null] }, c.id));
                        }) })] })) : null, popular.length > 0 ? (_jsxs("section", { children: [_jsxs("div", { className: "mb-5 flex items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-display text-xl text-ink md:text-2xl", children: "Popular tests" }), _jsx("p", { className: "mt-1 text-sm text-ink-soft", children: "Extra 30% off at payment \u00B7 Free home collection \u00B7 Fast reports" })] }), _jsxs(Link, { to: "/tests?popular=true", className: "flex items-center gap-0.5 text-sm font-semibold text-teal hover:underline", children: ["See all ", _jsx(ChevronRight, { className: "h-4 w-4" })] })] }), _jsx("div", { className: "-mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 scroll-smooth [scrollbar-width:thin]", children: popular.filter((t) => !t.isPackage).slice(0, 8).map((t, i) => (_jsx("div", { className: "snap-start", children: _jsx(OfferCard, { test: t, badge: "Popular", accentIndex: i }) }, t.id))) })] })) : null] }));
}
/** @deprecated use HomeExplore — kept for import compatibility */
export const SmartDashboard = HomeExplore;
export function SmartSearchBar() {
    return null;
}
export function PopularTestRow({ test }) {
    return (_jsx(Link, { to: `/appointments/book?testId=${test.id}`, className: "flex items-center justify-between gap-3 rounded-2xl border border-line/60 bg-white px-4 py-3 transition hover:border-teal/30", children: _jsx("span", { className: "truncate text-sm font-medium text-ink", children: test.name }) }));
}
