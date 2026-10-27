import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpDown } from 'lucide-react';
import api, { unwrap } from '@/services/api';
import { useHealthPackages } from '@/hooks/useHealthPackages';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { UserPage, UserSelect } from '@/components/user/UserUi';
import { OfferCard } from '@/components/home/OfferCard';
import { PackageCard } from '@/components/home/PackageCard';
import { TestsPageHero } from '@/components/tests/TestsPageHero';
import { TestsCategoryGrid } from '@/components/tests/TestsCategoryGrid';
import { PaymentDiscountBanner } from '@/components/brand/PaymentDiscountOffer';
function viewFromParams(params) {
    if (params.get('packages') === 'true')
        return 'packages';
    if (params.get('popular') === 'true')
        return 'popular';
    return 'all';
}
export function TestsPage() {
    const [params, setParams] = useSearchParams();
    const view = viewFromParams(params);
    const [category, setCategory] = useState(params.get('category') ?? '');
    const [sort, setSort] = useState('');
    const [search, setSearch] = useState('');
    useEffect(() => {
        setCategory(params.get('category') ?? '');
    }, [params]);
    const cats = useQuery({
        queryKey: ['categories'],
        queryFn: async () => unwrap((await api.get('/tests/categories')).data),
    });
    const packagesQuery = useHealthPackages();
    const tests = useQuery({
        queryKey: ['tests', category, sort, view === 'popular'],
        enabled: view !== 'packages',
        queryFn: async () => unwrap((await api.get('/tests', {
            params: {
                category: category || undefined,
                sort: sort || undefined,
                popular: view === 'popular' ? 'true' : undefined,
            },
        })).data),
        staleTime: 0,
        refetchOnMount: 'always',
    });
    const packagesOnly = view === 'packages';
    const raw = packagesOnly ? (packagesQuery.data ?? []) : (tests.data ?? []);
    const baseList = packagesOnly || category === 'full-body-packages' ? raw : raw.filter((t) => !t.isPackage);
    const list = useMemo(() => {
        const q = search.trim().toLowerCase();
        let items = baseList;
        if (!q)
            return items;
        return items.filter((t) => t.name.toLowerCase().includes(q) ||
            t.shortDescription.toLowerCase().includes(q) ||
            t.category?.name.toLowerCase().includes(q));
    }, [baseList, search]);
    const loading = packagesOnly ? packagesQuery.isLoading : tests.isLoading;
    function setView(next) {
        const url = new URLSearchParams(params);
        url.delete('category');
        setCategory('');
        if (next === 'packages') {
            url.set('packages', 'true');
            url.delete('popular');
        }
        else if (next === 'popular') {
            url.set('popular', 'true');
            url.delete('packages');
        }
        else {
            url.delete('packages');
            url.delete('popular');
        }
        setParams(url);
    }
    function setCategoryFilter(slug) {
        setCategory(slug);
        const url = new URLSearchParams(params);
        if (slug)
            url.set('category', slug);
        else
            url.delete('category');
        url.delete('packages');
        url.delete('popular');
        setParams(url);
    }
    return (_jsxs(UserPage, { className: "space-y-8", children: [_jsx(TestsPageHero, { view: view, onViewChange: setView, search: search, onSearchChange: setSearch, resultCount: list.length }), _jsx(PaymentDiscountBanner, {}), !packagesOnly && view === 'all' ? (_jsx(TestsCategoryGrid, { categories: cats.data ?? [], activeSlug: category, onSelect: setCategoryFilter })) : null, _jsxs("section", { "aria-label": "Catalog results", children: [_jsxs("div", { className: "mb-5 flex flex-wrap items-end justify-between gap-3", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-display text-xl text-ink md:text-2xl", children: packagesOnly ? 'Diagnostic packages' : view === 'popular' ? 'Popular tests' : category ? 'Filtered tests' : 'Individual tests' }), _jsx("p", { className: "mt-1 text-sm text-ink-soft", children: "Special member rates \u00B7 Home collection \u00B7 Reports in 24\u201348 hours" })] }), !packagesOnly ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ArrowUpDown, { className: "h-4 w-4 text-ink-soft" }), _jsxs(UserSelect, { value: sort, onChange: setSort, className: "min-w-[180px]", children: [_jsx("option", { value: "", children: "Sort: relevance" }), _jsx("option", { value: "price_asc", children: "Price: low to high" }), _jsx("option", { value: "price_desc", children: "Price: high to low" })] })] })) : null] }), loading ? (_jsx(Loading, { label: packagesOnly ? 'Loading packages' : 'Loading tests' })) : list.length === 0 ? (_jsx(EmptyState, { title: "No matches found", body: "Try another category, clear your search, or browse all packages." })) : packagesOnly ? (_jsx("div", { className: "grid gap-5 sm:grid-cols-2 xl:grid-cols-3", children: list.map((pkg, i) => (_jsx(PackageCard, { pkg: pkg, accentIndex: i, showIncluded: true }, pkg.id))) })) : view === 'popular' ? (_jsx("div", { className: "-mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 scroll-smooth [scrollbar-width:thin] md:grid md:grid-cols-2 md:overflow-visible md:pb-0 xl:grid-cols-3", children: list.map((t, i) => (_jsx("div", { className: "snap-start md:snap-align-none", children: _jsx(OfferCard, { test: t, badge: "Popular", accentIndex: i, fluid: true }) }, t.id))) })) : (_jsx("div", { className: "grid gap-5 sm:grid-cols-2 xl:grid-cols-3", children: list.map((t, i) => (_jsx(OfferCard, { test: t, accentIndex: i, fluid: true }, t.id))) }))] })] }));
}
