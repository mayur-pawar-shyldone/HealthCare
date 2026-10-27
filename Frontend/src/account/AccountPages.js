import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { upcomingCollectionDates } from '@/lib/booking-dates';
import api, { unwrap } from '@/services/api';
import { AccountDashboardPageContent } from '@/account/AccountDashboardHub';
import { AccountMpBookingsReportsPage } from '@/account/mp/AccountMpBookingsReportsPage';
import { AccountMpHelpSupportPage } from '@/account/mp/AccountMpHelpSupportPage';
import { AccountMpMyAccountPage } from '@/account/mp/AccountMpMyAccountPage';
import { rupee, useAccount } from '@/account/AccountContext';
import { BookSteps, PageHead } from '@/account/account-ui';
import { readForm } from '@/account/form-utils';
export function AccountDashboardPage() {
    return _jsx(AccountDashboardPageContent, {});
}
export function AccountBookingsPage() {
    return _jsx(AccountMpBookingsReportsPage, {});
}
export function AccountBookingDetailPage() {
    const acc = useAccount();
    const navigate = useNavigate();
    const { id } = useParams();
    const b = acc.bookings.find((x) => x.id === id);
    if (!b) {
        return (_jsxs(_Fragment, { children: [_jsx(PageHead, { title: "Booking", text: "We couldn\u2019t find that booking." }), _jsx("button", { type: "button", className: "hid-btn hid-btn-ghost", onClick: () => navigate('/account/bookings'), children: "Back to bookings" })] }));
    }
    const steps = ['Confirmed', 'Collection scheduled', 'Sample collected', 'Processing', 'Report ready'];
    const at = b.status === 'Completed' ? 4 : b.status === 'Cancelled' ? -1 : 1;
    return (_jsxs(_Fragment, { children: [_jsx(PageHead, { title: `Booking ${b.code || b.id}`, text: `${acc.pkg(b.packageId).name} for ${acc.member(b.memberId)?.name || ''}` }), _jsxs("div", { className: "grid-2", children: [_jsxs("article", { className: "card", children: [_jsx("span", { className: `badge ${b.status === 'Completed' ? 'ok' : ''}`, children: b.status }), _jsxs("div", { className: "kvs", style: { marginTop: 14 }, children: [_jsxs("div", { children: [_jsx("span", { children: "Patient" }), _jsx("strong", { children: acc.member(b.memberId)?.name })] }), _jsxs("div", { children: [_jsx("span", { children: "When" }), _jsxs("strong", { children: [b.date, " \u00B7 ", b.slot] })] }), _jsxs("div", { children: [_jsx("span", { children: "Where" }), _jsx("strong", { style: { textAlign: 'right' }, children: acc.address(b.addressId)?.line })] }), _jsxs("div", { children: [_jsx("span", { children: "Amount" }), _jsx("strong", { children: rupee(b.amount) })] })] }), _jsx("h3", { children: "Timeline" }), _jsx("div", { className: "list", children: steps.map((s, i) => (_jsxs("div", { className: "item", children: [_jsx("strong", { children: s }), _jsx("span", { className: `badge ${at >= i ? 'ok' : 'muted'}`, children: at >= i ? 'Done' : 'Pending' })] }, s))) })] }), _jsxs("article", { className: "card", children: [_jsx("h3", { style: { marginTop: 0 }, children: "Manage" }), b.status === 'Upcoming' ? (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", className: "hid-btn hid-btn-primary hid-btn-block", onClick: () => { acc.rescheduleBooking(b.id); navigate('/account/book/slot'); }, children: "Reschedule" }), _jsx("button", { type: "button", className: "hid-btn hid-btn-ghost hid-btn-block", style: { marginTop: 8 }, onClick: () => {
                                            if (confirm('Cancel this collection?')) {
                                                acc.cancelBooking(b.id);
                                                navigate('/account/bookings');
                                            }
                                        }, children: "Cancel booking" })] })) : null, b.report ? (_jsx("button", { type: "button", className: "hid-btn hid-btn-primary hid-btn-block", onClick: () => navigate('/account/reports'), children: "View report" })) : (_jsx("div", { className: "empty", children: "Report isn\u2019t ready yet." })), _jsx("button", { type: "button", className: "hid-btn hid-btn-ghost hid-btn-block", style: { marginTop: 8 }, onClick: () => navigate('/account/support'), children: "Contact support" })] })] })] }));
}
export function AccountReportsPage() {
    return _jsx(Navigate, { to: "/account/bookings", replace: true });
}
export function AccountProfilePage() {
    return _jsx(AccountMpMyAccountPage, {});
}
export function AccountSupportPage() {
    return _jsx(AccountMpHelpSupportPage, {});
}
export function AccountCataloguePage() {
    const acc = useAccount();
    const navigate = useNavigate();
    const q = acc.search.trim().toLowerCase();
    const filtered = acc.packages.filter((p) => !q || (p.name + p.summary).toLowerCase().includes(q));
    return (_jsxs(_Fragment, { children: [_jsx(PageHead, { title: "Book a test", text: "Same packages as the public site, at your member price." }), _jsx("div", { className: "grid-2", children: filtered.length ? (filtered.map((p) => (_jsxs("article", { className: "card", children: [_jsxs("span", { className: "badge", children: [p.tests, " tests \u00B7 Report in ", p.time] }), _jsx("h3", { children: p.name }), _jsx("p", { className: "muted", children: p.summary }), _jsxs("div", { className: "price", children: [rupee(p.price), " ", _jsx("s", { children: rupee(p.mrp) })] }), _jsx("button", { type: "button", className: "hid-btn hid-btn-primary", onClick: () => {
                                acc.choosePackage(p.id);
                                navigate('/account/book/member');
                            }, children: "Choose package" })] }, p.id)))) : (_jsx("div", { className: "card empty", children: "No package matches that search." })) })] }));
}
export function AccountBookMemberPage() {
    const acc = useAccount();
    const navigate = useNavigate();
    const p = acc.pkg(acc.draft.packageId);
    return (_jsxs(_Fragment, { children: [_jsx(BookSteps, { n: 0 }), _jsx(PageHead, { title: "Who is this test for?", text: `${p.name} · ${rupee(p.price)}` }), _jsx("form", { onSubmit: (e) => {
                    e.preventDefault();
                    const data = readForm(e.currentTarget);
                    if (acc.submitMemberStep(data.member, data.address))
                        navigate('/account/book/slot');
                }, children: _jsxs("div", { className: "split", children: [_jsxs("div", { children: [_jsx("h3", { children: "Family member" }), _jsx("div", { className: "choice", children: acc.family.map((m) => (_jsxs("label", { children: [_jsx("input", { type: "radio", name: "member", value: m.id, defaultChecked: acc.draft.memberId === m.id }), _jsxs("span", { children: [_jsx("strong", { children: m.name }), _jsx("br", {}), _jsx("small", { className: "muted", children: m.relation })] })] }, m.id))) }), _jsx("h3", { children: "Collection address" }), _jsx("div", { className: "choice", children: acc.addresses.map((a) => (_jsxs("label", { children: [_jsx("input", { type: "radio", name: "address", value: a.id, defaultChecked: acc.draft.addressId === a.id }), _jsxs("span", { children: [_jsx("strong", { children: a.label }), _jsx("br", {}), _jsx("small", { className: "muted", children: a.line })] })] }, a.id))) }), acc.error ? _jsx("p", { className: "error", children: acc.error }) : null, _jsx("button", { className: "hid-btn hid-btn-primary", type: "submit", style: { marginTop: 12 }, children: "Continue" })] }), _jsxs("aside", { className: "card", children: [_jsx("strong", { children: p.name }), _jsx("p", { className: "muted", children: p.prep }), _jsx("div", { className: "price", children: rupee(p.price) })] })] }) })] }));
}
export function AccountBookSlotPage() {
    const acc = useAccount();
    const navigate = useNavigate();
    const dates = useMemo(() => upcomingCollectionDates(7), []);
    const slotsQuery = useQuery({
        queryKey: ['slots', acc.draft.date],
        enabled: Boolean(acc.draft.date),
        queryFn: async () => unwrap((await api.get('/appointments/slots', { params: { date: acc.draft.date } })).data),
    });
    const slots = slotsQuery.data?.slots ?? [];
    return (_jsxs(_Fragment, { children: [_jsx(BookSteps, { n: 1 }), _jsx(PageHead, { title: "Choose a collection slot", text: acc.address(acc.draft.addressId)?.line || '' }), _jsxs("form", { onSubmit: (e) => {
                    e.preventDefault();
                    if (acc.submitSlotStep())
                        navigate('/account/book/review');
                }, children: [_jsx("h3", { children: "Date" }), _jsx("div", { className: "days", children: dates.map((d) => (_jsx("button", { type: "button", className: `day ${acc.draft.date === d.id ? 'on' : ''}`, onClick: () => acc.pickDate(d.id), children: d.label }, d.id))) }), _jsx("h3", { children: "Time" }), _jsx("div", { className: "slots", children: slotsQuery.isLoading ? (_jsx("p", { className: "muted", children: "Loading slots\u2026" })) : slots.length ? (slots.map((s) => (_jsx("button", { type: "button", className: `slot ${acc.draft.slot === s ? 'on' : ''}`, onClick: () => acc.pickSlot(s), children: s }, s)))) : (_jsx("p", { className: "muted", children: "Pick a date with open slots." })) }), acc.error ? _jsx("p", { className: "error", children: acc.error }) : null, _jsxs("div", { style: { display: 'flex', gap: 8, marginTop: 16 }, children: [_jsx("button", { type: "button", className: "hid-btn hid-btn-ghost", onClick: () => navigate('/account/book/member'), children: "Back" }), _jsx("button", { type: "submit", className: "hid-btn hid-btn-primary", children: "Continue" })] })] })] }));
}
export function AccountBookReviewPage() {
    const acc = useAccount();
    const navigate = useNavigate();
    const p = acc.pkg(acc.draft.packageId);
    const dates = useMemo(() => upcomingCollectionDates(7), []);
    const d = dates.find((x) => x.id === acc.draft.date);
    const save = p.mrp - p.price;
    return (_jsxs(_Fragment, { children: [_jsx(BookSteps, { n: 2 }), _jsx(PageHead, { title: "Review and confirm", text: "Price is the member rate. Collection is free." }), _jsxs("form", { className: "split", onSubmit: (e) => {
                    e.preventDefault();
                    void acc.confirmBooking().then((ok) => {
                        if (ok)
                            navigate('/account/book/done');
                    });
                }, children: [_jsxs("article", { className: "card", children: [_jsxs("div", { className: "kvs", children: [_jsxs("div", { children: [_jsx("span", { children: "Package" }), _jsx("strong", { children: p.name })] }), _jsxs("div", { children: [_jsx("span", { children: "Patient" }), _jsx("strong", { children: acc.member(acc.draft.memberId)?.name })] }), _jsxs("div", { children: [_jsx("span", { children: "When" }), _jsxs("strong", { children: [d?.label, " \u00B7 ", acc.draft.slot] })] }), _jsxs("div", { children: [_jsx("span", { children: "Where" }), _jsx("strong", { style: { textAlign: 'right' }, children: acc.address(acc.draft.addressId)?.line })] })] }), _jsxs("p", { className: "rounded-xl bg-mint/50 px-4 py-3 text-[14px] leading-relaxed text-ink-soft", children: [_jsx("strong", { className: "text-ink", children: "Pay at sample collection" }), " \u2014 cash or UPI to the phlebotomist when they visit. No online payment is taken during booking."] })] }), _jsxs("aside", { className: "card", children: [_jsxs("div", { className: "kvs", children: [_jsxs("div", { children: [_jsx("span", { children: "List price" }), _jsx("span", { children: rupee(p.mrp) })] }), _jsxs("div", { children: [_jsx("span", { children: "Member saving" }), _jsxs("span", { children: ["\u2212 ", rupee(save)] })] }), _jsxs("div", { children: [_jsx("span", { children: "Home collection" }), _jsx("span", { children: "\u20B90" })] }), _jsxs("div", { className: "total", children: [_jsx("span", { children: "Payable" }), _jsx("span", { children: rupee(p.price) })] })] }), acc.error ? _jsx("p", { className: "error", children: acc.error }) : null, _jsx("button", { className: "hid-btn hid-btn-primary hid-btn-block", style: { marginTop: 14 }, type: "submit", disabled: acc.busy, children: acc.busy ? 'Saving…' : 'Confirm booking' })] })] })] }));
}
export function AccountBookDonePage() {
    const acc = useAccount();
    const navigate = useNavigate();
    const b = acc.bookings[0];
    if (!b)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx(BookSteps, { n: 3 }), _jsx(PageHead, { title: "Booking confirmed", text: "We\u2019ve saved this visit on your account." }), _jsxs("article", { className: "card", children: [_jsx("span", { className: "badge ok", children: "Confirmed" }), _jsx("h2", { style: { fontFamily: '"Plus Jakarta Sans", sans-serif' }, children: b.code || b.id }), _jsxs("p", { children: [acc.pkg(b.packageId).name, " for ", acc.member(b.memberId)?.name, " \u00B7 ", b.date, " \u00B7 ", b.slot] }), _jsx("button", { type: "button", className: "hid-btn hid-btn-primary", onClick: () => navigate(`/account/bookings/${b.id}`), children: "View booking" }), _jsx("button", { type: "button", className: "hid-btn hid-btn-ghost", onClick: () => navigate('/account/bookings'), children: "All bookings" })] })] }));
}
