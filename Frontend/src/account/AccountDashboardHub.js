import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, FlaskConical, Sparkles } from 'lucide-react';
import { useAccount } from '@/account/AccountContext';
import { AccountCardWalletSection } from '@/account/AccountCardWalletSection';
import { AccountDashboardFamilyPanel } from '@/account/dashboard/AccountDashboardFamilyPanel';
import { AccountFamilyManageModal } from '@/account/dashboard/AccountFamilyManageModal';
import { AccountDashboardHeroCard } from '@/account/dashboard/AccountDashboardHeroCard';
import { AccountDashboardNextVisitPanel } from '@/account/dashboard/AccountDashboardNextVisitPanel';
import { dashboardGreeting } from '@/account/dashboard/mp-utils';
import { PLATFORM } from '@/data/platform-content';
/** Account dashboard — Magic Patterns home + card & wallet hub. */
export function AccountDashboardPageContent() {
    const acc = useAccount();
    const navigate = useNavigate();
    const firstName = acc.name.split(' ')[0];
    const [familyManage, setFamilyManage] = useState({
        open: false,
        mode: 'list',
    });
    function openFamilyManage(mode = 'list') {
        setFamilyManage({ open: true, mode });
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("section", { className: "relative overflow-hidden rounded-[20px] bg-navy py-4 pl-5 pr-5 sm:py-5 sm:pl-6 sm:pr-6 md:py-4 md:pl-6 md:pr-6", children: [_jsxs("div", { className: "relative z-[1] min-w-0 md:max-w-[calc(100%-304px)] md:pr-4", children: [_jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-[#8fe0d6]", children: [_jsx(Sparkles, { className: "h-3.5 w-3.5", "aria-hidden": true }), "Active \u00B7 ", PLATFORM.membership.flatDiscount, "% member pricing"] }), _jsxs("h2", { className: "mt-3 font-display text-2xl font-extrabold tracking-tight text-white sm:text-[28px]", children: [dashboardGreeting(), ", ", firstName] }), _jsxs("p", { className: "mt-2 max-w-xl text-sm leading-relaxed text-white/80", children: ["Your family card covers ", acc.family.length, " people. Book any test at member price with free home collection."] }), _jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [_jsxs("button", { type: "button", onClick: () => {
                                            if (acc.packages[0])
                                                acc.choosePackage(acc.packages[0].id);
                                            navigate(acc.packages[0] ? '/account/book/member' : '/account/catalogue');
                                        }, className: "inline-flex items-center gap-1.5 rounded-full bg-mp-coral px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-mp-coral-600", children: [_jsx(FlaskConical, { className: "h-4 w-4", "aria-hidden": true }), "Book a test"] }), _jsxs(Link, { to: "/account/bookings", className: "inline-flex items-center gap-1.5 rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10", children: [_jsx(FileText, { className: "h-4 w-4", "aria-hidden": true }), "My reports"] })] })] }), _jsx("div", { className: "relative z-[2] mt-3 w-fit max-w-full md:absolute md:right-5 md:top-3 md:mt-0 md:translate-y-0", children: _jsx(AccountDashboardHeroCard, { flushRight: true }) })] }), _jsxs("div", { className: "grid gap-4 lg:grid-cols-[1.25fr_1fr]", children: [_jsx(AccountDashboardFamilyPanel, { onManageFamily: () => openFamilyManage('list'), onAddMember: () => openFamilyManage('add') }), _jsx(AccountDashboardNextVisitPanel, {})] }), _jsx(AccountCardWalletSection, {}), _jsx(AccountFamilyManageModal, { open: familyManage.open, initialMode: familyManage.mode, onClose: () => setFamilyManage((s) => ({ ...s, open: false })) })] }));
}
