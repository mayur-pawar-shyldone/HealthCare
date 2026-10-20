import { Link } from 'react-router-dom'
import {
  CalendarDays,
  ChevronRight,
  FileText,
  FlaskConical,
  HelpCircle,
  UserPlus,
} from 'lucide-react'
import { PLATFORM } from '@/data/platform-content'
import { cn } from '@/lib/utils'

type QuickActionItem = {
  label: string
  sub: string
  icon: typeof CalendarDays
  to?: string
  onClick?: () => void
  primary?: boolean
}

function QuickActionRow({ label, sub, icon: Icon, onClick, to, primary }: QuickActionItem) {
  const inner = (
    <>
      <span
        className={cn(
          'grid h-10 w-10 shrink-0 place-items-center rounded-xl',
          primary ? 'bg-teal text-white' : 'bg-teal-light/80 text-teal',
        )}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block dash-body">
          <strong>{label}</strong>
        </span>
        <span className="block dash-muted">{sub}</span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 opacity-40" aria-hidden />
    </>
  )
  const className =
    'flex h-full min-h-[68px] w-full items-center gap-3 rounded-2xl border border-line/60 bg-white p-3.5 text-left transition hover:border-teal/35'
  if (to) {
    return (
      <Link to={to} className={className}>
        {inner}
      </Link>
    )
  }
  return (
    <button type="button" className={className} onClick={onClick}>
      {inner}
    </button>
  )
}

type AccountQuickActionsProps = {
  onAddFamily?: () => void
}

export function AccountQuickActions({ onAddFamily }: AccountQuickActionsProps) {
  const items: QuickActionItem[] = [
    {
      label: 'Book a test',
      sub: `${PLATFORM.testCount}+ tests & packages`,
      icon: FlaskConical,
      to: '/account/catalogue',
      primary: true,
    },
    { label: 'My bookings', sub: 'Track collections', icon: CalendarDays, to: '/account/bookings' },
    { label: 'Reports & records', sub: 'Download PDFs', icon: FileText, to: '/account/reports' },
    { label: 'Add family member', sub: 'Up to 5 on one card', icon: UserPlus, onClick: onAddFamily },
    { label: 'Help & support', sub: '1800-123-4567', icon: HelpCircle, to: '/account/support' },
  ]

  return (
    <section className="dash-panel dash-panel-lg" aria-labelledby="account-quick-actions">
      <p id="account-quick-actions" className="dash-section-eyebrow">
        Quick actions
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
        {items.map((item) => (
          <QuickActionRow key={item.label} {...item} />
        ))}
      </div>
    </section>
  )
}
