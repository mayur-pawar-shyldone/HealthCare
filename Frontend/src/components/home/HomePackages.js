import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useHealthPackages } from '@/hooks/useHealthPackages';
import { PackageCard } from './PackageCard';
import { Loading } from '@/components/ui/Loading';
import { PLATFORM } from '@/data/platform-content';
import { PaymentDiscountBadge } from '@/components/brand/PaymentDiscountOffer';
export function HomePackages() {
    const packages = useHealthPackages();
    if (packages.isLoading)
        return _jsx(Loading, { label: "Loading health packages" });
    const list = packages.data ?? [];
    if (!list.length)
        return null;
    return (_jsxs("section", { "aria-labelledby": "home-packages-heading", children: [_jsxs("div", { className: "mb-5 flex items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("h2", { id: "home-packages-heading", className: "font-display text-xl text-ink md:text-2xl", children: "Diagnostic packages" }), _jsxs("p", { className: "mt-1 text-sm text-ink-soft", children: [PLATFORM.packageCount, " official packages \u00B7 Extra ", PLATFORM.membership.flatDiscount, "% off at payment \u00B7 Free home collection"] }), _jsx("div", { className: "mt-2", children: _jsx(PaymentDiscountBadge, { size: "sm" }) })] }), _jsxs(Link, { to: "/tests?packages=true", className: "flex items-center gap-0.5 text-sm font-semibold text-teal hover:underline", children: ["All ", list.length, " packages ", _jsx(ChevronRight, { className: "h-4 w-4" })] })] }), _jsx("div", { className: "-mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 scroll-smooth [scrollbar-width:thin]", children: list.map((pkg, i) => (_jsx("div", { className: "snap-start", children: _jsx(PackageCard, { pkg: pkg, accentIndex: i, compact: true, showIncluded: true }) }, pkg.id))) })] }));
}
