import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function IconGrid() {
    return (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": true, children: [_jsx("rect", { x: "3", y: "3", width: "7", height: "7" }), _jsx("rect", { x: "14", y: "3", width: "7", height: "7" }), _jsx("rect", { x: "3", y: "14", width: "7", height: "7" }), _jsx("rect", { x: "14", y: "14", width: "7", height: "7" })] }));
}
export function IconCard() {
    return (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": true, children: [_jsx("rect", { x: "3", y: "5", width: "18", height: "14", rx: "2" }), _jsx("path", { d: "M3 10h18" })] }));
}
export function IconUsers() {
    return (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": true, children: [_jsx("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }), _jsx("circle", { cx: "9", cy: "7", r: "4" }), _jsx("path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }), _jsx("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })] }));
}
export function IconCal() {
    return (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": true, children: [_jsx("rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }), _jsx("path", { d: "M3 10h18M8 3v4M16 3v4" })] }));
}
export function IconFile() {
    return (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": true, children: [_jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), _jsx("path", { d: "M14 2v6h6" })] }));
}
export function IconUser() {
    return (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": true, children: [_jsx("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }), _jsx("circle", { cx: "12", cy: "7", r: "4" })] }));
}
export function IconHelp() {
    return (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": true, children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("path", { d: "M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4" }), _jsx("path", { d: "M12 17h.01" })] }));
}
export function IconTube() {
    return (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": true, children: [_jsx("path", { d: "M14.5 2v17.5a2.5 2.5 0 0 1-5 0V2" }), _jsx("path", { d: "M8.5 2h7M14.5 16h-5" })] }));
}
export function IconSearch() {
    return (_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": true, children: [_jsx("circle", { cx: "11", cy: "11", r: "8" }), _jsx("path", { d: "m21 21-4.3-4.3" })] }));
}
export const ACCOUNT_NAV = [
    { href: '/account/dashboard', label: 'Dashboard', icon: _jsx(IconGrid, {}) },
    { href: '/account/bookings', label: 'My Bookings', icon: _jsx(IconCal, {}) },
    { href: '/account/reports', label: 'Reports & Records', icon: _jsx(IconFile, {}) },
    { href: '/account/catalogue', label: 'Book a test', icon: _jsx(IconTube, {}) },
    { href: '/account/profile', label: 'Profile & Settings', icon: _jsx(IconUser, {}) },
    { href: '/account/support', label: 'Help & Support', icon: _jsx(IconHelp, {}) },
];
