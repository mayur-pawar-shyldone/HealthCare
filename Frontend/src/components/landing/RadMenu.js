import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { ArrowRight, Baby, Brain, ChevronRight, FileText, FlaskConical, HeartPulse, LayoutGrid, Scan, ScanLine, Syringe, } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RADIOLOGY_GROUPS } from '@/data/landing-nav-data';
import { bookStartUrl } from '@/booking/booking-url';
import { serviceBrowsePath } from '@/data/service-browse';
import { useCatalogTests } from '@/hooks/useCatalogTests';
import { filterTestsForNav, labTestToPreview } from '@/lib/catalog';
const RAD_ICONS = {
    usg: Scan,
    obs: Baby,
    vasc: HeartPulse,
    xray: ScanLine,
    proc: FlaskConical,
    ir: Syringe,
    mri: Brain,
    ct: Scan,
    other: FileText,
};
export function RadMenu({ onNavigate }) {
    const catalog = useCatalogTests();
    const tests = catalog.data ?? [];
    const [activeId, setActiveId] = useState(RADIOLOGY_GROUPS[0].id);
    const group = RADIOLOGY_GROUPS.find((g) => g.id === activeId) ?? RADIOLOGY_GROUPS[0];
    const items = useMemo(() => tests.filter((test) => filterTestsForNav(group.id, test)).map(labTestToPreview), [tests, group.id]);
    const counts = useMemo(() => {
        const map = {};
        for (const cat of RADIOLOGY_GROUPS) {
            map[cat.id] = tests.filter((test) => filterTestsForNav(cat.id, test)).length;
        }
        return map;
    }, [tests]);
    return (_jsxs("div", { className: "grid-cols-[280px_1fr] grid gap-0 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-lift lg:grid-cols-[320px_1fr]", children: [_jsxs("div", { className: "flex flex-col border-b border-ink/10 bg-white lg:border-b-0 lg:border-r lg:bg-gradient-to-b lg:from-white lg:via-mint/[0.15] lg:to-white", children: [_jsxs("div", { className: "p-5 pb-4", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("span", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white shadow-sm", children: _jsx(LayoutGrid, { className: "h-4 w-4", "aria-hidden": true }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[11px] font-bold uppercase tracking-[0.14em] text-ink", children: "Browse imaging types" }), _jsxs("p", { className: "text-[12.5px] text-ink-muted", children: [RADIOLOGY_GROUPS.length, " categories \u00B7 tap to preview"] })] })] }), _jsxs("div", { className: "mt-3 inline-flex items-center gap-2 rounded-full bg-mint px-3 py-1.5", children: [_jsx("span", { className: "h-2 w-2 animate-pulse rounded-full bg-emerald-500", "aria-hidden": true }), _jsx("span", { className: "text-[11.5px] font-semibold text-ink-soft", children: "NABL centres \u2022 Nashik" })] })] }), _jsx("div", { className: "flex max-h-[min(520px,58vh)] flex-col gap-2 overflow-y-auto px-3 pb-3 [scrollbar-gutter:stable]", children: RADIOLOGY_GROUPS.map((cat) => {
                            const isActive = cat.id === activeId;
                            const Icon = RAD_ICONS[cat.id] ?? Scan;
                            return (_jsxs("button", { type: "button", onMouseEnter: () => setActiveId(cat.id), onFocus: () => setActiveId(cat.id), onClick: () => setActiveId(cat.id), className: `group flex w-full items-center gap-3 rounded-[16px] border p-2 pr-3 text-left transition-all duration-200 ease-out ${isActive
                                    ? 'scale-[1.01] border-ink bg-ink text-white shadow-lg shadow-ink/10'
                                    : 'border-ink/10 bg-white text-ink-soft hover:border-brand-200 hover:bg-brand-50/70 hover:text-ink hover:shadow-sm'}`, children: [_jsx("span", { className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${isActive ? 'bg-white text-ink' : 'bg-mint text-brand-600 group-hover:bg-white group-hover:text-brand-600'}`, children: _jsx(Icon, { className: "h-5 w-5", "aria-hidden": true }) }), _jsxs("span", { className: "flex-1 min-w-0", children: [_jsx("span", { className: `block text-[14px] font-semibold leading-none ${isActive ? 'text-white' : 'text-ink group-hover:text-ink'}`, children: cat.label }), _jsx("span", { className: `mt-1 block text-[12px] leading-none ${isActive ? 'text-white/70' : 'text-ink-muted'}`, children: `${counts[cat.id] ?? 0} studies` })] }), _jsx("span", { className: `flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${isActive ? 'bg-white/15 text-white' : 'bg-ink/5 text-ink-muted group-hover:bg-white group-hover:text-brand-600'}`, children: _jsx(ChevronRight, { className: `h-3.5 w-3.5 transition-transform duration-200 ${isActive ? 'translate-x-0' : 'group-hover:translate-x-0.5'}`, "aria-hidden": true }) })] }, cat.id));
                        }) })] }), _jsxs("div", { className: "rad-main min-w-0 bg-white", children: [_jsxs("div", { className: "rad-head", children: [_jsxs("div", { children: [_jsx("h3", { children: group.label }), _jsx("p", { children: group.note ?? 'Nashik Radiological & Imaging Association' })] }), _jsxs("div", { className: "shrink-0 text-right", children: [_jsxs("p", { className: "text-[12px] font-semibold text-[#5a7284]", children: [items.length, " studies"] }), _jsx(Link, { to: serviceBrowsePath('radiology', group.id), onClick: onNavigate, className: "mt-1 inline-block text-[12px] font-bold text-[#175a76] underline-offset-2 hover:underline", children: "View all" })] })] }), _jsx("div", { className: "rad-list", children: catalog.isLoading ? (_jsx("p", { className: "px-4 py-8 text-sm font-semibold text-ink-soft", children: "Loading imaging from the lab\u2026" })) : items.length ? (items.map((item) => (_jsxs("div", { className: "rad-row group", children: [_jsx("p", { className: "rad-name", children: item.name }), _jsxs("span", { className: "rad-price group-hover:opacity-0", children: ["\u20B9", item.price.toLocaleString('en-IN')] }), _jsxs(Link, { to: bookStartUrl({
                                        id: item.id,
                                        name: item.name,
                                        memberPrice: item.price,
                                        mrp: item.mrp,
                                        testCount: item.tests,
                                    }), className: "rad-book", onClick: onNavigate, children: ["Book now", _jsx(ArrowRight, { className: "h-3.5 w-3.5", "aria-hidden": true })] })] }, item.id)))) : (_jsx("p", { className: "px-4 py-8 text-sm font-semibold text-ink-soft", children: "No imaging studies listed from the lab yet." })) }), _jsx("div", { className: "flex justify-center border-t border-ink/10 px-4 py-4", children: _jsxs(Link, { to: serviceBrowsePath('radiology', group.id), onClick: onNavigate, className: "inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-4 py-2 text-[13.5px] font-semibold text-ink-soft transition hover:border-brand-200 hover:text-ink", children: ["View all", _jsx(ArrowRight, { className: "h-3.5 w-3.5", "aria-hidden": true })] }) })] })] }));
}
