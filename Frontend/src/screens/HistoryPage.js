import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Download, MessageCircle } from 'lucide-react';
import { downloadAuthenticatedFile } from '@/lib/download';
import api, { unwrap } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { formatDate, formatMoney } from '@/lib/utils';
import { UserBadge, UserEmptyRow, UserPage, UserPageHeader, UserPanel, UserSearch, UserTable, UserTd, UserTh, UserTHead, UserToolbar, UserTr, } from '@/components/user/UserUi';
export function HistoryPage() {
    const [params, setParams] = useSearchParams();
    const reportId = params.get('report');
    const [activeReport, setActiveReport] = useState(null);
    const [query, setQuery] = useState('');
    const q = useQuery({
        queryKey: ['history'],
        queryFn: async () => unwrap((await api.get('/history')).data),
    });
    const reportQuery = useQuery({
        queryKey: ['report', reportId],
        enabled: !!reportId,
        queryFn: async () => unwrap((await api.get(`/reports/${reportId}`)).data),
    });
    useEffect(() => {
        if (reportQuery.data)
            setActiveReport(reportQuery.data);
    }, [reportQuery.data]);
    const filtered = useMemo(() => {
        const list = q.data ?? [];
        const qLower = query.trim().toLowerCase();
        if (!qLower)
            return list;
        return list.filter((a) => a.test.name.toLowerCase().includes(qLower) ||
            a.code.toLowerCase().includes(qLower) ||
            a.patientName.toLowerCase().includes(qLower));
    }, [q.data, query]);
    if (q.isLoading)
        return _jsx(Loading, { label: "Loading history" });
    if (!q.data?.length) {
        return (_jsxs(UserPage, { children: [_jsx(UserPageHeader, { title: "Reports & history", subtitle: "Completed tests and lab reports" }), _jsx(EmptyState, { title: "No test history yet", body: "Completed appointments and reports will appear here." })] }));
    }
    return (_jsxs(UserPage, { children: [_jsx(UserPageHeader, { title: "Reports & history", subtitle: "Reports are stored securely and sent on WhatsApp when ready" }), activeReport ? (_jsxs(UserPanel, { title: "Lab report", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsx("p", { className: "font-display text-xl", children: activeReport.appointment?.test?.name ?? 'Lab report' }), _jsx("p", { className: "text-sm text-ink-soft", children: activeReport.releasedAt ? formatDate(activeReport.releasedAt) : 'Recently released' })] }), _jsx(Button, { variant: "ghost", className: "rounded-xl", onClick: () => { setActiveReport(null); setParams({}); }, children: "Close" })] }), activeReport.summary ? _jsx("p", { className: "mt-4 rounded-2xl bg-teal-light/60 p-4 text-sm", children: activeReport.summary }) : null, activeReport.fileUrl ? (_jsxs(Button, { className: "mt-4 rounded-xl", onClick: () => downloadAuthenticatedFile(`/reports/${activeReport.id}/file`, activeReport.fileName ?? 'lab-report.pdf'), children: [_jsx(Download, { className: "mr-2 h-4 w-4" }), "Download report"] })) : null, _jsxs("p", { className: "mt-4 flex items-center gap-2 text-xs text-ink-soft", children: [_jsx(MessageCircle, { className: "h-4 w-4 text-teal" }), " Also shared on your WhatsApp number"] })] })) : null, _jsx(UserToolbar, { children: _jsx(UserSearch, { value: query, onChange: setQuery, placeholder: "Search test, booking code, patient\u2026" }) }), _jsx(UserTable, { children: _jsxs("table", { className: "w-full min-w-[880px] text-left text-sm", children: [_jsxs(UserTHead, { children: [_jsx(UserTh, { children: "Test" }), _jsx(UserTh, { children: "Patient" }), _jsx(UserTh, { children: "Visit date" }), _jsx(UserTh, { children: "Booking" }), _jsx(UserTh, { children: "Amount" }), _jsx(UserTh, { children: "Report" }), _jsx(UserTh, { children: "Actions" })] }), _jsx("tbody", { children: !filtered.length ? (_jsx(UserEmptyRow, { colSpan: 7, message: "No records match your search" })) : (filtered.map((a) => {
                                const report = a.reports?.[0];
                                const status = report?.status ?? 'PENDING';
                                return (_jsxs(UserTr, { children: [_jsxs(UserTd, { children: [_jsx("p", { className: "font-semibold", children: a.test.name }), report?.summary && status === 'AVAILABLE' ? (_jsx("p", { className: "mt-0.5 line-clamp-1 text-xs text-ink-soft", children: report.summary })) : null] }), _jsx(UserTd, { children: a.patientName }), _jsx(UserTd, { className: "text-ink-soft", children: formatDate(a.date) }), _jsx(UserTd, { className: "font-mono text-xs", children: a.code }), _jsx(UserTd, { children: a.finalPrice != null ? formatMoney(Number(a.finalPrice)) : '—' }), _jsx(UserTd, { children: _jsx(UserBadge, { tone: status === 'AVAILABLE' ? 'success' : status === 'PROCESSING' ? 'warn' : 'default', children: status === 'AVAILABLE' ? 'Ready' : status }) }), _jsx(UserTd, { children: status === 'AVAILABLE' && report ? (_jsx(Button, { size: "sm", className: "rounded-lg text-xs", onClick: () => {
                                                    setParams({ report: report.id });
                                                    setActiveReport(report);
                                                }, children: "View report" })) : (_jsx("span", { className: "text-xs text-ink-soft", children: "Processing\u2026" })) })] }, a.id));
                            })) })] }) })] }));
}
