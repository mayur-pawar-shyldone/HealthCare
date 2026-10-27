import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Award, CalendarCheck, ChevronDown, ChevronRight, Droplets, FlaskConical, Heart, Home, MessageCircle, Microscope, Pill, ShieldCheck, Stethoscope, Truck, Users, } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { HealthIdCard } from '@/components/brand/HealthIdCard';
import { formatMoney } from '@/lib/utils';
const CATEGORY_ICONS = {
    'blood-tests': Droplets,
    diabetes: Activity,
    thyroid: Microscope,
    liver: Pill,
    kidney: FlaskConical,
    heart: Heart,
    vitamins: Award,
    hormones: Stethoscope,
    infection: ShieldCheck,
    'full-body-packages': Users,
};
export function HeroSection({ userName, city, tests, mobile, }) {
    const navigate = useNavigate();
    const [name, setName] = useState(userName);
    const [phone, setPhone] = useState(mobile ?? '');
    const [location, setLocation] = useState(city ?? 'Mumbai');
    const [testId, setTestId] = useState('');
    function onBook(e) {
        e.preventDefault();
        const params = new URLSearchParams();
        if (testId)
            params.set('testId', testId);
        navigate(`/appointments/book?${params.toString()}`);
    }
    return (_jsx("section", { className: "overflow-hidden rounded-2xl bg-gradient-to-br from-teal-light via-white to-[#fff8e6]", children: _jsxs("div", { className: "grid gap-8 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8", children: [_jsxs("div", { className: "flex flex-col justify-center", children: [_jsx("span", { className: "inline-flex w-fit rounded-full bg-brand-red/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-red", children: "Care beyond borders" }), _jsx("h1", { className: "mt-4 font-display text-3xl leading-tight text-ink md:text-4xl lg:text-[2.6rem]", children: "Full body checkups & lab tests at home" }), _jsx("p", { className: "mt-4 max-w-xl text-base leading-relaxed text-ink-soft", children: "Book blood tests and health profiles with free home sample collection. Get reports on WhatsApp at exclusive HealthID Card rates." }), _jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [_jsx(Link, { to: "/tests?packages=true", children: _jsx(Button, { size: "lg", className: "rounded-lg", children: "View all packages" }) }), _jsx(Link, { to: "/membership", children: _jsx(Button, { size: "lg", variant: "secondary", className: "rounded-lg", children: "Get free HealthID Card" }) })] }), _jsx("div", { className: "mt-8 grid grid-cols-3 gap-4 border-t border-line/80 pt-6", children: [
                                { n: '30+', l: 'Lab tests' },
                                { n: '30%', l: 'Member savings' },
                                { n: '24hr', l: 'Report delivery' },
                            ].map((s) => (_jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-teal", children: s.n }), _jsx("p", { className: "text-xs text-ink-soft", children: s.l })] }, s.l))) })] }), _jsxs("div", { className: "rounded-2xl border border-line bg-white p-6 shadow-[0_12px_40px_rgba(43,90,121,0.08)]", children: [_jsx("h2", { className: "font-display text-xl text-ink", children: "Quick book at home" }), _jsx("p", { className: "mt-1 text-sm text-ink-soft", children: "Phlebotomist visits your doorstep" }), _jsxs("form", { onSubmit: onBook, className: "mt-5 space-y-3", children: [_jsx(Input, { label: "Full name", value: name, onChange: (e) => setName(e.target.value) }), _jsx(Input, { label: "Mobile number", value: phone, onChange: (e) => setPhone(e.target.value) }), _jsx(Input, { label: "City", value: location, onChange: (e) => setLocation(e.target.value) }), _jsxs("label", { className: "block text-sm", children: ["Select test / package", _jsxs("select", { className: "mt-1 w-full rounded-2xl border border-line px-4 py-3 text-sm outline-none focus:border-teal", value: testId, onChange: (e) => setTestId(e.target.value), children: [_jsx("option", { value: "", children: "Choose a test" }), tests.slice(0, 12).map((t) => (_jsx("option", { value: t.id, children: t.name }, t.id)))] })] }), _jsx(Button, { type: "submit", className: "mt-2 w-full rounded-lg", size: "lg", children: "Book now" })] })] })] }) }));
}
export function CategoryStrip({ categories }) {
    return (_jsxs("section", { children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsx("h2", { className: "font-display text-2xl text-ink", children: "Browse by category" }), _jsxs(Link, { to: "/tests", className: "flex items-center gap-1 text-sm font-medium text-teal hover:underline", children: ["View all ", _jsx(ChevronRight, { className: "h-4 w-4" })] })] }), _jsx("div", { className: "flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", children: categories.map((c) => {
                    const Icon = CATEGORY_ICONS[c.slug] ?? FlaskConical;
                    return (_jsxs(Link, { to: `/tests?category=${c.slug}`, className: "flex min-w-[88px] flex-col items-center gap-2 rounded-xl border border-line bg-white px-4 py-4 text-center transition hover:border-teal hover:bg-teal-light/40", children: [_jsx("div", { className: "grid h-12 w-12 place-items-center rounded-full bg-teal-light text-teal", children: _jsx(Icon, { className: "h-5 w-5" }) }), _jsx("span", { className: "text-xs font-medium leading-tight text-ink", children: c.name })] }, c.id));
                }) })] }));
}
export function SectionHeader({ title, href, linkLabel = 'View all' }) {
    return (_jsxs("div", { className: "mb-4 flex items-end justify-between gap-4", children: [_jsx("h2", { className: "font-display text-2xl text-ink md:text-3xl", children: title }), _jsxs(Link, { to: href, className: "flex shrink-0 items-center gap-1 text-sm font-medium text-teal hover:underline", children: [linkLabel, " ", _jsx(ChevronRight, { className: "h-4 w-4" })] })] }));
}
export function HorizontalOffers({ children }) {
    return (_jsx("div", { className: "flex gap-4 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", children: children }));
}
export function MembershipSection({ hasMembership, cardData, }) {
    return (_jsx("section", { className: "overflow-hidden rounded-2xl bg-gradient-to-r from-[#fff8e6] via-[#fff3d6] to-teal-light/50", children: _jsxs("div", { className: "grid items-center gap-8 p-6 lg:grid-cols-2 lg:p-8", children: [_jsxs("div", { children: [_jsx("span", { className: "rounded-full bg-brand-red px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white", children: "Free for 1 year" }), _jsx("h2", { className: "mt-4 font-display text-3xl text-ink", children: "HealthID Card membership" }), _jsx("p", { className: "mt-3 max-w-lg text-sm leading-relaxed text-ink-soft", children: "One card for your whole family. Flat 30% off every test, free home collection, WhatsApp updates, and digital reports in your account." }), _jsx("ul", { className: "mt-5 space-y-2.5 text-sm", children: ['Exclusive rates on 63+ tests', 'Add up to 5 family members', 'Free home sample collection', 'Reports on app + WhatsApp'].map((b) => (_jsxs("li", { className: "flex items-center gap-2", children: [_jsx(ShieldCheck, { className: "h-4 w-4 shrink-0 text-teal" }), b] }, b))) }), _jsx(Link, { to: hasMembership ? '/membership/card' : '/membership', children: _jsx(Button, { className: "mt-6 rounded-lg", size: "lg", variant: hasMembership ? 'primary' : 'accent', children: hasMembership ? 'View my card' : 'Join now — it\'s free' }) })] }), _jsx("div", { className: "flex justify-center lg:justify-end", children: hasMembership && cardData ? (_jsx("div", { className: "scale-[0.92] origin-center lg:origin-right", children: _jsx(HealthIdCard, { data: cardData }) })) : (_jsxs("div", { className: "w-full max-w-[380px] rounded-2xl border-2 border-dashed border-teal/30 bg-white/70 p-8 text-center", children: [_jsx(CreditCardPlaceholder, {}), _jsx("p", { className: "mt-4 font-display text-xl text-ink", children: "Your digital health card" }), _jsx("p", { className: "mt-2 text-sm text-ink-soft", children: "Activate once \u00B7 Valid 12 months \u00B7 Family included" })] })) })] }) }));
}
function CreditCardPlaceholder() {
    return (_jsxs("div", { className: "mx-auto h-44 w-full max-w-[320px] rounded-2xl bg-gradient-to-br from-ink to-teal p-5 text-left text-white shadow-lg", children: [_jsx("p", { className: "text-[10px] uppercase tracking-[0.2em] text-white/60", children: "HealthID Card" }), _jsx("p", { className: "mt-8 font-display text-2xl", children: "Member Name" }), _jsx("p", { className: "mt-2 text-xs text-white/60", children: "Valid thru \u00B7 12 Sep 2027" })] }));
}
export function HowItWorksSection() {
    const steps = [
        { icon: CalendarCheck, title: 'Book online', body: 'Choose test, share location, pick your preferred time slot.' },
        { icon: Home, title: 'Home collection', body: 'Certified phlebotomist visits your home for sample pickup.' },
        { icon: MessageCircle, title: 'Reports on WhatsApp', body: 'Digital reports in your login and shared on WhatsApp.' },
    ];
    return (_jsxs("section", { className: "rounded-2xl border border-line bg-white p-6 md:p-8", children: [_jsx("h2", { className: "text-center font-display text-2xl md:text-3xl", children: "How HealthID Card works" }), _jsx("p", { className: "mx-auto mt-2 max-w-xl text-center text-sm text-ink-soft", children: "From booking to report \u2014 a seamless at-home healthcare experience" }), _jsx("div", { className: "mt-8 grid gap-6 md:grid-cols-3", children: steps.map((s, i) => (_jsxs("div", { className: "relative text-center", children: [i < steps.length - 1 ? (_jsx("div", { className: "absolute left-[calc(50%+40px)] top-8 hidden h-px w-[calc(100%-80px)] bg-line md:block" })) : null, _jsx("div", { className: "mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-light text-teal", children: _jsx(s.icon, { className: "h-7 w-7" }) }), _jsxs("p", { className: "mt-1 text-xs font-bold uppercase tracking-wider text-brand-red", children: ["Step ", i + 1] }), _jsx("h3", { className: "mt-2 font-display text-lg", children: s.title }), _jsx("p", { className: "mt-2 text-sm leading-relaxed text-ink-soft", children: s.body })] }, s.title))) })] }));
}
export function TrustSection() {
    const badges = ['NABL Partner Labs', 'ISO 27001 Certified', 'CAP Accredited', 'Verified Phlebotomists'];
    return (_jsx("section", { className: "rounded-2xl bg-ink px-6 py-8 text-white md:px-10", children: _jsxs("div", { className: "flex flex-col items-center gap-6 md:flex-row md:justify-between", children: [_jsxs("div", { className: "text-center md:text-left", children: [_jsx("h2", { className: "font-display text-2xl", children: "Trusted healthcare platform" }), _jsx("p", { className: "mt-2 text-sm text-white/70", children: "Quality diagnostics with privacy-first digital reports" })] }), _jsx("div", { className: "flex flex-wrap justify-center gap-3", children: badges.map((b) => (_jsx("span", { className: "rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-wide text-white/85", children: b }, b))) })] }) }));
}
export function FaqSection() {
    const faqs = [
        { q: 'Is home sample collection really free?', a: 'Yes. HealthID Card members get free home collection across all major cities. Share your location and pick a convenient time slot during booking.' },
        { q: 'How does the 30% member discount work?', a: 'Once you activate your free HealthID Card, a flat 30% discount is automatically applied on every test and package at checkout.' },
        { q: 'Can I add family members to one card?', a: 'Absolutely. Add up to 5 family members on a single card and book tests for anyone in your family.' },
        { q: 'When will I receive my reports?', a: 'Most reports are available within 24–48 hours. You\'ll get an in-app notification and a WhatsApp message when your report is ready.' },
        { q: 'How do I pay for my booking?', a: 'Pay securely via UPI, debit/credit card, or cash on collection (COD) during the booking flow.' },
    ];
    return (_jsxs("section", { className: "rounded-2xl border border-line bg-white p-6 md:p-8", children: [_jsx("h2", { className: "font-display text-2xl md:text-3xl", children: "Frequently asked questions" }), _jsx("div", { className: "mt-5 divide-y divide-line", children: faqs.map((f) => (_jsx(FaqItem, { question: f.q, answer: f.a }, f.q))) })] }));
}
function FaqItem({ question, answer }) {
    const [open, setOpen] = useState(false);
    return (_jsxs("div", { className: "py-4", children: [_jsxs("button", { type: "button", onClick: () => setOpen((o) => !o), className: "flex w-full items-start justify-between gap-4 text-left", children: [_jsx("span", { className: "font-medium text-ink", children: question }), _jsx(ChevronDown, { className: `h-5 w-5 shrink-0 text-teal transition ${open ? 'rotate-180' : ''}` })] }), open ? _jsx("p", { className: "mt-3 pr-8 text-sm leading-relaxed text-ink-soft", children: answer }) : null] }));
}
export function UpcomingStrip({ testName, date, time, address, href, }) {
    return (_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 rounded-xl border border-teal/20 bg-teal-light/60 px-5 py-4", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal text-white", children: _jsx(Truck, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-teal", children: "Upcoming home collection" }), _jsx("p", { className: "font-medium text-ink", children: testName }), _jsxs("p", { className: "text-sm text-ink-soft", children: [date, " \u00B7 ", time, address ? ` · ${address}` : ''] })] })] }), _jsx(Link, { to: href, children: _jsx(Button, { variant: "secondary", size: "sm", className: "rounded-lg", children: "View booking" }) })] }));
}
export function ComparisonTable({ packages }) {
    if (!packages.length)
        return null;
    const rows = ['Home collection', 'Digital reports', 'WhatsApp updates', 'Member 30% off', 'Family coverage'];
    return (_jsxs("section", { className: "overflow-hidden rounded-2xl border border-line bg-white", children: [_jsxs("div", { className: "border-b border-line px-6 py-5", children: [_jsx("h2", { className: "font-display text-2xl", children: "Compare health packages" }), _jsx("p", { className: "mt-1 text-sm text-ink-soft", children: "All packages include free home collection for HealthID Card members" })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full min-w-[640px] text-left text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-line bg-cream/80", children: [_jsx("th", { className: "px-6 py-3 font-medium text-ink-soft", children: "Benefit" }), packages.slice(0, 3).map((p) => (_jsx("th", { className: "px-4 py-3 font-display text-base text-teal-dark", children: p.name.replace(' Package', '').replace(' Checkup', '') }, p.id)))] }) }), _jsxs("tbody", { children: [_jsxs("tr", { className: "border-b border-line", children: [_jsx("td", { className: "px-6 py-3 text-ink-soft", children: "Price (member)" }), packages.slice(0, 3).map((p) => (_jsx("td", { className: "px-4 py-3 font-semibold", children: formatMoney(p.memberPrice ?? p.discountedPrice ?? p.price) }, p.id)))] }), rows.map((row) => (_jsxs("tr", { className: "border-b border-line last:border-0", children: [_jsx("td", { className: "px-6 py-3 text-ink-soft", children: row }), packages.slice(0, 3).map((p) => (_jsx("td", { className: "px-4 py-3 text-success", children: "\u2713 Included" }, p.id)))] }, row)))] })] }) })] }));
}
