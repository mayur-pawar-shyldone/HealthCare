import type { ReactNode } from 'react'

export function PageHead({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {action}
    </div>
  )
}

export function BookSteps({ n }: { n: number }) {
  const labels = ['Member & address', 'Date & time', 'Review', 'Confirmed']
  return (
    <div className="steps">
      {labels.map((l, i) => (
        <span key={l} className={i === n ? 'on' : ''}>
          {i + 1}. {l}
        </span>
      ))}
    </div>
  )
}
