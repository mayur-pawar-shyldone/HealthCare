import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarDays, FlaskConical, History, Home, LogOut, Plus, Search, UserRound, } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cn } from '@/lib/utils';
import { clearSession } from '@/store/authSlice';
import api, { unwrap } from '@/services/api';
import { NotifyBell } from '@/components/ui/SearchBar';
const navItems = [
    { to: '/home', label: 'Home', icon: Home, end: true },
    { to: '/tests', label: 'Tests & packages', icon: FlaskConical },
    { to: '/appointments', label: 'My bookings', icon: CalendarDays },
    { to: '/history', label: 'Reports & records', icon: History },
    { to: '/profile', label: 'Profile & settings', icon: UserRound },
];
const mobileNav = [
    { to: '/home', label: 'Home', icon: Home, end: true },
    { to: '/tests', label: 'Tests', icon: FlaskConical },
    { to: '/appointments/book', label: 'Book', icon: Plus, fab: true },
    { to: '/appointments', label: 'Bookings', icon: CalendarDays },
    { to: '/history', label: 'Reports', icon: History },
];
function NavItemLink({ item }) {
    const Icon = item.icon;
    return (_jsxs(NavLink, { to: item.to, end: item.end, className: ({ isActive }) => (isActive ? 'active' : undefined), children: [_jsx(Icon, { width: 18, height: 18, strokeWidth: 2 }), item.label] }));
}
export function AppShell() {
    const user = useSelector((s) => s.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const qc = useQueryClient();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQ, setSearchQ] = useState('');
    const unread = useQuery({
        queryKey: ['notifications-unread'],
        queryFn: async () => unwrap((await api.get('/notifications/unread-count')).data),
        staleTime: 30_000,
        refetchInterval: 60_000,
    });
    useEffect(() => {
        if (user?.id) {
            void qc.invalidateQueries({ queryKey: ['tests'] });
        }
    }, [user?.id, qc]);
    async function logout() {
        try {
            await api.post('/auth/logout', { refreshToken: localStorage.getItem('hc_refresh') });
        }
        finally {
            dispatch(clearSession());
            navigate('/login', { replace: true });
        }
    }
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
    function onSearch(e) {
        e.preventDefault();
        const q = searchQ.trim();
        if (!q)
            return;
        const recent = JSON.parse(localStorage.getItem('hc_recent_searches') || '[]');
        localStorage.setItem('hc_recent_searches', JSON.stringify([q, ...recent.filter((x) => x !== q)].slice(0, 6)));
        navigate(`/search?q=${encodeURIComponent(q)}`);
    }
    return (_jsxs("div", { className: "shell", children: [_jsx("div", { className: cn('backdrop', sidebarOpen && 'show'), onClick: () => setSidebarOpen(false), onKeyDown: () => undefined, role: "presentation" }), _jsxs("aside", { className: cn('sidebar', sidebarOpen && 'open'), children: [_jsx(NavLink, { to: "/home", onClick: () => setSidebarOpen(false), children: _jsx("img", { className: "logo", src: "/logo.webp", alt: "HealthIDCard" }) }), _jsxs(NavLink, { to: "/appointments/book", onClick: () => setSidebarOpen(false), className: "hid-btn hid-btn-coral hid-btn-block", style: { marginTop: 18, height: 42, fontSize: 13 }, children: [_jsx(Plus, { width: 16, height: 16 }), "Book a test"] }), _jsx("nav", { className: "nav", "aria-label": "Main navigation", children: navItems.map((item) => (_jsx(NavItemLink, { item: item }, item.to))) }), _jsxs("div", { className: "side-foot", children: [isAdmin ? (_jsx(NavLink, { to: "/admin", className: "linkish", style: { display: 'block', padding: '8px 12px', fontSize: 12 }, children: "Admin console \u2192" })) : null, _jsxs("button", { type: "button", onClick: logout, children: [_jsx(LogOut, { width: 18, height: 18 }), "Log out"] })] })] }), _jsxs("div", { className: "main", children: [_jsxs("header", { className: "topbar", children: [_jsx("button", { type: "button", className: "menu-btn", "aria-label": "Open menu", onClick: () => setSidebarOpen(true), children: "Menu" }), _jsxs("form", { className: "search", onSubmit: onSearch, children: [_jsx(Search, { width: 16, height: 16 }), _jsx("input", { name: "q", value: searchQ, onChange: (e) => setSearchQ(e.target.value), placeholder: "Search tests, bookings or reports" })] }), _jsxs("div", { className: "top-actions", children: [_jsx(NotifyBell, { count: unread.data?.count ?? 0, compact: true }), _jsxs(NavLink, { to: "/profile", className: "icon-btn", children: [_jsx(UserRound, { width: 16, height: 16 }), user?.fullName?.split(' ')[0]] })] })] }), _jsx("div", { className: "content pb-24 lg:pb-8", children: _jsx(Outlet, {}) })] }), _jsx("nav", { className: "fixed inset-x-2 bottom-2 z-30 lg:hidden", children: _jsx("div", { className: "flex items-end justify-around rounded-xl border border-[var(--hid-line)] bg-white px-0.5 py-1.5 shadow-[0_4px_20px_rgba(16,52,74,0.12)]", children: mobileNav.map((item) => {
                        const Icon = item.icon;
                        if ('fab' in item && item.fab) {
                            return (_jsx(NavLink, { to: item.to, className: "-mt-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-r from-[#e23d26] to-[#c22f1b] text-white shadow-md transition active:scale-95", children: _jsx(Icon, { className: "h-5 w-5", strokeWidth: 2.5 }) }, item.to));
                        }
                        return (_jsx(NavLink, { to: item.to, end: 'end' in item ? item.end : false, className: ({ isActive }) => cn('flex min-w-[48px] flex-col items-center gap-0.5 px-1 py-1 text-[9px] font-semibold', isActive ? 'text-[var(--hid-brand)]' : 'text-[var(--hid-muted)]'), children: ({ isActive }) => (_jsxs(_Fragment, { children: [_jsx(Icon, { className: "h-[18px] w-[18px]", strokeWidth: isActive ? 2.25 : 2 }), item.label] })) }, item.to));
                    }) }) })] }));
}
