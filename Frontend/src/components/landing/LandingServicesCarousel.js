import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LANDING_SERVICE_TILES } from '@/data/landing-services-data';
import { serviceBrowsePath } from '@/data/service-browse';
const TILE_BROWSE = {
    'blood-tests': 'blood-test',
    'full-body': 'blood-test',
    scans: 'radiology',
    consult: 'doctor',
    prescription: 'blood-test',
};
export function LandingServicesCarousel() {
    const scroller = useRef(null);
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(1);
    const measure = useCallback(() => {
        const el = scroller.current;
        if (!el)
            return;
        const nextPages = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth));
        setPages(nextPages);
        setPage(Math.round(el.scrollLeft / el.clientWidth));
    }, []);
    useEffect(() => {
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, [measure]);
    function scrollByPage(dir) {
        const el = scroller.current;
        if (!el)
            return;
        el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
    }
    function goToPage(p) {
        const el = scroller.current;
        if (!el)
            return;
        el.scrollTo({ left: p * el.clientWidth, behavior: 'smooth' });
    }
    return (_jsx("section", { id: "categories", className: "bg-white py-20", "aria-labelledby": "services-heading", children: _jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [_jsxs("div", { className: "flex flex-wrap items-end justify-between gap-6", children: [_jsxs("div", { className: "max-w-2xl", children: [_jsx("h2", { id: "services-heading", className: "font-display text-[32px] font-extrabold leading-tight tracking-tight text-ink sm:text-[38px]", children: "Start with what you're worried about" }), _jsx("p", { className: "mt-3 text-[16px] leading-relaxed text-ink-soft", children: "Every service is priced at the member rate, with the extra 30% applied at payment." })] }), _jsxs("div", { className: "hidden items-center gap-2 sm:flex", children: [_jsx("button", { type: "button", onClick: () => scrollByPage(-1), "aria-label": "Scroll services left", className: "flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:border-brand-300 hover:text-brand-600 active:scale-95", children: _jsx(ArrowLeft, { className: "h-5 w-5", "aria-hidden": true }) }), _jsx("button", { type: "button", onClick: () => scrollByPage(1), "aria-label": "Scroll services right", className: "flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:border-brand-300 hover:text-brand-600 active:scale-95", children: _jsx(ArrowRight, { className: "h-5 w-5", "aria-hidden": true }) })] })] }), _jsx("ul", { ref: scroller, onScroll: measure, className: "no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2", children: LANDING_SERVICE_TILES.map((item) => {
                        const browseId = TILE_BROWSE[item.id];
                        const browseTab = item.id === 'full-body' ? 'full-body' : undefined;
                        const tileClass = 'group block rounded-[24px] outline-none focus-visible:ring-4 focus-visible:ring-brand-100';
                        const inner = (_jsxs(_Fragment, { children: [_jsxs("div", { className: "relative overflow-hidden rounded-[24px] bg-mint", children: [_jsx("img", { src: item.image, alt: "", className: "aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.04]" }), _jsx("span", { className: "absolute inset-x-3 bottom-3 rounded-full bg-white/95 py-2 text-center text-[13px] font-bold text-brand-600 shadow-sm backdrop-blur transition group-hover:bg-coral group-hover:text-white", children: item.offer })] }), _jsxs("div", { className: "mt-3.5 flex items-start justify-between gap-2 px-1", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-display text-[15.5px] font-bold leading-snug text-ink", children: item.name }), _jsx("p", { className: "mt-0.5 text-[12.5px] text-ink-muted", children: item.meta })] }), _jsx(ChevronRight, { className: "mt-1 h-4 w-4 shrink-0 text-ink-muted transition group-hover:translate-x-0.5 group-hover:text-brand-500", "aria-hidden": true })] })] }));
                        return (_jsx("li", { className: "w-[184px] shrink-0 snap-start sm:w-[208px]", children: browseId ? (_jsx(Link, { to: serviceBrowsePath(browseId, browseTab), className: tileClass, children: inner })) : (_jsx("a", { href: "#popular-plans", className: tileClass, children: inner })) }, item.id));
                    }) }), pages > 1 ? (_jsx("div", { className: "mt-6 flex items-center justify-center gap-2", children: Array.from({ length: pages }).map((_, i) => (_jsx("button", { type: "button", onClick: () => goToPage(i), "aria-label": `Go to services page ${i + 1}`, "aria-current": i === page, className: `h-1.5 rounded-full transition-all duration-200 ${i === page ? 'w-8 bg-brand-500' : 'w-4 bg-ink/15 hover:bg-ink/30'}` }, i))) })) : null] }) }));
}
