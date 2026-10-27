import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FileSearch } from 'lucide-react';
import { Button } from './Button';
export function EmptyState({ title, body, action }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center", children: [_jsx(FileSearch, { className: "mb-4 h-10 w-10 text-teal" }), _jsx("h3", { className: "font-display text-xl", children: title }), _jsx("p", { className: "mt-2 max-w-sm text-sm text-ink-soft", children: body }), action ? (_jsx(Button, { className: "mt-5", onClick: action.onClick, children: action.label })) : null] }));
}
