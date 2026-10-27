import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
function hasSession(user, accessToken) {
    return Boolean(user?.id && accessToken);
}
export function ProtectedRoute() {
    const { user, accessToken } = useSelector((s) => s.auth);
    const location = useLocation();
    if (!hasSession(user, accessToken)) {
        return _jsx(Navigate, { to: "/login", replace: true, state: { from: location.pathname } });
    }
    return _jsx(Outlet, {});
}
export function AdminRoute() {
    const { user, accessToken } = useSelector((s) => s.auth);
    if (!hasSession(user, accessToken))
        return _jsx(Navigate, { to: "/login", replace: true });
    if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN')
        return _jsx(Navigate, { to: "/home", replace: true });
    return _jsx(Outlet, {});
}
export function GuestRoute() {
    const { user, accessToken } = useSelector((s) => s.auth);
    if (hasSession(user, accessToken)) {
        const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
        return _jsx(Navigate, { to: isAdmin ? '/admin' : '/home', replace: true });
    }
    return _jsx(Outlet, {});
}
