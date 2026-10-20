import type { ReactNode } from 'react'

type PanelProps = {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function AccountDashboardPanel({ title, subtitle, action, children, className = '' }: PanelProps) {
  return (
    <section className={`rounded-[20px] bg-white p-3.5 sm:p-4 ${className}`}>
      {(title || action) && (
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            {title ? <h2 className="text-lg font-bold tracking-tight text-brick">{title}</h2> : null}
            {subtitle ? <p className="mt-0.5 text-[13px] text-muted">{subtitle}</p> : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
