import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Barcode, MessageCircle, Smartphone, UserCheck } from 'lucide-react';
const ICONS = {
    smartphone: Smartphone,
    userCheck: UserCheck,
    barcode: Barcode,
    message: MessageCircle,
};
/** HealthID `sg` */
export function JourneyStepIcon({ icon, index }) {
    const Icon = ICONS[icon];
    return (_jsxs("span", { className: "relative flex h-[88px] w-[88px] items-center justify-center rounded-full bg-brand-100 ring-8 ring-white", children: [_jsx(Icon, { className: "h-8 w-8 text-brand-600", strokeWidth: 1.75, "aria-hidden": true }), _jsx("span", { className: "absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[12px] font-bold text-white", children: index + 1 })] }));
}
