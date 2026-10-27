import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAccount } from '@/account/AccountContext';
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel';
import { PLATFORM } from '@/data/platform-content';
import { formatMoney } from '@/lib/utils';
export function AccountDashboardPackagesPanel() {
    const acc = useAccount();
    const navigate = useNavigate();
    const [added, setAdded] = useState(null);
    return (_jsx("div", { id: "packages", className: "scroll-mt-6", children: _jsxs(AccountDashboardPanel, { title: "Book at member price", subtitle: `Free home collection · Reports in ${PLATFORM.reportHours} hours`, children: [acc.packages.length === 0 ? (_jsx("p", { className: "py-6 text-sm text-muted", children: "No packages from the lab yet." })) : null, _jsx("ul", { className: "grid gap-x-10 md:grid-cols-2", children: acc.packages.map((p) => (_jsxs("li", { className: "flex items-center gap-4 border-t border-line py-4", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("p", { className: "text-xs font-medium text-mp-teal-700", children: [p.tests, " tests"] }), _jsx("p", { className: "text-[15px] font-semibold text-navy", children: p.name }), _jsx("p", { className: "mt-0.5 truncate text-[13px] text-muted", children: p.summary })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-lg font-extrabold text-navy", children: formatMoney(p.price) }), _jsx("p", { className: "text-[13px] text-muted line-through", children: formatMoney(p.mrp) })] }), _jsx("button", { type: "button", onClick: () => {
                                    setAdded(p.id);
                                    acc.choosePackage(p.id);
                                    navigate('/account/book/member');
                                }, className: `w-[84px] rounded-full py-2 text-[13px] font-semibold transition-colors duration-150 ${added === p.id ? 'bg-mp-teal-50 text-mp-teal-700' : 'bg-mp-coral text-white hover:bg-mp-coral-600'}`, children: added === p.id ? (_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(Check, { className: "h-4 w-4" }), "Added"] })) : ('Book') })] }, p.id))) })] }) }));
}
