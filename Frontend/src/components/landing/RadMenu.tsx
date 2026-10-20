import { useState } from 'react'
import {
  ArrowRight,
  Baby,
  Brain,
  ChevronRight,
  FileText,
  FlaskConical,
  HeartPulse,
  LayoutGrid,
  Scan,
  ScanLine,
  Syringe,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { RADIOLOGY_GROUPS } from '@/data/landing-nav-data'
import { bookStartUrl } from '@/booking/booking-url'
import { serviceBrowsePath, slugifyBrowseKey } from '@/data/service-browse'

const RAD_ICONS: Record<string, typeof Scan> = {
  usg: Scan,
  obs: Baby,
  vasc: HeartPulse,
  xray: ScanLine,
  proc: FlaskConical,
  ir: Syringe,
  mri: Brain,
  ct: Scan,
  other: FileText,
}

function parseRadPrice(price: string) {
  const match = price.match(/[\d,]+/)
  return match ? Number(match[0].replace(/,/g, '')) : 999
}

type Props = { onNavigate?: () => void }

export function RadMenu({ onNavigate }: Props) {
  const [activeId, setActiveId] = useState(RADIOLOGY_GROUPS[0].id)
  const group = RADIOLOGY_GROUPS.find((g) => g.id === activeId) ?? RADIOLOGY_GROUPS[0]

  return (
    <div className="grid-cols-[280px_1fr] grid gap-0 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-lift lg:grid-cols-[320px_1fr]">
      <div className="flex flex-col border-b border-ink/10 bg-white lg:border-b-0 lg:border-r lg:bg-gradient-to-b lg:from-white lg:via-mint/[0.15] lg:to-white">
        <div className="p-5 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white shadow-sm">
              <LayoutGrid className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink">Browse imaging types</p>
              <p className="text-[12.5px] text-ink-muted">
                {RADIOLOGY_GROUPS.length} categories · tap to preview
              </p>
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-mint px-3 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" aria-hidden />
            <span className="text-[11.5px] font-semibold text-ink-soft">NABL centres • Nashik</span>
          </div>
        </div>
        <div className="flex max-h-[min(520px,58vh)] flex-col gap-2 overflow-y-auto px-3 pb-3 [scrollbar-gutter:stable]">
          {RADIOLOGY_GROUPS.map((cat) => {
            const isActive = cat.id === activeId
            const Icon = RAD_ICONS[cat.id] ?? Scan
            return (
              <button
                key={cat.id}
                type="button"
                onMouseEnter={() => setActiveId(cat.id)}
                onFocus={() => setActiveId(cat.id)}
                onClick={() => setActiveId(cat.id)}
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
                <span className="flex-1 min-w-0">
                  <span
                    className={`block text-[14px] font-semibold leading-none ${isActive ? 'text-white' : 'text-ink group-hover:text-ink'}`}
                  >
                    {cat.label}
                  </span>
                  <span className={`mt-1 block text-[12px] leading-none ${isActive ? 'text-white/70' : 'text-ink-muted'}`}>
                    {`${cat.items.length} studies`}
                  </span>
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                    isActive ? 'bg-white/15 text-white' : 'bg-ink/5 text-ink-muted group-hover:bg-white group-hover:text-brand-600'
                  }`}
                >
                  <ChevronRight
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${isActive ? 'translate-x-0' : 'group-hover:translate-x-0.5'}`}
                    aria-hidden
                  />
                </span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="rad-main min-w-0 bg-white">
        <div className="rad-head">
          <div>
            <h3>{group.label}</h3>
            <p>{group.note ?? 'Nashik Radiological & Imaging Association'}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[12px] font-semibold text-[#5a7284]">{group.items.length} studies</p>
            <Link
              to={serviceBrowsePath('radiology', group.id)}
              onClick={onNavigate}
              className="mt-1 inline-block text-[12px] font-bold text-[#175a76] underline-offset-2 hover:underline"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="rad-list">
          {group.items.map((item) => (
            <div key={item.name} className="rad-row group">
              <p className="rad-name">
                {item.name}
                {item.detail ? <span>{item.detail}</span> : null}
              </p>
              <span className="rad-price group-hover:opacity-0">{item.price}</span>
              <Link
                to={bookStartUrl({
                  id: `rad-${group.id}-${slugifyBrowseKey(item.name)}`,
                  name: item.name,
                  memberPrice: parseRadPrice(item.price),
                  mrp: Math.round(parseRadPrice(item.price) * 2.15) || 1999,
                  testCount: 1,
                })}
                className="rad-book"
                onClick={onNavigate}
              >
                Book now
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          ))}
        </div>
        <div className="flex justify-center border-t border-ink/10 px-4 py-4">
          <Link
            to={serviceBrowsePath('radiology', group.id)}
            onClick={onNavigate}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-4 py-2 text-[13.5px] font-semibold text-ink-soft transition hover:border-brand-200 hover:text-ink"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  )
}
