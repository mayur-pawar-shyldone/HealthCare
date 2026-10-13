import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Baby,
  Brain,
  ChevronRight,
  Clock,
  Droplets,
  FileText,
  FlaskConical,
  Flower2,
  Heart,
  HeartPulse,
  LayoutGrid,
  Leaf,
  MessageCircle,
  Moon,
  Pill,
  Ribbon,
  Scale,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  UserRound,
  Users,
} from 'lucide-react'
import { HEALTH_VERTICALS, type HealthVertical } from '@/data/landing-nav-data'
import { serviceBrowsePath, slugifyBrowseKey, type BrowseCategoryId } from '@/data/service-browse'
import { Link } from 'react-router-dom'
import { openHealthCard } from '@/lib/health-card-bus'
import { LabBrowsePackageCard } from '@/components/landing/LabBrowsePackageCard'

const ICONS: Record<string, typeof FlaskConical> = {
  'full-body': FlaskConical,
  heart: UserRound,
  cancer: Ribbon,
  thyroid: FileText,
  diabetes: Droplets,
  pregnancy: Clock,
  hormone: FileText,
  'doc-gp-care': Stethoscope,
  'doc-specialist': UserRound,
  'doc-cardio': HeartPulse,
  'doc-women': Flower2,
  'doc-peds': Baby,
  'doc-mental': Brain,
  'ayu-consult-root': Leaf,
  'ayu-pancha': Sparkles,
  'ayu-herbal': Leaf,
  'ayu-women': Flower2,
  'ayu-stress': Moon,
  'ayu-weight': Scale,
  'ph-rx': Pill,
  'ph-supplements': FlaskConical,
  'ph-essentials': ShoppingBag,
  'ph-chronic': HeartPulse,
  'ph-family': Users,
}

type Props = {
  compact?: boolean
  onNavigate?: () => void
  /** Defaults to full-body browse list */
  verticals?: HealthVertical[]
  defaultActiveId?: string
  sidebarEyebrow?: string
  sidebarBadge?: string
  packageCountLabel?: string
  browseCategoryId?: BrowseCategoryId
}

/** HealthID browse-by-need panel — sidebar + package cards (Blood Test, ECG, etc.). */
export function HealthVerticalPanel({
  compact,
  onNavigate,
  verticals = HEALTH_VERTICALS,
  defaultActiveId,
  sidebarEyebrow = 'Browse by health need',
  sidebarBadge = 'NABL labs • Home collection',
  packageCountLabel = 'packages',
  browseCategoryId,
}: Props) {
  const initialId = defaultActiveId ?? verticals[0]?.id ?? HEALTH_VERTICALS[0].id
  const [activeId, setActiveId] = useState(initialId)
  const active = useMemo(
    () => verticals.find((v) => v.id === activeId) ?? verticals[0] ?? HEALTH_VERTICALS[0],
    [activeId, verticals],
  )

  return (
    <div className="grid-cols-[280px_1fr] grid gap-0 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-lift lg:grid-cols-[320px_1fr]">
      <Sidebar
        active={active}
        activeId={activeId}
        compact={compact}
        verticals={verticals}
        sidebarEyebrow={sidebarEyebrow}
        sidebarBadge={sidebarBadge}
        onSelect={setActiveId}
        onNavigate={onNavigate}
      />
      <MainPanel
        active={active}
        compact={compact}
        packageCountLabel={packageCountLabel}
        onNavigate={onNavigate}
        browseCategoryId={browseCategoryId}
      />
    </div>
  )
}

function subtitleFor(item: HealthVertical) {
  return item.subtitle
}

