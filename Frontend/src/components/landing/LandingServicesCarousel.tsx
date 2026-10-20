import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LANDING_SERVICE_TILES } from '@/data/landing-services-data'
import { serviceBrowsePath, type BrowseCategoryId } from '@/data/service-browse'

const TILE_BROWSE: Partial<Record<string, BrowseCategoryId>> = {
  'blood-tests': 'blood-test',
  'full-body': 'blood-test',
  scans: 'radiology',
  consult: 'doctor',
  prescription: 'blood-test',
}

export function LandingServicesCarousel() {
  const scroller = useRef<HTMLUListElement>(null)
  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(1)

  const measure = useCallback(() => {
    const el = scroller.current
    if (!el) return
    const nextPages = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth))
    setPages(nextPages)
    setPage(Math.round(el.scrollLeft / el.clientWidth))
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  function scrollByPage(dir: number) {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' })
  }

  function goToPage(p: number) {
    const el = scroller.current
    if (!el) return
    el.scrollTo({ left: p * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <section id="categories" className="bg-white py-20" aria-labelledby="services-heading">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2
              id="services-heading"
              className="font-display text-[32px] font-extrabold leading-tight tracking-tight text-ink sm:text-[38px]"
            >
              Start with what you&apos;re worried about
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
              Every service is priced at the member rate, with the extra 30% applied at payment.
            </p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollByPage(-1)}
              aria-label="Scroll services left"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:border-brand-300 hover:text-brand-600 active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scrollByPage(1)}
              aria-label="Scroll services right"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:border-brand-300 hover:text-brand-600 active:scale-95"
            >
              <ArrowRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>

        <ul
          ref={scroller}
          onScroll={measure}
          className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
        >
          {LANDING_SERVICE_TILES.map((item) => {
            const browseId = TILE_BROWSE[item.id]
            const browseTab = item.id === 'full-body' ? 'full-body' : undefined
            const tileClass = 'group block rounded-[24px] outline-none focus-visible:ring-4 focus-visible:ring-brand-100'
            const inner = (
              <>
                <div className="relative overflow-hidden rounded-[24px] bg-mint">
                  <img
                    src={item.image}
                    alt=""
                    className="aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-x-3 bottom-3 rounded-full bg-white/95 py-2 text-center text-[13px] font-bold text-brand-600 shadow-sm backdrop-blur transition group-hover:bg-coral group-hover:text-white">
                    {item.offer}
                  </span>
                </div>
                <div className="mt-3.5 flex items-start justify-between gap-2 px-1">
                  <div>
                    <h3 className="font-display text-[15.5px] font-bold leading-snug text-ink">{item.name}</h3>
                    <p className="mt-0.5 text-[12.5px] text-ink-muted">{item.meta}</p>
                  </div>
                  <ChevronRight
                    className="mt-1 h-4 w-4 shrink-0 text-ink-muted transition group-hover:translate-x-0.5 group-hover:text-brand-500"
                    aria-hidden
                  />
                </div>
              </>
            )

            return (
              <li key={item.id} className="w-[184px] shrink-0 snap-start sm:w-[208px]">
                {browseId ? (
                  <Link to={serviceBrowsePath(browseId, browseTab)} className={tileClass}>
                    {inner}
                  </Link>
                ) : (
                  <a href="#popular-plans" className={tileClass}>
                    {inner}
                  </a>
                )}
              </li>
            )
          })}
        </ul>

        {pages > 1 ? (
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToPage(i)}
                aria-label={`Go to services page ${i + 1}`}
                aria-current={i === page}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === page ? 'w-8 bg-brand-500' : 'w-4 bg-ink/15 hover:bg-ink/30'
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
