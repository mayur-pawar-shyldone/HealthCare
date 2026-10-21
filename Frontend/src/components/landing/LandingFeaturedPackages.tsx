import { Link } from 'react-router-dom'
import { ArrowRight, Activity } from 'lucide-react'
import { bookStartUrl } from '@/booking/booking-url'
import { useHealthPackages } from '@/hooks/useHealthPackages'
import { formatMoney } from '@/lib/utils'

const TINTS = ['bg-tint-peach', 'bg-tint-mint', 'bg-tint-lilac', 'bg-brand-50']

export function LandingFeaturedPackages() {
  const { data, isLoading } = useHealthPackages()
  const featured = (data ?? []).slice().sort((a, b) => Number(b.isPopular) - Number(a.isPopular)).slice(0, 4)

  return (
    <section id="packages" className="bg-mint py-20" aria-labelledby="packages-heading">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <h2
            id="packages-heading"
            className="font-display text-[32px] font-extrabold leading-tight tracking-tight text-ink sm:text-[38px]"
          >
            Packages people book most
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
            Bundled panels that cover a full picture in one visit — no repeat pricks, no repeat fees.
          </p>
        </div>
        {isLoading ? (
          <p className="mt-10 text-sm font-semibold text-ink-soft">Loading packages from the lab…</p>
        ) : featured.length ? (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {featured.map((pkg, i) => {
              const save = pkg.brochureMrp > 0 ? Math.round(((pkg.brochureMrp - pkg.brochureSpecialPrice) / pkg.brochureMrp) * 100) : 0
              const preview = pkg.includedTestNames.slice(0, 3)
              return (
                <li key={pkg.id} className="flex">
                  <article className="group flex h-full w-full flex-col rounded-[22px] border border-ink/10 bg-white p-2.5 transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
                    <div className={`flex min-h-[140px] flex-1 flex-col rounded-[16px] p-4 ${TINTS[i % TINTS.length]}`}>
                      <div className="flex items-start justify-between gap-3">
                        {pkg.isPopular ? (
                          <span className="rounded-full bg-brand-500 px-2.5 py-1 text-[11px] font-semibold text-white">
                            Most booked
                          </span>
                        ) : (
                          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink-soft">
                            Home collection
                          </span>
                        )}
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
                          <Activity className="h-4 w-4" aria-hidden />
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-[16px] font-bold leading-snug text-ink">{pkg.name}</h3>
                      <p className="mt-2 line-clamp-3 text-[12px] leading-relaxed text-ink-soft">
                        {preview.join(' · ')}
                        {pkg.includedTestNames.length > 3 ? '…' : ''}
                      </p>
                    </div>
                    <div className="mt-3 px-1 pb-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-[22px] font-extrabold text-ink">{formatMoney(pkg.brochureSpecialPrice)}</span>
                        <span className="text-sm text-ink-muted line-through">{formatMoney(pkg.brochureMrp)}</span>
                      </div>
                      {save > 0 ? <p className="mt-1 text-[11px] font-semibold text-success">Save {save}% vs MRP</p> : null}
                      <Link
                        to={bookStartUrl({
                          id: pkg.id,
                          name: pkg.name,
                          memberPrice: pkg.brochureSpecialPrice,
                          mrp: pkg.brochureMrp,
                          testCount: pkg.includedTestNames.length || 1,
                        })}
                        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition hover:bg-brand-600"
                      >
                        Book now
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="mt-10 rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center text-sm font-semibold text-ink-soft">
            No packages listed from the lab yet.
          </p>
        )}
      </div>
    </section>
  )
}
