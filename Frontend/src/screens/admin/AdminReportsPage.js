import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, FileUp, Upload } from 'lucide-react';
import api, { unwrap } from '@/services/api';
import { formatDate } from '@/lib/utils';
import { downloadAuthenticatedFile } from '@/lib/download';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AdminPage, AdminPageHeader, AdminPanel, AdminSelect, AdminTHead, AdminTh, AdminTr, AdminTd, AdminTable, Badge, } from '@/components/admin/AdminUi';
export function AdminReportsPage() {
    const qc = useQueryClient();
    const fileRef = useRef(null);
    const [appointmentId, setAppointmentId] = useState('');
    const [summary, setSummary] = useState('');
    const [file, setFile] = useState(null);
    const { data, isLoading } = useQuery({
        queryKey: ['admin-reports'],
        queryFn: async () => unwrap((await api.get('/admin/reports')).data),
    });
    const appointments = useQuery({
        queryKey: ['admin-appts-for-reports'],
        queryFn: async () => unwrap((await api.get('/admin/appointments')).data),
    });
    const upload = useMutation({
        mutationFn: async () => {
            if (!file || !appointmentId)
                throw new Error('Missing file or appointment');
            const form = new FormData();
            form.append('file', file);
            form.append('appointmentId', appointmentId);
            if (summary.trim())
                form.append('summary', summary.trim());
            return api.post('/admin/reports/upload', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-reports'] });
            setAppointmentId('');
            setSummary('');
            setFile(null);
            if (fileRef.current)
                fileRef.current.value = '';
        },
    });
    if (isLoading)
        return _jsx(Loading, { label: "Loading reports" });
    return (_jsxs(AdminPage, { children: [_jsx(AdminPageHeader, { title: "Reports", subtitle: "Upload lab report files \u2014 customers download securely from their account" }), _jsxs(AdminPanel, { title: "Upload report file", subtitle: "PDF, PNG, JPG or TXT \u00B7 max 10 MB \u00B7 triggers notification + WhatsApp", children: [_jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsxs(AdminSelect, { label: "Booking", value: appointmentId, onChange: setAppointmentId, className: "w-full", children: [_jsx("option", { value: "", children: "Select appointment\u2026" }), (appointments.data ?? []).map((a) => (_jsxs("option", { value: a.id, children: [a.code, " \u00B7 ", a.test.name, " \u00B7 ", a.patientName] }, a.id)))] }), _jsx(Input, { label: "Summary (optional)", value: summary, onChange: (e) => setSummary(e.target.value), placeholder: "All parameters within normal range" }), _jsxs("div", { className: "sm:col-span-2", children: [_jsx("p", { className: "mb-2 text-sm font-semibold text-ink/80", children: "Report file" }), _jsxs("label", { className: "flex cursor-pointer flex-wrap items-center gap-3 rounded-2xl border border-dashed border-teal/40 bg-teal-light/20 px-4 py-4 transition hover:bg-teal-light/35", children: [_jsx(FileUp, { className: "h-5 w-5 text-teal" }), _jsx("span", { className: "text-sm text-ink-soft", children: file ? file.name : 'Choose PDF, image, or text report' }), _jsx("input", { ref: fileRef, type: "file", accept: ".pdf,.png,.jpg,.jpeg,.webp,.txt,application/pdf,image/*,text/plain", className: "hidden", onChange: (e) => setFile(e.target.files?.[0] ?? null) })] })] })] }), _jsxs(Button, { size: "sm", className: "mt-4 rounded-xl", disabled: !appointmentId || !file || upload.isPending, onClick: () => upload.mutate(), children: [_jsx(Upload, { className: "mr-2 h-4 w-4" }), upload.isPending ? 'Uploading…' : 'Upload & release report'] }), upload.isError ? (_jsx("p", { className: "mt-2 text-sm text-brand-red", children: "Upload failed. Check file type and size." })) : null] }), _jsx(AdminTable, { children: _jsxs("table", { className: "w-full min-w-[900px] text-left text-sm", children: [_jsxs(AdminTHead, { children: [_jsx(AdminTh, { children: "Customer" }), _jsx(AdminTh, { children: "Test" }), _jsx(AdminTh, { children: "Booking" }), _jsx(AdminTh, { children: "File" }), _jsx(AdminTh, { children: "Status" }), _jsx(AdminTh, { children: "Released" }), _jsx(AdminTh, { children: "Actions" })] }), _jsx("tbody", { children: (data ?? []).map((r) => (_jsxs(AdminTr, { children: [_jsxs(AdminTd, { children: [_jsx("p", { className: "font-semibold", children: r.user.fullName }), _jsx("p", { className: "text-xs text-ink-soft", children: r.summary ?? '—' })] }), _jsx(AdminTd, { children: r.appointment.test.name }), _jsx(AdminTd, { className: "font-mono text-xs", children: r.appointment.code }), _jsx(AdminTd, { className: "text-xs text-ink-soft", children: r.fileName ?? (r.fileUrl ? 'Uploaded' : '—') }), _jsx(AdminTd, { children: _jsx(Badge, { tone: r.status === 'AVAILABLE' ? 'success' : 'warn', children: r.status }) }), _jsx(AdminTd, { className: "text-ink-soft", children: formatDate(r.createdAt) }), _jsx(AdminTd, { children: r.fileUrl ? (_jsxs(Button, { size: "sm", variant: "secondary", className: "rounded-lg text-xs", onClick: () => downloadAuthenticatedFile(`/admin/reports/${r.id}/file`, r.fileName ?? 'report.pdf'), children: [_jsx(Download, { className: "mr-1 h-3.5 w-3.5" }), " Download"] })) : (_jsx("span", { className: "text-xs text-ink-soft", children: "No file" })) })] }, r.id))) })] }) })] }));
}
