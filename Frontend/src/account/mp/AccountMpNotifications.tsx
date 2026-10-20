import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, CalendarCheck, FileText, Gift } from 'lucide-react'
import {
  accountMpNotifications,
  unreadNotificationCount,
  type AccountMpNotification,
} from '@/account/mp/account-mp-notifications'

const KIND_ICON: Record<AccountMpNotification['kind'], typeof Bell> = {
  report: FileText,
  visit: CalendarCheck,
  offer: Gift,
}

export function AccountMpNotifications() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(accountMpNotifications)
  const rootRef = useRef<HTMLDivElement>(null)
  const unread = unreadNotificationCount(items)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  function openPanel() {
    setOpen((v) => !v)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        onClick={openPanel}
        className={`relative grid h-11 w-11 place-items-center rounded-full transition-colors duration-150 ${
          open ? 'bg-navy text-white' : 'bg-mp-teal-50 text-mp-teal-700 hover:bg-[#d3ecea]'
        }`}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-mp-coral px-1 text-[11px] font-bold text-white ring-2 ring-white">
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-[60] mt-2 w-[min(100vw-2rem,360px)] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_20px_50px_-24px_rgba(16,52,74,0.45)]">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div>
              <p className="text-[15px] font-bold text-navy">Notifications</p>
              <p className="text-[12px] text-muted">
                {unread > 0 ? `${unread} unread` : 'You’re all caught up'}
              </p>
            </div>
            {unread > 0 ? (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[12px] font-semibold text-mp-teal-700 hover:underline"
              >
                Mark all read
              </button>
            ) : null}
          </div>

          <ul className="max-h-[min(60vh,320px)] overflow-y-auto py-1">
            {items.map((n) => {
              const Icon = KIND_ICON[n.kind]
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))}
                    className={`flex w-full gap-3 px-4 py-3 text-left transition hover:bg-canvas ${
                      n.unread ? 'bg-mp-teal-50/40' : ''
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                        n.unread ? 'bg-mp-teal text-white' : 'bg-mp-teal-50 text-mp-teal-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-[13.5px] font-semibold text-navy">{n.title}</span>
                        {n.unread ? (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-mp-coral" aria-label="Unread" />
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{n.body}</span>
                      <span className="mt-1 block text-[11px] font-medium text-mp-teal-700">{n.time}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="border-t border-line bg-canvas/50 px-4 py-2.5">
            <Link
              to="/account/bookings"
              onClick={() => setOpen(false)}
              className="block text-center text-[13px] font-semibold text-mp-teal-700 hover:underline"
            >
              View bookings & reports
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}
