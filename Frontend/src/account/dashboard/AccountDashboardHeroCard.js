import { jsx as _jsx } from "react/jsx-runtime";
import { AccountMemberCard } from '@/account/AccountMemberCard';
/** Navy banner card — live HealthID artwork only (ID / validity on the card face, not duplicated below). */
export function AccountDashboardHeroCard({ flushRight = false }) {
    return (_jsx("div", { className: flushRight ? 'w-[min(100%,272px)] sm:w-[280px] md:w-[272px]' : 'w-[min(100%,272px)]', children: _jsx(AccountMemberCard, { showCaption: false, className: "max-w-none bg-transparent shadow-none" }) }));
}
