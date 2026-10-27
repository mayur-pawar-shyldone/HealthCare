import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { MapPin } from 'lucide-react';
import { useHealthPackages } from '@/hooks/useHealthPackages';
import { labTestToShowcase } from '@/lib/catalog';
import { LandingShowcaseCard } from '@/components/landing/LandingShowcaseCard';
function categoryTabId(category) {
    return `showcase-tab-${category.replace(/\s+/g, '-').toLowerCase()}`;
}
/** Member-priced package grid from the lab catalog */
export function LandingShowcaseSection() {
    const { data, isLoading } = useHealthPackages();
    const packages = useMemo(() => (data ?? []).map(labTestToShowcase), [data]);
    const categories = useMemo(() => {
        const names = [...new Set(packages.map((p) => p.category).filter(Boolean))];
        return names.length ? names : ['Packages'];
    }, [packages]);
    const [category, setCategory] = useState('');
    const active = category && categories.includes(category) ? category : categories[0];
    const visible = useMemo(() => packages.filter((p) => !active || p.category === active), [packages, active]);
    return (_jsx("section", { id: "popular-plans", className: "scroll-mt-28 bg-cream py-20", "aria-labelledby": "showcase-heading", children: _jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [_jsxs("header", { className: "flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between", children: [_jsxs("div", { className: "max-w-xl", children: [_jsxs("p", { className: "inline-flex items-center gap-1.5 text-[13px] font-bold text-teal", children: [_jsx(MapPin, { className: "h-4 w-4", "aria-hidden": true }), "Nashik \u00B7 home collection"] }), _jsx("h2", { id: "showcase-heading", className: "mt-3 font-editorial text-[32px] font-bold leading-[1.12] text-ink sm:text-[40px]", children: "Popular plans" }), _jsx("p", { className: "mt-3 text-[15px] leading-relaxed text-ink-soft", children: "Card holder rates below MRP, reports on WhatsApp, and one price per person for the whole family." })] }), categories.length > 1 ? (_jsx("div", { role: "tablist", "aria-label": "Package categories", className: "flex flex-wrap gap-2", children: categories.map((cat) => {
                                const on = cat === active;
                                return (_jsx("button", { type: "button", role: "tab", id: categoryTabId(cat), "aria-selected": on, "aria-controls": "showcase-grid", onClick: () => setCategory(cat), className: `rounded-full px-4 py-2 text-[13.5px] font-bold transition-colors duration-150 ease-out ${on ? 'bg-ink text-white' : 'border border-line bg-white text-ink-soft hover:text-ink'}`, children: cat }, cat));
                            }) })) : null] }), isLoading ? (_jsx("p", { className: "mt-10 text-sm font-semibold text-ink-soft", children: "Loading packages from the lab\u2026" })) : visible.length > 0 ? (_jsx("div", { id: "showcase-grid", role: "tabpanel", "aria-labelledby": categoryTabId(active), className: "mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3", children: visible.map((pkg) => (_jsx(LandingShowcaseCard, { pkg: pkg }, pkg.id))) })) : (_jsx("p", { className: "mt-10 rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center text-sm font-semibold text-ink-soft", children: "No packages in this category yet \u2014 try another one." }))] }) }));
}
