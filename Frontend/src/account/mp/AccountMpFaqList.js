import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ACCOUNT_FAQS, ACCOUNT_FAQ_CATEGORIES } from '@/account/account-data';
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel';
export function AccountMpFaqList({ query }) {
    const [category, setCategory] = useState('All');
    const [openId, setOpenId] = useState(null);
    const q = query.trim().toLowerCase();
    const visible = ACCOUNT_FAQS.filter((f) => (category === 'All' || f.category === category) &&
        (!q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)));
    return (_jsxs(AccountDashboardPanel, { title: "Common questions", children: [_jsx("div", { className: "flex flex-wrap gap-2", role: "group", "aria-label": "Filter questions", children: ACCOUNT_FAQ_CATEGORIES.map((c) => (_jsx("button", { type: "button", "aria-pressed": category === c, onClick: () => setCategory(c), className: `rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150 ${category === c ? 'bg-navy text-white' : 'bg-mp-teal-50 text-muted hover:text-navy'}`, children: c }, c))) }), _jsxs("ul", { className: "mt-4 divide-y divide-line", children: [visible.map((f) => {
                        const open = openId === f.id;
                        return (_jsxs("li", { children: [_jsxs("button", { type: "button", "aria-expanded": open, onClick: () => setOpenId(open ? null : f.id), className: "flex w-full items-center gap-3 py-3.5 text-left", children: [_jsxs("span", { className: "flex-1", children: [_jsx("span", { className: "block text-xs text-mp-teal-700", children: f.category }), _jsx("span", { className: "block text-sm font-semibold text-navy", children: f.q })] }), _jsx(ChevronDown, { className: `h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`, "aria-hidden": true })] }), _jsx(AnimatePresence, { initial: false, children: open ? (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] }, className: "overflow-hidden", children: _jsx("p", { className: "pb-3.5 pr-8 text-[13px] leading-relaxed text-muted", children: f.a }) })) : null })] }, f.id));
                    }), visible.length === 0 ? (_jsxs("li", { className: "py-10 text-center text-muted", children: ["No answers match \"", query, "\". Try another word or talk to us."] })) : null] })] }));
}
