import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { useAccount } from '@/account/AccountContext'
import { AccountMpSidebar } from '@/account/mp/AccountMpSidebar'
import { AccountMpTopbar } from '@/account/mp/AccountMpTopbar'
import { accountMpReminder } from '@/account/mp/account-mp-reminder'

/** Magic Patterns account shell — matches reference screenshots. */
export function AccountShell() {
  const acc = useAccount()
  const [menuOpen, setMenuOpen] = useState(false)
  const reminder = accountMpReminder(acc)

  return (
    <div className="account-mp-root flex min-h-full w-full bg-canvas">
      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 border-r border-line lg:block">
        <AccountMpSidebar />
      </aside>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-navy/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[290px] bg-white shadow-xl lg:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            >
              <AccountMpSidebar onNavigate={() => setMenuOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        {reminder ? (
          <div role="status" className="flex items-start gap-2 bg-alert-bg px-4 py-2 text-sm text-alert-text lg:px-6">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{reminder}</span>
          </div>
        ) : null}
        <AccountMpTopbar onMenu={() => setMenuOpen(true)} />
        <main className="account-mp-main flex-1 overflow-y-auto px-4 py-5 lg:px-6 lg:py-5">
          <div className="shell account-mp-legacy-wrap mx-auto w-full max-w-[1180px]">
            <Outlet />
          </div>
        </main>
        <footer className="border-t border-line bg-white py-3 text-center text-sm text-muted">
          © 2026 HealthIDCard · Care beyond borders
        </footer>
      </div>
      {acc.toast ? <div className="toast">{acc.toast}</div> : null}
    </div>
  )
}
