import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { BadgePercent, Save, ShieldAlert } from 'lucide-react';
import api, { unwrap } from '@/services/api';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AdminPage, AdminPageHeader, AdminPanel, } from '@/components/admin/AdminUi';
export function AdminPricingSettingsPage() {
    const user = useSelector((s) => s.auth.user);
    const isSuper = user?.role === 'SUPER_ADMIN';
    const qc = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['admin-pricing-settings'],
        queryFn: async () => unwrap((await api.get('/admin/settings/pricing')).data),
    });
    const [form, setForm] = useState(null);
    const [saved, setSaved] = useState(false);
    useEffect(() => {
        if (data)
            setForm(data);
    }, [data]);
    const save = useMutation({
        mutationFn: async (payload) => unwrap((await api.patch('/admin/settings/pricing', payload)).data),
        onSuccess: (updated) => {
            setForm(updated);
            setSaved(true);
            qc.invalidateQueries({ queryKey: ['admin-pricing-settings'] });
            qc.invalidateQueries({ queryKey: ['platform-pricing'] });
            setTimeout(() => setSaved(false), 2500);
        },
    });
    if (isLoading || !form)
        return _jsx(Loading, { label: "Loading pricing settings" });
    if (!isSuper) {
        return (_jsxs(AdminPage, { children: [_jsx(AdminPageHeader, { title: "Payment promo settings", subtitle: "Super admin access required" }), _jsxs("div", { className: "glass-panel flex items-start gap-3 rounded-3xl p-6 text-sm text-amber-900", children: [_jsx(ShieldAlert, { className: "mt-0.5 h-5 w-5 shrink-0" }), _jsx("p", { children: "Only super admins can change platform-wide payment discounts. Contact your super admin to adjust promo rules." })] }), _jsx(AdminPanel, { title: "Current settings (read-only)", children: _jsx(SettingsPreview, { settings: form }) })] }));
    }
    return (_jsxs(AdminPage, { children: [_jsx(AdminPageHeader, { title: "Payment promo settings", subtitle: "Manage checkout discount applied on special price (not MRP)", actions: _jsxs(Button, { className: "rounded-xl", disabled: save.isPending, onClick: () => save.mutate({
                        paymentPromoPercent: form.paymentPromoPercent,
                        paymentPromoActive: form.paymentPromoActive,
                        paymentPromoApplyToAllUsers: form.paymentPromoApplyToAllUsers,
                        promoLabel: form.promoLabel,
                    }), children: [_jsx(Save, { className: "mr-2 h-4 w-4" }), save.isPending ? 'Saving…' : saved ? 'Saved' : 'Save changes'] }) }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [_jsx(AdminPanel, { title: "Discount rules", children: _jsxs("div", { className: "space-y-5", children: [_jsxs("label", { className: "flex items-center justify-between gap-4 rounded-2xl border border-line/60 bg-white/60 px-4 py-3", children: [_jsx("span", { className: "text-sm font-semibold text-ink", children: "Promo active" }), _jsx("input", { type: "checkbox", checked: form.paymentPromoActive, onChange: (e) => setForm({ ...form, paymentPromoActive: e.target.checked }), className: "h-5 w-5 rounded accent-teal" })] }), _jsxs("label", { className: "flex items-center justify-between gap-4 rounded-2xl border border-line/60 bg-white/60 px-4 py-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-ink", children: "Apply to all users" }), _jsx("p", { className: "text-xs text-ink-soft", children: "When off, only members get payment promo" })] }), _jsx("input", { type: "checkbox", checked: form.paymentPromoApplyToAllUsers, onChange: (e) => setForm({ ...form, paymentPromoApplyToAllUsers: e.target.checked }), className: "h-5 w-5 rounded accent-teal" })] }), _jsx(Input, { label: "Discount percent (on special price)", type: "number", min: 0, max: 100, value: form.paymentPromoPercent, onChange: (e) => setForm({ ...form, paymentPromoPercent: Number(e.target.value) }) }), _jsx(Input, { label: "Promo label (shown in app)", value: form.promoLabel, onChange: (e) => setForm({ ...form, promoLabel: e.target.value }) })] }) }), _jsxs(AdminPanel, { title: "Live preview", children: [_jsx(SettingsPreview, { settings: form }), form.updatedAt ? (_jsxs("p", { className: "mt-4 text-xs text-ink-soft", children: ["Last updated ", new Date(form.updatedAt).toLocaleString('en-IN')] })) : null] })] })] }));
}
function SettingsPreview({ settings }) {
    const pct = settings.paymentPromoActive ? settings.paymentPromoPercent : 0;
    const sampleSpecial = 1000;
    const after = Math.round(sampleSpecial * (1 - pct / 100));
    return (_jsxs("div", { className: "rounded-2xl border border-[#e03a28]/20 bg-gradient-to-br from-[#fff5f4] to-teal-light/30 p-5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(BadgePercent, { className: "h-5 w-5 text-[#e03a28]" }), _jsx("p", { className: "font-semibold text-ink", children: settings.promoLabel })] }), _jsxs("p", { className: "mt-3 text-sm text-ink-soft", children: ["Status:", ' ', _jsx("strong", { className: settings.paymentPromoActive ? 'text-emerald-600' : 'text-ink-soft', children: settings.paymentPromoActive ? 'Active' : 'Inactive' }), ' · ', "Audience:", ' ', _jsx("strong", { children: settings.paymentPromoApplyToAllUsers ? 'All users' : 'Members only' })] }), settings.paymentPromoActive ? (_jsxs("p", { className: "mt-2 text-sm text-ink", children: ["Example: special price \u20B9", sampleSpecial.toLocaleString('en-IN'), " \u2192 pay ~\u20B9", after.toLocaleString('en-IN'), " after ", pct, "% at checkout"] })) : (_jsx("p", { className: "mt-2 text-sm text-ink-soft", children: "No payment discount will be applied while inactive." }))] }));
}
