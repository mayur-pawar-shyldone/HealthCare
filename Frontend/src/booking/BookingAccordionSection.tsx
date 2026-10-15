import type { ReactNode } from 'react'
import { Check, ChevronDown, Lock, type LucideIcon } from 'lucide-react'

export type AccordionSectionState = 'locked' | 'open' | 'done' | 'idle'

export function BookingAccordionSection({
  icon: StepIcon,
  category,
  title,
  state,
  summary,
  onToggle,
  onHeaderKeyDown,
  headerRef,
  panelId,
  children,
}: {
  icon: LucideIcon
  category?: string
  title: string
  state: AccordionSectionState
  summary?: string
  onToggle: () => void
  onHeaderKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void
  headerRef?: (el: HTMLButtonElement | null) => void
  panelId?: string
  children: ReactNode
}) {
  const locked = state === 'locked'
  const open = state === 'open'
  const done = state === 'done'
  const idle = state === 'idle'
  const stepLabel = category ?? title

  return (
    <section
      className={`overflow-hidden rounded-[20px] border bg-white transition-shadow duration-200 ${
        open ? 'border-mp-teal/50 shadow-md ring-1 ring-mp-teal/15' : done ? 'border-line' : 'border-line opacity-90'
      }`}
    >
      <button
        ref={headerRef}
        type="button"
        disabled={locked}
        onClick={onToggle}
        onKeyDown={onHeaderKeyDown}
        aria-expanded={open}
        aria-controls={panelId}
        id={panelId ? `${panelId}-header` : undefined}
        className={`flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6 sm:py-5 ${
          locked ? 'cursor-not-allowed opacity-50' : 'hover:bg-canvas/60'
        }`}
      >
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold ${
            done ? 'bg-mp-teal text-white' : open ? 'bg-navy text-white' : locked ? 'bg-canvas text-muted' : 'bg-mp-teal-50 text-navy'
          }`}
        >
          {done ? (
            <Check className="h-5 w-5" strokeWidth={2.5} aria-hidden />
          ) : locked ? (
            <Lock className="h-4 w-4" aria-hidden />
          ) : (
            <StepIcon className="h-5 w-5" strokeWidth={2.25} aria-hidden />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold uppercase tracking-wide text-mp-teal-700">{stepLabel}</span>
          <span className="mt-0.5 block text-lg font-bold leading-snug text-navy sm:text-xl">{title}</span>
          {done && summary && !open ? (
            <span className="mt-1.5 block text-[15px] leading-snug text-muted">{summary}</span>
          ) : null}
          {idle ? (
            <span className="mt-1 block text-[15px] text-muted">Tap to open and fill in</span>
          ) : null}
        </span>
        {locked ? (
          <Lock className="h-5 w-5 shrink-0 text-muted" aria-hidden />
        ) : (
          <ChevronDown
            className={`h-6 w-6 shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            aria-hidden
          />
        )}
      </button>
      {open ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={panelId ? `${panelId}-header` : undefined}
          className="border-t border-line px-5 pb-6 pt-4 text-[15px] leading-relaxed sm:px-6 sm:pb-8 sm:pt-5"
        >
          {children}
        </div>
      ) : null}
    </section>
  )
}
