import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingCart } from '@/cart/BookingCartContext';
export function useCartActions() {
    const cart = useBookingCart();
    const navigate = useNavigate();
    const addToCart = useCallback((item) => {
        const result = cart.addItem(item);
        return result;
    }, [cart]);
    const addAndViewCart = useCallback((item, openCart) => {
        const result = addToCart(item);
        if (result.added)
            openCart();
        return result;
    }, [addToCart]);
    const addAndBook = useCallback((item) => {
        addToCart(item);
        navigate('/book');
    }, [addToCart, navigate]);
    return { addToCart, addAndViewCart, addAndBook, cart };
}
