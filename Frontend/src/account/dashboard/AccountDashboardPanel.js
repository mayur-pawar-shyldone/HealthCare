import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function AccountDashboardPanel({ title, subtitle, action, children, className = '' }) {
    return (_jsxs("section", { className: `rounded-[20px] bg-white p-3.5 sm:p-4 ${className}`, children: [(title || action) && (_jsxs("div", { className: "mb-3 flex items-start justify-between gap-2", children: [_jsxs("div", { children: [title ? _jsx("h2", { className: "text-lg font-bold tracking-tight text-brick", children: title }) : null, subtitle ? _jsx("p", { className: "mt-0.5 text-[13px] text-muted", children: subtitle }) : null] }), action] })), children] }));
}
