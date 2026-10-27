import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import api, { unwrap } from '@/services/api';
import { formatDate } from '@/lib/utils';
import { Loading } from '@/components/ui/Loading';
import { AdminPage, AdminPageHeader, AdminTHead, AdminTh, AdminTr, AdminTd, AdminTable, Badge, } from '@/components/admin/AdminUi';
export function AdminWhatsAppPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['admin-whatsapp'],
        queryFn: async () => unwrap((await api.get('/admin/whatsapp')).data),
    });
    if (isLoading)
        return _jsx(Loading, { label: "Loading messages" });
    return (_jsxs(AdminPage, { children: [_jsx(AdminPageHeader, { title: "WhatsApp log", subtitle: "Outbound customer messages (simulated delivery in dev)" }), _jsx(AdminTable, { children: _jsxs("table", { className: "w-full min-w-[800px] text-left text-sm", children: [_jsxs(AdminTHead, { children: [_jsx(AdminTh, { children: "When" }), _jsx(AdminTh, { children: "Customer" }), _jsx(AdminTh, { children: "Template" }), _jsx(AdminTh, { children: "Message" }), _jsx(AdminTh, { children: "Status" })] }), _jsx("tbody", { children: (data ?? []).map((m) => (_jsxs(AdminTr, { children: [_jsx(AdminTd, { className: "text-ink-soft", children: formatDate(m.createdAt) }), _jsxs(AdminTd, { children: [_jsx("p", { className: "font-semibold", children: m.user.fullName }), _jsx("p", { className: "text-xs text-ink-soft", children: m.mobile })] }), _jsx(AdminTd, { children: _jsx(Badge, { tone: "teal", children: m.template }) }), _jsx(AdminTd, { className: "max-w-md text-xs text-ink-soft", children: m.body }), _jsx(AdminTd, { children: _jsx(Badge, { tone: "success", children: m.status }) })] }, m.id))) })] }) })] }));
}
