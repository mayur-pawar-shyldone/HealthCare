import { useMemo, useState } from 'react'
import { MapPin } from 'lucide-react'
import { useHealthPackages } from '@/hooks/useHealthPackages'
import { labTestToShowcase } from '@/lib/catalog'
import { LandingShowcaseCard } from '@/components/landing/LandingShowcaseCard'

function categoryTabId(category: string) {
  return `showcase-tab-${category.replace(/\s+/g, '-').toLowerCase()}`
}

/** Member-priced package grid from the lab catalog */
export function LandingShowcaseSection() {
  const { data, isLoading } = useHealthPackages()
  const packages = useMemo(() => (data ?? []).map(labTestToShowcase), [data])
  const categories = useMemo(() => {
    const names = [...new Set(packages.map((p) => p.category).filter(Boolean))]
    return names.length ? names : ['Packages']
  }, [packages])
  const [category, setCategory] = useState('')
  const active = category && categories.includes(category) ? category : categories[0]
  const visible = useMemo(
    () => packages.filter((p) => !active || p.category === active),
    [packages, active],
  )

  return (
    <section id="popular-plans" className="scroll-mt-28 bg-cream py-20" aria-labelledby="showcase-heading">
      <div className="mx-auto max-w-7xl px-6">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-1.5 text-[13px] font-bold text-teal">
              <MapPin className="h-4 w-4" aria-hidden />
              Nashik · home collection
            </p>
            <h2
              id="showcase-heading"
              className="mt-3 font-editorial text-[32px] font-bold leading-[1.12] text-ink sm:text-[40px]"
            >
              Popular plans
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              Card holder rates below MRP, reports on WhatsApp, and one price per person for the whole family.
            </p>
          </div>
          {categories.length > 1 ? (
            <div role="tablist" aria-label="Package categories" className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const on = cat === active
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    id={categoryTabId(cat)}
                    aria-selected={on}
                    aria-controls="showcase-grid"
                    onClick={() => setCategory(cat)}
                    className={`rounded-full px-4 py-2 text-[13.5px] font-bold transition-colors duration-150 ease-out ${
                      on ? 'bg-ink text-white' : 'border border-line bg-white text-ink-soft hover:text-ink'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          ) : null}
        </header>

        {isLoading ? (
          <p className="mt-10 text-sm font-semibold text-ink-soft">Loading packages from the lab…</p>
        ) : visible.length > 0 ? (
          <div
            id="showcase-grid"
            role="tabpanel"
            aria-labelledby={categoryTabId(active)}
            className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((pkg) => (
              <LandingShowcaseCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center text-sm font-semibold text-ink-soft">
            No packages in this category yet — try another one.
          </p>
        )}
      </div>
    </section>
  )
}
