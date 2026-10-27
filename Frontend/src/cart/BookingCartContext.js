import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, } from 'react';
import { loadBookingDraft, patchBookingDraft, saveBookingDraft, } from '@/booking/booking-session';
const BookingCartContext = createContext(null);
export function BookingCartProvider({ children }) {
    const [cart, setCart] = useState(() => loadBookingDraft().cart);
    const [undo, setUndo] = useState(null);
    const [toast, setToast] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const persist = useCallback((items) => {
        setCart(items);
        patchBookingDraft({ cart: items });
    }, []);
    const refreshFromStorage = useCallback(() => {
        setCart(loadBookingDraft().cart);
    }, []);
    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === 'hid_public_booking_v1')
                refreshFromStorage();
        };
        const onCart = () => refreshFromStorage();
        window.addEventListener('storage', onStorage);
        window.addEventListener('hid-cart-updated', onCart);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('hid-cart-updated', onCart);
        };
    }, [refreshFromStorage]);
    const addItem = useCallback((item) => {
        const current = loadBookingDraft().cart;
        if (current.some((c) => c.id === item.id)) {
            setToast('Already in your cart');
            return { added: false, duplicate: true };
        }
        const next = [...current, item];
        persist(next);
        setToast('Added to cart');
        setUndo(null);
        return { added: true, duplicate: false };
    }, [persist]);
    const removeItem = useCallback((id) => {
        const current = loadBookingDraft().cart;
        const index = current.findIndex((c) => c.id === id);
        if (index === -1)
            return;
        const removed = current[index];
        const next = current.filter((c) => c.id !== id);
        persist(next);
        setUndo({ item: removed, index });
        setToast('Removed from cart');
    }, [persist]);
    const undoRemove = useCallback(() => {
        if (!undo)
            return;
        const current = loadBookingDraft().cart;
        if (current.some((c) => c.id === undo.item.id)) {
            setUndo(null);
            return;
        }
        const next = [...current];
        next.splice(Math.min(undo.index, next.length), 0, undo.item);
        persist(next);
        setUndo(null);
        setToast('Restored to cart');
    }, [persist, undo]);
    const clearCart = useCallback(() => {
        persist([]);
        setUndo(null);
        const draft = loadBookingDraft();
        saveBookingDraft({ ...draft, cart: [] });
    }, [persist]);
    const value = useMemo(() => ({
        cart,
        count: cart.length,
        addItem,
        removeItem,
        undoRemove,
        undoAvailable: Boolean(undo),
        clearCart,
        refreshFromStorage,
        toast,
        clearToast: () => setToast(null),
        drawerOpen,
        openDrawer: () => setDrawerOpen(true),
        closeDrawer: () => setDrawerOpen(false),
    }), [cart, addItem, removeItem, undoRemove, undo, clearCart, refreshFromStorage, toast, drawerOpen]);
    return _jsx(BookingCartContext.Provider, { value: value, children: children });
}
export function useBookingCart() {
    const ctx = useContext(BookingCartContext);
    if (!ctx)
        throw new Error('useBookingCart must be used within BookingCartProvider');
    return ctx;
}
