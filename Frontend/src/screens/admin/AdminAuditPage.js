import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api, { unwrap } from '@/services/api';
import { formatDate } from '@/lib/utils';
import { Loading } from '@/components/ui/Loading';
import { AdminPage, AdminPageHeader, AdminPagination, AdminSelect, AdminTHead, AdminTh, AdminTr, AdminTd, AdminTable, AdminToolbar, Badge, } from '@/components/admin/AdminUi';
export function AdminAuditPage() {
    const [page, setPage] = useState(1);
    const [entity, setEntity] = useState('');
    const { data, isLoading } = useQuery({
        queryKey: ['admin-audit', page, entity],
        queryFn: async () => unwrap((await api.get('/admin/audit-logs', { params: { page, entity: entity || undefined } })).data),
    });
    if (isLoading)
        return _jsx(Loading, { label: "Loading audit log" });
    return (_jsxs(AdminPage, { children: [_jsx(AdminPageHeader, { title: "Audit log", subtitle: "Track admin actions across the platform" }), _jsx(AdminToolbar, { children: _jsxs(AdminSelect, { value: entity, onChange: (v) => { setEntity(v); setPage(1); }, children: [_jsx("option", { value: "", children: "All entities" }), ['User', 'Test', 'TestCategory', 'Appointment', 'Membership'].map((e) => (_jsx("option", { value: e, children: e }, e)))] }) }), _jsx(AdminTable, { children: _jsxs("table", { className: "w-full min-w-[800px] text-left text-sm", children: [_jsxs(AdminTHead, { children: [_jsx(AdminTh, { children: "When" }), _jsx(AdminTh, { children: "Admin" }), _jsx(AdminTh, { children: "Action" }), _jsx(AdminTh, { children: "Entity" }), _jsx(AdminTh, { children: "Details" })] }), _jsx("tbody", { children: (data?.items ?? []).map((log) => (_jsxs(AdminTr, { children: [_jsx(AdminTd, { className: "text-ink-soft", children: formatDate(log.createdAt) }), _jsxs(AdminTd, { children: [_jsx("p", { className: "font-semibold", children: log.user?.fullName ?? 'System' }), _jsx("p", { className: "text-xs text-ink-soft", children: log.user?.role })] }), _jsx(AdminTd, { children: _jsx(Badge, { tone: "teal", children: log.action }) }), _jsxs(AdminTd, { children: [log.entity, log.entityId ? ` · ${log.entityId.slice(0, 8)}…` : ''] }), _jsx(AdminTd, { className: "max-w-xs truncate text-xs text-ink-soft", children: log.meta ? JSON.stringify(log.meta) : '—' })] }, log.id))) })] }) }), data ? _jsx(AdminPagination, { page: page, pages: data.pages, onPage: setPage }) : null] }));
}
