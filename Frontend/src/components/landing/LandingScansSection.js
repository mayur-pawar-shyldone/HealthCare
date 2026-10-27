import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, ChevronDown, ScanLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SCAN_TESTS } from '@/data/landing-scans-data';
import { bookStartUrl } from '@/booking/booking-url';
import api, { unwrap } from '@/services/api';
import { testIncludes, testMemberPrice } from '@/lib/catalog';
const SCAN_IMAGES = SCAN_TESTS.map((t) => t.image);
function toScanCard(test, index) {
    const match = SCAN_TESTS.find((s) => test.name.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(test.name.toLowerCase()));
    const includes = testIncludes(test);
    return {
        id: test.id,
        name: test.name,
        originalPrice: Number(test.price),
        offerPrice: testMemberPrice(test),
        description: test.shortDescription || test.description || '',
        features: includes.slice(0, 3).length
            ? includes.slice(0, 3)
            : [test.preparation, test.sampleType].filter(Boolean),
        image: match?.image || SCAN_IMAGES[index % SCAN_IMAGES.length] || '/landing/scans/ultrasound.webp',
    };
}
function ScanBottomSheetCard({ test }) {
    const [open, setOpen] = useState(false);
    const reduceMotion = useReducedMotion();
    const togglePointer = (pointerType) => {
        if (pointerType !== 'mouse')
            setOpen((s) => !s);
    };
    const bookTo = bookStartUrl({
        id: test.id,
        name: test.name,
        memberPrice: test.offerPrice,
        mrp: test.originalPrice,
        testCount: 1,
    });
    return (_jsxs("article", { className: "group relative h-[420px] overflow-hidden rounded-[26px] bg-ink", onMouseEnter: () => setOpen(true), onMouseLeave: () => setOpen(false), onFocus: () => setOpen(true), onBlur: () => setOpen(false), onPointerDown: (e) => togglePointer(e.pointerType), tabIndex: 0, "aria-expanded": open, "aria-label": `${test.name}, starting at ₹${test.offerPrice}`, children: [_jsx(motion.img, { src: test.image, alt: test.name, className: "absolute inset-0 h-full w-full object-cover", animate: reduceMotion ? undefined : { scale: open ? 1.05 : 1 }, transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] } }), _jsx("div", { className: "absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/85 via-ink/45 to-transparent" }), _jsxs("div", { className: "absolute inset-x-0 bottom-0 rounded-t-[26px] bg-white p-5", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-display text-[19px] font-bold text-ink", children: test.name }), _jsxs("p", { className: "mt-0.5 text-[14px]", children: [_jsxs("span", { className: "mr-2 text-ink-muted line-through", children: ["\u20B9", test.originalPrice] }), _jsxs("span", { className: "text-[19px] font-bold text-brand-600", children: ["\u20B9", test.offerPrice] })] })] }), _jsx(motion.span, { className: "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mint text-ink-soft", animate: reduceMotion ? undefined : { rotate: open ? 180 : 0 }, transition: { duration: 0.2, ease: 'easeOut' }, "aria-hidden": true, children: _jsx(ChevronDown, { className: "h-4 w-4" }) })] }), _jsx(AnimatePresence, { initial: false, children: open ? (_jsxs(motion.div, { initial: reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }, animate: reduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }, exit: reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }, transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] }, className: "overflow-hidden", children: [_jsx("p", { className: "mt-3 line-clamp-3 text-[13px] leading-relaxed text-ink-soft", children: test.description }), _jsx("ul", { className: "mt-3 space-y-1.5", children: test.features.map((f) => (_jsxs("li", { className: "flex items-start gap-2 text-[13px] leading-snug text-ink-soft", children: [_jsx("span", { className: "mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-coral-soft", children: _jsx(Check, { className: "h-2 w-2 text-coral-dark", "aria-hidden": true }) }), f] }, f))) }), _jsx(Link, { to: bookTo, className: "mt-4 block w-full rounded-xl bg-brand-600 py-2.5 text-center text-[14px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-brand-700", children: "Book Now" })] }, "details")) : null })] })] }));
}
export function LandingScansSection() {
    const { data, isLoading } = useQuery({
        queryKey: ['tests', 'popular'],
        queryFn: async () => unwrap((await api.get('/tests', { params: { popular: 'true' } })).data),
    });
    const scans = useMemo(() => (data ?? []).slice(0, 6).map(toScanCard), [data]);
    return (_jsx("section", { id: "scans", className: "relative overflow-hidden bg-mint py-20", "aria-labelledby": "scans-heading", children: _jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [_jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [_jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-brand-600", children: [_jsx(ScanLine, { className: "h-3.5 w-3.5", "aria-hidden": true }), "Imaging & scans"] }), _jsx("h2", { id: "scans-heading", className: "mt-4 font-display text-[30px] font-extrabold leading-tight tracking-tight text-ink sm:text-[36px]", children: "Health Scans & Imaging Tests" }), _jsx("p", { className: "mt-4 text-[16px] leading-relaxed text-ink-soft", children: "Popular tests at member prices in Nashik \u2014 hover a card to see details and book." })] }), isLoading ? (_jsx("p", { className: "mt-14 text-center text-sm font-semibold text-ink-soft", children: "Loading tests from the lab\u2026" })) : scans.length ? (_jsx("div", { className: "mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3", children: scans.map((test) => (_jsx(ScanBottomSheetCard, { test: test }, test.id))) })) : (_jsx("p", { className: "mx-auto mt-14 max-w-xl rounded-2xl border border-dashed border-line bg-white px-6 py-12 text-center text-sm font-semibold text-ink-soft", children: "No popular tests are listed yet." }))] }) }));
}
