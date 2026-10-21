import { useMemo } from 'react'
import type { LandingNavCategory } from '@/data/landing-nav-data'
import { PackagePreviewCard } from '@/components/landing/PackagePreviewCard'
import { useCatalogTests } from '@/hooks/useCatalogTests'
import { browseFilter, labTestToPreview } from '@/lib/catalog'

type Props = {
  category: LandingNavCategory
  compact?: boolean
  onNavigate?: () => void
}

export function CategoryMegaPanel({ category, compact, onNavigate }: Props) {
  const catalog = useCatalogTests()
  const packages = useMemo(() => {
    const tests = catalog.data ?? []
    return tests.filter((test) => browseFilter(category.id, test)).slice(0, 6).map(labTestToPreview)
  }, [catalog.data, category.id])

  return (
    <div
      className={`grid gap-0 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_12px_32px_rgba(16,52,74,0.12)] ${
        compact ? 'grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]' : 'md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]'
      }`}
    >
      <div className="flex flex-col border-b border-ink/10 bg-gradient-to-b from-white via-[#f4f8fb]/40 to-white md:border-b-0 md:border-r">
        <div className="p-5 pb-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink">{category.label}</p>
          <h3 className="mt-2 font-display text-lg font-bold leading-snug text-ink">{category.headline}</h3>
          {!compact ? (
            <ul className="mt-4 space-y-2.5">
              {category.points.map((point) => (
                <li key={point} className="flex gap-2.5 text-[13px] leading-snug text-ink-soft">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {compact ? (
          <div className="relative mx-3 mb-3 overflow-hidden rounded-[20px] bg-ink p-4 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60">Why it matters</p>
            <ul className="mt-3 space-y-2 text-[13px] leading-snug text-white/80">
              {category.points.slice(0, 3).map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-2">
          {category.quickLinks.map((link) => (
            <span
              key={link}
              className="rounded-full border border-teal/20 bg-teal-light px-3 py-1.5 text-[12.5px] font-medium text-ink-soft"
            >
              {link}
            </span>
          ))}
        </div>
        {catalog.isLoading ? (
          <p className="mt-4 text-sm font-semibold text-ink-soft">Loading packages from the lab…</p>
        ) : packages.length ? (
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {packages.map((pkg) => (
              <li key={pkg.id} className="min-w-0">
                <PackagePreviewCard pkg={pkg} onAction={onNavigate} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-2xl border border-dashed border-line bg-cream px-4 py-10 text-center text-sm font-semibold text-ink-soft">
            No packages in this category yet.
          </p>
        )}
      </div>
    </div>
  )
}
