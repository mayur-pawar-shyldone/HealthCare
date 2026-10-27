import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LandingFooter, LandingHeader } from '@/components/landing/LandingLayout';
import { LandingShowcaseCard } from '@/components/landing/LandingShowcaseCard';
import { BROWSE_CATEGORY_META, isBrowseCategoryId, slugifyBrowseKey, } from '@/data/service-browse';
import { browseFilter, labTestToShowcase } from '@/lib/catalog';
import api, { unwrap } from '@/services/api';
function BrowseContent({ categoryId }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const highlightItem = searchParams.get('item');
    const tabParam = searchParams.get('tab');
    const catalog = useQuery({
        queryKey: ['tests', 'browse', categoryId],
        queryFn: async () => {
            const [packages, all] = await Promise.all([
                unwrap((await api.get('/tests', { params: { packages: 'true' } })).data),
                unwrap((await api.get('/tests')).data),
            ]);
            const merged = [...packages];
            for (const row of all) {
                if (!merged.some((p) => p.id === row.id))
                    merged.push(row);
            }
            return merged.filter((t) => browseFilter(categoryId, t)).map(labTestToShowcase);
        },
    });
    const meta = BROWSE_CATEGORY_META[categoryId];
    const allPackages = catalog.data ?? [];
    const tabs = useMemo(() => {
        const names = [...new Set(allPackages.map((p) => p.category).filter(Boolean))];
        return [{ id: 'all', label: 'All' }, ...names.map((n) => ({ id: slugifyBrowseKey(n), label: n }))];
    }, [allPackages]);
    const activeTab = tabs.some((t) => t.id === tabParam) ? tabParam : 'all';
    const packages = useMemo(() => activeTab === 'all'
        ? allPackages
        : allPackages.filter((p) => slugifyBrowseKey(p.category) === activeTab), [allPackages, activeTab]);
    const cardRefs = useRef({});
    useEffect(() => {
        if (tabParam)
            return;
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set('tab', activeTab);
            return next;
        }, { replace: true });
    }, [tabParam, activeTab, setSearchParams]);
    useEffect(() => {
        if (!highlightItem)
            return;
        const key = slugifyBrowseKey(highlightItem);
        const match = packages.find((p) => p.id === highlightItem || slugifyBrowseKey(p.name) === key || p.id.endsWith(`-${key}`)) ??
            null;
        if (!match)
            return;
        const el = cardRefs.current[match.id];
        if (el) {
            window.requestAnimationFrame(() => {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }
    }, [highlightItem, packages, activeTab]);
    const setTab = (tabId) => {
        const next = new URLSearchParams(searchParams);
        next.set('tab', tabId);
        next.delete('item');
        setSearchParams(next, { replace: true });
    };
    return (_jsxs("main", { className: "mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-6", children: [_jsxs("nav", { className: "text-[13px] font-medium text-ink-soft", "aria-label": "Breadcrumb", children: [_jsx(Link, { to: "/", className: "transition-colors hover:text-teal", children: "Home" }), _jsx("span", { className: "mx-2 text-ink-muted", children: "/" }), _jsx("span", { className: "text-ink", children: meta.title })] }), _jsxs("div", { className: "mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "font-display text-[clamp(1.75rem,3vw,2.35rem)] font-bold leading-tight text-ink", children: meta.title }), _jsx("p", { className: "mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-soft", children: meta.subtitle })] }), _jsx("p", { className: "shrink-0 text-[13px] font-semibold text-ink-muted", children: catalog.isLoading ? 'Loading…' : `${packages.length} options in this section` })] }), _jsx("div", { className: "mt-8 flex gap-2 overflow-x-auto pb-1 no-scrollbar", role: "tablist", "aria-label": `${meta.title} categories`, children: tabs.map((tab) => {
                    const on = tab.id === activeTab;
                    return (_jsx("button", { type: "button", role: "tab", "aria-selected": on, onClick: () => setTab(tab.id), className: `shrink-0 rounded-full border px-4 py-2.5 text-[13.5px] font-bold transition-colors duration-150 ${on
                            ? 'border-ink bg-ink text-white shadow-md shadow-ink/15'
                            : 'border-line bg-white text-ink-soft hover:border-teal/40 hover:text-ink'}`, children: tab.label }, tab.id));
                }) }), catalog.isLoading ? (_jsx("p", { className: "mt-8 text-sm font-semibold text-ink-soft", children: "Loading tests from the lab\u2026" })) : null, !catalog.isLoading && packages.length === 0 ? (_jsx("p", { className: "mt-8 rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center text-sm font-semibold text-ink-soft", children: "No tests are listed in this section yet." })) : null, _jsx("ul", { className: "mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3", children: packages.map((pkg) => {
                    const highlight = highlightItem &&
                        (pkg.id === highlightItem ||
                            slugifyBrowseKey(pkg.name) === slugifyBrowseKey(highlightItem) ||
                            pkg.id.endsWith(`-${slugifyBrowseKey(highlightItem)}`));
                    return (_jsx("li", { ref: (node) => {
                            cardRefs.current[pkg.id] = node;
                        }, className: `min-w-0 transition-[transform,box-shadow] duration-300 ${highlight ? 'rounded-[28px] ring-2 ring-teal ring-offset-2 ring-offset-[#f4f9fb]' : ''}`, children: _jsx(LandingShowcaseCard, { pkg: pkg }) }, pkg.id));
                }) })] }));
}
export function ServiceBrowsePage() {
    const { categoryId } = useParams();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [categoryId]);
    if (!isBrowseCategoryId(categoryId)) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return (_jsxs("div", { className: "landing-page min-h-screen bg-[#f4f9fb] font-sans text-ink", children: [_jsx(LandingHeader, {}), _jsx(BrowseContent, { categoryId: categoryId }), _jsx(LandingFooter, {})] }));
}
