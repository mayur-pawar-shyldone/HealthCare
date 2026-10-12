import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { ACCOUNT_FAQS, ACCOUNT_FAQ_CATEGORIES } from '@/account/account-data'
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel'

type Props = { query: string }

export function AccountMpFaqList({ query }: Props) {
  const [category, setCategory] = useState<string>('All')
  const [openId, setOpenId] = useState<string | null>(null)

  const q = query.trim().toLowerCase()
  const visible = ACCOUNT_FAQS.filter(
    (f) =>
      (category === 'All' || f.category === category) &&
      (!q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)),
  )

  return (
    <AccountDashboardPanel title="Common questions">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter questions">
        {ACCOUNT_FAQ_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-150 ${
              category === c ? 'bg-navy text-white' : 'bg-mp-teal-50 text-muted hover:text-navy'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="mt-4 divide-y divide-line">
        {visible.map((f) => {
          const open = openId === f.id
          return (
            <li key={f.id}>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : f.id)}
                className="flex w-full items-center gap-4 py-5 text-left"
              >
                <span className="flex-1">
                  <span className="block text-sm text-mp-teal-700">{f.category}</span>
                  <span className="block text-lg font-semibold text-navy">{f.q}</span>
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 pr-10 text-[15px] leading-relaxed text-muted">{f.a}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          )
        })}
        {visible.length === 0 ? (
          <li className="py-10 text-center text-muted">No answers match &quot;{query}&quot;. Try another word or talk to us.</li>
        ) : null}
      </ul>
    </AccountDashboardPanel>
  )
}
