import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
export function UserPage({ children, className }) {
    return _jsx("div", { className: cn('w-full space-y-6', className), children: children });
}
export function UserPageHeader({ title, subtitle, actions }) {
    return (_jsxs("div", { className: "page-head", children: [_jsxs("div", { children: [_jsx("h1", { children: title }), subtitle ? _jsx("p", { children: subtitle }) : null] }), actions ? _jsx("div", { className: "flex flex-wrap gap-2", children: actions }) : null] }));
}
export function UserPanel({ title, subtitle, children, className }) {
    return (_jsxs("div", { className: cn('glass-panel rounded-3xl p-5 md:p-6', className), children: [title ? _jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-ink-soft", children: title }) : null, subtitle ? _jsx("p", { className: "mt-1 text-sm text-ink-soft", children: subtitle }) : null, _jsx("div", { className: title || subtitle ? 'mt-4' : undefined, children: children })] }));
}
export function UserStatCard({ label, value, hint }) {
    return (_jsxs("div", { className: "glass-panel rounded-3xl p-5", children: [_jsx("p", { className: "text-[11px] font-bold uppercase tracking-wider text-ink-soft", children: label }), _jsx("p", { className: "mt-2 font-display text-2xl text-ink", children: value }), hint ? _jsx("p", { className: "mt-1 text-xs text-ink-soft", children: hint }) : null] }));
}
export function UserToolbar({ children }) {
    return _jsx("div", { className: "glass-panel flex flex-wrap items-center gap-3 rounded-2xl p-3 md:p-4", children: children });
}
export function UserSearch({ value, onChange, placeholder = 'Search…', onSubmit, }) {
    if (onSubmit) {
        return (_jsxs("form", { onSubmit: (e) => {
                e.preventDefault();
                const q = new FormData(e.currentTarget).get('q');
                onSubmit(String(q ?? ''));
            }, className: "glass-panel flex items-center gap-3 rounded-2xl px-4 py-1", children: [_jsx(Search, { className: "h-4 w-4 shrink-0 text-teal" }), _jsx("input", { name: "q", defaultValue: value, placeholder: placeholder, className: "min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-ink-soft/60" }), _jsx(Button, { type: "submit", size: "sm", className: "rounded-xl", children: "Search" })] }));
    }
    return (_jsxs("div", { className: "relative min-w-[200px] flex-1", children: [_jsx(Search, { className: "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" }), _jsx("input", { type: "search", value: value, onChange: (e) => onChange?.(e.target.value), placeholder: placeholder, className: "w-full rounded-xl border border-line/80 bg-white/90 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-teal focus:shadow-[0_0_0_4px_rgba(26,77,109,0.08)]" })] }));
}
export function UserChip({ active, children, onClick }) {
    return (_jsx("button", { type: "button", onClick: onClick, className: cn('shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition', active ? 'bg-teal text-white shadow-sm' : 'border border-line/80 bg-white/80 text-ink-soft hover:border-teal/40 hover:text-teal'), children: children }));
}
export function UserSection({ title, action, children }) {
    return (_jsxs("section", { children: [_jsxs("div", { className: "mb-3 flex items-end justify-between gap-3", children: [_jsx("h2", { className: "font-display text-xl text-ink", children: title }), action] }), children] }));
}
export function UserQuickLink({ to, label }) {
    return (_jsxs(Link, { to: to, className: "flex items-center justify-between rounded-2xl border border-line/60 bg-white/60 px-4 py-3.5 text-sm font-semibold text-ink transition hover:border-teal/40 hover:bg-teal-light/40 hover:text-teal", children: [label, _jsx("span", { className: "text-teal", children: "\u2192" })] }));
}
export function UserPagination({ page, pages, onPage, }) {
    if (pages <= 1)
        return null;
    return (_jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx(Button, { size: "sm", variant: "secondary", className: "rounded-xl", disabled: page <= 1, onClick: () => onPage(page - 1), children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), _jsxs("span", { className: "min-w-[100px] text-center text-sm text-ink-soft", children: ["Page ", page, " of ", pages] }), _jsx(Button, { size: "sm", variant: "secondary", className: "rounded-xl", disabled: page >= pages, onClick: () => onPage(page + 1), children: _jsx(ChevronRight, { className: "h-4 w-4" }) })] }));
}
export function UserSelect({ value, onChange, children, className, }) {
    return (_jsx("select", { value: value, onChange: (e) => onChange(e.target.value), className: cn('rounded-xl border border-line/80 bg-white/90 px-4 py-2.5 text-sm font-medium shadow-sm outline-none transition focus:border-teal focus:shadow-[0_0_0_4px_rgba(26,77,109,0.08)]', className), children: children }));
}
export function UserTable({ children }) {
    return (_jsx("div", { className: "glass-panel overflow-hidden rounded-3xl p-0", children: _jsx("div", { className: "overflow-x-auto", children: children }) }));
}
export function UserTHead({ children }) {
    return (_jsx("thead", { children: _jsx("tr", { className: "border-b border-line/60 bg-gradient-to-r from-teal/[0.08] to-cream/80 text-[11px] font-bold uppercase tracking-wider text-ink-soft", children: children }) }));
}
export function UserTh({ children, className }) {
    return _jsx("th", { className: cn('px-4 py-3.5 md:px-5', className), children: children });
}
export function UserTr({ children, className }) {
    return _jsx("tr", { className: cn('border-b border-line/40 transition hover:bg-teal-light/30', className), children: children });
}
export function UserTd({ children, className }) {
    return _jsx("td", { className: cn('px-4 py-3.5 md:px-5', className), children: children });
}
export function UserBadge({ children, tone = 'default', }) {
    const tones = {
        default: 'bg-ink/5 text-ink-soft',
        success: 'bg-emerald-50 text-success',
        warn: 'bg-amber-50 text-amber-800',
        danger: 'bg-brand-red-light text-brand-red',
        teal: 'bg-teal-light text-teal-dark',
    };
    return (_jsx("span", { className: cn('inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide', tones[tone]), children: children }));
}
export function UserEmptyRow({ colSpan, message }) {
    return (_jsx("tr", { children: _jsx("td", { colSpan: colSpan, className: "px-5 py-14 text-center text-sm text-ink-soft", children: message }) }));
}
