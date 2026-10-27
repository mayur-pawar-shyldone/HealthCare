import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronLeft, MapPin, Truck } from 'lucide-react';
import api, { unwrap } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { formatMoney } from '@/lib/utils';
import { BookTestTable } from '@/components/booking/BookTestTable';
import { BookPaymentPanel } from '@/components/booking/BookPaymentPanel';
import { PaymentDiscountBanner } from '@/components/brand/PaymentDiscountOffer';
const STEP_LABELS = ['Choose test', 'Schedule visit', 'Confirm & pay'];
export function BookAppointmentPage() {
    const [params] = useSearchParams();
    const preset = params.get('testId') ?? '';
    const user = useSelector((s) => s.auth.user);
    const navigate = useNavigate();
    const qc = useQueryClient();
    const [step, setStep] = useState(preset ? 2 : 1);
    const [testId, setTestId] = useState(preset);
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [patientName, setPatientName] = useState(user.fullName);
    const [patientAge, setPatientAge] = useState('');
    const [familyMemberId, setFamilyMemberId] = useState('');
    const [collectionType] = useState('HOME');
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const useWallet = false;
    const useReferral = false;
    const [locationStatus, setLocationStatus] = useState('');
    const [serviceable, setServiceable] = useState(null);
    const [done, setDone] = useState(null);
    const profile = useQuery({
        queryKey: ['profile'],
        queryFn: async () => unwrap((await api.get('/users/profile')).data),
    });
    const family = useQuery({
        queryKey: ['family'],
        queryFn: async () => unwrap((await api.get('/family')).data),
    });
    const tests = useQuery({
        queryKey: ['tests', 'all'],
        queryFn: async () => unwrap((await api.get('/tests')).data),
        staleTime: 0,
        refetchOnMount: 'always',
    });
    const slots = useQuery({
        queryKey: ['slots', date],
        enabled: !!date,
        queryFn: async () => unwrap((await api.get('/appointments/slots', { params: { date } })).data),
    });
    const quote = useQuery({
        queryKey: ['quote', testId, useWallet, useReferral],
        enabled: !!testId,
        queryFn: async () => unwrap((await api.get('/appointments/quote', {
            params: { testId, useWallet: useWallet ? 'true' : 'false', useReferral: useReferral ? 'true' : 'false' },
        })).data),
    });
    const selected = tests.data?.find((t) => t.id === testId);
    const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
    const addr = profile.data?.addresses[0];
    const showAllSteps = step === 1 || !preset;
    const visibleSteps = showAllSteps ? STEP_LABELS : STEP_LABELS.slice(1);
    const visualStep = showAllSteps ? step : step - 1;
    const canSchedule = date && timeSlot && addr?.line1 && serviceable !== false;
    function stepFromVisibleIndex(idx) {
        return showAllSteps ? idx + 1 : idx + 2;
    }
    function canGoToStep(target) {
        if (target === 1)
            return true;
        if (target === 2)
            return !!testId;
        if (target === 3)
            return !!testId && !!canSchedule;
        return false;
    }
    function goToStep(target) {
        if (target < step) {
            setStep(target);
            return;
        }
        if (canGoToStep(target))
            setStep(target);
    }
    function selectTest(id) {
        setTestId(id);
        setStep(2);
    }
    useEffect(() => {
        if (profile.data?.dateOfBirth && !patientAge) {
            const dob = new Date(profile.data.dateOfBirth);
            const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 86400000));
            if (age > 0)
                setPatientAge(String(age));
        }
    }, [profile.data, patientAge]);
    useEffect(() => {
        if (addr?.pincode) {
            api.get('/appointments/serviceability', { params: { pincode: addr.pincode } }).then((res) => {
                const data = unwrap(res.data);
                setServiceable(data.serviceable);
                setLocationStatus(data.message);
            });
        }
    }, [addr?.pincode]);
    function useCurrentLocation() {
        if (!navigator.geolocation) {
            setLocationStatus('Update your address in Profile to enable home collection.');
            return;
        }
        setLocationStatus('Fetching location…');
        navigator.geolocation.getCurrentPosition(async (pos) => {
            await api.patch('/users/profile', {
                locationLat: pos.coords.latitude,
                locationLng: pos.coords.longitude,
                line1: addr?.line1,
                city: addr?.city,
                state: addr?.state,
                pincode: addr?.pincode,
            });
            setLocationStatus('Live location saved ✓ Phlebotomist can navigate to you.');
            qc.invalidateQueries({ queryKey: ['profile'] });
        }, () => setLocationStatus('Could not access location. Allow GPS or add address in Profile.'));
    }
    const book = useMutation({
        mutationFn: async () => unwrap((await api.post('/appointments', {
            testId,
            date,
            timeSlot,
            patientName,
            patientAge: patientAge ? Number(patientAge) : undefined,
            collectionType,
            addressId: addr?.id,
            familyMemberId: familyMemberId || undefined,
            deliveryAddress: addr ? `${addr.line1}, ${addr.city}, ${addr.state} - ${addr.pincode}` : undefined,
            latitude: profile.data?.profile?.locationLat ?? undefined,
            longitude: profile.data?.profile?.locationLng ?? undefined,
            paymentMethod,
            useWallet,
            useReferral,
            reminderEnabled: true,
        })).data),
        onSuccess: (data) => {
            qc.invalidateQueries({ queryKey: ['dashboard'] });
            qc.invalidateQueries({ queryKey: ['appointments'] });
            qc.invalidateQueries({ queryKey: ['reminders'] });
            qc.invalidateQueries({ queryKey: ['quote'] });
            setDone(data);
        },
    });
    if (tests.isLoading || profile.isLoading)
        return _jsx(Loading, { label: "Preparing booking" });
    if (done && selected) {
        return (_jsx("div", { className: "mx-auto grid max-w-lg place-items-center py-8", children: _jsxs(Card, { glass: true, className: "w-full p-8 text-center md:p-10", children: [_jsx("div", { className: "mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal text-2xl text-white shadow-lg", children: "\u2713" }), _jsx("h1", { className: "font-display text-3xl", children: "You're all set!" }), _jsxs("p", { className: "mt-2 text-ink-soft", children: ["Booking ID ", _jsx("strong", { children: done.code })] }), _jsxs("div", { className: "mt-5 rounded-2xl bg-teal-light/60 p-4 text-left text-sm", children: [_jsx("p", { className: "font-medium", children: selected.name }), _jsxs("p", { className: "mt-1 text-ink-soft", children: [date, " \u00B7 ", timeSlot] }), _jsxs("p", { className: "text-ink-soft", children: [patientName, patientAge ? ` · ${patientAge} yrs` : ''] }), _jsx("p", { className: "mt-2 text-teal", children: "Home collection \u00B7 WhatsApp confirmation sent" })] }), _jsxs("div", { className: "mt-6 grid gap-3", children: [_jsx(Link, { to: `/appointments/${done.id}`, children: _jsx(Button, { className: "w-full", children: "View booking" }) }), _jsx(Link, { to: "/home", children: _jsx(Button, { variant: "secondary", className: "w-full", children: "Back to home" }) })] })] }) }));
    }
    return (_jsxs("div", { className: "w-full space-y-5", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { type: "button", onClick: () => (step > (preset ? 2 : 1) ? setStep(step - 1) : navigate(-1)), className: "glass-panel rounded-2xl p-2.5 transition hover:bg-white", children: _jsx(ChevronLeft, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-teal", children: "Smart booking" }), _jsx("h1", { className: "font-display text-2xl md:text-3xl", children: "Home collection" })] })] }), _jsx(PaymentDiscountBanner, {}), _jsx("div", { className: "glass-panel rounded-2xl p-4", children: _jsx("div", { className: "flex gap-2 sm:gap-3", children: visibleSteps.map((label, idx) => {
                        const n = idx + 1;
                        const targetStep = stepFromVisibleIndex(idx);
                        const active = n <= visualStep;
                        const current = n === visualStep;
                        const reachable = targetStep <= step || canGoToStep(targetStep);
                        return (_jsxs("button", { type: "button", disabled: !reachable, onClick: () => goToStep(targetStep), className: `flex flex-1 items-center gap-2 rounded-xl px-1 py-1 text-left transition ${reachable ? 'cursor-pointer hover:bg-white/60' : 'cursor-not-allowed opacity-60'} ${current ? 'bg-white/50' : ''}`, children: [_jsx("div", { className: `grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-bold transition ${active ? 'bg-ink text-white' : 'bg-line/60 text-ink-soft'} ${current ? 'ring-2 ring-teal/30 ring-offset-2' : ''}`, children: n }), _jsx("p", { className: `hidden text-xs sm:block ${current ? 'font-bold text-ink' : 'text-ink-soft'}`, children: label })] }, label));
                    }) }) }), step === 1 && tests.data ? (_jsx(BookTestTable, { tests: tests.data, onSelect: selectTest })) : null, step === 2 && (_jsxs(Card, { glass: true, className: "mx-auto w-full max-w-3xl space-y-5 p-5 md:p-6", children: [selected ? (_jsxs("div", { className: "rounded-2xl bg-teal-light/50 p-4", children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-ink-soft", children: "Selected test" }), _jsx("p", { className: "mt-1 font-display text-lg", children: selected.name }), _jsxs("p", { className: "mt-1 text-sm text-ink-soft", children: ["MRP ", formatMoney(Number(selected.price)), " \u00B7 Card discount applied at payment"] })] })) : null, _jsxs("div", { className: "flex items-start gap-3 rounded-2xl border border-teal/20 bg-teal-light/30 p-4", children: [_jsx(Truck, { className: "mt-0.5 h-5 w-5 shrink-0 text-teal" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: "Free home collection" }), _jsx("p", { className: "text-sm text-ink-soft", children: "A phlebotomist will visit your address" })] })] }), addr ? (_jsxs("div", { className: "rounded-2xl border border-line/80 bg-white/80 p-4", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-ink-soft", children: "Collection address" }), _jsxs("p", { className: "mt-1 text-sm font-medium", children: [addr.line1, ", ", addr.city, " \u2014 ", addr.pincode] }), locationStatus ? _jsx("p", { className: "mt-2 text-xs font-medium text-teal", children: locationStatus }) : null, profile.data?.profile?.locationLat ? (_jsxs("p", { className: "mt-1 text-[10px] text-ink-soft", children: ["GPS: ", Number(profile.data.profile.locationLat).toFixed(4), ", ", Number(profile.data.profile.locationLng).toFixed(4)] })) : null] }), _jsx(Link, { to: "/profile", className: "text-xs font-semibold text-teal hover:underline", children: "Edit" })] }), _jsxs(Button, { variant: "secondary", size: "sm", className: "mt-3 rounded-xl", onClick: useCurrentLocation, children: [_jsx(MapPin, { className: "mr-1.5 h-4 w-4" }), " Share live location"] })] })) : (_jsxs("div", { className: "rounded-2xl border border-brand-red/30 bg-brand-red-light/30 p-4", children: [_jsx("p", { className: "font-semibold text-brand-red", children: "Add your home address first" }), _jsx("p", { className: "mt-1 text-sm text-ink-soft", children: "We need this for home sample collection." }), _jsx(Link, { to: "/profile", children: _jsx(Button, { className: "mt-3", size: "sm", children: "Add address" }) })] })), _jsx(Input, { label: "Preferred date", type: "date", min: minDate, value: date, onChange: (e) => setDate(e.target.value) }), date ? (_jsxs("div", { children: [_jsx("p", { className: "mb-2 text-sm font-semibold", children: "Preferred time" }), _jsx("div", { className: "grid grid-cols-3 gap-2 sm:grid-cols-4", children: (slots.data?.slots ?? []).map((s) => (_jsx("button", { type: "button", onClick: () => setTimeSlot(s), className: `rounded-xl border px-2 py-2.5 text-xs font-semibold transition ${timeSlot === s ? 'border-teal bg-teal-light text-teal shadow-sm' : 'border-line hover:border-teal/40'}`, children: s }, s))) })] })) : null, _jsxs("div", { className: "flex flex-col-reverse gap-3 sm:flex-row", children: [_jsx(Button, { variant: "secondary", className: "w-full sm:flex-1", size: "lg", onClick: () => goToStep(1), children: "Back to tests" }), _jsx(Button, { disabled: !canSchedule, className: "w-full sm:flex-[2]", size: "lg", onClick: () => goToStep(3), children: "Continue to payment" })] })] })), step === 3 && quote.data && selected ? (_jsxs(Card, { glass: true, className: "mx-auto w-full max-w-3xl space-y-5 p-5 md:p-6", children: [_jsxs("div", { className: "rounded-2xl bg-teal-light/50 p-4", children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-ink-soft", children: "Selected test" }), _jsx("p", { className: "mt-1 font-display text-lg", children: selected.name }), _jsxs("p", { className: "mt-1 text-sm text-ink-soft", children: ["MRP ", formatMoney(Number(selected.price)), " \u00B7 Member rate on next step"] })] }), _jsxs("div", { className: "rounded-2xl border border-line/80 bg-white/80 p-4", children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-ink-soft", children: "Patient details" }), _jsxs("div", { className: "mt-3 space-y-3", children: [_jsxs("label", { className: "block space-y-2", children: [_jsx("span", { className: "text-sm font-semibold text-ink/80", children: "Who is this test for?" }), _jsxs("select", { className: "w-full rounded-2xl border border-line/80 bg-white/90 px-4 py-3.5 text-sm font-medium shadow-sm outline-none focus:border-teal focus:shadow-[0_0_0_4px_rgba(26,77,109,0.08)]", value: familyMemberId, onChange: (e) => {
                                                    setFamilyMemberId(e.target.value);
                                                    const fm = family.data?.find((f) => f.id === e.target.value);
                                                    if (fm) {
                                                        setPatientName(fm.name);
                                                        setPatientAge(String(fm.age ?? ''));
                                                    }
                                                    else {
                                                        setPatientName(user.fullName);
                                                    }
                                                }, children: [_jsxs("option", { value: "", children: ["Self \u2014 ", user.fullName] }), (family.data ?? []).map((f) => (_jsxs("option", { value: f.id, children: [f.name, " (", f.relation, ")"] }, f.id)))] })] }), _jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [_jsx(Input, { label: "Patient name", value: patientName, onChange: (e) => setPatientName(e.target.value) }), _jsx(Input, { label: "Age", value: patientAge, onChange: (e) => setPatientAge(e.target.value) })] })] })] }), _jsx(BookPaymentPanel, { selected: selected, quote: quote.data, date: date, timeSlot: timeSlot, patientName: patientName, addressLine: addr ? `${addr.line1}, ${addr.city} — ${addr.pincode}` : undefined, paymentMethod: paymentMethod, onPaymentMethod: setPaymentMethod, onConfirm: () => book.mutate(), isPending: book.isPending, error: !!book.error }), _jsx(Button, { variant: "secondary", className: "w-full", size: "lg", onClick: () => goToStep(2), children: "Back to schedule" })] })) : null] }));
}
