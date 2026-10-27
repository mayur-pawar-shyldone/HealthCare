import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PANEL_TINTS } from '@/data/landing-healthid-content';
import { HealthIdFvPackageCard } from '@/components/landing/HealthIdFvPackageCard';
import { useHealthPackages } from '@/hooks/useHealthPackages';
import { labTestToFv } from '@/lib/catalog';
export function LandingPackagesMostBooked() {
    const { data, isLoading } = useHealthPackages();
    const packages = (data ?? []).slice().sort((a, b) => Number(b.isPopular) - Number(a.isPopular)).slice(0, 4).map(labTestToFv);
    return (_jsx("section", { id: "packages", className: "bg-mint py-20", "aria-labelledby": "packages-heading", children: _jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [_jsxs("div", { className: "max-w-2xl", children: [_jsx("h2", { id: "packages-heading", className: "font-display text-[32px] font-extrabold leading-tight tracking-tight text-ink sm:text-[38px]", children: "Packages people book most" }), _jsx("p", { className: "mt-3 text-[16px] leading-relaxed text-ink-soft", children: "Bundled panels that cover a full picture in one visit \u2014 no repeat pricks, no repeat fees." })] }), isLoading ? (_jsx("p", { className: "mt-10 text-sm font-semibold text-ink-soft", children: "Loading packages from the lab\u2026" })) : packages.length ? (_jsx("ul", { className: "mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4", children: packages.map((pkg, i) => (_jsx("li", { className: "flex", children: _jsx(HealthIdFvPackageCard, { pkg: pkg, tint: PANEL_TINTS[i % PANEL_TINTS.length] }) }, pkg.id))) })) : (_jsx("p", { className: "mt-10 rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center text-sm font-semibold text-ink-soft", children: "No packages listed from the lab yet." }))] }) }));
}
