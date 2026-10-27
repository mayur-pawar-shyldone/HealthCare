import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { bookStartUrl } from '@/booking/booking-url';
import { formatMoney } from '@/lib/utils';
export function PackagePreviewCard({ pkg, onAction }) {
    const save = pkg.mrp > 0 ? Math.round(((pkg.mrp - pkg.price) / pkg.mrp) * 100) : 0;
    const comingSoon = pkg.price <= 0;
    return (_jsxs("article", { className: "group flex h-full flex-col rounded-[22px] border border-ink/10 bg-white p-2.5 transition duration-200 ease-out hover:-translate-y-1 hover:border-teal/30 hover:shadow-[0_12px_32px_rgba(16,52,74,0.12)]", children: [_jsxs("div", { className: "relative flex min-h-[112px] flex-col rounded-[16px] bg-[#f4f8fb] p-4", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [pkg.tag ? (_jsx("span", { className: "rounded-full bg-teal px-2.5 py-1 text-[11px] font-semibold text-white", children: pkg.tag })) : (_jsx("span", { className: "rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-ink-soft", children: "Member rate" })), _jsx("span", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-white text-teal shadow-sm", children: _jsx(Activity, { className: "h-4 w-4", "aria-hidden": true }) })] }), _jsx("h4", { className: "mt-3 font-display text-[15px] font-bold leading-snug text-ink", children: pkg.name }), _jsx("p", { className: "mt-1 text-[12px] text-ink-soft", children: pkg.tests > 0 ? `${pkg.tests} tests · ${pkg.reportIn}` : pkg.reportIn })] }), _jsxs("div", { className: "mt-3 flex flex-1 flex-col px-1 pb-1", children: [_jsx("div", { className: "flex items-baseline gap-2", children: comingSoon ? (_jsx("span", { className: "text-lg font-bold text-ink-soft", children: "Coming soon" })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-xl font-bold text-brand-red", children: formatMoney(pkg.price) }), _jsx("span", { className: "text-sm text-ink-soft line-through", children: formatMoney(pkg.mrp) })] })) }), !comingSoon && save > 0 ? (_jsxs("p", { className: "mt-1 text-[11px] font-semibold text-success", children: ["Save ", save, "% vs MRP"] })) : null, comingSoon ? (_jsx("span", { className: "mt-4 inline-flex h-10 items-center justify-center rounded-full border border-line text-sm font-semibold text-ink-soft", children: "Notify me" })) : (_jsxs(Link, { to: bookStartUrl({
                            id: pkg.id,
                            name: pkg.name,
                            memberPrice: pkg.price,
                            mrp: pkg.mrp,
                            testCount: pkg.tests,
                        }), onClick: onAction, className: "mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition hover:bg-teal-dark", children: ["Book", _jsx(ArrowRight, { className: "h-3.5 w-3.5", "aria-hidden": true })] }))] })] }));
}
