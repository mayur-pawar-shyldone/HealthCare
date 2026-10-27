import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import api, { unwrap } from '@/services/api';
import { clearSession, updateUser } from '@/store/authSlice';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { UserPage, UserPageHeader, UserPanel } from '@/components/user/UserUi';
export function ProfilePage() {
    const user = useSelector((s) => s.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const qc = useQueryClient();
    const q = useQuery({
        queryKey: ['profile'],
        queryFn: async () => unwrap((await api.get('/users/profile')).data),
    });
    const family = useQuery({
        queryKey: ['family'],
        queryFn: async () => unwrap((await api.get('/family')).data),
    });
    const [form, setForm] = useState({});
    const [locationMsg, setLocationMsg] = useState('');
    const [saveMsg, setSaveMsg] = useState('');
    const save = useMutation({
        mutationFn: async () => api.patch('/users/profile', {
            fullName: form.fullName ?? q.data?.fullName,
            dateOfBirth: form.dateOfBirth,
            gender: form.gender,
            avatarUrl: form.avatarUrl,
            language: q.data?.profile?.language,
            theme: form.theme ?? q.data?.profile?.theme,
            notificationsOn: form.notificationsOn ?? q.data?.profile?.notificationsOn,
            whatsappOn: form.whatsappOn ?? q.data?.profile?.whatsappOn,
            locationLat: form.locationLat ?? q.data?.profile?.locationLat,
            locationLng: form.locationLng ?? q.data?.profile?.locationLng,
            line1: form.line1 ?? q.data?.addresses[0]?.line1,
            city: form.city ?? q.data?.addresses[0]?.city,
            state: form.state ?? q.data?.addresses[0]?.state,
            pincode: form.pincode ?? q.data?.addresses[0]?.pincode,
        }),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['profile'] });
            const nextName = form.fullName ?? q.data?.fullName;
            if (nextName)
                dispatch(updateUser({ fullName: nextName }));
            setSaveMsg('Profile saved successfully');
            setTimeout(() => setSaveMsg(''), 3000);
        },
        onError: () => setSaveMsg('Could not save profile. Please try again.'),
    });
    async function logout(all = false) {
        try {
            await api.post(all ? '/auth/logout-all' : '/auth/logout', { refreshToken: localStorage.getItem('hc_refresh') });
        }
        finally {
            dispatch(clearSession());
            navigate('/login');
        }
    }
    async function onPhoto(file) {
        const reader = new FileReader();
        reader.onload = () => setForm((f) => ({ ...f, avatarUrl: String(reader.result) }));
        reader.readAsDataURL(file);
    }
    function shareLocation() {
        navigator.geolocation?.getCurrentPosition((pos) => {
            setForm((f) => ({ ...f, locationLat: pos.coords.latitude, locationLng: pos.coords.longitude }));
            setLocationMsg('Location captured. Save profile to enable home delivery.');
        }, () => setLocationMsg('Could not access location.'));
    }
    if (q.isLoading || !q.data)
        return _jsx(Loading, {});
    const p = q.data;
    const addr = p.addresses[0];
    return (_jsxs(UserPage, { className: "max-w-3xl", children: [_jsx(UserPageHeader, { title: "Profile", subtitle: "Personal details, address, and preferences" }), _jsxs(UserPanel, { title: "Personal information", children: [_jsxs("div", { className: "flex items-center gap-4", children: [form.avatarUrl ?? p.avatarUrl ? (_jsx("img", { src: form.avatarUrl ?? p.avatarUrl ?? '', alt: "", className: "h-16 w-16 rounded-full bg-teal object-cover" })) : (_jsx("span", { className: "grid h-16 w-16 place-items-center rounded-full bg-teal text-xl font-bold text-white", children: p.fullName?.[0]?.toUpperCase() ?? '?' })), _jsxs("label", { className: "text-sm text-teal", children: ["Update photo", _jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => e.target.files?.[0] && onPhoto(e.target.files[0]) })] })] }), _jsx(Input, { label: "Name", defaultValue: p.fullName, onChange: (e) => setForm((f) => ({ ...f, fullName: e.target.value })) }), _jsx(Input, { label: "Email", defaultValue: p.email, disabled: true }), _jsx(Input, { label: "Mobile (WhatsApp)", defaultValue: p.mobile, disabled: true }), _jsx(Input, { label: "Date of birth", type: "date", defaultValue: p.dateOfBirth?.slice(0, 10), onChange: (e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value })) })] }), _jsxs(UserPanel, { title: "Home collection address", subtitle: "Required for free sample pickup", children: [_jsx(Input, { label: "Address", defaultValue: addr?.line1, onChange: (e) => setForm((f) => ({ ...f, line1: e.target.value })) }), _jsxs("div", { className: "grid gap-3 md:grid-cols-3", children: [_jsx(Input, { label: "City", defaultValue: addr?.city, onChange: (e) => setForm((f) => ({ ...f, city: e.target.value })) }), _jsx(Input, { label: "State", defaultValue: addr?.state, onChange: (e) => setForm((f) => ({ ...f, state: e.target.value })) }), _jsx(Input, { label: "Pincode", defaultValue: addr?.pincode, onChange: (e) => setForm((f) => ({ ...f, pincode: e.target.value })) })] }), _jsx(Button, { variant: "secondary", onClick: shareLocation, children: "Share current location" }), locationMsg ? _jsx("p", { className: "text-sm text-teal", children: locationMsg }) : null, _jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsx(Button, { className: "rounded-xl", disabled: save.isPending, onClick: () => save.mutate(), children: save.isPending ? 'Saving…' : 'Save profile' }), saveMsg ? (_jsx("p", { className: `text-sm ${saveMsg.includes('success') ? 'text-emerald-700' : 'text-brand-red'}`, children: saveMsg })) : null] })] }), _jsxs(UserPanel, { title: "Family members", subtitle: "Manage members on your HealthID Card", children: [_jsxs("div", { className: "space-y-2", children: [(family.data ?? []).map((f) => (_jsx("div", { className: "flex items-center justify-between rounded-2xl border border-line px-4 py-3 text-sm", children: _jsxs("span", { children: [f.name, " \u00B7 ", f.relation, f.age ? ` · ${f.age} yrs` : ''] }) }, f.id))), !family.data?.length ? _jsx("p", { className: "text-sm text-ink-soft", children: "No family members yet. Add them from your HealthID Card." }) : null] }), _jsx(Link, { to: "/home#healthid-card-section", className: "text-sm font-semibold text-teal hover:underline", children: "Manage card & family on Home \u2192" })] }), _jsxs(UserPanel, { title: "Notifications", children: [_jsxs("label", { className: "flex items-center gap-2 text-sm", children: [_jsx("input", { type: "checkbox", defaultChecked: p.profile?.notificationsOn, onChange: (e) => setForm((f) => ({ ...f, notificationsOn: e.target.checked })) }), "In-app notifications"] }), _jsxs("label", { className: "flex items-center gap-2 text-sm", children: [_jsx("input", { type: "checkbox", defaultChecked: p.profile?.whatsappOn ?? true, onChange: (e) => setForm((f) => ({ ...f, whatsappOn: e.target.checked })) }), _jsx(MessageCircle, { className: "h-4 w-4 text-teal" }), " WhatsApp updates (bookings, reminders, reports)"] }), _jsx(Link, { to: "/notifications", className: "text-sm font-semibold text-teal hover:underline", children: "View all notifications \u2192" }), _jsx(Link, { to: "/reminders", className: "text-sm font-semibold text-teal hover:underline", children: "Manage reminders \u2192" }), _jsxs("select", { className: "w-full rounded-2xl border border-line/80 bg-white/90 px-4 py-3 text-sm outline-none focus:border-teal", defaultValue: p.profile?.theme, onChange: (e) => setForm((f) => ({ ...f, theme: e.target.value })), children: [_jsx("option", { value: "system", children: "Theme: System" }), _jsx("option", { value: "light", children: "Theme: Light" }), _jsx("option", { value: "dark", children: "Theme: Dark" })] })] }), _jsxs(UserPanel, { title: "Security", children: [_jsx(ChangePasswordForm, {}), _jsx(Sessions, {}), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx(Button, { variant: "secondary", onClick: () => logout(false), children: "Logout" }), _jsx(Button, { variant: "danger", onClick: () => logout(true), children: "Logout all devices" })] }), user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? (_jsx(Link, { to: "/admin", className: "text-sm font-semibold text-teal hover:underline", children: "Open operations console \u2192" })) : null] })] }));
}
function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    async function submit() {
        try {
            await api.post('/users/change-password', { currentPassword, newPassword });
            setMessage('Password updated');
            setCurrentPassword('');
            setNewPassword('');
        }
        catch {
            setMessage('Could not change password');
        }
    }
    return (_jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [_jsx(Input, { label: "Current password", type: "password", value: currentPassword, onChange: (e) => setCurrentPassword(e.target.value) }), _jsx(Input, { label: "New password", type: "password", value: newPassword, onChange: (e) => setNewPassword(e.target.value) }), _jsx(Button, { type: "button", variant: "secondary", onClick: submit, children: "Change password" }), message ? _jsx("p", { className: "text-sm text-ink-soft", children: message }) : null] }));
}
function Sessions() {
    const q = useQuery({
        queryKey: ['sessions'],
        queryFn: async () => unwrap((await api.get('/auth/sessions')).data),
    });
    if (!q.data?.length)
        return _jsx("p", { className: "text-sm text-ink-soft", children: "No other active sessions." });
    return (_jsx("div", { className: "space-y-2", children: q.data.map((s) => (_jsxs("p", { className: "text-sm text-ink-soft", children: [s.userAgent ?? 'Device', " \u00B7 ", new Date(s.createdAt).toLocaleString()] }, s.id))) }));
}
