import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { formatMoney, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
const PAGE_SIZE = 10;
function testPrice(t) {
    return Number(t.memberPrice ?? t.discountedPrice ?? t.price);
}
function SortHeader({ label, field, sortField, sortDir, onSort, align = 'left', }) {
    const active = sortField === field;
    const Icon = active ? (sortDir === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;
    return (_jsxs("button", { type: "button", onClick: () => onSort(field), className: cn('inline-flex items-center gap-1 transition hover:text-teal', align === 'right' && 'ml-auto', active ? 'text-teal' : 'text-ink-soft'), children: [label, _jsx(Icon, { className: cn('h-3.5 w-3.5 shrink-0', !active && 'opacity-45') })] }));
}
export function BookTestTable({ tests, onSelect }) {
    const [query, setQuery] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortDir, setSortDir] = useState('asc');
    const [page, setPage] = useState(1);
    function toggleSort(field) {
        if (sortField === field) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        }
        else {
            setSortField(field);
            setSortDir('asc');
        }
        setPage(1);
    }
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        let list = tests.filter((t) => {
            if (!q)
                return true;
            return (t.name.toLowerCase().includes(q) ||
                t.category?.name?.toLowerCase().includes(q) ||
                t.shortDescription?.toLowerCase().includes(q));
        });
        list = [...list].sort((a, b) => {
            let cmp = 0;
            if (sortField === 'name')
                cmp = a.name.localeCompare(b.name);
            else if (sortField === 'category')
                cmp = (a.category?.name ?? '').localeCompare(b.category?.name ?? '');
            else if (sortField === 'mrp')
                cmp = Number(a.price) - Number(b.price);
            else
                cmp = testPrice(a) - testPrice(b);
            return sortDir === 'asc' ? cmp : -cmp;
        });
        return list;
    }, [tests, query, sortField, sortDir]);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
    function onSearch(v) {
        setQuery(v);
        setPage(1);
    }
    return (_jsxs(Card, { glass: true, className: "w-full overflow-hidden p-0", children: [_jsxs("div", { className: "border-b border-line/60 p-5 md:p-6", children: [_jsx("p", { className: "text-sm font-medium text-ink", children: "What would you like to book?" }), _jsxs("p", { className: "mt-0.5 text-xs text-ink-soft", children: [filtered.length, " tests & packages \u00B7 HealthID Card special rates"] }), _jsxs("div", { className: "relative mt-4", children: [_jsx(Search, { className: "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" }), _jsx("input", { type: "search", value: query, onChange: (e) => onSearch(e.target.value), placeholder: "Search tests, packages, categories\u2026", className: "w-full rounded-xl border border-line/80 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/10" })] })] }), _jsx("div", { className: "w-full overflow-x-auto", children: _jsxs("table", { className: "w-full table-fixed text-left text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-line/60 bg-cream/80 text-[11px] font-bold uppercase tracking-wider", children: [_jsx("th", { className: "w-14 px-4 py-3 md:px-6", children: "#" }), _jsx("th", { className: "px-4 py-3 md:px-6", children: _jsx(SortHeader, { label: "Test name", field: "name", sortField: sortField, sortDir: sortDir, onSort: toggleSort }) }), _jsx("th", { className: "hidden w-[18%] px-4 py-3 md:table-cell md:px-6", children: _jsx(SortHeader, { label: "Category", field: "category", sortField: sortField, sortDir: sortDir, onSort: toggleSort }) }), _jsx("th", { className: "w-[11%] px-4 py-3 text-right md:px-6", children: _jsx(SortHeader, { label: "MRP", field: "mrp", sortField: sortField, sortDir: sortDir, onSort: toggleSort, align: "right" }) }), _jsx("th", { className: "w-[13%] px-4 py-3 text-right md:px-6", children: _jsx(SortHeader, { label: "Your price", field: "price", sortField: sortField, sortDir: sortDir, onSort: toggleSort, align: "right" }) }), _jsx("th", { className: "w-[100px] px-4 py-3 text-right text-ink-soft md:px-6", children: "Action" })] }) }), _jsx("tbody", { children: rows.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-6 py-12 text-center text-ink-soft", children: "No tests match your search." }) })) : (rows.map((t, i) => {
                                const price = testPrice(t);
                                const mrp = Number(t.price);
                                const sr = (safePage - 1) * PAGE_SIZE + i + 1;
                                return (_jsxs("tr", { onClick: () => onSelect(t.id), className: "cursor-pointer border-b border-line/40 transition hover:bg-teal-light/40", children: [_jsx("td", { className: "px-4 py-3.5 text-ink-soft md:px-6", children: sr }), _jsxs("td", { className: "px-4 py-3.5 md:px-6", children: [_jsx("p", { className: "font-semibold text-ink", children: t.name }), _jsx("p", { className: "mt-0.5 text-xs text-ink-soft md:hidden", children: t.category?.name ?? '—' }), _jsxs("div", { className: "mt-0.5 flex flex-wrap gap-1", children: [t.isPackage ? (_jsx("span", { className: "inline-block rounded-md bg-teal-light px-1.5 py-0.5 text-[10px] font-bold text-teal", children: "Package" })) : null, t.isPopular ? (_jsx("span", { className: "inline-block rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800", children: "Popular" })) : null] })] }), _jsx("td", { className: "hidden truncate px-4 py-3.5 text-ink-soft md:table-cell md:px-6", children: t.category?.name ?? '—' }), _jsx("td", { className: "px-4 py-3.5 text-right text-ink-soft line-through md:px-6", children: formatMoney(mrp) }), _jsx("td", { className: "px-4 py-3.5 text-right font-bold text-teal md:px-6", children: formatMoney(price) }), _jsx("td", { className: "px-4 py-3.5 text-right md:px-6", children: _jsx(Button, { size: "sm", variant: "primary", className: "rounded-xl text-xs", onClick: (e) => { e.stopPropagation(); onSelect(t.id); }, children: "Select" }) })] }, t.id));
                            })) })] }) }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 border-t border-line/60 px-5 py-4 md:px-6", children: [_jsxs("p", { className: "text-xs text-ink-soft", children: ["Showing ", (safePage - 1) * PAGE_SIZE + (rows.length ? 1 : 0), "\u2013", (safePage - 1) * PAGE_SIZE + rows.length, " of ", filtered.length] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { size: "sm", variant: "secondary", className: "rounded-xl", disabled: safePage <= 1, onClick: () => setPage((p) => Math.max(1, p - 1)), children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), _jsxs("span", { className: "min-w-[80px] text-center text-xs font-semibold text-ink", children: ["Page ", safePage, " / ", totalPages] }), _jsx(Button, { size: "sm", variant: "secondary", className: "rounded-xl", disabled: safePage >= totalPages, onClick: () => setPage((p) => Math.min(totalPages, p + 1)), children: _jsx(ChevronRight, { className: "h-4 w-4" }) })] })] })] }));
}
