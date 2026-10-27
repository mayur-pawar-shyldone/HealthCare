import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { useAccount } from '@/account/AccountContext';
import { AccountMpSidebar } from '@/account/mp/AccountMpSidebar';
import { AccountMpTopbar } from '@/account/mp/AccountMpTopbar';
import { accountMpReminder } from '@/account/mp/account-mp-reminder';
/** Magic Patterns account shell — matches reference screenshots. */
export function AccountShell() {
    const acc = useAccount();
    const [menuOpen, setMenuOpen] = useState(false);
    const reminder = accountMpReminder(acc);
    return (_jsxs("div", { className: "account-mp-root flex min-h-full w-full bg-canvas", children: [_jsx("aside", { className: "sticky top-0 hidden h-screen w-[260px] shrink-0 border-r border-line lg:block", children: _jsx(AccountMpSidebar, {}) }), _jsx(AnimatePresence, { children: menuOpen ? (_jsxs(_Fragment, { children: [_jsx(motion.div, { className: "fixed inset-0 z-40 bg-navy/40 lg:hidden", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 }, onClick: () => setMenuOpen(false) }), _jsx(motion.aside, { className: "fixed inset-y-0 left-0 z-50 w-[290px] bg-white shadow-xl lg:hidden", initial: { x: -300 }, animate: { x: 0 }, exit: { x: -300 }, transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] }, children: _jsx(AccountMpSidebar, { onNavigate: () => setMenuOpen(false) }) })] })) : null }), _jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [reminder ? (_jsxs("div", { role: "status", className: "flex items-start gap-2 bg-alert-bg px-4 py-2 text-sm text-alert-text lg:px-6", children: [_jsx(Info, { className: "mt-0.5 h-4 w-4 shrink-0", "aria-hidden": true }), _jsx("span", { children: reminder })] })) : null, _jsx(AccountMpTopbar, { onMenu: () => setMenuOpen(true) }), _jsx("main", { className: "account-mp-main flex-1 overflow-y-auto px-4 py-4 lg:px-5 lg:py-4", children: _jsx("div", { className: "shell account-mp-legacy-wrap account-dashboard-mp mx-auto w-full max-w-[1180px] text-[14px] leading-snug", children: _jsx(Outlet, {}) }) }), _jsx("footer", { className: "border-t border-line bg-white py-3 text-center text-sm text-muted", children: "\u00A9 2026 HealthIDCard \u00B7 Care beyond borders" })] }), acc.toast ? _jsx("div", { className: "toast", children: acc.toast }) : null] }));
}
