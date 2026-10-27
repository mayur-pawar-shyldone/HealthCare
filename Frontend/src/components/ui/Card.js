import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
export function Card({ children, className, glass }) {
    return (_jsx("div", { className: cn(glass ? 'glass-panel rounded-3xl' : 'card-premium rounded-3xl', className), children: children }));
}
