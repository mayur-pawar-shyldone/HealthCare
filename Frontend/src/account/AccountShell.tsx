import type { FormEvent } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ACCOUNT_NAV, IconSearch, IconUser } from '@/account/account-icons'
import { useAccount } from '@/account/AccountContext'

function navActive(href: string, pathname: string) {
  if (href === '/account/catalogue') return pathname === href || pathname.startsWith('/account/book/')
  if (href === '/account/bookings') return pathname === href || pathname.startsWith('/account/bookings/')
  return pathname === href
}

export function AccountShell() {
  const acc = useAccount()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const q = new FormData(e.currentTarget).get('q')?.toString() ?? ''
    acc.setSearch(q)
    const path = pathname
    if (!path.includes('/catalogue') && !path.includes('/bookings') && !path.includes('/reports')) {
      navigate('/account/catalogue')
    }
  }

  return (
    <div className="shell">
      <div className={`backdrop ${acc.sidebar ? 'show' : ''}`} onClick={() => acc.setSidebar(false)} aria-hidden />
      <aside className={`sidebar ${acc.sidebar ? 'open' : ''}`}>
        <button type="button" onClick={() => navigate('/account/dashboard')} style={{ border: 0, background: 'none', padding: 0 }}>
          <img className="logo" src="/logo.webp" alt="HealthIDCard" />
        </button>
        <nav className="nav">
          {ACCOUNT_NAV.map(({ href, label, icon }) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) => (isActive || navActive(href, pathname) ? 'active' : '')}
              onClick={() => acc.setSidebar(false)}
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="side-foot">
          <button type="button" onClick={() => { acc.logout(); navigate('/login') }}>
            <IconUser /> Log out
          </button>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <button type="button" className="menu-btn" onClick={() => acc.setSidebar(true)} aria-label="Open menu">
            Menu
          </button>
          <form className="search" onSubmit={onSearch}>
            <IconSearch />
            <input name="q" placeholder="Search tests, bookings or reports" defaultValue={acc.search} />
          </form>
          <div className="top-actions">
            <button type="button" className="icon-btn" onClick={() => navigate('/account/support')}>
              Help
            </button>
            <button type="button" className="icon-btn" onClick={() => navigate('/account/profile')}>
              {acc.name.split(' ')[0]}
            </button>
          </div>
        </header>
        <div className="content pb-24 lg:pb-10">
          <Outlet />
        </div>
      </div>
      {acc.toast ? <div className="toast">{acc.toast}</div> : null}
    </div>
  )
}
