import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { CHECKUP_SUBTITLE, CHECKUP_TONES } from '@/data/landing-checkup-tabs';
import { LandingPopularCheckupCard } from '@/components/landing/LandingPopularCheckupCard';
import { useHealthPackages } from '@/hooks/useHealthPackages';
import { labTestToCheckup } from '@/lib/catalog';
/** HealthID `ik` — Popular packages section */
export function LandingPopularCheckups() {
    const { data, isLoading } = useHealthPackages();
    const tabs = useMemo(() => {
        const rows = data ?? [];
        const names = [...new Set(rows.map((pkg) => pkg.category?.name || 'Packages'))];
        return names.map((label) => ({
            id: label.toLowerCase().replace(/\s+/g, '-'),
            label,
            packages: rows.filter((pkg) => (pkg.category?.name || 'Packages') === label).map(labTestToCheckup),
        }));
    }, [data]);
    const [tabId, setTabId] = useState('');
    const activeTab = tabs.find((t) => t.id === tabId) ?? tabs[0];
    return (_jsx("section", { id: "checkups", className: "bg-white py-20", "aria-labelledby": "checkups-heading", children: _jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [_jsxs("p", { className: "flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-600", children: [_jsx("span", { className: "h-0.5 w-5 rounded-full bg-coral", "aria-hidden": true }), "Popular packages"] }), _jsxs("h2", { id: "checkups-heading", className: "mt-3 font-display text-[32px] font-extrabold leading-tight tracking-tight text-ink sm:text-[38px]", children: [activeTab?.label ?? 'Packages', " in Nashik"] }), _jsx("p", { className: "mt-3 text-[16px] leading-relaxed text-ink-soft", children: CHECKUP_SUBTITLE }), tabs.length > 1 ? (_jsx("div", { className: "no-scrollbar mt-8 -mx-6 overflow-x-auto px-6 lg:mx-0 lg:px-0", children: _jsx("div", { role: "tablist", "aria-label": "Package categories", className: "flex w-max gap-2.5", children: tabs.map((t) => {
                            const on = t.id === (activeTab?.id ?? '');
                            return (_jsx("button", { type: "button", role: "tab", id: `checkup-tab-${t.id}`, "aria-selected": on, "aria-controls": "checkup-grid", onClick: () => setTabId(t.id), className: `whitespace-nowrap rounded-full border px-4 py-2.5 text-[14px] font-semibold transition-[color,background-color,border-color] duration-150 ease-out ${on
                                    ? 'border-ink bg-ink text-white'
                                    : 'border-ink/15 bg-white text-ink-soft hover:border-brand-300 hover:text-brand-600'}`, children: t.label }, t.id));
                        }) }) })) : null, isLoading ? (_jsx("p", { className: "mt-8 text-sm font-semibold text-ink-soft", children: "Loading packages from the lab\u2026" })) : activeTab?.packages.length ? (_jsx("div", { id: "checkup-grid", role: "tabpanel", "aria-labelledby": `checkup-tab-${activeTab.id}`, className: "mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3", children: activeTab.packages.map((pkg, i) => (_jsx(LandingPopularCheckupCard, { pkg: pkg, tone: CHECKUP_TONES[i % CHECKUP_TONES.length] }, pkg.id))) })) : (_jsx("p", { className: "mt-8 rounded-2xl border border-dashed border-line bg-cream px-6 py-14 text-center text-sm font-semibold text-ink-soft", children: "No packages listed from the lab yet." }))] }) }));
}
