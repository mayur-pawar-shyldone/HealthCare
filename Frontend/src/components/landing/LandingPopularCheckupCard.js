import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Activity, ArrowRight, Clock, FileText, Heart, TestTube2, Users, X, } from 'lucide-react';
import { Link } from 'react-router-dom';
import { bookStartUrl } from '@/booking/booking-url';
import { CHECKUP_TONE_CLASSES, CHECKUP_VISIBLE_TAGS, } from '@/data/landing-checkup-tabs';
function formatInr(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}
function packageTestIcon(name) {
    const n = name.toLowerCase();
    if (n.includes('diabetic') || n.includes('diabetes') || n.includes('glucose'))
        return TestTube2;
    if (n.includes('thyroid'))
        return Activity;
    if (n.includes('heart') || n.includes('cardiac') || n.includes('lipid'))
        return Heart;
    if (n.includes('vitamin') || n.includes('nutrition'))
        return Activity;
    if (n.includes('allergy'))
        return Activity;
    return TestTube2;
}
const META_ICONS = [Clock, Users, FileText];
/** HealthID `rk` — Popular packages card */
export function LandingPopularCheckupCard({ pkg, tone }) {
    const [expandedTags, setExpandedTags] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const TestIcon = useMemo(() => packageTestIcon(pkg.name), [pkg.name]);
    const extraCount = Math.max(0, pkg.includes.length - CHECKUP_VISIBLE_TAGS);
    const visibleTags = expandedTags ? pkg.includes : pkg.includes.slice(0, CHECKUP_VISIBLE_TAGS);
    const metaLines = [pkg.fasting, pkg.recommendedFor, pkg.reportTime];
    return (_jsxs(_Fragment, { children: [_jsxs("article", { className: "group flex h-full flex-col rounded-[24px] border border-ink/10 bg-white p-2.5 transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift", children: [_jsxs("div", { className: `flex flex-1 flex-col rounded-[17px] p-5 ${CHECKUP_TONE_CLASSES[tone]}`, children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("span", { className: "rounded-full bg-white px-3 py-1.5 text-[11.5px] font-bold text-ink", children: [pkg.testCount, "+ Tests"] }), _jsx("span", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm", children: _jsx(TestIcon, { className: "h-6 w-6", "aria-hidden": true }) })] }), _jsx("h3", { className: "mt-4 font-display text-[20px] font-extrabold leading-snug text-ink", children: pkg.name }), _jsx("p", { className: "mt-4 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-soft", children: "Tests included" }), _jsxs("ul", { className: "mt-2.5 flex flex-wrap gap-1.5", children: [visibleTags.map((test) => (_jsx("li", { className: "rounded-full border border-ink/15 px-2.5 py-1 text-[11.5px] font-medium leading-snug text-ink-soft", children: test }, test))), extraCount > 0 ? (_jsx("li", { children: _jsx("button", { type: "button", onClick: () => setExpandedTags((v) => !v), "aria-expanded": expandedTags, className: "rounded-full border border-ink/15 px-2.5 py-1 text-[11.5px] font-semibold text-ink-soft transition-colors duration-150 ease-out hover:border-ink/40 hover:text-ink", children: expandedTags ? 'Show less' : `+${extraCount} more` }) })) : null] })] }), _jsxs("div", { className: "flex flex-col px-3 pb-1 pt-5", children: [_jsx("ul", { className: "space-y-2", children: metaLines.map((line, d) => {
                                    const Icon = META_ICONS[d] ?? Clock;
                                    return (_jsxs("li", { className: "flex items-start gap-2.5 text-[12.5px] text-ink-soft", children: [_jsx(Icon, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted", "aria-hidden": true }), line] }, line));
                                }) }), _jsx("div", { className: "mt-auto pt-5", children: _jsxs("div", { className: "flex flex-col gap-2 border-t border-ink/10 pt-4", children: [_jsxs("div", { className: "flex items-end justify-between gap-3", children: [_jsxs("p", { children: [_jsx("span", { className: "block font-display text-[26px] font-extrabold leading-none text-ink", children: formatInr(pkg.price) }), _jsxs("span", { className: "mt-1.5 block text-[12px] text-ink-muted", children: ["per person \u00B7 ", _jsx("span", { className: "line-through", children: formatInr(pkg.mrp) })] })] }), _jsxs(Link, { to: bookStartUrl({
                                                        id: pkg.id,
                                                        name: pkg.name,
                                                        memberPrice: pkg.price,
                                                        mrp: pkg.mrp,
                                                        testCount: pkg.testCount,
                                                    }), className: "inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-semibold text-white transition-[transform,background-color] duration-150 ease-out hover:bg-brand-600 active:scale-[0.98]", children: ["Book now", _jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": true })] })] }), _jsx("button", { type: "button", onClick: () => setModalOpen(true), className: "w-full rounded-full border border-ink/15 bg-white py-2 text-[13px] font-semibold text-ink-soft transition-colors duration-150 ease-out hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600", children: "Know more \u2014 view all tests" })] }) })] })] }), modalOpen ? (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm", onClick: () => setModalOpen(false), role: "presentation", children: _jsxs("div", { className: "relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[24px] bg-white p-6 shadow-2xl", onClick: (e) => e.stopPropagation(), role: "dialog", "aria-modal": "true", "aria-labelledby": `checkup-modal-${pkg.id}`, children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600", children: _jsx(TestIcon, { className: "h-6 w-6", "aria-hidden": true }) }), _jsxs("div", { children: [_jsx("h3", { id: `checkup-modal-${pkg.id}`, className: "font-display text-lg font-bold text-ink", children: pkg.name }), _jsxs("p", { className: "text-sm text-ink-muted", children: [pkg.testCount, " tests included"] })] })] }), _jsx("button", { type: "button", onClick: () => setModalOpen(false), className: "flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-700", "aria-label": "Close", children: _jsx(X, { className: "h-5 w-5", "aria-hidden": true }) })] }), _jsx("div", { className: "mt-6 rounded-xl bg-mint p-4", children: _jsx("ul", { className: "space-y-2", children: pkg.includes.map((item) => (_jsxs("li", { className: "flex gap-2.5 text-sm text-ink", children: [_jsx("span", { className: "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400", "aria-hidden": true }), item] }, item))) }) }), _jsx("ul", { className: "mt-6 space-y-3 rounded-xl border border-ink/10 p-4", children: metaLines.map((line, d) => {
                                const Icon = META_ICONS[d] ?? Clock;
                                return (_jsxs("li", { className: "flex items-start gap-2.5 text-sm text-ink-soft", children: [_jsx(Icon, { className: "mt-0.5 h-4 w-4 shrink-0 text-brand-500", "aria-hidden": true }), line] }, line));
                            }) }), _jsxs("div", { className: "mt-6 flex items-center justify-between rounded-xl bg-zinc-50 p-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-ink-muted", children: "Price per person" }), _jsxs("p", { className: "flex items-baseline gap-2", children: [_jsx("span", { className: "font-display text-2xl font-extrabold text-ink", children: formatInr(pkg.price) }), _jsx("span", { className: "text-sm text-ink-muted line-through", children: formatInr(pkg.mrp) })] })] }), _jsx("button", { type: "button", onClick: () => setModalOpen(false), className: "rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600", children: "Got it" })] }), _jsx(Link, { to: bookStartUrl({
                                id: pkg.id,
                                name: pkg.name,
                                memberPrice: pkg.price,
                                mrp: pkg.mrp,
                                testCount: pkg.testCount,
                            }), onClick: () => setModalOpen(false), className: "mt-4 block w-full rounded-full bg-ink py-3 text-center text-sm font-semibold text-white hover:bg-brand-600", children: "Book now" })] }) })) : null] }));
}
