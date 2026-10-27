import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Sparkles } from 'lucide-react';
import { PLATFORM } from '@/data/platform-content';
import { useAccount } from '@/account/AccountContext';
import { HealthIdCard } from '@/components/brand/HealthIdCard';
import { HomeCardActions } from '@/components/home/HomeCardActions';
import { hubSectionClassName } from '@/components/home/CardFamilyHubPanels';
function accountCardData(name, mobile, memberId, family) {
    const self = family.find((m) => m.id === 'self');
    const validFrom = new Date();
    const validUntil = new Date(validFrom);
    validUntil.setFullYear(validUntil.getFullYear() + 1);
    return {
        memberName: name,
        dateOfBirth: self?.dob ?? null,
        membershipId: memberId,
        validFrom: validFrom.toISOString(),
        validUntil: validUntil.toISOString(),
        plan: PLATFORM.membership.name,
        flatDiscountPercent: PLATFORM.membership.flatDiscount,
        familyMembers: family.map((m) => ({
            name: m.name,
            relation: m.relation,
            isPrimary: m.id === 'self',
        })),
        qrPayload: `healthidcard:member:${memberId}:${mobile}`,
    };
}
export function AccountCardWalletSection() {
    const acc = useAccount();
    const navigate = useNavigate();
    const [flipped, setFlipped] = useState(false);
    const cardData = useMemo(() => accountCardData(acc.name, acc.mobile, acc.memberId(), acc.family), [acc.name, acc.mobile, acc.memberId, acc.family]);
    const hasAddress = acc.addresses.length > 0;
    return (_jsxs("section", { id: "card-wallet", className: hubSectionClassName(), "aria-labelledby": "account-card-wallet-heading", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 border-b border-line/60 bg-gradient-to-r from-teal-light/40 via-white to-[#fff8e6]/80 px-5 py-4 md:px-8 md:py-5", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [_jsx("span", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-teal text-white shadow-sm", children: _jsx(CreditCard, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("p", { className: "dash-section-eyebrow", children: "Member hub" }), _jsx("h2", { id: "account-card-wallet-heading", className: "dash-h2", children: "HealthID Card" }), _jsx("p", { className: "dash-muted", children: "Show your card at collection \u00B7 Member pricing on every test" })] })] }), _jsx("div", { className: "ml-auto shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 dash-badge text-emerald-700", children: _jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx(Sparkles, { className: "h-3.5 w-3.5" }), "Active member"] }) })] }), _jsxs("div", { className: "bg-gradient-to-b from-[#f4f8fb] to-white p-5 md:p-8", children: [_jsxs("div", { className: "mb-5 flex min-h-[28px] items-center justify-between gap-3", children: [_jsx("p", { className: "dash-section-eyebrow dash-muted-label", children: "Digital card" }), _jsxs("span", { className: "rounded-full bg-teal/10 px-2.5 py-1 dash-badge uppercase text-teal", children: [PLATFORM.membership.flatDiscount, "% member discount"] })] }), _jsxs("div", { className: "mx-auto flex w-full max-w-[420px] flex-col gap-5", children: [_jsx(HealthIdCard, { data: cardData, flipped: flipped, onFlipChange: setFlipped, disableTapFlip: true, hideBuiltInFlipHint: true, className: "mx-auto w-full max-w-[420px]" }), _jsx(HomeCardActions, { cardData: cardData, flipped: flipped, onFlip: () => setFlipped((f) => !f), onEdit: () => navigate('/account/profile'), hasAddress: hasAddress, profilePath: "/account/profile" })] })] })] }));
}
