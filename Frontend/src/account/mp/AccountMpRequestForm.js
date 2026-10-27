import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useAccount } from '@/account/AccountContext';
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel';
const issues = ['Reschedule a visit', 'Report not received', 'Payment or refund', 'Something else'];
export function AccountMpRequestForm() {
    const acc = useAccount();
    const [about, setAbout] = useState('General');
    const [issue, setIssue] = useState(issues[0]);
    const [details, setDetails] = useState('');
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');
    const fieldClass = 'mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-navy focus:border-mp-teal focus:outline-none focus:ring-2 focus:ring-mp-teal-50';
    const submit = (e) => {
        e.preventDefault();
        if (details.trim().length < 5) {
            setError('Tell us a little more so we can help.');
            return;
        }
        setError('');
        setStatus('sending');
        acc.submitTicket(`${issue}: ${details.trim()}`);
        window.setTimeout(() => setStatus('sent'), 700);
    };
    if (status === 'sent') {
        return (_jsx(AccountDashboardPanel, { title: "Raise a request", children: _jsxs("div", { className: "flex flex-col items-center py-5 text-center", children: [_jsx(CheckCircle2, { className: "h-9 w-9 text-mp-teal", "aria-hidden": true }), _jsx("p", { className: "mt-2 text-base font-bold text-navy", children: "Request received" }), _jsx("p", { className: "mt-1 text-[13px] text-muted", children: "We'll reply on WhatsApp within a few hours." }), _jsx("button", { type: "button", onClick: () => {
                            setStatus('idle');
                            setDetails('');
                        }, className: "mt-4 rounded-full border border-line px-4 py-2 text-[13px] font-semibold text-navy hover:bg-canvas", children: "Raise another" })] }) }));
    }
    return (_jsx(AccountDashboardPanel, { title: "Raise a request", children: _jsxs("form", { onSubmit: submit, className: "space-y-4", noValidate: true, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "rq-about", className: "text-sm font-medium text-navy", children: "About" }), _jsxs("select", { id: "rq-about", value: about, onChange: (e) => setAbout(e.target.value), className: fieldClass, children: [_jsx("option", { children: "General" }), acc.bookings.map((b) => (_jsxs("option", { children: [acc.pkg(b.packageId).name, " \u00B7 ", b.date] }, b.id)))] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "rq-issue", className: "text-sm font-medium text-navy", children: "Issue" }), _jsx("select", { id: "rq-issue", value: issue, onChange: (e) => setIssue(e.target.value), className: fieldClass, children: issues.map((i) => (_jsx("option", { children: i }, i))) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "rq-details", className: "text-sm font-medium text-navy", children: "What happened?" }), _jsx("textarea", { id: "rq-details", rows: 3, value: details, onChange: (e) => setDetails(e.target.value), placeholder: "A short description", "aria-invalid": !!error, className: `${fieldClass} resize-none` }), error ? _jsx("p", { className: "mt-1.5 text-sm text-brick", children: error }) : null] }), _jsx("button", { type: "submit", disabled: status === 'sending', className: "w-full rounded-full bg-navy py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-navy-600 disabled:opacity-70", children: status === 'sending' ? 'Sending…' : 'Submit request' })] }) }));
}
