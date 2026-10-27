import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { AYURVEDA_VERTICALS, DOCTOR_VERTICALS, LANDING_NAV_CATEGORIES, PHARMACY_VERTICALS, } from '@/data/landing-nav-data';
import { HealthVerticalPanel } from '@/components/landing/HealthVerticalPanel';
import { RadMenu } from '@/components/landing/RadMenu';
export function LandingCategoryMenu() {
    const [openId, setOpenId] = useState(null);
    const closeTimer = useRef(null);
    const rootRef = useRef(null);
    const dropRef = useRef(null);
    const reduceMotion = useReducedMotion();
    const active = LANDING_NAV_CATEGORIES.find((c) => c.id === openId) ?? null;
    const clearCloseTimer = () => {
        if (closeTimer.current !== null) {
            window.clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
    };
    const openCategory = (id) => {
        clearCloseTimer();
        setOpenId(id);
    };
    const scheduleClose = () => {
        clearCloseTimer();
        closeTimer.current = window.setTimeout(() => setOpenId(null), 120);
    };
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape')
                setOpenId(null);
        };
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('keydown', onKey);
            clearCloseTimer();
        };
    }, []);
    useEffect(() => {
        if (!openId)
            return;
        const backdrop = document.createElement('div');
        backdrop.className = 'menu-backdrop';
        const close = () => setOpenId(null);
        backdrop.addEventListener('click', close);
        backdrop.addEventListener('mouseenter', close);
        document.body.appendChild(backdrop);
        return () => {
            backdrop.removeEventListener('click', close);
            backdrop.removeEventListener('mouseenter', close);
            backdrop.remove();
        };
    }, [openId]);
    useEffect(() => {
        if (!openId)
            return;
        const onMove = (e) => {
            const drop = dropRef.current;
            const nav = rootRef.current;
            if (!drop || !nav)
                return;
            const dropR = drop.getBoundingClientRect();
            const navR = nav.getBoundingClientRect();
            const { clientX: x, clientY: y } = e;
            const inDrop = x >= dropR.left && x <= dropR.right && y >= dropR.top && y <= dropR.bottom;
            const inNav = x >= navR.left && x <= navR.right && y >= navR.top && y <= navR.bottom;
            if (!inDrop && !inNav)
                scheduleClose();
        };
        document.addEventListener('mousemove', onMove);
        return () => document.removeEventListener('mousemove', onMove);
    }, [openId]);
    const closeMenu = () => setOpenId(null);
    return (_jsxs("div", { id: "categories-nav", ref: rootRef, className: "relative border-t border-white/10 bg-gradient-to-r from-brand-700 via-ink to-brand-700", onMouseLeave: scheduleClose, onBlur: (e) => {
            if (!rootRef.current?.contains(e.relatedTarget))
                setOpenId(null);
        }, children: [_jsx("div", { className: "mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 no-scrollbar md:px-6", children: LANDING_NAV_CATEGORIES.map((cat) => {
                    const open = openId === cat.id;
                    return (_jsx("div", { className: "shrink-0", children: _jsxs("button", { type: "button", onMouseEnter: () => openCategory(cat.id), onFocus: () => openCategory(cat.id), onClick: () => setOpenId(open ? null : cat.id), "aria-expanded": open, "aria-haspopup": "true", className: `relative flex h-12 items-center gap-1.5 px-3 text-[14.5px] font-semibold transition-colors duration-150 ${open ? 'text-white' : 'text-white/80 hover:text-white'}`, children: [cat.label, cat.badge ? (_jsx("span", { className: "rounded-full bg-brand-red-light px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-red", children: cat.badge })) : null, _jsx(ChevronDown, { className: `h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`, "aria-hidden": true }), _jsx("span", { className: `absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-white transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`, "aria-hidden": true })] }) }, cat.id));
                }) }), _jsx(AnimatePresence, { children: active ? (_jsx(motion.div, { initial: reduceMotion ? false : { opacity: 0, y: -6 }, animate: { opacity: 1, y: 0 }, exit: reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }, transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] }, className: "pointer-events-none absolute inset-x-0 top-full z-40 px-4 pb-6 md:px-6", onMouseEnter: clearCloseTimer, children: _jsx("div", { ref: dropRef, className: "menu-drop pointer-events-auto mx-auto max-w-7xl", children: active.id === 'radiology' ? (_jsx(RadMenu, { onNavigate: closeMenu })) : active.id === 'blood-test' ? (_jsx(HealthVerticalPanel, { compact: true, browseCategoryId: "blood-test", onNavigate: closeMenu })) : active.id === 'ecg' ? (_jsx(HealthVerticalPanel, { compact: true, browseCategoryId: "ecg", onNavigate: closeMenu, defaultActiveId: "heart" })) : active.id === 'doctor' ? (_jsx(HealthVerticalPanel, { compact: true, browseCategoryId: "doctor", onNavigate: closeMenu, verticals: DOCTOR_VERTICALS, defaultActiveId: "doc-gp-care", sidebarEyebrow: "Browse consult types", sidebarBadge: "Licensed doctors \u2022 Video consults", packageCountLabel: "consult options" })) : active.id === 'ayurveda' ? (_jsx(HealthVerticalPanel, { compact: true, browseCategoryId: "ayurveda", onNavigate: closeMenu, verticals: AYURVEDA_VERTICALS, defaultActiveId: "ayu-consult-root", sidebarEyebrow: "Browse wellness paths", sidebarBadge: "Authentic Ayurveda \u2022 Personal plans", packageCountLabel: "wellness plans" })) : active.id === 'pharmacy' ? (_jsx(HealthVerticalPanel, { compact: true, browseCategoryId: "pharmacy", onNavigate: closeMenu, verticals: PHARMACY_VERTICALS, defaultActiveId: "ph-rx", sidebarEyebrow: "Browse categories", sidebarBadge: "Licensed pharmacies \u2022 Launching soon", packageCountLabel: "categories" })) : null }) }, active.id)) : null })] }));
}
