import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation } from 'react-router-dom';
import { useBookingCart } from '@/cart/BookingCartContext';
import { CartToast, LandingCartDrawer } from '@/components/site/LandingCartDrawer';
/** Mount once near app root — cart drawer + toasts. */
export function SiteCartUi() {
    const cart = useBookingCart();
    const { pathname } = useLocation();
    const hideCartToast = pathname.startsWith('/book');
    return (_jsxs(_Fragment, { children: [_jsx(LandingCartDrawer, { open: cart.drawerOpen, onClose: cart.closeDrawer }), !hideCartToast ? _jsx(CartToast, {}) : null] }));
}
