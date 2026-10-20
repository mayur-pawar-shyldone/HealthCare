import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, MapPin, Search, ShieldCheck } from 'lucide-react'
import { HERO_TRUST, LANDING_BANNERS } from '@/data/landing-services-data'

export function LandingHero() {
  const [index, setIndex] = useState(0)
  const count = LANDING_BANNERS.length

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), 3800)
    return () => window.clearInterval(timer)
  }, [count])

  const banner = LANDING_BANNERS[index]

  return (
    <section
      className="relative bg-gradient-to-b from-[#f0f8fc] via-[#f8fafc] to-white pb-6 pt-6 sm:pb-8 sm:pt-8"
      aria-label="Featured banners"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[20px] bg-white shadow-[0_12px_32px_-16px_rgba(16,52,74,0.18)] sm:rounded-[24px] lg:rounded-[28px]">
          <div className="relative aspect-[2059/764] max-h-[520px] w-full overflow-hidden">
            <img
              src={banner.src}
              alt={banner.alt}
              className="block h-full w-full object-cover object-center"
              loading="eager"
            />
          </div>
          <button
            type="button"
            aria-label="Previous banner"
            onClick={() => setIndex((i) => (i - 1 + count) % count)}
            className="absolute left-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-ink shadow-[0_4px_16px_rgba(16,52,74,0.2)] backdrop-blur transition hover:scale-105 hover:bg-white active:scale-95 sm:left-6 sm:h-11 sm:w-11"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next banner"
            onClick={() => setIndex((i) => (i + 1) % count)}
            className="absolute right-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-ink shadow-[0_4px_16px_rgba(16,52,74,0.2)] backdrop-blur transition hover:scale-105 hover:bg-white active:scale-95 sm:right-6 sm:h-11 sm:w-11"
          >
            <ArrowRight className="h-5 w-5" aria-hidden />
          </button>
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 sm:bottom-4">
            {LANDING_BANNERS.map((b, i) => (
              <button
                key={b.id}
                type="button"
                aria-label={`Go to banner ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? 'w-7 bg-white shadow' : 'w-2.5 bg-white/70 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-6 max-w-4xl px-2 sm:px-0">
        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className="shadow-lift flex flex-col gap-2 rounded-2xl border border-ink/10 bg-white/90 p-2 backdrop-blur sm:flex-row sm:items-center sm:rounded-full"
        >
          <label className="relative flex-1">
            <span className="sr-only">Search for tests, packages or health concerns</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
            <input
              type="search"
              placeholder="Search tests, packages or health concerns"
              className="h-12 w-full rounded-full bg-transparent pl-11 pr-4 text-[15px] text-ink outline-none placeholder:text-ink-muted"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-500 px-8 text-[15px] font-semibold text-white transition hover:bg-brand-600 active:scale-[0.98]"
          >
            Search
          </button>
        </form>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
          {HERO_TRUST.map((label) => (
            <li key={label} className="flex items-center gap-2 text-[13.5px] font-medium text-ink-soft">
              <ShieldCheck className="h-4 w-4 text-brand-500" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[12px] font-medium text-ink-muted">
          <MapPin className="h-3.5 w-3.5 text-brand-500" aria-hidden />
          Home collection in Mumbai, Delhi NCR, Bangalore &amp; more
        </p>
      </div>
    </section>
  )
}
