import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import { PLATFORM } from '@/data/platform-content';
import { useAccount } from '@/account/AccountContext';
import { CardMarketingFront, HEALTH_ID_CARD_IMAGES } from '@/components/brand/HealthIdCard';
import { cn } from '@/lib/utils';
function accountToCardData(name, mobile, memberId) {
    const validFrom = new Date();
    const validUntil = new Date(validFrom);
    validUntil.setFullYear(validUntil.getFullYear() + 1);
    return {
        memberName: name,
        dateOfBirth: null,
        membershipId: memberId,
        validFrom: validFrom.toISOString(),
        validUntil: validUntil.toISOString(),
        plan: PLATFORM.membership.name,
        flatDiscountPercent: PLATFORM.membership.flatDiscount,
        familyMembers: [],
        qrPayload: `healthidcard:member:${memberId}:${mobile}`,
    };
}
/** Hero / compact preview — same branded face as flip card front. */
export function AccountMemberCard({ className, showCaption = true }) {
    const acc = useAccount();
    const data = useMemo(() => accountToCardData(acc.name, acc.mobile, acc.memberId()), [acc.name, acc.mobile, acc.memberId]);
    return (_jsxs("div", { className: cn('mx-auto w-full max-w-[420px] bg-transparent', className), children: [_jsx("div", { className: "relative aspect-[1.586/1] w-full bg-transparent", children: _jsx(CardMarketingFront, { data: data, imageSrc: HEALTH_ID_CARD_IMAGES.hero }) }), showCaption ? (_jsxs("div", { className: "mt-4 space-y-2 text-center", children: [_jsxs("p", { className: "text-xs text-ink-soft", children: ["QR verified at partner labs \u00B7 ", PLATFORM.brand] }), _jsxs("p", { className: "inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700", children: [_jsx(Sparkles, { className: "h-3.5 w-3.5", "aria-hidden": true }), "Member pricing active"] })] })) : null] }));
}
