import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { CheckCircle2, Home, MapPin, Plus } from 'lucide-react';
import { useAccount } from '@/account/AccountContext';
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel';
import { AccountAddAddressModal } from '@/account/mp/AccountAddAddressModal';
import { AccountMpPersonalDetails } from '@/account/mp/AccountMpPersonalDetails';
import { AccountMpProfileCard } from '@/account/mp/AccountMpProfileCard';
export function AccountMpMyAccountPage() {
    const acc = useAccount();
    const [addressModalOpen, setAddressModalOpen] = useState(false);
    return (_jsxs("div", { className: "grid items-start gap-4 lg:grid-cols-[min(320px,100%)_1fr]", children: [_jsx("div", { className: "lg:sticky lg:top-6", children: _jsx(AccountMpProfileCard, {}) }), _jsxs("div", { className: "space-y-4", children: [_jsx(AccountMpPersonalDetails, {}), _jsx(AccountDashboardPanel, { title: "Collection addresses", action: _jsxs("button", { type: "button", onClick: () => {
                                acc.setError('');
                                setAddressModalOpen(true);
                            }, className: "inline-flex items-center gap-1 pt-1 text-[13px] font-medium text-mp-teal-700 hover:underline", children: [_jsx(Plus, { className: "h-3.5 w-3.5", "aria-hidden": true }), "Add new"] }), children: _jsx("div", { className: "grid gap-4 md:grid-cols-2", children: acc.addresses.map((a) => {
                                const isDefault = a.id === acc.defaultAddressId;
                                const Icon = isDefault ? Home : MapPin;
                                return (_jsxs("div", { className: `flex flex-col rounded-xl border p-3.5 ${isDefault ? 'border-mp-teal bg-mp-teal-50/60' : 'border-line'}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("p", { className: "flex items-center gap-2 text-sm font-semibold text-navy", children: [_jsx(Icon, { className: "h-4 w-4 text-mp-teal-700", "aria-hidden": true }), a.label] }), isDefault ? (_jsxs("span", { className: "flex items-center gap-1 text-sm font-medium text-mp-teal-700", children: [_jsx(CheckCircle2, { className: "h-4 w-4", "aria-hidden": true }), "Default"] })) : (_jsx("button", { type: "button", onClick: () => acc.setDefaultAddress(a.id), className: "text-sm font-medium text-muted hover:text-mp-teal-700", children: "Set default" }))] }), _jsx("p", { className: "mt-2 text-[13px] text-navy", children: a.line }), _jsx("p", { className: "mt-auto pt-1.5 text-[13px] text-muted", children: a.note })] }, a.id));
                            }) }) })] }), _jsx(AccountAddAddressModal, { open: addressModalOpen, onClose: () => setAddressModalOpen(false) })] }));
}
