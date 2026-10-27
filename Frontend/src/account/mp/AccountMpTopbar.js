import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { AccountMpNotifications } from '@/account/mp/AccountMpNotifications';
import { AccountMpLogo } from '@/account/mp/AccountMpLogo';
import { useAccount } from '@/account/AccountContext';
import { accountMpTitle } from '@/account/mp/account-mp-nav';
import { memberInitials, memberShortName } from '@/account/dashboard/mp-utils';
export function AccountMpTopbar({ onMenu }) {
    const { pathname } = useLocation();
    const acc = useAccount();
    const title = accountMpTitle(pathname);
    const firstName = memberShortName(acc.name);
    return (_jsxs("header", { className: "flex h-[60px] items-center justify-between border-b border-line bg-white px-4 lg:h-[64px] lg:px-5", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [_jsx("button", { type: "button", onClick: onMenu, "aria-label": "Open menu", className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl text-navy hover:bg-canvas lg:hidden", children: _jsx(Menu, { className: "h-5 w-5" }) }), _jsx("div", { className: "lg:hidden", children: _jsx(AccountMpLogo, {}) }), _jsx("h1", { className: "hidden text-sm font-medium text-muted lg:block", children: title })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(AccountMpNotifications, {}), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "grid h-11 w-11 place-items-center rounded-full bg-navy text-sm font-bold text-white", children: memberInitials(acc.name) }), _jsxs("div", { className: "hidden leading-tight sm:block", children: [_jsxs("p", { className: "text-[15px] font-semibold text-navy", children: ["Hi, ", firstName] }), _jsx("p", { className: "text-sm text-brick", children: acc.memberId() })] })] })] })] }));
}
