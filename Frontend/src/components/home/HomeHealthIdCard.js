import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreditCard, Sparkles, Users } from 'lucide-react';
import api, { unwrap } from '@/services/api';
import { PLATFORM } from '@/data/platform-content';
import { HealthIdCard } from '@/components/brand/HealthIdCard';
import { Loading } from '@/components/ui/Loading';
import { MembershipEditPanel } from './MembershipEditPanel';
import { HomeCardActions } from './HomeCardActions';
import { HomeActivatePanel } from './HomeActivatePanel';
import { CardBenefitsList, FamilyOnCardPanel, hubSectionClassName } from './CardFamilyHubPanels';
export function HomeHealthIdCard({ hasMembership, editOpen, onEditOpen, hasAddress }) {
    const qc = useQueryClient();
    const [flipped, setFlipped] = useState(false);
    const cardQuery = useQuery({
        queryKey: ['card'],
        enabled: hasMembership,
        queryFn: async () => unwrap((await api.get('/membership/card')).data),
    });
    const plans = useQuery({
        queryKey: ['plans'],
        enabled: !hasMembership,
        queryFn: async () => unwrap((await api.get('/membership/plans')).data),
    });
    const familyQuery = useQuery({
        queryKey: ['family'],
        enabled: hasMembership,
        queryFn: async () => unwrap((await api.get('/family')).data),
    });
    const subscribe = useMutation({
        mutationFn: async (planId) => api.post('/membership', { planId }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['membership'] });
            qc.invalidateQueries({ queryKey: ['dashboard'] });
            qc.invalidateQueries({ queryKey: ['card'] });
        },
    });
    if (editOpen) {
        return _jsx(MembershipEditPanel, { onClose: () => onEditOpen(false) });
    }
    if (hasMembership && cardQuery.isLoading) {
        return _jsx(Loading, { label: "Loading your card" });
    }
    const plan = plans.data?.[0];
    const maxFamily = plan?.maxFamilyMembers ?? PLATFORM.familyMembers;
    const familyCount = familyQuery.data?.length ?? cardQuery.data?.familyMembers.length ?? 0;
    const discount = cardQuery.data?.flatDiscountPercent;
    return (_jsxs("section", { id: "healthid-card-section", "aria-labelledby": "healthid-card-heading", className: hubSectionClassName(), children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 border-b border-line/60 bg-gradient-to-r from-teal-light/40 via-white to-[#fff8e6]/80 px-5 py-4 md:px-6 md:py-5", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-teal text-white shadow-sm", children: _jsx(Users, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.2em] text-teal", children: "Member hub" }), _jsx("h2", { id: "healthid-card-heading", className: "font-display text-xl text-ink md:text-2xl", children: "HealthID Card & family" }), _jsx("p", { className: "mt-0.5 text-sm text-ink-soft", children: hasMembership
                                            ? 'Your digital card, member benefits, and family you can book for'
                                            : 'Activate once for member rates and family coverage' })] })] }), hasMembership ? (_jsxs("div", { className: "flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700", children: [_jsx(Sparkles, { className: "h-3.5 w-3.5" }), "Active member"] })) : (_jsx("span", { className: "rounded-full bg-[#e03a28]/10 px-3 py-1.5 text-xs font-bold text-[#e03a28]", children: "Free \u00B7 1 year" }))] }), _jsxs("div", { className: "grid lg:grid-cols-2 lg:items-start", children: [_jsxs("div", { className: "border-b border-line/60 bg-gradient-to-b from-[#f4f8fb] to-white p-5 md:p-6 lg:border-b-0 lg:border-r", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between gap-2", children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-ink-soft", children: "Digital card" }), hasMembership && cardQuery.data ? (_jsxs("span", { className: "rounded-full bg-teal/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-teal", children: [cardQuery.data.flatDiscountPercent, "% member discount"] })) : null] }), hasMembership && cardQuery.data ? (_jsxs("div", { className: "space-y-5", children: [_jsx("div", { className: "mx-auto w-full max-w-[400px] rounded-[28px] bg-gradient-to-b from-teal/5 to-transparent p-1 pt-2", children: _jsx(HealthIdCard, { data: cardQuery.data, flipped: flipped, onFlipChange: setFlipped, disableTapFlip: true, hideBuiltInFlipHint: true, className: "mx-auto w-full" }) }), _jsx(HomeCardActions, { cardData: cardQuery.data, flipped: flipped, onFlip: () => setFlipped((f) => !f), onEdit: () => onEditOpen(true), hasAddress: hasAddress })] })) : (_jsxs("div", { className: "space-y-5", children: [_jsx("div", { className: "relative mx-auto w-full max-w-[400px]", children: _jsx("div", { className: "aspect-[1.58/1] overflow-hidden rounded-[24px] border-2 border-dashed border-teal/20 bg-gradient-to-br from-[#1a3d56]/5 via-teal-light/30 to-white", children: _jsxs("div", { className: "flex h-full flex-col items-center justify-center px-6 text-center", children: [_jsx("div", { className: "grid h-14 w-14 place-items-center rounded-2xl bg-teal/10 text-teal", children: _jsx(CreditCard, { className: "h-7 w-7" }) }), _jsx("p", { className: "mt-4 font-display text-lg text-ink", children: "Your card appears here" }), _jsx("p", { className: "mt-1 max-w-[240px] text-sm text-ink-soft", children: "One tap activation \u00B7 Family included \u00B7 Member pricing unlocked instantly" })] }) }) }), _jsx(HomeActivatePanel, { compact: true, onActivate: plan ? () => subscribe.mutate(plan.id) : undefined, activatePending: subscribe.isPending })] }))] }), _jsxs("div", { className: "space-y-6 p-5 md:p-6", children: [_jsxs("div", { children: [_jsx("p", { className: "mb-3 text-xs font-bold uppercase tracking-wider text-ink-soft", children: "Card benefits" }), _jsx(CardBenefitsList, { active: hasMembership, familyCount: familyCount, maxFamily: maxFamily, memberDiscount: discount })] }), _jsx(FamilyOnCardPanel, { hasMembership: hasMembership, maxFamily: maxFamily })] })] })] }));
}
