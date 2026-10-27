import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Loading({ label = 'Loading' }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center gap-4 py-20", children: [_jsxs("div", { className: "relative h-12 w-12", children: [_jsx("div", { className: "absolute inset-0 rounded-full border-2 border-teal/20" }), _jsx("div", { className: "absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-teal" }), _jsx("div", { className: "absolute inset-2 rounded-full bg-teal-light/50" })] }), _jsx("p", { className: "text-sm font-medium text-ink-soft", children: label })] }));
}
export function Skeleton({ className }) {
    return _jsx("div", { className: `animate-pulse rounded-2xl bg-gradient-to-r from-line/50 via-line/30 to-line/50 ${className ?? 'h-24'}` });
}
