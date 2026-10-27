import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
export const Input = forwardRef(function Input({ label, error, className, id, ...props }, ref) {
    const inputId = id ?? props.name;
    return (_jsxs("label", { className: "block space-y-2", children: [label ? _jsx("span", { className: "text-sm font-semibold text-ink/80", children: label }) : null, _jsx("input", { id: inputId, ref: ref, className: cn('w-full rounded-2xl border border-line/80 bg-white/90 px-4 py-3.5 text-ink shadow-sm outline-none transition', 'placeholder:text-ink-soft/60 focus:border-teal focus:bg-white focus:shadow-[0_0_0_4px_rgba(26,77,109,0.08)]', error && 'border-danger focus:shadow-[0_0_0_4px_rgba(224,58,40,0.1)]', className), ...props }), error ? _jsx("span", { className: "text-xs font-medium text-danger", children: error }) : null] }));
});
