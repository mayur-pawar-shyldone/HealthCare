import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
export function Logo({ variant = 'full', onDark = false, className }) {
    if (variant === 'icon') {
        return (_jsx("img", { src: "/logo.webp", alt: "HealthID Card", className: cn('h-10 w-10 object-contain', className) }));
    }
    const logo = (_jsx("img", { src: "/logo.webp", alt: "HealthID Card \u2014 Care Beyond Borders", className: cn(variant === 'compact' ? 'h-10 w-auto max-w-[190px] object-contain' : 'h-14 w-auto max-w-[320px] object-contain', className) }));
    if (onDark) {
        return (_jsx("div", { className: cn('inline-flex rounded-2xl bg-white px-3 py-2 shadow-sm', className), children: logo }));
    }
    return logo;
}
export function LogoImage({ className }) {
    return _jsx("img", { src: "/logo.webp", alt: "HealthID Card", className: className });
}
