import { useEffect, useMemo, useRef } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { LandingFooter, LandingHeader } from '@/components/landing/LandingLayout'
import { LandingShowcaseCard } from '@/components/landing/LandingShowcaseCard'
import {
  BROWSE_CATEGORY_META,
  browsePackagesForTab,
  browseTabsForCategory,
  isBrowseCategoryId,
  resolveBrowseTab,
  slugifyBrowseKey,
  type BrowseCategoryId,
} from '@/data/service-browse'

function BrowseContent({ categoryId }: { categoryId: BrowseCategoryId }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const highlightItem = searchParams.get('item')
  const tabParam = searchParams.get('tab')

  const meta = BROWSE_CATEGORY_META[categoryId]
  const tabs = browseTabsForCategory(categoryId)
  const activeTab = resolveBrowseTab(categoryId, tabParam)
  const packages = useMemo(() => browsePackagesForTab(categoryId, activeTab), [categoryId, activeTab])
  const cardRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    if (tabParam) return
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('tab', activeTab)
        return next
      },
      { replace: true },
    )
  }, [tabParam, activeTab, setSearchParams])

  useEffect(() => {
    if (!highlightItem) return
    const key = slugifyBrowseKey(highlightItem)
    const match =
      packages.find((p) => p.id === highlightItem || slugifyBrowseKey(p.name) === key || p.id.endsWith(`-${key}`)) ??
      null
    if (!match) return
    const el = cardRefs.current[match.id]
    if (el) {
      window.requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    }
  }, [highlightItem, packages, activeTab])

  const setTab = (tabId: string) => {
    const next = new URLSearchParams(searchParams)
    next.set('tab', tabId)
    next.delete('item')
    setSearchParams(next, { replace: true })
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-6">
      <nav className="text-[13px] font-medium text-ink-soft" aria-label="Breadcrumb">
        <Link to="/" className="transition-colors hover:text-teal">
          Home
        </Link>
        <span className="mx-2 text-ink-muted">/</span>
        <span className="text-ink">{meta.title}</span>
      </nav>

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-[clamp(1.75rem,3vw,2.35rem)] font-bold leading-tight text-ink">
            {meta.title}
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-soft">{meta.subtitle}</p>
        </div>
        <p className="shrink-0 text-[13px] font-semibold text-ink-muted">{packages.length} options in this section</p>
      </div>

      <div
        className="mt-8 flex gap-2 overflow-x-auto pb-1 no-scrollbar"
        role="tablist"
        aria-label={`${meta.title} categories`}
      >
        {tabs.map((tab) => {
          const on = tab.id === activeTab
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setTab(tab.id)}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-[13.5px] font-bold transition-colors duration-150 ${
                on
                  ? 'border-ink bg-ink text-white shadow-md shadow-ink/15'
                  : 'border-line bg-white text-ink-soft hover:border-teal/40 hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {packages.map((pkg) => {
          const highlight =
            highlightItem &&
            (pkg.id === highlightItem ||
              slugifyBrowseKey(pkg.name) === slugifyBrowseKey(highlightItem) ||
              pkg.id.endsWith(`-${slugifyBrowseKey(highlightItem)}`))
          return (
            <li
              key={pkg.id}
              ref={(node) => {
                cardRefs.current[pkg.id] = node
              }}
              className={`min-w-0 transition-[transform,box-shadow] duration-300 ${
                highlight ? 'rounded-[28px] ring-2 ring-teal ring-offset-2 ring-offset-[#f4f9fb]' : ''
              }`}
            >
                <LandingShowcaseCard pkg={pkg} />
            </li>
          )
        })}
      </ul>
    </main>
  )
}

export function ServiceBrowsePage() {
  const { categoryId } = useParams<{ categoryId: string }>()

  useEffect(() => {
    document.body.style.overflow = 'auto'
    document.documentElement.style.overflow = 'auto'
    const root = document.getElementById('root')
    if (root) root.style.overflow = 'auto'
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      if (root) root.style.overflow = ''
    }
  }, [])

  if (!isBrowseCategoryId(categoryId)) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="landing-page min-h-screen bg-[#f4f9fb] font-sans text-ink">
      <LandingHeader />
      <BrowseContent categoryId={categoryId} />
      <LandingFooter />
    </div>
  )
}
