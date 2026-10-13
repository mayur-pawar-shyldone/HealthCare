import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { RATE_LIST, RATE_LIST_CATEGORIES, POPULAR_TESTS, savingsPercent } from '@/data/rate-list'
import { PLATFORM } from '@/data/platform-content'
import { formatMoney } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { PaymentDiscountBadge } from '@/components/brand/PaymentDiscountOffer'

export function LandingRateList() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return RATE_LIST.filter((t) => {
      if (category !== 'All' && t.category !== category) return false
      if (!q) return true
      return t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    })
  }, [query, category])

  return (
    <section id="pricing" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-600">
            <span className="h-0.5 w-5 rounded-full bg-coral" aria-hidden />
            Transparent pricing
          </p>
          <h2 className="mt-3 font-display text-[32px] font-extrabold leading-tight tracking-tight text-ink sm:text-[38px]">
            Blood test rate list
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
            Official partner rates with an extra{' '}
            <strong className="text-ink">{PLATFORM.membership.flatDiscount}% off applied at payment</strong>. MRP shown
            for reference — special price includes free home collection.
          </p>
          <div className="mt-4">
            <PaymentDiscountBadge size="lg" />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 lg:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tests…"
              className="h-12 w-full rounded-full border border-ink/10 bg-mint pl-11 pr-4 text-[14px] outline-none focus:border-brand-300 focus:bg-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {RATE_LIST_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition ${
                  category === c
                    ? 'border-ink bg-ink text-white'
                    : 'border-ink/15 bg-white text-ink-soft hover:border-brand-300 hover:text-brand-600'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[22px] border border-ink/10 bg-white shadow-lift">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-ink/10 bg-brand-700 text-white">
                  <th className="w-12 px-4 py-3.5 font-semibold">#</th>
                  <th className="px-4 py-3.5 font-semibold">Test name</th>
                  <th className="hidden px-4 py-3.5 font-semibold md:table-cell">Category</th>
                  <th className="bg-white/10 px-4 py-3.5 text-right font-semibold">MRP</th>
                  <th className="bg-coral/90 px-4 py-3.5 text-right font-semibold">Special price</th>
                  <th className="hidden px-4 py-3.5 text-right font-semibold sm:table-cell">You save</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-ink-soft">
                      No tests match your search. Try another keyword or category.
                    </td>
                  </tr>
                ) : (
                  filtered.map((t, i) => {
                    const save = savingsPercent(t.mrp, t.specialPrice)
                    return (
                      <tr
                        key={t.sr}
                        className={`border-b border-ink/10 transition hover:bg-brand-50/50 ${
                          i % 2 === 0 ? 'bg-white' : 'bg-mint/40'
                        }`}
                      >
                        <td className="px-4 py-3 text-ink-muted">{t.sr}</td>
                        <td className="px-4 py-3 font-medium leading-snug text-ink">{t.name}</td>
                        <td className="hidden px-4 py-3 text-ink-soft md:table-cell">{t.category}</td>
                        <td className="px-4 py-3 text-right text-ink-muted line-through">{formatMoney(t.mrp)}</td>
                        <td className="px-4 py-3 text-right font-bold text-coral">{formatMoney(t.specialPrice)}</td>
                        <td className="hidden px-4 py-3 text-right sm:table-cell">
                          <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                            {save}%
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 bg-mint/60 px-4 py-4">
            <p className="text-[12px] text-ink-soft">
              Showing {filtered.length} of {RATE_LIST.length} tests · Prices inclusive of home collection for members
            </p>
            <Link to="/signup">
              <Button variant="accent" size="sm" className="rounded-full px-5">
                Get free card to book
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/** @deprecated Use `LandingRateList` — name kept for older imports */
export { LandingRateList as LandingHealthPackages }

export function LandingPopularTests() {
  const featured = POPULAR_TESTS.slice(0, 4)

  return (
    <section id="popular" className="border-y border-line bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">Most booked</p>
            <h2 className="mt-3 font-display text-3xl">Popular tests at special rates</h2>
          </div>
          <a href="#pricing" className="text-sm font-semibold text-teal hover:underline">View full rate list →</a>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((t) => (
            <div key={t.sr} className="rounded-2xl border border-line p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-xs font-medium uppercase tracking-wide text-teal">{t.category}</p>
              <h3 className="mt-2 font-display text-lg leading-snug">{t.name}</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-brand-red">{formatMoney(t.specialPrice)}</span>
                <span className="text-sm text-ink-soft line-through">{formatMoney(t.mrp)}</span>
              </div>
              <p className="mt-1 text-xs font-medium text-success">Save {savingsPercent(t.mrp, t.specialPrice)}%</p>
              <Link to="/signup" className="mt-4 block">
                <Button className="w-full rounded-lg text-xs">Book with free card</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
