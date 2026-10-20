import { useLocation } from 'react-router-dom'
import { useBookingCart } from '@/cart/BookingCartContext'
import { CartToast, LandingCartDrawer } from '@/components/site/LandingCartDrawer'

/** Mount once near app root — cart drawer + toasts. */
export function SiteCartUi() {
  const cart = useBookingCart()
  const { pathname } = useLocation()
  const hideCartToast = pathname.startsWith('/book')

  return (
    <>
      <LandingCartDrawer open={cart.drawerOpen} onClose={cart.closeDrawer} />
      {!hideCartToast ? <CartToast /> : null}
    </>
  )
}
