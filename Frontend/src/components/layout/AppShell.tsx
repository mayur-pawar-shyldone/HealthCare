import { useEffect, useState, type FormEvent } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CalendarDays,
  FlaskConical,
  History,
  Home,
  LogOut,
  Plus,
  Search,
  UserRound,
  Wallet,
} from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { cn, formatMoney } from '@/lib/utils'
import type { RootState } from '@/store'
import type { WalletSummary } from '@/types'
import { clearSession } from '@/store/authSlice'
import api, { unwrap } from '@/services/api'
import { NotifyBell } from '@/components/ui/SearchBar'

type NavItem = {
  to: string
  label: string
  icon: typeof Home
  end?: boolean
}

const navItems: NavItem[] = [
  { to: '/home', label: 'Home', icon: Home, end: true },
  { to: '/tests', label: 'Tests & packages', icon: FlaskConical },
  { to: '/appointments', label: 'My bookings', icon: CalendarDays },
  { to: '/history', label: 'Reports & records', icon: History },
  { to: '/wallet', label: 'Wallet', icon: Wallet },
  { to: '/profile', label: 'Profile & settings', icon: UserRound },
]

const mobileNav = [
  { to: '/home', label: 'Home', icon: Home, end: true },
  { to: '/tests', label: 'Tests', icon: FlaskConical },
  { to: '/appointments/book', label: 'Book', icon: Plus, fab: true },
  { to: '/appointments', label: 'Bookings', icon: CalendarDays },
  { to: '/history', label: 'Reports', icon: History },
] as const

function NavItemLink({ item }: { item: NavItem }) {
  const Icon = item.icon
  return (
    <NavLink to={item.to} end={item.end} className={({ isActive }) => (isActive ? 'active' : undefined)}>
      <Icon width={18} height={18} strokeWidth={2} />
      {item.label}
    </NavLink>
  )
}

export function AppShell() {
  const user = useSelector((s: RootState) => s.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')

  const wallet = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => unwrap<WalletSummary>((await api.get('/wallet')).data),
    staleTime: 60_000,
  })

  const unread = useQuery({
    queryKey: ['notifications-unread'],
    queryFn: async () => unwrap<{ count: number }>((await api.get('/notifications/unread-count')).data),
    staleTime: 30_000,
    refetchInterval: 60_000,
  })

  useEffect(() => {
    if (user?.id) {
      void qc.invalidateQueries({ queryKey: ['tests'] })
    }
  }, [user?.id, qc])

  async function logout() {
    try {
      await api.post('/auth/logout', { refreshToken: localStorage.getItem('hc_refresh') })
    } finally {
      dispatch(clearSession())
      navigate('/login', { replace: true })
    }
  }

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'

  function onSearch(e: FormEvent) {
    e.preventDefault()
    const q = searchQ.trim()
    if (!q) return
    const recent = JSON.parse(localStorage.getItem('hc_recent_searches') || '[]') as string[]
    localStorage.setItem('hc_recent_searches', JSON.stringify([q, ...recent.filter((x) => x !== q)].slice(0, 6)))
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="shell">
      <div
        className={cn('backdrop', sidebarOpen && 'show')}
        onClick={() => setSidebarOpen(false)}
        onKeyDown={() => undefined}
        role="presentation"
      />

      <aside className={cn('sidebar', sidebarOpen && 'open')}>
        <NavLink to="/home" onClick={() => setSidebarOpen(false)}>
          <img className="logo" src="/logo.webp" alt="HealthIDCard" />
        </NavLink>

        <NavLink
          to="/appointments/book"
          onClick={() => setSidebarOpen(false)}
          className="hid-btn hid-btn-coral hid-btn-block"
          style={{ marginTop: 18, height: 42, fontSize: 13 }}
        >
          <Plus width={16} height={16} />
          Book a test
        </NavLink>

        <nav className="nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavItemLink key={item.to} item={item} />
          ))}
        </nav>

        <div className="side-foot">
          {isAdmin ? (
            <NavLink to="/admin" className="linkish" style={{ display: 'block', padding: '8px 12px', fontSize: 12 }}>
              Admin console →
            </NavLink>
          ) : null}
          <button type="button" onClick={logout}>
            <LogOut width={18} height={18} />
            Log out
          </button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button type="button" className="menu-btn" aria-label="Open menu" onClick={() => setSidebarOpen(true)}>
            Menu
          </button>
          <form className="search" onSubmit={onSearch}>
            <Search width={16} height={16} />
            <input
              name="q"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search tests, bookings or reports"
            />
          </form>
          <div className="top-actions">
            {wallet.data ? (
              <NavLink to="/wallet" className="icon-btn">
                <Wallet width={16} height={16} />
                {formatMoney(wallet.data.totalSpendable)}
              </NavLink>
            ) : null}
            <NotifyBell count={unread.data?.count ?? 0} compact />
            <NavLink to="/profile" className="icon-btn">
              <UserRound width={16} height={16} />
              {user?.fullName?.split(' ')[0]}
            </NavLink>
          </div>
        </header>

        <div className="content pb-24 lg:pb-8">
          <Outlet />
        </div>
      </div>

      <nav className="fixed inset-x-2 bottom-2 z-30 lg:hidden">
        <div className="flex items-end justify-around rounded-xl border border-[var(--hid-line)] bg-white px-0.5 py-1.5 shadow-[0_4px_20px_rgba(16,52,74,0.12)]">
          {mobileNav.map((item) => {
            const Icon = item.icon
            if ('fab' in item && item.fab) {
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="-mt-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-r from-[#e23d26] to-[#c22f1b] text-white shadow-md transition active:scale-95"
                >
                  <Icon className="h-5 w-5" strokeWidth={2.5} />
                </NavLink>
              )
            }
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={'end' in item ? item.end : false}
                className={({ isActive }) =>
                  cn(
                    'flex min-w-[48px] flex-col items-center gap-0.5 px-1 py-1 text-[9px] font-semibold',
                    isActive ? 'text-[var(--hid-brand)]' : 'text-[var(--hid-muted)]',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.25 : 2} />
                    {item.label}
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
