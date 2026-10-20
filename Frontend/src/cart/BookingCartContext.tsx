import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  loadBookingDraft,
  patchBookingDraft,
  saveBookingDraft,
  type BookingCartItem,
} from '@/booking/booking-session'

type UndoState = { item: BookingCartItem; index: number } | null

type BookingCartContextValue = {
  cart: BookingCartItem[]
  count: number
  addItem: (item: BookingCartItem) => { added: boolean; duplicate: boolean }
  removeItem: (id: string) => void
  undoRemove: () => void
  undoAvailable: boolean
  clearCart: () => void
  refreshFromStorage: () => void
  toast: string | null
  clearToast: () => void
  drawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

const BookingCartContext = createContext<BookingCartContextValue | null>(null)

export function BookingCartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<BookingCartItem[]>(() => loadBookingDraft().cart)
  const [undo, setUndo] = useState<UndoState>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const persist = useCallback((items: BookingCartItem[]) => {
    setCart(items)
    patchBookingDraft({ cart: items })
  }, [])

  const refreshFromStorage = useCallback(() => {
    setCart(loadBookingDraft().cart)
  }, [])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'hid_public_booking_v1') refreshFromStorage()
    }
    const onCart = () => refreshFromStorage()
    window.addEventListener('storage', onStorage)
    window.addEventListener('hid-cart-updated', onCart)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('hid-cart-updated', onCart)
    }
  }, [refreshFromStorage])

  const addItem = useCallback(
    (item: BookingCartItem) => {
      const current = loadBookingDraft().cart
      if (current.some((c) => c.id === item.id)) {
        setToast('Already in your cart')
        return { added: false, duplicate: true }
      }
      const next = [...current, item]
      persist(next)
      setToast('Added to cart')
      setUndo(null)
      return { added: true, duplicate: false }
    },
    [persist],
  )

  const removeItem = useCallback(
    (id: string) => {
      const current = loadBookingDraft().cart
      const index = current.findIndex((c) => c.id === id)
      if (index === -1) return
      const removed = current[index]
      const next = current.filter((c) => c.id !== id)
      persist(next)
      setUndo({ item: removed, index })
      setToast('Removed from cart')
    },
    [persist],
  )

  const undoRemove = useCallback(() => {
    if (!undo) return
    const current = loadBookingDraft().cart
    if (current.some((c) => c.id === undo.item.id)) {
      setUndo(null)
      return
    }
    const next = [...current]
    next.splice(Math.min(undo.index, next.length), 0, undo.item)
    persist(next)
    setUndo(null)
    setToast('Restored to cart')
  }, [persist, undo])

  const clearCart = useCallback(() => {
    persist([])
    setUndo(null)
    const draft = loadBookingDraft()
    saveBookingDraft({ ...draft, cart: [] })
  }, [persist])

  const value = useMemo(
    () => ({
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
    }),
    [cart, addItem, removeItem, undoRemove, undo, clearCart, refreshFromStorage, toast, drawerOpen],
  )

  return <BookingCartContext.Provider value={value}>{children}</BookingCartContext.Provider>
}

export function useBookingCart() {
  const ctx = useContext(BookingCartContext)
  if (!ctx) throw new Error('useBookingCart must be used within BookingCartProvider')
  return ctx
}
