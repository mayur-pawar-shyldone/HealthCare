import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { RADIOLOGY_GROUPS } from '@/data/landing-nav-data'
import { serviceBrowsePath, slugifyBrowseKey } from '@/data/service-browse'

type Props = { onNavigate?: () => void }

export function RadMenu({ onNavigate }: Props) {
  const [activeId, setActiveId] = useState(RADIOLOGY_GROUPS[0].id)
  const group = RADIOLOGY_GROUPS.find((g) => g.id === activeId) ?? RADIOLOGY_GROUPS[0]

  return (
    <div className="rad-panel">
      <div className="rad-side">
        <p className="rad-kicker">Radiology</p>
        {RADIOLOGY_GROUPS.map((cat) => {
          const on = cat.id === activeId
          return (
            <button
              key={cat.id}
              type="button"
              onMouseEnter={() => setActiveId(cat.id)}
              onFocus={() => setActiveId(cat.id)}
              onClick={() => setActiveId(cat.id)}
              className={`rad-cat${on ? ' on' : ''}`}
            >
              {cat.label}
              <small>{cat.items.length}</small>
            </button>
          )
        })}
      </div>
      <div className="rad-main">
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
                to={serviceBrowsePath('radiology', group.id, slugifyBrowseKey(item.name))}
                className="rad-book"
                onClick={onNavigate}
              >
                Book now
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
