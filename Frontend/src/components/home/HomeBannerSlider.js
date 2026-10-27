import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgePercent, Bell, ChevronLeft, ChevronRight, Clock, FileText, FlaskConical, Gift, HeartPulse, Home, MessageCircle, Package, Receipt, Sparkles, Star, Truck, Users, Wallet, Zap, } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLATFORM } from '@/data/platform-content';
import { usePlatformPricing } from '@/hooks/usePlatformPricing';
const SLIDE_THEMES = {
    teal: {
        shell: 'from-[#0c1929] via-[#1a4d6d] to-[#1e6b8a]',
        glow: 'bg-cyan-400/25',
        badge: 'bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-300/30',
        stat: 'text-cyan-200',
        accent: 'from-cyan-300 to-teal-200',
        ring: 'ring-cyan-300/25',
    },
    red: {
        shell: 'from-[#3d0f0a] via-[#e03a28] to-[#ff6b57]',
        glow: 'bg-orange-300/25',
        badge: 'bg-white/15 text-white ring-1 ring-white/25',
        stat: 'text-orange-100',
        accent: 'from-orange-200 to-amber-100',
        ring: 'ring-orange-200/30',
    },
    indigo: {
        shell: 'from-[#1e1b4b] via-[#4338ca] to-[#7c3aed]',
        glow: 'bg-violet-300/25',
        badge: 'bg-white/15 text-white ring-1 ring-white/25',
        stat: 'text-violet-100',
        accent: 'from-violet-200 to-fuchsia-100',
        ring: 'ring-violet-200/30',
    },
    emerald: {
        shell: 'from-[#064e3b] via-[#059669] to-[#14b8a6]',
        glow: 'bg-emerald-300/25',
        badge: 'bg-white/15 text-white ring-1 ring-white/25',
        stat: 'text-emerald-100',
        accent: 'from-emerald-200 to-teal-100',
        ring: 'ring-emerald-200/30',
    },
};
const UPDATES = [
    {
        id: 'invoice',
        icon: Receipt,
        title: 'Payment invoices',
        body: 'Download tax invoices for every booking from your account.',
        to: '/transactions',
        tone: 'bg-indigo-50 text-indigo-800 border-indigo-100',
        iconTone: 'bg-indigo-500 text-white',
    },
    {
        id: 'reports',
        icon: FileText,
        title: 'Reports in app',
        body: 'Lab PDFs download securely — also sent on WhatsApp.',
        to: '/history',
        tone: 'bg-teal-light text-teal-dark border-teal/20',
        iconTone: 'bg-teal text-white',
    },
    {
        id: 'collection',
        icon: Truck,
        title: 'Free home visit',
        body: 'Phlebotomist at your doorstep on every booking.',
        to: '/appointments/book',
        tone: 'bg-amber-50 text-amber-900 border-amber-100',
        iconTone: 'bg-amber-500 text-white',
    },
    {
        id: 'cbc',
        icon: HeartPulse,
        title: 'Free annual CBC',
        body: 'Members get one Complete Blood Count every year.',
        to: '/tests',
        tone: 'bg-rose-50 text-rose-900 border-rose-100',
        iconTone: 'bg-[#e03a28] text-white',
    },
];
const QUICK_OFFERS = [
    {
        id: 'full-body',
        label: 'Top package',
        title: 'Full Body Basic',
        value: '₹999',
        sub: '8 tests · Home collection',
        to: '/tests?packages=true',
        icon: Package,
        gradient: 'from-teal to-[#0f3349]',
        ribbon: 'Best value',
    },
    {
        id: 'member',
        label: 'Member',
        title: 'Card discount',
        value: `${PLATFORM.membership.flatDiscount}%`,
        sub: 'Off eligible tests',
        to: '/home?edit=card',
        icon: Gift,
        gradient: 'from-amber-500 to-orange-600',
        ribbon: 'Member rate',
    },
    {
        id: 'whatsapp',
        label: 'Reports',
        title: 'WhatsApp delivery',
        value: '24–48h',
        sub: 'Digital vault + chat',
        to: '/history',
        icon: MessageCircle,
        gradient: 'from-[#e03a28] to-[#9a2a1e]',
        ribbon: 'Fast',
    },
    {
        id: 'book',
        label: 'Book',
        title: 'Home collection',
        value: 'Free',
        sub: 'At member price',
        to: '/appointments/book',
        icon: Sparkles,
        gradient: 'from-indigo-500 to-violet-700',
        ribbon: 'Book now',
    },
];
function SlideVisual({ type, theme, discountPct, }) {
    if (type === 'discount') {
        return (_jsxs("div", { className: "relative flex h-[140px] w-[140px] items-center justify-center md:h-[168px] md:w-[168px]", children: [_jsx("div", { className: cn('absolute inset-0 rounded-[32px] bg-gradient-to-br opacity-90 blur-sm', theme.accent) }), _jsxs("div", { className: cn('relative grid place-items-center rounded-[32px] bg-white/10 p-5 ring-1 backdrop-blur-md', theme.ring), children: [_jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.2em] text-white/60", children: "Extra off" }), _jsxs("p", { className: "font-display text-5xl leading-none text-white md:text-6xl", children: [discountPct, "%"] }), _jsx("p", { className: "mt-1 text-center text-[10px] font-semibold text-white/70", children: "on special price" }), _jsx(BadgePercent, { className: "absolute -right-2 -top-2 h-8 w-8 rounded-full bg-white p-1.5 text-[#e03a28] shadow-lg" })] }), _jsx("div", { className: "absolute -bottom-2 -left-3 rounded-xl bg-white/95 px-2.5 py-1.5 text-[10px] font-bold text-teal shadow-md", children: "Not on MRP" })] }));
    }
    if (type === 'packages') {
        return (_jsxs("div", { className: "relative h-[140px] w-[160px] md:h-[168px] md:w-[180px]", children: [['Diabetic', 'Cardiac', 'PCOD', 'Senior'].map((label, i) => (_jsx("div", { className: cn('absolute rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-bold text-white backdrop-blur-sm', i === 0 && 'left-0 top-0 rotate-[-6deg]', i === 1 && 'right-0 top-2 rotate-[4deg]', i === 2 && 'bottom-8 left-2 rotate-[3deg]', i === 3 && 'bottom-0 right-0 rotate-[-3deg]'), children: label }, label))), _jsx("div", { className: "absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/30", children: _jsx(Package, { className: "h-8 w-8 text-white" }) }), _jsxs("p", { className: "absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1 text-[10px] font-bold text-[#e03a28] shadow", children: [PLATFORM.packageCount, " packages"] })] }));
    }
    if (type === 'wallet') {
        return (_jsxs("div", { className: "relative flex h-[140px] w-[150px] flex-col items-center justify-end md:h-[168px] md:w-[170px]", children: [[0, 1, 2].map((i) => (_jsx("div", { className: cn('absolute rounded-2xl border border-white/25 bg-gradient-to-br from-white/25 to-white/5 backdrop-blur-sm', i === 0 && 'bottom-0 h-14 w-28', i === 1 && 'bottom-4 h-12 w-24 opacity-80', i === 2 && 'bottom-8 h-10 w-20 opacity-60') }, i))), _jsx("div", { className: "relative mb-2 grid h-14 w-14 place-items-center rounded-2xl bg-white text-indigo-600 shadow-xl", children: _jsx(Wallet, { className: "h-7 w-7" }) }), _jsx("p", { className: "relative rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold text-white", children: "Fintech wallet" })] }));
    }
    return (_jsxs("div", { className: "relative flex h-[140px] w-[160px] items-center justify-center md:h-[168px] md:w-[180px]", children: [_jsx("div", { className: "absolute inset-0 rounded-full bg-white/5" }), [0, 1, 2, 3, 4].map((i) => (_jsx("div", { className: cn('absolute grid h-10 w-10 place-items-center rounded-full bg-white/15 text-xs font-bold text-white ring-2 ring-white/20', i === 0 && 'left-1/2 top-0 -translate-x-1/2', i === 1 && 'left-0 top-1/2 -translate-y-1/2', i === 2 && 'right-0 top-1/2 -translate-y-1/2', i === 3 && 'bottom-2 left-4', i === 4 && 'bottom-2 right-4'), children: i === 0 ? 'You' : '•' }, i))), _jsx(Users, { className: "relative h-12 w-12 text-white/90" }), _jsxs("p", { className: "absolute -bottom-1 rounded-full bg-white px-3 py-1 text-[10px] font-bold text-emerald-700 shadow", children: [PLATFORM.familyMembers, " members"] })] }));
}
export function HomeBannerSlider() {
    const { activePercent, isPromoActive } = usePlatformPricing();
    const discountPct = isPromoActive ? activePercent : PLATFORM.membership.flatDiscount;
    const featured = useMemo(() => [
        {
            id: 'rates',
            tag: 'Launch offer',
            title: `Extra ${discountPct}% off at every payment`,
            highlight: `${PLATFORM.testCount}+ tests · special partner rates`,
            body: 'Discount applies on special price (not MRP). Auto-applied at checkout for members.',
            cta: 'Browse tests',
            to: '/tests',
            visual: 'discount',
            theme: SLIDE_THEMES.teal,
        },
        {
            id: 'packages',
            tag: 'Bundle & save',
            title: `${PLATFORM.packageCount} health packages`,
            highlight: 'Full Body Basic from ₹999',
            body: 'Diabetic, cardiac, thyroid, PCOD & senior panels — one visit, maximum savings.',
            cta: 'Explore packages',
            to: '/tests?packages=true',
            visual: 'packages',
            theme: SLIDE_THEMES.red,
        },
        {
            id: 'family',
            tag: 'Family care',
            title: 'One HealthID Card, whole family',
            highlight: 'Free home collection every time',
            body: `Add ${PLATFORM.familyMembers} members · WhatsApp reports in ${PLATFORM.reportHours} hours · lifetime digital vault.`,
            cta: 'Manage card',
            to: '/home#healthid-card-section',
            visual: 'family',
            theme: SLIDE_THEMES.emerald,
        },
    ], [discountPct]);
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [animKey, setAnimKey] = useState(0);
    const slide = featured[index];
    useEffect(() => {
        if (paused)
            return;
        const duration = 6500;
        const tick = 50;
        const timer = window.setInterval(() => {
            setProgress((p) => {
                if (p >= 100) {
                    setIndex((i) => (i + 1) % featured.length);
                    setAnimKey((k) => k + 1);
                    return 0;
                }
                return p + (tick / duration) * 100;
            });
        }, tick);
        return () => window.clearInterval(timer);
    }, [paused, index, featured.length]);
    function goTo(i) {
        setIndex(i);
        setProgress(0);
        setAnimKey((k) => k + 1);
    }
    return (_jsxs("section", { "aria-label": "Offers and updates", className: "space-y-4", children: [_jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3 px-0.5", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "relative flex h-2 w-2", children: [_jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e03a28] opacity-40" }), _jsx("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-[#e03a28]" })] }), _jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.22em] text-[#e03a28]", children: "Live for members" })] }), _jsx("h2", { className: "mt-1 font-display text-2xl text-ink md:text-[1.65rem]", children: "Offers & updates" })] }), _jsxs(Link, { to: "/tests", className: "inline-flex items-center gap-1.5 rounded-full border border-teal/25 bg-teal-light/50 px-4 py-2 text-xs font-bold text-teal transition hover:bg-teal-light", children: ["View all deals", _jsx(ArrowRight, { className: "h-3.5 w-3.5" })] })] }), _jsxs("div", { className: "overflow-hidden rounded-[28px] border border-line/80 bg-white shadow-[0_16px_48px_rgba(12,25,41,0.08)]", onMouseEnter: () => setPaused(true), onMouseLeave: () => setPaused(false), children: [_jsxs("article", { className: cn('relative overflow-hidden bg-gradient-to-br text-white transition-opacity duration-500', slide.theme.shell), children: [_jsx("div", { className: cn('pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full blur-3xl', slide.theme.glow) }), _jsx("div", { className: "pointer-events-none absolute -bottom-20 left-1/4 h-72 w-72 rounded-full bg-white/5 blur-2xl" }), _jsx("div", { className: "pointer-events-none absolute inset-0 opacity-[0.07]", style: {
                                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                                    backgroundSize: '24px 24px',
                                } }), _jsx("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.14),transparent_45%)]" }), _jsxs("div", { className: "relative grid min-h-[240px] items-center gap-6 p-6 md:min-h-[220px] md:grid-cols-[1fr_auto] md:p-8 lg:min-h-[200px]", children: [_jsxs("div", { className: "min-w-0 space-y-3.5", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsxs("span", { className: cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider', slide.theme.badge), children: [_jsx(Sparkles, { className: "h-3 w-3" }), slide.tag] }), _jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-black/15 px-2.5 py-1 text-[10px] font-semibold text-white/80", children: [_jsx(Star, { className: "h-3 w-3 fill-amber-300 text-amber-300" }), "Member exclusive"] })] }), _jsx("h3", { className: "max-w-lg font-display text-[1.65rem] leading-[1.15] md:text-[1.85rem]", children: slide.title }), _jsx("p", { className: cn('text-sm font-bold', slide.theme.stat), children: slide.highlight }), _jsx("p", { className: "max-w-md text-sm leading-relaxed text-white/78", children: slide.body }), _jsxs("div", { className: "flex flex-wrap items-center gap-3 pt-1", children: [_jsxs(Link, { to: slide.to, className: "inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-ink shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition hover:-translate-y-0.5 hover:bg-white/95", children: [slide.cta, _jsx(ArrowRight, { className: "h-4 w-4" })] }), _jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs text-white/55", children: [_jsx(Clock, { className: "h-3.5 w-3.5" }), "Limited launch pricing"] })] })] }), _jsx("div", { className: "flex justify-center md:justify-end", children: _jsx(SlideVisual, { type: slide.visual, theme: slide.theme, discountPct: discountPct }) })] }), _jsx("div", { className: "relative border-t border-white/10 bg-black/10 px-4 py-3 backdrop-blur-sm md:px-6", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { type: "button", "aria-label": "Previous offer", onClick: () => goTo((index - 1 + featured.length) % featured.length), className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25", children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), _jsx("div", { className: "flex flex-1 items-center gap-2", children: featured.map((b, i) => (_jsx("button", { type: "button", "aria-label": `Show offer: ${b.title}`, onClick: () => goTo(i), className: "group relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/20", children: _jsx("span", { className: cn('absolute inset-y-0 left-0 rounded-full bg-white transition-all', i === index ? 'opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-40'), style: i === index ? { width: `${progress}%` } : undefined }) }, b.id))) }), _jsxs("span", { className: "hidden text-[10px] font-bold tabular-nums text-white/50 sm:inline", children: [index + 1, "/", featured.length] }), _jsx("button", { type: "button", "aria-label": "Next offer", onClick: () => goTo((index + 1) % featured.length), className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25", children: _jsx(ChevronRight, { className: "h-4 w-4" }) })] }) })] }, animKey), _jsx("div", { className: "grid grid-cols-2 gap-px bg-line/60 sm:grid-cols-4", children: featured.map((b, i) => (_jsxs("button", { type: "button", onClick: () => goTo(i), className: cn('flex items-center gap-2.5 bg-white px-4 py-3 text-left transition hover:bg-teal-light/30', i === index && 'bg-teal-light/50 ring-1 ring-inset ring-teal/20'), children: [_jsx("span", { className: cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-white', i === index
                                        ? 'from-teal to-teal-dark shadow-sm'
                                        : 'from-slate-400/90 to-slate-500/90'), children: b.visual === 'discount' ? (_jsx(BadgePercent, { className: "h-4 w-4" })) : b.visual === 'packages' ? (_jsx(Package, { className: "h-4 w-4" })) : b.visual === 'wallet' ? (_jsx(Wallet, { className: "h-4 w-4" })) : (_jsx(Users, { className: "h-4 w-4" })) }), _jsxs("span", { className: "min-w-0", children: [_jsx("p", { className: "truncate text-[11px] font-bold text-ink", children: b.tag }), _jsx("p", { className: "truncate text-[10px] text-ink-soft", children: b.highlight.split('·')[0] })] })] }, b.id))) })] }), _jsxs("div", { children: [_jsxs("div", { className: "mb-3 flex items-center gap-2 px-0.5", children: [_jsx(Bell, { className: "h-4 w-4 text-teal" }), _jsx("p", { className: "text-xs font-bold uppercase tracking-[0.16em] text-ink-soft", children: "What's new" })] }), _jsx("div", { className: "-mx-1 flex gap-3 overflow-x-auto pb-1 px-1 scrollbar-thin", children: UPDATES.map((item) => {
                            const Icon = item.icon;
                            return (_jsxs(Link, { to: item.to, className: cn('group flex min-w-[220px] max-w-[260px] shrink-0 flex-col rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md sm:min-w-[240px]', item.tone), children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsx("span", { className: cn('grid h-9 w-9 place-items-center rounded-xl shadow-sm', item.iconTone), children: _jsx(Icon, { className: "h-4 w-4" }) }), _jsx(ArrowRight, { className: "h-4 w-4 shrink-0 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-50" })] }), _jsx("p", { className: "mt-3 text-sm font-bold leading-snug", children: item.title }), _jsx("p", { className: "mt-1 text-xs leading-relaxed opacity-80", children: item.body })] }, item.id));
                        }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "mb-3 flex items-center justify-between gap-2 px-0.5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Zap, { className: "h-4 w-4 text-[#e03a28]" }), _jsx("p", { className: "text-xs font-bold uppercase tracking-[0.16em] text-ink-soft", children: "Quick picks" })] }), _jsx(Link, { to: "/tests?packages=true", className: "text-[11px] font-semibold text-teal hover:underline", children: "See packages \u2192" })] }), _jsx("div", { className: "grid grid-cols-2 gap-3 lg:grid-cols-4", children: QUICK_OFFERS.map((offer) => {
                            const Icon = offer.icon;
                            return (_jsxs(Link, { to: offer.to, className: "group relative overflow-hidden rounded-[22px] shadow-[0_8px_28px_rgba(12,25,41,0.1)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(12,25,41,0.14)]", children: [_jsx("div", { className: cn('absolute inset-0 bg-gradient-to-br', offer.gradient) }), _jsx("div", { className: "pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-xl" }), _jsx("div", { className: "pointer-events-none absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-black/10 blur-xl" }), _jsx("span", { className: "absolute right-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white backdrop-blur-sm", children: offer.ribbon }), _jsxs("div", { className: "relative flex min-h-[148px] flex-col p-4 text-white", children: [_jsx("span", { className: "grid h-10 w-10 place-items-center rounded-xl bg-white/20 ring-1 ring-white/25 backdrop-blur-sm", children: _jsx(Icon, { className: "h-5 w-5" }) }), _jsx("p", { className: "mt-auto pt-4 text-[10px] font-bold uppercase tracking-wider text-white/70", children: offer.label }), _jsx("p", { className: "font-display text-lg leading-tight", children: offer.title }), _jsx("p", { className: "mt-1 font-display text-2xl leading-none", children: offer.value }), _jsx("p", { className: "mt-1 text-[11px] text-white/75", children: offer.sub }), _jsxs("span", { className: "mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-white/90 opacity-0 transition group-hover:opacity-100", children: ["Claim offer ", _jsx(ArrowRight, { className: "h-3 w-3" })] })] })] }, offer.id));
                        }) })] }), _jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [_jsxs(Link, { to: "/appointments/book", className: "group relative overflow-hidden rounded-[22px] border border-teal/20 bg-gradient-to-r from-teal-light via-white to-cream p-5 transition hover:shadow-md", children: [_jsx("div", { className: "pointer-events-none absolute -right-4 -top-4 h-28 w-28 rounded-full bg-teal/10 blur-2xl" }), _jsxs("div", { className: "relative flex items-center gap-4", children: [_jsx("span", { className: "grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-teal text-white shadow-lg", children: _jsx(Home, { className: "h-7 w-7" }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-teal", children: "Home collection" }), _jsx("p", { className: "font-display text-xl text-ink", children: "Book a visit today" }), _jsx("p", { className: "text-sm text-ink-soft", children: "Free phlebotomist at your doorstep" })] }), _jsx(ArrowRight, { className: "h-5 w-5 shrink-0 text-teal opacity-40 transition group-hover:translate-x-1 group-hover:opacity-100" })] })] }), _jsxs(Link, { to: "/tests", className: "group relative overflow-hidden rounded-[22px] border border-[#e03a28]/20 bg-gradient-to-r from-[#fff5f4] via-white to-teal-light/30 p-5 transition hover:shadow-md", children: [_jsx("div", { className: "pointer-events-none absolute -right-4 -top-4 h-28 w-28 rounded-full bg-[#e03a28]/10 blur-2xl" }), _jsxs("div", { className: "relative flex items-center gap-4", children: [_jsx("span", { className: "grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#e03a28] to-[#c42e1e] text-white shadow-lg", children: _jsx(FlaskConical, { className: "h-7 w-7" }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("p", { className: "text-[10px] font-bold uppercase tracking-wider text-[#e03a28]", children: [PLATFORM.testCount, "+ tests"] }), _jsx("p", { className: "font-display text-xl text-ink", children: "Member special rates" }), _jsxs("p", { className: "text-sm text-ink-soft", children: ["Up to ", PLATFORM.maxSavingsPct, "% off MRP + ", discountPct, "% at payment"] })] }), _jsx(ArrowRight, { className: "h-5 w-5 shrink-0 text-[#e03a28] opacity-40 transition group-hover:translate-x-1 group-hover:opacity-100" })] })] })] })] }));
}
