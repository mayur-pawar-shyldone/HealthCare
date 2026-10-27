import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarCheck, ChevronDown, CreditCard, FileText, LayoutGrid, LogOut, UserRound, Users } from 'lucide-react';
import { useAccount } from '@/account/AccountContext';
import { memberInitials, memberShortName } from '@/account/dashboard/mp-utils';
import { useBookingCart } from '@/cart/BookingCartContext';
export function LandingProfileMenu() {
    const acc = useAccount();
    const cart = useBookingCart();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);
    useEffect(() => {
        if (!open)
            return;
        const onDoc = (e) => {
            if (!rootRef.current?.contains(e.target))
                setOpen(false);
        };
        const onKey = (e) => {
            if (e.key === 'Escape')
                setOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDoc);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);
    if (!acc.authed)
        return null;
    const firstName = memberShortName(acc.name);
    function logout() {
        cart.clearCart();
        acc.logout();
        setOpen(false);
        navigate('/');
    }
    const links = [
        { to: '/account/dashboard', label: 'Dashboard', icon: LayoutGrid },
        { to: '/account/bookings', label: 'My Bookings', icon: CalendarCheck },
        { to: '/account/reports', label: 'Reports', icon: FileText },
        { to: '/account/dashboard#card-wallet', label: 'My HealthID Card', icon: CreditCard },
        { to: '/account/dashboard#card-family', label: 'Family Members', icon: Users },
        { to: '/account/profile', label: 'Profile & Settings', icon: UserRound },
    ];
    return (_jsxs("div", { ref: rootRef, className: "relative", children: [_jsxs("button", { type: "button", "aria-expanded": open, "aria-haspopup": "menu", onClick: () => setOpen((v) => !v), className: "inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white py-1.5 pl-1.5 pr-3 transition hover:border-brand-300", children: [_jsx("span", { className: "grid h-8 w-8 place-items-center rounded-full bg-navy text-xs font-bold text-white", children: memberInitials(acc.name) }), _jsx("span", { className: "hidden max-w-[120px] truncate text-[13px] font-bold text-ink sm:block", children: firstName }), _jsx(ChevronDown, { className: `h-4 w-4 text-muted transition ${open ? 'rotate-180' : ''}`, "aria-hidden": true })] }), open ? (_jsxs("div", { role: "menu", className: "absolute right-0 z-[60] mt-2 w-[240px] overflow-hidden rounded-2xl border border-line bg-white py-1 shadow-[0_16px_48px_-20px_rgba(16,52,74,0.35)]", children: [_jsxs("div", { className: "border-b border-line px-4 py-3", children: [_jsx("p", { className: "text-sm font-bold text-ink", children: acc.name }), _jsx("p", { className: "text-[12px] text-ink-muted", children: acc.memberId() })] }), _jsx("ul", { className: "py-1", children: links.map(({ to, label, icon: Icon }) => (_jsx("li", { children: _jsxs(Link, { role: "menuitem", to: to, onClick: () => setOpen(false), className: "flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] font-semibold text-ink transition hover:bg-brand-50 hover:text-brand-600", children: [_jsx(Icon, { className: "h-4 w-4 shrink-0 opacity-70", "aria-hidden": true }), label] }) }, to + label))) }), _jsx("div", { className: "border-t border-line p-1", children: _jsxs("button", { type: "button", role: "menuitem", onClick: logout, className: "flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-[13.5px] font-semibold text-coral transition hover:bg-coral/10", children: [_jsx(LogOut, { className: "h-4 w-4", "aria-hidden": true }), "Logout"] }) })] })) : null] }));
}
