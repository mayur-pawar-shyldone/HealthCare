import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Baby, Brain, ChevronRight, Clock, Droplets, FileText, FlaskConical, Flower2, Heart, HeartPulse, LayoutGrid, Leaf, MessageCircle, Moon, Pill, Ribbon, Scale, Scan, ScanLine, ShoppingBag, Sparkles, Stethoscope, Syringe, UserRound, Users, } from 'lucide-react';
import { HEALTH_VERTICALS } from '@/data/landing-nav-data';
import { serviceBrowsePath } from '@/data/service-browse';
import { browseTabForQuickLink, packagesForQuickLink } from '@/lib/landing-quick-link-packages';
import { labTestToPreview, pickTestsForNav } from '@/lib/catalog';
import { useCatalogTests } from '@/hooks/useCatalogTests';
import { Link } from 'react-router-dom';
import { openHealthCard } from '@/lib/health-card-bus';
import { LabBrowsePackageCard } from '@/components/landing/LabBrowsePackageCard';
const ICONS = {
    'full-body': FlaskConical,
    heart: UserRound,
    cancer: Ribbon,
    thyroid: FileText,
    diabetes: Droplets,
    pregnancy: Clock,
    hormone: FileText,
    'doc-gp-care': Stethoscope,
    'doc-specialist': UserRound,
    'doc-cardio': HeartPulse,
    'doc-women': Flower2,
    'doc-peds': Baby,
    'doc-mental': Brain,
    'ayu-consult-root': Leaf,
    'ayu-pancha': Sparkles,
    'ayu-herbal': Leaf,
    'ayu-women': Flower2,
    'ayu-stress': Moon,
    'ayu-weight': Scale,
    'ph-rx': Pill,
    'ph-supplements': FlaskConical,
    'ph-essentials': ShoppingBag,
    'ph-chronic': HeartPulse,
    'ph-family': Users,
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
/** HealthID browse-by-need panel — sidebar + package cards (Blood Test, ECG, etc.). */
export function HealthVerticalPanel({ compact, onNavigate, verticals = HEALTH_VERTICALS, defaultActiveId, sidebarEyebrow = 'Browse by health need', sidebarBadge = 'NABL labs • Home collection', packageCountLabel = 'packages', browseCategoryId, }) {
    const initialId = defaultActiveId ?? verticals[0]?.id ?? HEALTH_VERTICALS[0].id;
    const [activeId, setActiveId] = useState(initialId);
    const catalog = useCatalogTests();
    const tests = catalog.data ?? [];
    const liveVerticals = useMemo(() => verticals.map((vertical) => {
        const matched = pickTestsForNav(vertical.id, tests);
        const fallback = matched.length === 0 && (browseCategoryId === 'blood-test' || browseCategoryId == null)
            ? tests.filter((test) => test.isPackage).slice(0, 6)
            : [];
        return {
            ...vertical,
            packages: (matched.length ? matched : fallback).map(labTestToPreview),
        };
    }), [verticals, tests, browseCategoryId]);
    const active = useMemo(() => liveVerticals.find((v) => v.id === activeId) ?? liveVerticals[0] ?? HEALTH_VERTICALS[0], [activeId, liveVerticals]);
    return (_jsxs("div", { className: "grid-cols-[280px_1fr] grid gap-0 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-lift lg:grid-cols-[320px_1fr]", children: [_jsx(Sidebar, { active: active, activeId: activeId, compact: compact, verticals: liveVerticals, sidebarEyebrow: sidebarEyebrow, sidebarBadge: sidebarBadge, onSelect: setActiveId, onNavigate: onNavigate }), _jsx(MainPanel, { active: active, verticals: liveVerticals, compact: compact, packageCountLabel: packageCountLabel, onNavigate: onNavigate, browseCategoryId: browseCategoryId, isLoading: catalog.isLoading })] }));
}
function subtitleFor(item) {
    return item.subtitle;
}
function Sidebar({ active, activeId, compact, verticals, sidebarEyebrow, sidebarBadge, onSelect, onNavigate, }) {
    return (_jsxs("div", { className: "flex flex-col border-b border-ink/10 bg-white lg:border-b-0 lg:border-r lg:bg-gradient-to-b lg:from-white lg:via-mint/[0.15] lg:to-white", children: [_jsxs("div", { className: "p-5 pb-4", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("span", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white shadow-sm", children: _jsx(LayoutGrid, { className: "h-4 w-4", "aria-hidden": true }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[11px] font-bold uppercase tracking-[0.14em] text-ink", children: sidebarEyebrow }), _jsxs("p", { className: "text-[12.5px] text-ink-muted", children: [verticals.length, " curated panels \u00B7 tap to preview"] })] })] }), _jsxs("div", { className: "mt-3 inline-flex items-center gap-2 rounded-full bg-mint px-3 py-1.5", children: [_jsx("span", { className: "h-2 w-2 animate-pulse rounded-full bg-emerald-500", "aria-hidden": true }), _jsx("span", { className: "text-[11.5px] font-semibold text-ink-soft", children: sidebarBadge })] })] }), _jsx("div", { className: "flex max-h-[min(520px,58vh)] flex-col gap-2 overflow-y-auto px-3 pb-3 [scrollbar-gutter:stable]", children: verticals.map((item) => {
                    const isActive = item.id === activeId;
                    const Icon = ICONS[item.id] ?? Heart;
                    return (_jsxs("button", { type: "button", onClick: () => onSelect(item.id), onMouseEnter: () => onSelect(item.id), onFocus: () => onSelect(item.id), className: `group flex w-full items-center gap-3 rounded-[16px] border p-2 pr-3 text-left transition-all duration-200 ease-out ${isActive
                            ? 'scale-[1.01] border-ink bg-ink text-white shadow-lg shadow-ink/10'
                            : 'border-ink/10 bg-white text-ink-soft hover:border-brand-200 hover:bg-brand-50/70 hover:text-ink hover:shadow-sm'}`, children: [_jsx("span", { className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${isActive ? 'bg-white text-ink' : 'bg-mint text-brand-600 group-hover:bg-white group-hover:text-brand-600'}`, children: _jsx(Icon, { className: "h-5 w-5", "aria-hidden": true }) }), _jsxs("span", { className: "flex-1", children: [_jsx("span", { className: `block text-[14px] font-semibold leading-none ${isActive ? 'text-white' : 'text-ink group-hover:text-ink'}`, children: item.label }), _jsx("span", { className: `mt-1 block text-[12px] leading-none ${isActive ? 'text-white/70' : 'text-ink-muted'}`, children: subtitleFor(item) })] }), _jsx("span", { className: `flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${isActive ? 'bg-white/15 text-white' : 'bg-ink/5 text-ink-muted group-hover:bg-white group-hover:text-brand-600'}`, children: _jsx(ChevronRight, { className: `h-3.5 w-3.5 transition-transform duration-200 ${isActive ? 'translate-x-0' : 'group-hover:translate-x-0.5'}`, "aria-hidden": true }) })] }, item.id));
                }) }), !compact ? (_jsxs("div", { className: "relative mx-3 mb-3 mt-4 overflow-hidden rounded-[20px] bg-ink p-4 text-white", children: [_jsx("span", { className: "pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl", "aria-hidden": true }), _jsxs("div", { className: "relative", children: [_jsxs("p", { className: "inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60", children: [_jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400", "aria-hidden": true }), "Why it matters"] }), _jsx("h4", { className: "mt-2 font-display text-[15px] font-bold leading-snug text-white", children: active.headline }), _jsx("ul", { className: "mt-3 space-y-2.5", children: active.points.map((point) => (_jsxs("li", { className: "flex gap-2.5 text-[13px] leading-snug text-white/80", children: [_jsx("span", { className: "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400", "aria-hidden": true }), point] }, point))) }), _jsxs("button", { type: "button", onClick: () => {
                                    onNavigate?.();
                                    openHealthCard();
                                }, className: "mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-full bg-white px-4 text-[13px] font-semibold text-ink transition hover:bg-brand-50", children: [_jsx(MessageCircle, { className: "h-3.5 w-3.5", "aria-hidden": true }), "Talk to advisor"] })] })] })) : null] }));
}
function MainPanel({ active, verticals, compact, packageCountLabel, onNavigate, browseCategoryId, isLoading, }) {
    const [hoveredQuickLink, setHoveredQuickLink] = useState(null);
    useEffect(() => {
        setHoveredQuickLink(null);
    }, [active.id]);
    const displayPackages = useMemo(() => {
        if (!hoveredQuickLink)
            return active.packages;
        return packagesForQuickLink(active, hoveredQuickLink, verticals);
    }, [active, hoveredQuickLink, verticals]);
    const browseTabId = useMemo(() => {
        if (!hoveredQuickLink)
            return active.id;
        return browseTabForQuickLink(active, hoveredQuickLink, verticals);
    }, [active, hoveredQuickLink, verticals]);
    return (_jsxs("div", { className: "bg-white p-6", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-display text-[19px] font-bold leading-tight text-ink", children: active.label }), _jsx("p", { className: "mt-1 max-w-xl text-[13.5px] leading-snug text-ink-muted", children: active.headline })] }), _jsxs("span", { className: "hidden shrink-0 rounded-full bg-mint px-3 py-1.5 text-[11.5px] font-semibold text-ink-soft sm:inline-flex", children: [displayPackages.length, " ", packageCountLabel] })] }), _jsxs("div", { onMouseLeave: () => setHoveredQuickLink(null), children: [_jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: active.quickLinks.map((link) => {
                            const on = hoveredQuickLink === link;
                            return (_jsx("button", { type: "button", onMouseEnter: () => setHoveredQuickLink(link), onFocus: () => setHoveredQuickLink(link), className: `rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-colors duration-150 ease-out ${on
                                    ? 'border-ink bg-ink text-white shadow-sm'
                                    : 'border-brand-200 bg-brand-50 text-ink-soft hover:border-brand-300 hover:text-ink'}`, children: link }, link));
                        }) }), isLoading ? (_jsx("p", { className: "mt-4 text-sm font-semibold text-ink-soft", children: "Loading packages from the lab\u2026" })) : displayPackages.length ? (_jsx("ul", { className: "mt-4 grid gap-3 md:grid-cols-3", children: displayPackages.map((pkg) => (_jsx("li", { className: "min-w-0", children: _jsx(LabBrowsePackageCard, { pkg: pkg, onNavigate: onNavigate, browseCategoryId: browseCategoryId, browseTabId: browseTabId }) }, pkg.id))) })) : (_jsx("p", { className: "mt-4 rounded-2xl border border-dashed border-line bg-cream px-4 py-10 text-center text-sm font-semibold text-ink-soft", children: "No packages in this category yet." }))] }), compact ? (_jsx("div", { className: "mt-6 flex justify-center", children: browseCategoryId ? (_jsxs(Link, { to: serviceBrowsePath(browseCategoryId, active.id), onClick: onNavigate, className: "inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-4 py-2 text-[13.5px] font-semibold text-ink-soft transition hover:border-brand-200 hover:text-ink", children: ["View all", _jsx(ArrowRight, { className: "h-3.5 w-3.5", "aria-hidden": true })] })) : (_jsxs("a", { href: "#popular-plans", onClick: onNavigate, className: "inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-4 py-2 text-[13.5px] font-semibold text-ink-soft transition hover:border-brand-200 hover:text-ink", children: ["View all", _jsx(ArrowRight, { className: "h-3.5 w-3.5", "aria-hidden": true })] })) })) : null] }));
}
