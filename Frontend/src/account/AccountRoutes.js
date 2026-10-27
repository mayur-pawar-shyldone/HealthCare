import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useAccount } from '@/account/AccountContext';
import { AccountLoginPage } from '@/account/AccountLoginPage';
import { OtpVerification } from '@/account/OtpVerification';
import { consumeLoginReturn, loginReturnFromLocation } from '@/lib/auth-return';
import { AccountShell } from '@/account/AccountShell';
import { AccountBookDonePage, AccountBookMemberPage, AccountBookReviewPage, AccountBookSlotPage, AccountBookingDetailPage, AccountBookingsPage, AccountCataloguePage, AccountDashboardPage, AccountProfilePage, AccountReportsPage, AccountSupportPage, } from '@/account/AccountPages';
/** OTP login from pasted HealthID account portal — use at `/login`. */
export function AccountLoginGate() {
    const acc = useAccount();
    const location = useLocation();
    if (acc.authed) {
        const dest = consumeLoginReturn(loginReturnFromLocation(location));
        return _jsx(Navigate, { to: dest, replace: true });
    }
    loginReturnFromLocation(location);
    return _jsx(AccountLoginPage, {});
}
export function AccountEmailOtpGate() {
    const acc = useAccount();
    const location = useLocation();
    if (acc.authed) {
        const dest = consumeLoginReturn(loginReturnFromLocation(location));
        return _jsx(Navigate, { to: dest, replace: true });
    }
    loginReturnFromLocation(location);
    return _jsx(OtpVerification, {});
}
function AccountProtected() {
    const acc = useAccount();
    const location = useLocation();
    if (!acc.authed)
        return _jsx(Navigate, { to: "/login", replace: true, state: { from: location.pathname } });
    return _jsx(Outlet, {});
}
export function AccountRoutes() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "login", element: _jsx(Navigate, { to: "/login", replace: true }) }), _jsx(Route, { element: _jsx(AccountProtected, {}), children: _jsxs(Route, { element: _jsx(AccountShell, {}), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "dashboard", replace: true }) }), _jsx(Route, { path: "dashboard", element: _jsx(AccountDashboardPage, {}) }), _jsx(Route, { path: "card", element: _jsx(Navigate, { to: "/account/dashboard", replace: true }) }), _jsx(Route, { path: "family", element: _jsx(Navigate, { to: "/account/dashboard", replace: true }) }), _jsx(Route, { path: "bookings", element: _jsx(AccountBookingsPage, {}) }), _jsx(Route, { path: "bookings/:id", element: _jsx(AccountBookingDetailPage, {}) }), _jsx(Route, { path: "reports", element: _jsx(AccountReportsPage, {}) }), _jsx(Route, { path: "catalogue", element: _jsx(AccountCataloguePage, {}) }), _jsx(Route, { path: "profile", element: _jsx(AccountProfilePage, {}) }), _jsx(Route, { path: "support", element: _jsx(AccountSupportPage, {}) }), _jsx(Route, { path: "book/member", element: _jsx(AccountBookMemberPage, {}) }), _jsx(Route, { path: "book/slot", element: _jsx(AccountBookSlotPage, {}) }), _jsx(Route, { path: "book/review", element: _jsx(AccountBookReviewPage, {}) }), _jsx(Route, { path: "book/done", element: _jsx(AccountBookDonePage, {}) })] }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/login", replace: true }) })] }));
}
