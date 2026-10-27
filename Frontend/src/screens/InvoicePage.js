import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import api, { unwrap } from '@/services/api';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { InvoiceDocument } from '@/components/payments/InvoiceDocument';
import { UserPage, UserPageHeader } from '@/components/user/UserUi';
export function InvoicePage({ mode }) {
    const { id } = useParams();
    const printRef = useRef(null);
    const invoiceApi = mode === 'admin' ? `/admin/payments/${id}/invoice` : `/payments/transactions/${id}/invoice`;
    const backTo = mode === 'admin' ? `/admin/payments/${id}` : `/transactions/${id}`;
    const { data, isLoading, isError } = useQuery({
        queryKey: ['invoice', mode, id],
        enabled: Boolean(id),
        queryFn: async () => unwrap((await api.get(invoiceApi)).data),
    });
    function handlePrint() {
        window.print();
    }
    if (isLoading)
        return _jsx(Loading, { label: "Loading invoice" });
    if (isError || !data) {
        return (_jsxs(UserPage, { children: [_jsx("p", { className: "text-sm text-ink-soft", children: "Invoice not found." }), _jsx(Link, { to: mode === 'admin' ? '/admin/payments' : '/transactions', className: "mt-4 inline-block text-teal hover:underline", children: "\u2190 Back" })] }));
    }
    return (_jsxs(UserPage, { className: "print:max-w-none print:p-0", children: [_jsx("div", { className: "print:hidden", children: _jsx(UserPageHeader, { title: "Invoice", subtitle: data.invoiceNumber, actions: _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(Link, { to: backTo, children: _jsxs(Button, { variant: "secondary", className: "rounded-xl", children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), "Payment detail"] }) }), _jsxs(Button, { variant: "secondary", className: "rounded-xl", onClick: handlePrint, children: [_jsx(Printer, { className: "mr-2 h-4 w-4" }), "Print / Save PDF"] }), _jsxs(Button, { className: "rounded-xl", onClick: handlePrint, children: [_jsx(Download, { className: "mr-2 h-4 w-4" }), "Download"] })] }) }) }), _jsx(InvoiceDocument, { ref: printRef, invoice: data, variant: mode })] }));
}
