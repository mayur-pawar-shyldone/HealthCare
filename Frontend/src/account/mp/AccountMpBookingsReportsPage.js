import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarX, Download, FileText } from 'lucide-react';
import { useAccount } from '@/account/AccountContext';
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel';
import { memberShortName } from '@/account/dashboard/mp-utils';
import { formatMoney } from '@/lib/utils';
import { downloadAuthenticatedFile } from '@/lib/download';
const bookingTabs = ['Upcoming', 'Completed', 'Cancelled'];
const statusStyle = {
    Upcoming: 'bg-mp-teal-50 text-mp-teal-700',
    Completed: 'bg-navy-50 text-navy',
    Cancelled: 'bg-mp-coral-50 text-brick',
};
const tabClass = (active) => `rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 ${active ? 'bg-navy text-white' : 'bg-mp-teal-50 text-muted hover:text-navy'}`;
export function AccountMpBookingsReportsPage() {
    const acc = useAccount();
    const navigate = useNavigate();
    const [tab, setTab] = useState('Upcoming');
    const [person, setPerson] = useState('All');
    useEffect(() => {
        void acc.refreshBookings();
    }, [acc.refreshBookings]);
    const visibleBookings = acc.bookings.filter((b) => b.status === tab);
    const reportRows = acc.bookings.filter((b) => b.report &&
        (person === 'All' || memberShortName(acc.member(b.memberId)?.name ?? '') === person));
    const people = ['All', ...acc.family.map((f) => memberShortName(f.name))];
    return (_jsxs("div", { className: "grid items-stretch gap-4 lg:grid-cols-[1.5fr_1fr]", children: [_jsxs(AccountDashboardPanel, { title: "My bookings", subtitle: "Current and past home collections.", className: "flex h-full flex-col", children: [_jsx("div", { role: "tablist", className: "flex flex-wrap gap-2", children: bookingTabs.map((t) => (_jsx("button", { type: "button", role: "tab", "aria-selected": tab === t, onClick: () => setTab(t), className: tabClass(tab === t), children: t }, t))) }), _jsxs("ul", { className: "mt-3 flex min-h-[280px] flex-1 flex-col divide-y divide-line", children: [visibleBookings.map((b) => {
                                const pkg = acc.pkg(b.packageId);
                                const member = acc.member(b.memberId);
                                return (_jsxs("li", { className: "flex flex-col gap-3 py-4 md:flex-row md:items-center", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "text-[15px] font-bold text-navy", children: b.packageName || pkg.name }), _jsxs("p", { className: "mt-0.5 text-[13px] text-muted", children: [member?.name, " \u00B7 ", b.date, " \u00B7 ", b.slot] }), _jsx("p", { className: "text-xs text-mp-teal-700", children: b.id })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx("span", { className: "text-[15px] font-bold text-navy", children: formatMoney(b.amount) }), _jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[b.status] ?? ''}`, children: b.status }), b.status === 'Upcoming' ? (_jsx("button", { type: "button", onClick: () => {
                                                        acc.rescheduleBooking(b.id);
                                                        navigate('/account/book/slot');
                                                    }, className: "rounded-full border border-line px-4 py-2 text-[13px] font-semibold text-navy transition-colors duration-150 hover:bg-canvas", children: "Reschedule" })) : null, b.status === 'Completed' ? (_jsx("button", { type: "button", onClick: () => {
                                                        acc.choosePackage(b.packageId);
                                                        navigate('/account/book/member');
                                                    }, className: "rounded-full border border-line px-4 py-2 text-[13px] font-semibold text-navy transition-colors duration-150 hover:bg-canvas", children: "Book again" })) : null] })] }, b.id));
                            }), visibleBookings.length === 0 ? (_jsxs("li", { className: "flex flex-col items-center py-8 text-center", children: [_jsx(CalendarX, { className: "h-7 w-7 text-muted", "aria-hidden": true }), _jsxs("p", { className: "mt-2 text-sm font-semibold text-navy", children: ["No ", tab.toLowerCase(), " bookings"] }), _jsx("p", { className: "text-[13px] text-muted", children: "They'll show up here when you have any." })] })) : null] })] }), _jsxs(AccountDashboardPanel, { title: "Reports", subtitle: "Lab reports for people on this card.", className: "flex h-full flex-col", children: [_jsx("div", { className: "flex flex-wrap gap-2", role: "group", "aria-label": "Filter by person", children: people.map((p) => (_jsx("button", { type: "button", "aria-pressed": person === p, onClick: () => setPerson(p), className: `rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150 ${person === p ? 'bg-mp-coral text-white' : 'bg-mp-teal-50 text-muted hover:text-navy'}`, children: p }, p))) }), _jsxs("ul", { className: "mt-3 flex min-h-[280px] flex-1 flex-col space-y-2", children: [reportRows.map((b) => {
                                const pkg = acc.pkg(b.packageId);
                                const member = acc.member(b.memberId);
                                return (_jsxs("li", { className: "flex items-center gap-3 rounded-xl bg-canvas p-3", children: [_jsx("span", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-mp-teal-700", children: _jsx(FileText, { className: "h-4 w-4", "aria-hidden": true }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "text-sm font-bold text-navy", children: pkg.name }), _jsxs("p", { className: "text-[13px] text-muted", children: [memberShortName(member?.name ?? ''), " \u00B7 ", b.date] })] }), _jsxs("button", { type: "button", "aria-label": `Download ${pkg.name} PDF`, onClick: () => {
                                                if (b.reportId) {
                                                    void downloadAuthenticatedFile(`/reports/${b.reportId}/file`, `${pkg.name}.pdf`);
                                                    return;
                                                }
                                                acc.showToast('Report file is not ready yet.');
                                            }, className: "inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold text-navy transition-colors duration-150 hover:bg-mp-teal-50", children: [_jsx(Download, { className: "h-3.5 w-3.5", "aria-hidden": true }), "PDF"] })] }, b.id));
                            }), reportRows.length === 0 ? (_jsxs("li", { className: "rounded-xl bg-canvas p-4 text-center text-[13px] text-muted", children: ["No reports for ", person, " yet."] })) : null] })] })] }));
}
