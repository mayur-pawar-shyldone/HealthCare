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
    <section className={`rounded-[28px] bg-white p-6 sm:p-8 ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title ? <h2 className="text-[22px] font-bold tracking-tight text-brick">{title}</h2> : null}
            {subtitle ? <p className="mt-1 text-[15px] text-muted">{subtitle}</p> : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