function Sidebar({
  active,
  activeId,
  compact,
  verticals,
  sidebarEyebrow,
  sidebarBadge,
  onSelect,
  onNavigate,
}: {
  active: HealthVertical
  activeId: string
  compact?: boolean
  verticals: HealthVertical[]
  sidebarEyebrow: string
  sidebarBadge: string
  onSelect: (id: string) => void
  onNavigate?: () => void
}) {
  return (
    <div className="flex flex-col border-b border-ink/10 bg-white lg:border-b-0 lg:border-r lg:bg-gradient-to-b lg:from-white lg:via-mint/[0.15] lg:to-white">
      <div className="p-5 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white shadow-sm">
            <LayoutGrid className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink">{sidebarEyebrow}</p>
            <p className="text-[12.5px] text-ink-muted">
              {verticals.length} curated panels · tap to preview
            </p>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-mint px-3 py-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" aria-hidden />
          <span className="text-[11.5px] font-semibold text-ink-soft">{sidebarBadge}</span>
        </div>
      </div>
      <div className="flex max-h-[min(520px,58vh)] flex-col gap-2 overflow-y-auto px-3 pb-3 [scrollbar-gutter:stable]">
        {verticals.map((item) => {
          const isActive = item.id === activeId
          const Icon = ICONS[item.id] ?? Heart
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              onMouseEnter={() => onSelect(item.id)}
              onFocus={() => onSelect(item.id)}
              className={`group flex w-full items-center gap-3 rounded-[16px] border p-2 pr-3 text-left transition-all duration-200 ease-out ${
                isActive
                  ? 'scale-[1.01] border-ink bg-ink text-white shadow-lg shadow-ink/10'
                  : 'border-ink/10 bg-white text-ink-soft hover:border-brand-200 hover:bg-brand-50/70 hover:text-ink hover:shadow-sm'
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                  isActive ? 'bg-white text-ink' : 'bg-mint text-brand-600 group-hover:bg-white group-hover:text-brand-600'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="flex-1">
                <span className={`block text-[14px] font-semibold leading-none ${isActive ? 'text-white' : 'text-ink group-hover:text-ink'}`}>
                  {item.label}
                </span>
                <span className={`mt-1 block text-[12px] leading-none ${isActive ? 'text-white/70' : 'text-ink-muted'}`}>
                  {subtitleFor(item)}
                </span>
              </span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                  isActive ? 'bg-white/15 text-white' : 'bg-ink/5 text-ink-muted group-hover:bg-white group-hover:text-brand-600'
                }`}
              >
                <ChevronRight className={`h-3.5 w-3.5 transition-transform duration-200 ${isActive ? 'translate-x-0' : 'group-hover:translate-x-0.5'}`} aria-hidden />
              </span>
            </button>
          )
        })}
      </div>
      {!compact ? (
        <div className="relative mx-3 mb-3 mt-4 overflow-hidden rounded-[20px] bg-ink p-4 text-white">
          <span className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" aria-hidden />
          <div className="relative">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
              Why it matters
            </p>
            <h4 className="mt-2 font-display text-[15px] font-bold leading-snug text-white">{active.headline}</h4>
            <ul className="mt-3 space-y-2.5">
              {active.points.map((point) => (
                <li key={point} className="flex gap-2.5 text-[13px] leading-snug text-white/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                onNavigate?.()
                openHealthCard()
              }}
              className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-full bg-white px-4 text-[13px] font-semibold text-ink transition hover:bg-brand-50"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden />
              Talk to advisor
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function MainPanel({
  active,
  compact,
  packageCountLabel,
  onNavigate,
  browseCategoryId,
}: {
  active: HealthVertical
  compact?: boolean
  packageCountLabel: string
  onNavigate?: () => void
  browseCategoryId?: BrowseCategoryId
}) {
  return (
    <div className="bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-[19px] font-bold leading-tight text-ink">{active.label}</h3>
          <p className="mt-1 max-w-xl text-[13.5px] leading-snug text-ink-muted">{active.headline}</p>
        </div>
        <span className="hidden shrink-0 rounded-full bg-mint px-3 py-1.5 text-[11.5px] font-semibold text-ink-soft sm:inline-flex">
          {active.packages.length} {packageCountLabel}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {active.quickLinks.map((link) =>
          browseCategoryId ? (
            <Link
              key={link}
              to={serviceBrowsePath(browseCategoryId, active.id, slugifyBrowseKey(link))}
              onClick={onNavigate}
              className="group/link relative inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-[12.5px] font-medium text-ink-soft transition hover:border-teal hover:bg-white hover:text-ink"
            >
              <span className="transition-opacity group-hover/link:opacity-0">{link}</span>
              <span className="absolute inset-0 flex items-center justify-center gap-1 text-[12px] font-bold text-teal opacity-0 transition-opacity group-hover/link:opacity-100">
                Book now
                <ArrowRight className="h-3 w-3" aria-hidden />
              </span>
            </Link>
          ) : (
            <span
              key={link}
              className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-[12.5px] font-medium text-ink-soft"
            >
              {link}
            </span>
          ),
        )}
      </div>
      <ul className="mt-4 grid gap-3 md:grid-cols-3">
        {active.packages.map((pkg) => (
          <li key={pkg.id} className="min-w-0">
            <LabBrowsePackageCard
              pkg={pkg}
              onNavigate={onNavigate}
              browseCategoryId={browseCategoryId}
              browseTabId={active.id}
            />
          </li>
        ))}
      </ul>
      {compact ? (
        <div className="mt-6 flex justify-center">
          {browseCategoryId ? (
            <Link
              to={serviceBrowsePath(browseCategoryId, active.id)}
              onClick={onNavigate}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-4 py-2 text-[13.5px] font-semibold text-ink-soft transition hover:border-brand-200 hover:text-ink"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          ) : (
            <a
              href="#showcase"
              onClick={onNavigate}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-4 py-2 text-[13.5px] font-semibold text-ink-soft transition hover:border-brand-200 hover:text-ink"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </a>
          )}
        </div>
      ) : null}
    </div>
  )
}
